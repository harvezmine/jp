import { createPublicClient } from "@/lib/supabase/public";
import type { JPEvent, Post, Quote, Service, SocialPost } from "@/lib/types";
import { demoEvents, demoPosts, demoQuotes, demoServices } from "@/lib/demo";
import { featuredSocialPosts } from "@/lib/social-featured";
import { MOCK_ENABLED } from "@/lib/mock";

/**
 * Query publik.
 *
 * Dua lapis pengaman, supaya situs tidak pernah menampilkan halaman rusak:
 *  1. Supabase belum dikonfigurasi  → konten contoh dari demo.ts saat development,
 *     empty state di produksi (jangan sampai testimoni fiktif tampil ke publik).
 *  2. Supabase error saat dipanggil → kembalikan array kosong + catat di log,
 *     halaman menampilkan empty state yang rapi.
 *
 * Saat development (lihat lib/mock.ts), hasil kosong juga diganti konten
 * contoh supaya setiap section bisa dilihat desainnya.
 */

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/** Kunci pembanding saat menggabungkan hasil database dengan konten contoh. */
const keyOf = (item: unknown) =>
  typeof item === "object" && item !== null
    ? ((item as { slug?: string }).slug ?? (item as { id?: string }).id)
    : item;

/**
 * Mode contoh: daftar yang lebih pendek dari konten contoh dilengkapi sampai
 * sepanjang daftar contoh, dan hasil tunggal yang kosong diganti contoh.
 */
function withMock<T>(result: T, demo: T): T {
  if (!MOCK_ENABLED) return result;
  if (Array.isArray(result) && Array.isArray(demo)) {
    if (result.length >= demo.length) return result;
    const seen = new Set(result.map(keyOf));
    return [...result, ...demo.filter((d) => !seen.has(keyOf(d)))].slice(0, demo.length) as T;
  }
  return result ?? demo;
}

async function query<T>(
  label: string,
  run: (supabase: ReturnType<typeof createPublicClient>) => Promise<T>,
  demo: T,
  empty: T,
): Promise<T> {
  if (!isSupabaseConfigured()) return MOCK_ENABLED ? demo : empty;
  try {
    return withMock(await run(createPublicClient()), demo);
  } catch (err) {
    console.error(`[query] ${label} gagal:`, err);
    return MOCK_ENABLED ? demo : empty;
  }
}

const byNewest = (a: { published_at?: string | null; created_at: string }, b: typeof a) =>
  new Date(b.published_at ?? b.created_at).getTime() -
  new Date(a.published_at ?? a.created_at).getTime();

export async function getPosts({ limit, category }: { limit?: number; category?: string } = {}) {
  const demo = demoPosts
    .filter((p) => !category || category === "semua" || p.category === category)
    .sort(byNewest)
    .slice(0, limit ?? demoPosts.length);

  return query<Post[]>(
    "getPosts",
    async (supabase) => {
      let q = supabase
        .from("posts")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false, nullsFirst: false });

      if (category && category !== "semua") q = q.eq("category", category);
      if (limit) q = q.limit(limit);

      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Post[];
    },
    demo,
    [],
  );
}

export async function getPostBySlug(slug: string) {
  return query<Post | null>(
    "getPostBySlug",
    async (supabase) => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return (data as Post) ?? null;
    },
    demoPosts.find((p) => p.slug === slug) ?? null,
    null,
  );
}

export async function getPostSlugs() {
  return query<string[]>(
    "getPostSlugs",
    async (supabase) => {
      const { data, error } = await supabase.from("posts").select("slug").eq("published", true);
      if (error) throw error;
      return (data ?? []).map((r) => r.slug as string);
    },
    demoPosts.map((p) => p.slug),
    [],
  );
}

export async function getQuotes({ limit, featuredOnly }: { limit?: number; featuredOnly?: boolean } = {}) {
  const demo = demoQuotes
    .filter((q) => !featuredOnly || q.featured)
    .slice(0, limit ?? demoQuotes.length);

  return query<Quote[]>(
    "getQuotes",
    async (supabase) => {
      let q = supabase
        .from("quotes")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (featuredOnly) q = q.eq("featured", true);
      if (limit) q = q.limit(limit);

      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Quote[];
    },
    demo,
    [],
  );
}

export async function getEvents({ limit, upcoming }: { limit?: number; upcoming?: boolean } = {}) {
  const nowIso = new Date().toISOString();
  const demo = demoEvents
    .filter((e) => !upcoming || e.starts_at >= nowIso)
    .sort((a, b) =>
      upcoming
        ? new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()
        : new Date(b.starts_at).getTime() - new Date(a.starts_at).getTime(),
    )
    .slice(0, limit ?? demoEvents.length);

  return query<JPEvent[]>(
    "getEvents",
    async (supabase) => {
      let q = supabase.from("events").select("*").eq("published", true);

      if (upcoming) {
        q = q.gte("starts_at", nowIso).order("starts_at", { ascending: true });
      } else {
        q = q.order("starts_at", { ascending: false });
      }
      if (limit) q = q.limit(limit);

      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as JPEvent[];
    },
    demo,
    [],
  );
}

export async function getEventBySlug(slug: string) {
  return query<JPEvent | null>(
    "getEventBySlug",
    async (supabase) => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return (data as JPEvent) ?? null;
    },
    demoEvents.find((e) => e.slug === slug) ?? null,
    null,
  );
}

export async function getEventSlugs() {
  return query<string[]>(
    "getEventSlugs",
    async (supabase) => {
      const { data, error } = await supabase.from("events").select("slug").eq("published", true);
      if (error) throw error;
      return (data ?? []).map((r) => r.slug as string);
    },
    demoEvents.map((e) => e.slug),
    [],
  );
}

export async function getServices() {
  return query<Service[]>(
    "getServices",
    async (supabase) => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Service[];
    },
    demoServices,
    [],
  );
}

/** Kalau admin belum mengisi apa pun, yang tampil adalah postingan Instagram JP yang asli. */
export async function getSocialPosts({ limit }: { limit?: number } = {}) {
  const featured = featuredSocialPosts.slice(0, limit ?? featuredSocialPosts.length);
  return query<SocialPost[]>(
    "getSocialPosts",
    async (supabase) => {
      let q = supabase
        .from("social_posts")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (limit) q = q.limit(limit);

      const { data, error } = await q;
      if (error) throw error;
      return data?.length ? (data as SocialPost[]) : featured;
    },
    featured,
    featured,
  );
}
