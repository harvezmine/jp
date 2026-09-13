import { createClient } from "@supabase/supabase-js";

/**
 * Klien Supabase untuk konten publik — anon key, jadi RLS tetap berlaku.
 *
 * Sengaja tanpa cookie/sesi: situs publik tidak punya login, dan memanggil
 * cookies() membuat setiap halaman dirender dinamis sehingga ISR (`revalidate`)
 * dan generateStaticParams tidak berfungsi.
 */
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
