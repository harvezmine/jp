# Janji Pengharapan

Situs komunitas gereja Janji Pengharapan — landing page publik + admin panel
untuk mengelola konten, dan formulir permohonan pertolongan.

- **Stack**: Next.js 15 (App Router) · React 19 · Tailwind CSS v4 · Supabase
- **Hosting**: server sendiri (build `standalone`, di belakang nginx)
- **Domain**: janjipengharapan.com

---

## Isi situs

| Halaman | Rute | Sumber data |
|---|---|---|
| Beranda | `/` | Supabase |
| Siapa Kami | `/tentang-kami` | statis (`src/lib/site.ts`) |
| Pelayanan (4 ruang) | `/layanan` | statis (`src/lib/ruang.ts`) |
| Konten (tulisan · kutipan · sosmed) | `/konten` | Supabase |
| Detail tulisan | `/konten/[slug]` | Supabase |
| Event | `/event`, `/event/[slug]` | Supabase |
| Donasi | `/donasi` | statis (`src/lib/site.ts` → `donation`) |
| Kontak | `/kontak` | statis + form |
| **Butuh Pertolongan** | `/pertolongan` | form 3 langkah |
| Admin panel | `/admin` | login Supabase |

---

## Menjalankan di komputer sendiri

```bash
npm install
cp .env.example .env.local     # isi kredensial Supabase
npm run dev                    # http://localhost:3000
```

> Tanpa `.env.local`, situs tetap bisa dibuka memakai konten contoh dari
> `src/lib/demo.ts`. Admin panel baru aktif setelah Supabase dan
> `ADMIN_PASSWORD` dikonfigurasi.

---

## Menghubungkan Supabase

1. Buat proyek baru di [supabase.com](https://supabase.com) (free tier cukup).
2. **SQL Editor** → tempel isi `supabase/schema.sql` → Run.
   Ini membuat semua tabel, aturan RLS, bucket gambar, dan trigger.
3. Opsional: jalankan `supabase/seed.sql` untuk mengisi layanan & kutipan awal.
4. **Project Settings → API** → salin ke `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` — **jangan pernah dibagikan atau di-commit**
5. **Authentication → Providers → Email**: matikan *Enable email signups*.
   Situs tidak memakai akun Supabase sama sekali, jadi tidak ada alasan
   membiarkan orang mendaftar.

### Masuk ke admin panel

Admin panel dijaga **satu password bersama** — tidak ada akun per pengurus.

1. Isi `ADMIN_PASSWORD` di `.env.local` (produksi: `.env.production`),
   minimal 12 karakter. Contoh membuat yang acak: `openssl rand -base64 18`.
2. Jalankan ulang server, lalu masuk lewat `/admin/login`.

Yang perlu diketahui:

- **Sesi berlaku 7 hari** lewat cookie HttpOnly bertanda tangan. Tombol
  *Keluar* menghapus cookie di perangkat itu saja.
- **Ganti password = semua orang keluar.** Tanda tangan sesi diturunkan dari
  password, jadi mengganti `ADMIN_PASSWORD` (lalu `pm2 reload … --update-env`)
  langsung mematikan setiap sesi — lakukan ini bila ada pengurus yang berhenti
  atau password bocor.
- **5 kali salah → dikunci 15 menit** per alamat IP.
- Panel membaca & menulis database memakai service-role key di server, jadi
  setiap halaman dan Server Action admin wajib mengambil klien lewat
  `adminDb()` (`src/lib/admin-auth.ts`) — fungsi itulah yang memeriksa sesi.
- Tabel `admin_users` dan fungsi `is_admin()` di `schema.sql` tidak lagi
  dipakai untuk login; RLS-nya tetap aman dibiarkan (menolak semua penulisan
  dari anon key).

### Supabase lokal (opsional)

Untuk mencoba admin panel tanpa proyek Supabase cloud (butuh Docker):

```bash
npx supabase start -x gotrue,realtime,imgproxy,mailpit,postgres-meta,studio,edge-runtime,logflare,vector,supavisor
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres -f supabase/schema.sql -f supabase/seed.sql
npx supabase status -o env   # salin API_URL, ANON_KEY, SERVICE_ROLE_KEY ke .env.local
```

---

## Notifikasi permohonan pertolongan

Setiap permohonan **selalu** tersimpan di inbox admin. Notifikasi hanyalah
tambahan: kalau tokennya kosong atau layanannya sedang bermasalah, formulir
tetap berhasil terkirim dan kegagalan notifikasi hanya dicatat di log server.

| Kanal | Variabel | Cara dapat |
|---|---|---|
| WhatsApp | `FONNTE_TOKEN`, `NOTIFY_WA_TO` | daftar di [fonnte.com](https://fonnte.com), salin token perangkat |
| Email | `RESEND_API_KEY`, `NOTIFY_EMAIL_FROM`, `NOTIFY_EMAIL_TO` | daftar di [resend.com](https://resend.com), verifikasi domain |

`NOTIFY_WA_TO` boleh berisi beberapa nomor dipisah koma (format `62…`).

Permohonan yang ditandai **rahasia** oleh pemohon tidak pernah mengirimkan isi
pesannya ke WhatsApp/email — hanya pemberitahuan bahwa ada permohonan baru.
Isinya hanya bisa dibaca di admin panel yang terlindungi login.

---

## Mengganti identitas visual

| Yang diganti | Di mana |
|---|---|
| Logo | timpa `public/brand/logo.svg` — dipakai header, footer, admin |
| Favicon | taruh `favicon.ico` & `icon.png` di `src/app/` |
| Gambar share (WA/IG) | `public/brand/og-image.jpg`, 1200×630 |
| Nama, alamat, telepon, sosmed | `src/lib/site.ts` |
| Ruang pelayanan & jadwal rutin | `src/lib/ruang.ts` |
| Foto (sementara dari Unsplash) | `src/lib/photos.ts` |
| Rekening donasi | `src/lib/site.ts` → `donation` |
| Warna | `src/app/globals.css` → blok `@theme` |

Palet dibangun dari maroon logo (`--color-maroon-700`) plus netral hangat
(`sand`), terakota (`clay`), dan emas (`gold`). Mengubah nilai di `@theme`
otomatis merambat ke seluruh situs dan admin panel.

---

## Deploy ke server sendiri (PM2)

Build menghasilkan `.next/standalone` — server Node mandiri. PM2 cukup
menjalankan `server.js`, tidak perlu `next start` dan tidak perlu Vercel.

### Sekali di awal

```bash
sudo npm install -g pm2

sudo mkdir -p /var/www/janjipengharapan/{releases,logs}
sudo chown -R $USER:$USER /var/www/janjipengharapan

# Rahasia produksi — dibaca saat build DAN saat runtime
nano /var/www/janjipengharapan/.env.production
chmod 600 /var/www/janjipengharapan/.env.production

# Deploy pertama (sekaligus start PM2)
./deploy/deploy.sh

# Supaya PM2 ikut hidup setelah server reboot
pm2 startup          # jalankan perintah yang dicetaknya
pm2 save

# Rotasi log biar tidak memenuhi disk
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 14
```

Lalu pasang nginx sebagai reverse proxy:

```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/janjipengharapan
sudo ln -s /etc/nginx/sites-available/janjipengharapan /etc/nginx/sites-enabled/
sudo certbot --nginx -d janjipengharapan.com -d www.janjipengharapan.com
sudo nginx -t && sudo systemctl reload nginx
```

### Setiap kali memperbarui

Push ke GitHub, lalu di server cukup satu perintah:

```bash
/home/jp/deploy.sh           # pull + migrasi database + build + reload
/home/jp/deploy.sh --force   # ulangi walau tidak ada commit baru
```

Urutannya: `git pull --ff-only` → `deploy/migrate.sh` (migrasi Supabase yang
belum jalan) → `deploy/deploy.sh` (build, rakit bundel ke folder rilis baru,
tukar symlink `current`, `pm2 startOrReload --update-env`) → cek situs
menjawab 200 dan semua worker online. Rilis lama tetap melayani selama build
berjalan, dan reload mengganti worker satu per satu — pengunjung tidak kena
downtime. Lima rilis terakhir disimpan untuk jaga-jaga.

Kalau migrasi atau build gagal, rilis lama tetap jalan dan commit itu tidak
dicatat sebagai ter-deploy, jadi menjalankan `deploy.sh` lagi akan mencobanya
ulang. Log: `/var/www/janjipengharapan/logs/deploy.log`.

### Mengubah skema database (migrasi)

`supabase/schema.sql` dan `seed.sql` adalah **baseline** — jangan diubah lagi.
Setiap perubahan skema sesudahnya ditulis sebagai file migrasi:

```bash
deploy/migrate.sh new tambah_lokasi_event   # buat supabase/migrations/<timestamp>_tambah_lokasi_event.sql
deploy/migrate.sh status                    # mana yang sudah & belum diterapkan
```

Isi file dengan SQL-nya, commit, push, lalu `deploy.sh` menerapkannya.

- Setiap file dijalankan dalam **satu transaksi** — gagal di tengah, database
  tidak berubah. Jangan tulis `BEGIN`/`COMMIT` sendiri, dan hindari perintah
  yang tidak bisa di dalam transaksi (`CREATE INDEX CONCURRENTLY`, `VACUUM`).
- **Jangan edit migrasi yang sudah ter-deploy** (checksum-nya dicek dan deploy
  akan berhenti). Koreksi = migrasi baru.
- Migrasi jalan **sebelum** build, saat kode lama masih melayani: tambah kolom
  atau tabel dulu, hapus yang lama di deploy berikutnya.
- Tabel baru di `public` otomatis terbuka lewat API — selalu
  `enable row level security` dan tulis policy-nya.
- Catatan migrasi ada di tabel `jp_migrations.applied`.

### Perintah PM2 harian

```bash
pm2 status                       # ringkasan proses
pm2 logs janjipengharapan        # log langsung
pm2 logs janjipengharapan --err  # hanya error
pm2 reload janjipengharapan      # muat ulang tanpa downtime
pm2 restart janjipengharapan     # restart penuh (ada jeda singkat)
pm2 monit                        # CPU & memori
```

### Yang perlu diingat

- **`NEXT_PUBLIC_*` ditanam ke bundel saat build.** Setelah mengubahnya di
  `.env.production`, situs harus **di-build ulang** (`./deploy/deploy.sh`) —
  `pm2 restart` saja tidak cukup. Variabel server (`SUPABASE_SERVICE_ROLE_KEY`,
  `FONNTE_TOKEN`, `RESEND_API_KEY`) cukup `pm2 reload … --update-env`.
- **Jangan pakai `pm2 start server.js` langsung.** Selalu lewat
  `ecosystem.config.js`, karena di situlah `.env.production` dibaca dan
  `cwd` diarahkan ke symlink `current`.
- **Berapa instance?** Default 2 (mode cluster) supaya reload bisa tanpa
  downtime. Hindari `instances: "max"` tanpa alasan — cache ISR Next.js ada di
  disk dan dipakai bersama, jadi kelebihan worker hanya menduplikasi kerja
  revalidasi.
- Kalau lebih suka **systemd**, unit alternatifnya ada di
  `deploy/janjipengharapan.service.alt`. Jangan aktifkan bersamaan dengan PM2 —
  keduanya akan berebut port 3000.

---

## Catatan teknis

**Animasi.** Animasi saat scroll memakai AOS (`<Reveal>` hanya menulis atribut
`data-aos`, jadi tetap server component), parallax memakai react-scroll-parallax
(`<Parallax>` dan `<ParallaxImage>` di `src/components/parallax.tsx`). Keduanya
dijalankan `MotionProvider` (`src/components/motion.tsx`) dan mati otomatis bila
perangkat meminta "kurangi gerakan". Konten di atas lipatan memakai `<Rise>`,
animasi CSS murni tanpa JavaScript, supaya teks utama tidak menunggu hidrasi
React. Ada `<noscript>` yang menampilkan seluruh konten bila JavaScript mati.

**Konten contoh saat development.** Selama `npm run dev`, daftar di database yang
masih kosong atau pendek dilengkapi konten dari `src/lib/demo.ts`, dan kartu tanpa
gambar memakai foto contoh (`src/lib/mock.ts`). Build produksi selalu mematikannya;
saat development bisa dimatikan dengan `MOCK_CONTENT=0` di `.env.local`.

**Keamanan data permohonan.** Tabel `help_requests` tidak membuka akses baca
ke siapa pun lewat RLS. Pengiriman formulir memakai service-role key di sisi
server, sehingga pemohon anonim tetap bisa mengirim tanpa perlu membuka akses
baca. Pembacaan hanya lewat admin panel oleh akun yang lolos `is_admin()`.

**Isi tulisan** ditulis dengan sintaks ringkas (`##`, `>`, `-`, `**tebal**`)
dan dirender sebagai elemen React, bukan HTML mentah — jadi tidak ada celah
injeksi dari teks yang diketik di admin panel.

**Perintah**

```bash
npm run dev        # server pengembangan
npm run build      # build produksi (standalone)
npm run start      # jalankan hasil build secara lokal
npm run typecheck  # pemeriksaan TypeScript
```
