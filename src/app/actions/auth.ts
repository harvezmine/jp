"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  ADMIN_COOKIE,
  SESSION_MAX_AGE,
  checkPassword,
  createSessionToken,
  isAdminConfigured,
} from "@/lib/admin-session";

export type AuthState = { error?: string };

/*
 * Batas percobaan salah per IP. Disimpan di memori proses — cukup untuk
 * memperlambat tebak-tebakan password; tiap worker PM2 menghitung sendiri.
 */
const MAX_FAILS = 5;
const LOCK_MS = 15 * 60 * 1000;
const failures = new Map<string, { count: number; until: number }>();

async function clientIp() {
  const h = await headers();
  // nginx menimpa X-Real-IP dengan $remote_addr, jadi tidak bisa dipalsukan pengunjung.
  // Entri PERTAMA X-Forwarded-For justru bisa diisi sembarang oleh klien — pakai yang terakhir.
  return (
    h.get("x-real-ip") ||
    h.get("x-forwarded-for")?.split(",").at(-1)?.trim() ||
    "local"
  );
}

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  if (!isAdminConfigured()) return { error: "Admin panel belum dikonfigurasi." };

  const ip = await clientIp();
  const now = Date.now();

  for (const [key, record] of failures) if (record.until <= now) failures.delete(key);

  const record = failures.get(ip);
  if (record && record.count >= MAX_FAILS) {
    const minutes = Math.ceil((record.until - now) / 60_000);
    return { error: `Terlalu banyak percobaan. Coba lagi dalam ${minutes} menit.` };
  }

  const password = String(formData.get("password") ?? "");
  if (!(await checkPassword(password))) {
    failures.set(ip, { count: (record?.count ?? 0) + 1, until: now + LOCK_MS });
    return { error: "Password salah." };
  }

  failures.delete(ip);

  const store = await cookies();
  store.set(ADMIN_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  const next = String(formData.get("next") ?? "");
  redirect(next.startsWith("/admin") && !next.startsWith("/admin/login") ? next : "/admin");
}

export async function signOut() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}
