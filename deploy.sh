#!/usr/bin/env bash
# deploy.sh — tarik kode terbaru Janji Pengharapan dari GitHub lalu deploy.
#
# Pakai (di server, dari mana saja, setelah push ke GitHub):
#   ./deploy.sh           # deploy kalau ada commit baru
#   ./deploy.sh --force   # build & deploy ulang walau tidak ada commit baru
#
# Alurnya:
#   1. git fetch. Kalau origin tidak punya commit baru DAN commit sekarang
#      sudah pernah sukses di-deploy, keluar tanpa build.
#   2. git merge --ff-only.
#   3. deploy/deploy.sh — npm ci, build, rakit rilis baru, tukar symlink
#      `current`, pm2 reload (worker diganti satu per satu, tanpa downtime).
#   4. Cek kesehatan: situs menjawab 200 dan semua worker PM2 online.
#   5. Catat commit yang sukses ke $APP_DIR/.deployed-rev.
#
# Kalau build gagal, symlink `current` belum ditukar, jadi rilis lama tetap
# melayani pengunjung. Commit yang gagal tidak dicatat, sehingga menjalankan
# skrip ini lagi (setelah perbaikan di-push, atau dengan --force) akan mencoba
# ulang — bukan menganggap "sudah paling baru" hanya karena git pull-nya sudah
# terjadi.
#
# Perubahan supabase/*.sql TIDAK diterapkan otomatis: schema.sql bukan migrasi
# bertahap dan tidak aman dijalankan dua kali. Skrip hanya memperingatkan.
#
# Semua state disimpan di luar repo supaya working tree tetap bersih:
#   $APP_DIR/.env.production   env aplikasi (dibaca saat build & runtime)
#   $APP_DIR/.deploy.env       opsional: GIT_TOKEN kalau repo dibuat private
#                              (fine-grained token, Contents: Read-only), chmod 600
#   $APP_DIR/.deployed-rev     commit terakhir yang sukses di-deploy
#   $APP_DIR/logs/deploy.log   log setiap deploy
#   $APP_DIR/.deploy.lock      kunci supaya dua deploy tidak jalan bersamaan

set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="${JP_APP_DIR:-/var/www/janjipengharapan}"
APP_NAME="janjipengharapan"
ENV_FILE="$APP_DIR/.env.production"
LOG_FILE="$APP_DIR/logs/deploy.log"
LOCK_FILE="$APP_DIR/.deploy.lock"
REV_FILE="$APP_DIR/.deployed-rev"

log() {
  printf '[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$*" | tee -a "$LOG_FILE"
}

fail() {
  log "ERROR: $*"
  exit 1
}

env_get() {
  grep -E "^$1=" "$ENV_FILE" | tail -1 | cut -d= -f2- | tr -d "\"'"
}

git_remote() {
  # Token hanya dipakai sesaat lewat header, tidak pernah ditulis ke .git/config.
  if [[ -n "$GIT_TOKEN" ]]; then
    local header
    header="Authorization: Basic $(printf '%s' "x-access-token:${GIT_TOKEN}" | base64 -w0)"
    git -c http.extraHeader="$header" "$@"
  else
    git "$@"
  fi
}

# Dibungkus fungsi supaya bash membaca seluruh skrip sebelum menjalankannya:
# `git merge` di bawah bisa menimpa file ini sendiri saat sedang berjalan.
main() {
  local force=false
  case "${1:-}" in
    "") ;;
    --force) force=true ;;
    *) echo "Pakai: $0 [--force]" >&2; exit 2 ;;
  esac

  cd "$REPO_DIR"
  mkdir -p "$APP_DIR/logs"

  # --- kunci ---------------------------------------------------------------
  exec 200>"$LOCK_FILE"
  flock -n 200 || fail "deploy lain sedang berjalan (lock: $LOCK_FILE). Coba lagi nanti."

  # --- preflight -----------------------------------------------------------
  local cmd
  for cmd in git node npm pm2 curl flock; do
    command -v "$cmd" >/dev/null || fail "$cmd tidak ditemukan"
  done
  [[ -x deploy/deploy.sh ]] || fail "deploy/deploy.sh tidak ada atau tidak executable"
  [[ -f "$ENV_FILE" ]] || fail "$ENV_FILE tidak ada — lihat README bagian Deploy."

  GIT_TOKEN=""
  if [[ -f "$APP_DIR/.deploy.env" ]]; then
    GIT_TOKEN="$(grep -E '^GIT_TOKEN=' "$APP_DIR/.deploy.env" | head -1 | cut -d= -f2-)"
  fi

  local branch
  branch="$(git symbolic-ref --short HEAD)" || fail "HEAD detached — tidak tahu branch mana yang harus di-pull"

  log "=== Deploy mulai (branch: $branch$([[ "$force" == true ]] && echo ', --force')) ==="

  # File untracked tidak dihitung: tidak mengganggu fast-forward kecuali commit
  # baru membawa path yang sama, dan kasus itu ditangani di bawah.
  if [[ -n "$(git status --porcelain --untracked-files=no)" ]]; then
    fail "working tree tidak bersih, deploy dibatalkan supaya git pull tidak konflik:
$(git status --porcelain --untracked-files=no)"
  fi

  # --- fetch ---------------------------------------------------------------
  git_remote fetch origin "$branch" 2>&1 | tee -a "$LOG_FILE" || fail "git fetch gagal"

  local local_rev remote_rev deployed_rev merge_base
  local_rev="$(git rev-parse HEAD)"
  remote_rev="$(git rev-parse "origin/$branch")"
  deployed_rev="$(cat "$REV_FILE" 2>/dev/null || true)"

  if [[ "$local_rev" != "$remote_rev" ]]; then
    merge_base="$(git merge-base HEAD "origin/$branch")"
    if [[ "$merge_base" == "$remote_rev" ]]; then
      log "Local ($local_rev) lebih baru dari origin/$branch ($remote_rev) — tidak ada yang di-pull."
    elif [[ "$merge_base" != "$local_rev" ]]; then
      fail "local HEAD ($local_rev) menyimpang dari origin/$branch ($remote_rev) — tidak bisa fast-forward, perlu penanganan manual."
    else
      log "Update ditemukan: $local_rev -> $remote_rev"
      local changed
      changed="$(git diff --name-only "$local_rev" "$remote_rev")"
      log "File berubah:
$changed"

      # File yang dulu dibuat langsung di server lalu di-commit dari tempat
      # lain (misalnya deploy.sh ini) membuat merge menolak "untracked working
      # tree files would be overwritten". Kalau isinya identik, aman dihapus.
      local f
      while IFS= read -r f; do
        if git cat-file -e "$remote_rev:$f" 2>/dev/null && git show "$remote_rev:$f" | cmp -s - "$f"; then
          log "  $f belum di-track tapi identik dengan versi di $branch — dilepas supaya merge bisa jalan"
          rm -f -- "$f"
        fi
      done < <(git ls-files --others --exclude-standard)

      git merge --ff-only "origin/$branch" 2>&1 | tee -a "$LOG_FILE" || fail "git merge --ff-only gagal"

      if grep -q '^supabase/.*\.sql$' <<<"$changed"; then
        log "PERHATIAN: file SQL di supabase/ berubah. Tidak diterapkan otomatis —"
        log "  terapkan manual: cd /opt/supabase-jp && docker compose exec -T db psql -U supabase_admin -d postgres -1 -v ON_ERROR_STOP=1 < <file>"
      fi
    fi
  fi

  local target_rev
  target_rev="$(git rev-parse HEAD)"

  if [[ "$target_rev" == "$deployed_rev" && "$force" != true ]]; then
    log "Sudah paling baru dan sudah ter-deploy ($target_rev). Tidak ada yang di-deploy."
    exit 0
  fi

  # --- build & rilis -------------------------------------------------------
  log "Build & rilis $target_rev (npm ci, next build, tukar symlink, pm2 reload)..."
  JP_APP_DIR="$APP_DIR" deploy/deploy.sh 2>&1 | tee -a "$LOG_FILE" \
    || fail "build/rilis gagal — rilis lama tetap melayani. Commit $target_rev belum dicatat, jalankan ulang setelah diperbaiki."

  # --- cek kesehatan -------------------------------------------------------
  local host port url code="" workers=""
  host="$(env_get HOSTNAME)"; host="${host:-127.0.0.1}"
  port="$(env_get PORT)"; port="${port:-3000}"
  url="http://$host:$port/"

  log "Tunggu situs sehat di $url ..."
  local healthy=false
  for _ in $(seq 1 12); do
    sleep 5
    code="$(curl -s -o /dev/null -m 10 -w '%{http_code}' "$url" || true)"
    workers="$(pm2 jlist 2>/dev/null | node -e '
      let s = "";
      process.stdin.on("data", (d) => (s += d)).on("end", () => {
        try {
          const all = JSON.parse(s).filter((p) => p.name === process.argv[1]);
          const up = all.filter((p) => p.pm2_env.status === "online").length;
          console.log(`${up}/${all.length}`);
        } catch { console.log("?"); }
      });' "$APP_NAME" || echo "?")"
    # Sehat = HTTP 200 dan semua worker online ("2/2", bukan "1/2" atau "0/0").
    local up="${workers%/*}" total="${workers#*/}"
    if [[ "$code" == "200" && "$up" =~ ^[0-9]+$ && "$up" -gt 0 && "$up" == "$total" ]]; then
      healthy=true
      break
    fi
  done

  if [[ "$healthy" != true ]]; then
    log "PERINGATAN: situs belum sehat setelah 60 detik (HTTP ${code:-none}, worker online ${workers:-?})."
    log "Cek: pm2 logs $APP_NAME --err --lines 50"
    log "Rollback manual: ln -sfn <folder di $APP_DIR/releases> $APP_DIR/current && pm2 reload $APP_NAME --update-env"
    log "=== Deploy SELESAI DENGAN PERINGATAN ($target_rev) ==="
    exit 1
  fi

  printf '%s\n' "$target_rev" > "$REV_FILE"
  log "Situs sehat (HTTP $code, worker online $workers)."
  log "=== Deploy sukses: ${deployed_rev:-(belum pernah)} -> $target_rev ==="
}

main "$@"
