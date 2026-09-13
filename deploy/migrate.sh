#!/usr/bin/env bash
# Migrasi database Supabase (self-host, compose di /opt/supabase-jp).
#
# Pakai:
#   deploy/migrate.sh              # terapkan migrasi yang belum jalan
#   deploy/migrate.sh status       # lihat mana yang sudah & belum
#   deploy/migrate.sh new <nama>   # buat file migrasi baru bertimestamp
#
# ./deploy.sh menjalankan ini otomatis sebelum build.
#
# Aturan main:
#   - supabase/schema.sql & seed.sql adalah BASELINE. Jangan diubah lagi;
#     perubahan skema berikutnya ditulis sebagai file baru di
#     supabase/migrations/<YYYYMMDDHHMMSS>_<nama>.sql (pakai `new`).
#   - Migrasi yang sudah diterapkan tidak boleh diedit — checksum-nya dicek.
#     Salah? Buat migrasi baru yang memperbaikinya.
#   - Setiap file dijalankan dalam SATU transaksi bersama pencatatannya, jadi
#     gagal di tengah = database tidak berubah. Konsekuensinya: jangan tulis
#     BEGIN/COMMIT sendiri, dan jangan pakai perintah yang tidak bisa di dalam
#     transaksi (CREATE INDEX CONCURRENTLY, VACUUM, ALTER TYPE ... ADD VALUE
#     yang langsung dipakai).
#   - Deploy menjalankan migrasi SEBELUM build, saat kode lama masih melayani.
#     Buat migrasi yang aman untuk kode lama: tambah kolom/tabel dulu, hapus
#     yang lama di deploy berikutnya.
#   - Tabel baru di skema public otomatis bisa diakses lewat API publik —
#     selalu `enable row level security` dan tulis policy-nya.
#
# Catatan migrasi disimpan di jp_migrations.applied (skema ini tidak diekspos
# PostgREST).

set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SUPABASE_DIR="${JP_SUPABASE_DIR:-/opt/supabase-jp}"
MIGRATIONS_DIR="$REPO_DIR/supabase/migrations"
BASELINE_FILES=("$REPO_DIR/supabase/schema.sql" "$REPO_DIR/supabase/seed.sql")
BASELINE_VERSION="00000000000000"
NAME_RE='^([0-9]{14})_([a-z0-9_]+)\.sql$'

say() { printf '  [migrate] %s\n' "$*"; }
die() { printf '  [migrate] ERROR: %s\n' "$*" >&2; exit 1; }

compose() { docker compose -f "$SUPABASE_DIR/docker-compose.yml" "$@"; }

psql_db() {
  compose exec -T -e PGOPTIONS="-c client_min_messages=warning" db psql -U supabase_admin -d postgres -X -q -v ON_ERROR_STOP=1 "$@"
}

checksum() { cat "$@" | sha256sum | cut -d' ' -f1; }

ensure_db() {
  [[ -f "$SUPABASE_DIR/docker-compose.yml" ]] || die "compose Supabase tidak ditemukan di $SUPABASE_DIR"
  # Idempoten: tidak menyentuh container yang sudah jalan dengan konfigurasi sama.
  compose up -d --wait --wait-timeout 180 >/dev/null 2>&1 \
    || die "Supabase tidak sehat. Cek: docker compose -f $SUPABASE_DIR/docker-compose.yml ps"
  psql_db <<'SQL'
create schema if not exists jp_migrations;
revoke all on schema jp_migrations from public;
create table if not exists jp_migrations.applied (
  version    text primary key,
  name       text not null,
  checksum   text not null,
  applied_at timestamptz not null default now()
);
SQL
}

# Jalankan file-file SQL + catat versinya dalam satu transaksi.
# Nama variabel psql sengaja tidak lazim supaya tidak bentrok dengan isi SQL.
apply_sql() {
  local version=$1 name=$2 sum=$3; shift 3
  {
    local f
    for f in "$@"; do cat "$f"; printf '\n;\n'; done
    printf "insert into jp_migrations.applied (version, name, checksum) values (:'jp_mig_version', :'jp_mig_name', :'jp_mig_sum');\n"
  } | psql_db -1 -v jp_mig_version="$version" -v jp_mig_name="$name" -v jp_mig_sum="$sum" -f -
}

declare -A APPLIED_SUM=()
load_applied() {
  local v s
  while IFS='|' read -r v s; do
    [[ -n "$v" ]] && APPLIED_SUM["$v"]="$s"
  done < <(psql_db -At -F '|' -c "select version, checksum from jp_migrations.applied")
}

# Daftar file migrasi yang valid, urut versi. Nama yang salah = error, bukan
# diam-diam dilewati.
MIGRATIONS=()
load_files() {
  [[ -d "$MIGRATIONS_DIR" ]] || return 0
  local f base prev=""
  while IFS= read -r f; do
    base="$(basename "$f")"
    [[ "$base" =~ $NAME_RE ]] || die "nama file tidak valid: supabase/migrations/$base (harus <YYYYMMDDHHMMSS>_<nama_huruf_kecil>.sql)"
    [[ "${BASH_REMATCH[1]}" != "$prev" ]] || die "dua migrasi memakai versi yang sama: ${BASH_REMATCH[1]}"
    prev="${BASH_REMATCH[1]}"
    MIGRATIONS+=("$f")
  done < <(find "$MIGRATIONS_DIR" -maxdepth 1 -type f -name '*.sql' | sort)
}

baseline() {
  local sum
  sum="$(checksum "${BASELINE_FILES[@]}")"

  if [[ -n "${APPLIED_SUM[$BASELINE_VERSION]:-}" ]]; then
    if [[ "${APPLIED_SUM[$BASELINE_VERSION]}" != "$sum" ]]; then
      say "PERINGATAN: schema.sql/seed.sql berubah sejak baseline dicatat. Perubahan itu TIDAK"
      say "  diterapkan — tulis sebagai migrasi baru: deploy/migrate.sh new <nama>"
    fi
    return 0
  fi

  if [[ "$(psql_db -At -c "select to_regclass('public.posts') is not null")" == "t" ]]; then
    # Database lama yang disiapkan manual dengan schema.sql: cukup dicatat.
    # Lewat stdin, bukan -c: psql tidak mengisi :'variabel' di dalam -c.
    printf "insert into jp_migrations.applied (version, name, checksum) values ('%s', 'baseline (schema.sql + seed.sql)', :'jp_mig_sum');\n" "$BASELINE_VERSION" \
      | psql_db -v jp_mig_sum="$sum" -f -
    say "baseline: tabel sudah ada, dicatat sebagai sudah diterapkan"
  else
    say "baseline: database kosong, menerapkan schema.sql + seed.sql"
    apply_sql "$BASELINE_VERSION" "baseline (schema.sql + seed.sql)" "$sum" "${BASELINE_FILES[@]}" \
      || die "baseline gagal — transaksi di-rollback, database tidak berubah"
  fi
  APPLIED_SUM[$BASELINE_VERSION]="$sum"
}

cmd_apply() {
  ensure_db
  load_applied
  load_files
  baseline

  local latest="" v
  for v in "${!APPLIED_SUM[@]}"; do [[ "$v" > "$latest" ]] && latest="$v"; done

  local f base version name sum count=0
  for f in "${MIGRATIONS[@]}"; do
    base="$(basename "$f")"
    [[ "$base" =~ $NAME_RE ]]
    version="${BASH_REMATCH[1]}"; name="${BASH_REMATCH[2]}"
    sum="$(checksum "$f")"

    if [[ -n "${APPLIED_SUM[$version]:-}" ]]; then
      [[ "${APPLIED_SUM[$version]}" == "$sum" ]] \
        || die "$base sudah diterapkan tapi isinya berubah. Kembalikan isinya dan buat migrasi baru untuk koreksinya."
      continue
    fi

    [[ "$version" > "$latest" ]] || say "PERINGATAN: $base lebih tua dari migrasi terakhir ($latest) — tetap diterapkan"
    say "menerapkan $base"
    apply_sql "$version" "$name" "$sum" "$f" \
      || die "$base gagal — transaksinya di-rollback. Migrasi sebelumnya (kalau ada) tetap tercatat."
    count=$((count + 1))
  done

  local dbv known
  for dbv in "${!APPLIED_SUM[@]}"; do
    [[ "$dbv" == "$BASELINE_VERSION" ]] && continue
    known=false
    for f in "${MIGRATIONS[@]}"; do [[ "$(basename "$f")" == "${dbv}_"* ]] && known=true && break; done
    [[ "$known" == true ]] || say "PERINGATAN: versi $dbv tercatat di database tapi filenya tidak ada di repo"
  done

  if (( count == 0 )); then say "database sudah paling baru"; else say "$count migrasi diterapkan"; fi
}

cmd_status() {
  ensure_db
  load_files
  psql_db -c "select version, name, left(checksum, 12) as checksum, applied_at from jp_migrations.applied order by version"
  load_applied
  local f base pending=0
  for f in "${MIGRATIONS[@]}"; do
    base="$(basename "$f")"; [[ "$base" =~ $NAME_RE ]]
    [[ -z "${APPLIED_SUM[${BASH_REMATCH[1]}]:-}" ]] && { say "belum diterapkan: $base"; pending=$((pending + 1)); }
  done
  [[ -z "${APPLIED_SUM[$BASELINE_VERSION]:-}" ]] && say "baseline belum dicatat (akan dicatat/diterapkan saat apply)"
  say "$pending migrasi menunggu"
}

cmd_new() {
  local name="${1:-}"
  name="$(printf '%s' "$name" | tr '[:upper:] -' '[:lower:]__' | tr -cd 'a-z0-9_')"
  [[ -n "$name" ]] || die "pakai: deploy/migrate.sh new <nama>, mis. new tambah_kolom_lokasi_event"
  mkdir -p "$MIGRATIONS_DIR"
  local file
  file="$MIGRATIONS_DIR/$(date +%Y%m%d%H%M%S)_${name}.sql"
  [[ ! -e "$file" ]] || die "$file sudah ada"
  cat > "$file" <<'SQL'
-- Dijalankan otomatis oleh ./deploy.sh (deploy/migrate.sh) dalam satu transaksi.
-- Jangan tulis BEGIN/COMMIT. Jangan edit file ini setelah ter-deploy.
-- Tabel baru di public: enable row level security + policy.

SQL
  echo "$file"
}

case "${1:-apply}" in
  apply)  cmd_apply ;;
  status) cmd_status ;;
  new)    shift; cmd_new "$@" ;;
  *)      echo "Pakai: $0 [apply|status|new <nama>]" >&2; exit 2 ;;
esac
