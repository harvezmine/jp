/**
 * Sesi admin berbasis satu password bersama (ADMIN_PASSWORD).
 *
 * Cookie berisi waktu kedaluwarsa + tanda tangan HMAC-SHA256. Kuncinya
 * diturunkan dari SUPABASE_SERVICE_ROLE_KEY dan ADMIN_PASSWORD, jadi:
 *  - token tidak bisa dipalsukan tanpa service-role key;
 *  - mengganti password otomatis mengeluarkan semua sesi yang sedang aktif.
 *
 * Hanya memakai Web Crypto supaya bisa dipanggil dari middleware (edge)
 * maupun dari Server Component / Server Action / Route Handler.
 */

export const ADMIN_COOKIE = "jp_admin";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 hari, dalam detik
export const MIN_PASSWORD_LENGTH = 12;

const encoder = new TextEncoder();

export function isAdminConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      (process.env.ADMIN_PASSWORD ?? "").length >= MIN_PASSWORD_LENGTH,
  );
}

function base64url(bytes: Uint8Array) {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sign(message: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(`${process.env.SUPABASE_SERVICE_ROLE_KEY}|${process.env.ADMIN_PASSWORD}`),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return base64url(new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(message))));
}

/** Bandingkan dua string tanpa membocorkan posisi karakter yang berbeda lewat waktu. */
function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function checkPassword(input: string) {
  if (!isAdminConfigured()) return false;
  // Yang dibandingkan tanda tangannya, bukan password mentah — panjangnya selalu
  // sama, jadi panjang password asli pun tidak bocor.
  const [given, expected] = await Promise.all([
    sign(`password:${input}`),
    sign(`password:${process.env.ADMIN_PASSWORD}`),
  ]);
  return safeEqual(given, expected);
}

export async function createSessionToken() {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  return `${exp}.${await sign(`session:${exp}`)}`;
}

export async function verifySessionToken(token: string | undefined) {
  if (!token || !isAdminConfigured()) return false;

  const [exp, sig] = token.split(".");
  if (!exp || !sig || !/^\d+$/.test(exp)) return false;
  if (Number(exp) * 1000 < Date.now()) return false;

  return safeEqual(sig, await sign(`session:${exp}`));
}
