#!/usr/bin/env bash
# Build & pasang situs Janji Pengharapan di server sendiri (PM2).
#
# Jalankan dari akar repo di server:
#   ./deploy/deploy.sh
#
# Alurnya: build -> rakit bundel standalone ke folder rilis baru -> tukar
# symlink `current` -> reload PM2. Symlink baru ditukar setelah build selesai,
# jadi rilis lama tetap melayani pengunjung selama build berjalan, dan
# `pm2 reload` mengganti worker satu per satu sehingga tanpa downtime.

set -euo pipefail

APP_DIR="${JP_APP_DIR:-/var/www/janjipengharapan}"
RELEASE="$APP_DIR/releases/$(date +%Y%m%d%H%M%S)"
KEEP_RELEASES=5

if [[ ! -f "$APP_DIR/.env.production" ]]; then
  echo "✗ $APP_DIR/.env.production tidak ada. Buat dulu (lihat .env.example)." >&2
  exit 1
fi

echo "▸ Memasang dependensi"
npm ci

echo "▸ Build produksi"
# NEXT_PUBLIC_* ditanam ke dalam bundel saat build, jadi env harus tersedia
# di tahap ini — bukan hanya saat runtime.
cp "$APP_DIR/.env.production" .env.production
npm run build

echo "▸ Merakit bundel standalone di $RELEASE"
mkdir -p "$RELEASE"
cp -r .next/standalone/. "$RELEASE/"
# Dua folder ini sengaja tidak ikut ke dalam standalone dan harus disalin manual.
mkdir -p "$RELEASE/.next"
cp -r .next/static "$RELEASE/.next/static"
cp -r public "$RELEASE/public"

echo "▸ Mengaktifkan rilis baru"
mkdir -p "$APP_DIR/logs"
# Ecosystem disimpan di luar folder rilis supaya path-nya stabil antar deploy.
cp ecosystem.config.js "$APP_DIR/ecosystem.config.js"
ln -sfn "$RELEASE" "$APP_DIR/current"

# startOrReload: pertama kali akan start, berikutnya reload tanpa downtime.
# --update-env memaksa PM2 membaca ulang ecosystem (termasuk .env.production
# yang mungkin berubah) alih-alih memakai environment yang tersimpan.
JP_APP_DIR="$APP_DIR" pm2 startOrReload "$APP_DIR/ecosystem.config.js" --update-env
pm2 save

echo "▸ Menyisakan $KEEP_RELEASES rilis terakhir"
ls -1dt "$APP_DIR"/releases/*/ | tail -n +$((KEEP_RELEASES + 1)) | xargs -r rm -rf

echo "✓ Selesai — cek: pm2 status janjipengharapan"
