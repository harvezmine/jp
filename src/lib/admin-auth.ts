import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin-session";
import { createAdminClient } from "@/lib/supabase/admin";

export async function isAdminSession() {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value);
}

/**
 * Satu-satunya pintu ke database untuk admin panel.
 *
 * Tidak ada akun Supabase per pengurus, jadi panel memakai service-role key
 * yang MELEWATI RLS. Karena itu setiap halaman dan Server Action admin wajib
 * mengambil klien lewat fungsi ini — middleware saja tidak cukup, sebab
 * Server Action bisa dipanggil langsung dengan POST dari rute mana pun.
 */
export async function adminDb() {
  if (!(await isAdminSession())) redirect("/admin/login");
  return createAdminClient();
}
