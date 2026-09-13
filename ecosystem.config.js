/**
 * Konfigurasi PM2 untuk situs Janji Pengharapan.
 *
 * Yang dijalankan adalah `server.js` hasil build `output: "standalone"` —
 * server Node mandiri, bukan `next start`. Jadi PM2 cukup menjalankan satu
 * berkas Node biasa tanpa perlu tahu apa pun soal Next.js.
 *
 * Pakai:
 *   pm2 start ecosystem.config.js --env production
 *   pm2 reload ecosystem.config.js --update-env    # muat ulang tanpa downtime
 *   pm2 logs janjipengharapan
 */

const fs = require("node:fs");
const path = require("node:path");

const APP_DIR = process.env.JP_APP_DIR || "/var/www/janjipengharapan";
const ENV_FILE = path.join(APP_DIR, ".env.production");

/**
 * Membaca rahasia dari .env.production.
 *
 * Sengaja diurai di sini alih-alih memakai `node_args: "--env-file=…"`:
 * dalam mode cluster PM2 memakai launcher-nya sendiri, dan node_args tidak
 * selalu diteruskan ke tiap worker. Menaruh nilainya di `env` membuat
 * perilakunya sama persis di mode fork maupun cluster.
 */
function readEnvFile(file) {
  if (!fs.existsSync(file)) {
    console.warn(`[pm2] ${file} tidak ditemukan — memakai environment yang ada.`);
    return {};
  }

  const out = {};
  for (const raw of fs.readFileSync(file, "utf8").split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;

    const eq = line.indexOf("=");
    if (eq === -1) continue;

    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();

    // Lepas tanda kutip pembungkus bila ada.
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

module.exports = {
  apps: [
    {
      name: "janjipengharapan",
      script: "server.js",
      cwd: path.join(APP_DIR, "current"),

      /*
        Mode cluster dengan 2 instance: `pm2 reload` bisa mengganti worker satu
        per satu sehingga pengunjung tidak pernah kena downtime. Naikkan angkanya
        kalau trafik bertambah — tapi jangan pakai "max" tanpa alasan: cache ISR
        Next.js ada di disk dan dipakai bersama semua worker, jadi menambah
        instance melebihi kebutuhan hanya menduplikasi kerja revalidasi.
      */
      instances: 2,
      exec_mode: "cluster",

      env: {
        NODE_ENV: "production",
        PORT: Number(process.env.PORT || 3000),
        // Hanya dengarkan localhost — nginx yang menghadap ke internet.
        HOSTNAME: "127.0.0.1",
        ...readEnvFile(ENV_FILE),
      },

      // Restart otomatis, tapi berhenti mencoba kalau gagal terus (biasanya
      // tanda env atau build-nya bermasalah, bukan sesuatu yang sembuh sendiri).
      autorestart: true,
      max_restarts: 10,
      min_uptime: "20s",
      restart_delay: 3000,

      // Bunuh paksa kalau tidak mau berhenti dalam 10 detik.
      kill_timeout: 10000,
      listen_timeout: 10000,
      wait_ready: false,

      // Situs ini tidak menyimpan state di memori, jadi ambang ini murni
      // jaring pengaman terhadap kebocoran memori.
      max_memory_restart: "512M",

      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      out_file: `${APP_DIR}/logs/out.log`,
      error_file: `${APP_DIR}/logs/error.log`,
    },
  ],
};
