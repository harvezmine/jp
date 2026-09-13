"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { adminDb } from "@/lib/admin-auth";
import { fromWibInput, slugify } from "@/lib/utils";

/**
 * Aksi CRUD admin panel.
 *
 * Server Action adalah endpoint POST publik, dan klien database-nya memakai
 * service role (melewati RLS). Karena itu setiap aksi mengambil klien lewat
 * adminDb(), yang menolak permintaan tanpa sesi admin yang sah.
 */

export type ActionState = { status: "idle" | "success" | "error"; message?: string };

const text = (fd: FormData, key: string, max = 500) =>
  String(fd.get(key) ?? "").trim().slice(0, max);
const bool = (fd: FormData, key: string) => fd.get(key) === "on" || fd.get(key) === "true";
const nullable = (v: string) => (v === "" ? null : v);

function refreshPublic(paths: string[]) {
  for (const p of paths) revalidatePath(p);
}

/* ═══════════════════════════════════════════════════════════════════════════
   Tulisan
   ═══════════════════════════════════════════════════════════════════════════ */

export async function savePost(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const id = text(fd, "id", 60);
  const title = text(fd, "title", 200);
  const body = text(fd, "body", 60000);
  const published = bool(fd, "published");

  if (title.length < 3) return { status: "error", message: "Judul terlalu pendek." };
  if (body.length < 10) return { status: "error", message: "Isi tulisan masih kosong." };

  const slug = slugify(text(fd, "slug", 120) || title);

  const payload = {
    title,
    slug,
    excerpt: nullable(text(fd, "excerpt", 400)),
    body,
    cover_url: nullable(text(fd, "cover_url", 600)),
    category: text(fd, "category", 30) || "renungan",
    author: nullable(text(fd, "author", 120)),
    published,
    // Tanggal terbit dikunci saat pertama kali dipublikasikan — menjadikannya
    // draf lalu menerbitkan ulang tidak menggeser urutannya di halaman Konten.
    published_at: nullable(text(fd, "published_at", 40)) ?? (published ? new Date().toISOString() : null),
  };

  const supabase = await adminDb();
  const { error } = id
    ? await supabase.from("posts").update(payload).eq("id", id)
    : await supabase.from("posts").insert(payload);

  if (error) {
    console.error("[admin] savePost:", error);
    return {
      status: "error",
      message:
        error.code === "23505"
          ? "Slug sudah dipakai tulisan lain. Ubah judul atau slug-nya."
          : "Gagal menyimpan. Coba lagi sebentar.",
    };
  }

  refreshPublic(["/", "/konten", `/konten/${slug}`]);
  revalidatePath("/admin/konten");
  redirect("/admin/konten?saved=1");
}

export async function deletePost(fd: FormData) {
  const id = text(fd, "id", 60);
  const supabase = await adminDb();
  await supabase.from("posts").delete().eq("id", id);
  refreshPublic(["/", "/konten"]);
  revalidatePath("/admin/konten");
}

export async function togglePost(fd: FormData) {
  const id = text(fd, "id", 60);
  const next = bool(fd, "next");
  const supabase = await adminDb();
  const { data: current } = await supabase
    .from("posts")
    .select("published_at")
    .eq("id", id)
    .maybeSingle();
  await supabase
    .from("posts")
    .update({
      published: next,
      published_at: current?.published_at ?? (next ? new Date().toISOString() : null),
    })
    .eq("id", id);
  refreshPublic(["/", "/konten"]);
  revalidatePath("/admin/konten");
}

/* ═══════════════════════════════════════════════════════════════════════════
   Kutipan
   ═══════════════════════════════════════════════════════════════════════════ */

export async function saveQuote(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const id = text(fd, "id", 60);
  const content = text(fd, "content", 1000);

  if (content.length < 5) return { status: "error", message: "Isi kutipan masih kosong." };

  const payload = {
    content,
    reference: nullable(text(fd, "reference", 120)),
    author: nullable(text(fd, "author", 120)),
    published: bool(fd, "published"),
    featured: bool(fd, "featured"),
  };

  const supabase = await adminDb();
  const { error } = id
    ? await supabase.from("quotes").update(payload).eq("id", id)
    : await supabase.from("quotes").insert(payload);

  if (error) {
    console.error("[admin] saveQuote:", error);
    return { status: "error", message: "Gagal menyimpan kutipan." };
  }

  refreshPublic(["/", "/konten"]);
  revalidatePath("/admin/quotes");
  return { status: "success", message: "Kutipan tersimpan." };
}

export async function deleteQuote(fd: FormData) {
  const supabase = await adminDb();
  await supabase.from("quotes").delete().eq("id", text(fd, "id", 60));
  refreshPublic(["/", "/konten"]);
  revalidatePath("/admin/quotes");
}

/* ═══════════════════════════════════════════════════════════════════════════
   Event
   ═══════════════════════════════════════════════════════════════════════════ */

export async function saveEvent(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const id = text(fd, "id", 60);
  const title = text(fd, "title", 200);
  // Jam di form selalu dibaca sebagai WIB, apa pun zona waktu server.
  const startsAt = fromWibInput(text(fd, "starts_at", 40));
  const endsAt = fromWibInput(text(fd, "ends_at", 40));

  if (title.length < 3) return { status: "error", message: "Judul event terlalu pendek." };
  if (!startsAt) return { status: "error", message: "Tanggal dan jam mulai wajib diisi." };
  if (endsAt && endsAt <= startsAt) {
    return { status: "error", message: "Jam selesai harus setelah jam mulai." };
  }

  const slug = slugify(text(fd, "slug", 120) || title);

  const payload = {
    title,
    slug,
    description: nullable(text(fd, "description", 20000)),
    starts_at: startsAt,
    ends_at: endsAt,
    location: nullable(text(fd, "location", 200)),
    address: nullable(text(fd, "address", 400)),
    map_url: nullable(text(fd, "map_url", 600)),
    cover_url: nullable(text(fd, "cover_url", 600)),
    register_url: nullable(text(fd, "register_url", 600)),
    published: bool(fd, "published"),
  };

  const supabase = await adminDb();
  const { error } = id
    ? await supabase.from("events").update(payload).eq("id", id)
    : await supabase.from("events").insert(payload);

  if (error) {
    console.error("[admin] saveEvent:", error);
    return {
      status: "error",
      message:
        error.code === "23505"
          ? "Slug sudah dipakai event lain. Ubah judul atau slug-nya."
          : "Gagal menyimpan event.",
    };
  }

  refreshPublic(["/", "/event", `/event/${slug}`]);
  revalidatePath("/admin/event");
  redirect("/admin/event?saved=1");
}

export async function deleteEvent(fd: FormData) {
  const supabase = await adminDb();
  await supabase.from("events").delete().eq("id", text(fd, "id", 60));
  refreshPublic(["/", "/event"]);
  revalidatePath("/admin/event");
}

/* ═══════════════════════════════════════════════════════════════════════════
   Layanan
   ═══════════════════════════════════════════════════════════════════════════ */

export async function saveService(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const id = text(fd, "id", 60);
  const title = text(fd, "title", 200);

  if (title.length < 3) return { status: "error", message: "Nama layanan terlalu pendek." };

  const payload = {
    title,
    slug: slugify(text(fd, "slug", 120) || title),
    summary: nullable(text(fd, "summary", 400)),
    description: nullable(text(fd, "description", 8000)),
    icon: text(fd, "icon", 30) || "heart",
    schedule: nullable(text(fd, "schedule", 120)),
    sort_order: Number(text(fd, "sort_order", 6)) || 0,
    published: bool(fd, "published"),
  };

  const supabase = await adminDb();
  const { error } = id
    ? await supabase.from("services").update(payload).eq("id", id)
    : await supabase.from("services").insert(payload);

  if (error) {
    console.error("[admin] saveService:", error);
    return { status: "error", message: "Gagal menyimpan layanan." };
  }

  refreshPublic(["/", "/layanan"]);
  revalidatePath("/admin/layanan");
  return { status: "success", message: "Layanan tersimpan." };
}

export async function deleteService(fd: FormData) {
  const supabase = await adminDb();
  await supabase.from("services").delete().eq("id", text(fd, "id", 60));
  refreshPublic(["/", "/layanan"]);
  revalidatePath("/admin/layanan");
}

/* ═══════════════════════════════════════════════════════════════════════════
   Konten sosmed
   ═══════════════════════════════════════════════════════════════════════════ */

export async function saveSocialPost(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const id = text(fd, "id", 60);
  const url = text(fd, "url", 600);

  if (!/^https?:\/\//i.test(url)) {
    return { status: "error", message: "Tautan harus diawali http:// atau https://" };
  }

  const payload = {
    platform: text(fd, "platform", 20) || "instagram",
    url,
    caption: nullable(text(fd, "caption", 600)),
    thumbnail_url: nullable(text(fd, "thumbnail_url", 600)),
    sort_order: Number(text(fd, "sort_order", 6)) || 0,
    published: bool(fd, "published"),
  };

  const supabase = await adminDb();
  const { error } = id
    ? await supabase.from("social_posts").update(payload).eq("id", id)
    : await supabase.from("social_posts").insert(payload);

  if (error) {
    console.error("[admin] saveSocialPost:", error);
    return { status: "error", message: "Gagal menyimpan konten sosmed." };
  }

  refreshPublic(["/", "/konten"]);
  revalidatePath("/admin/sosmed");
  return { status: "success", message: "Konten sosmed tersimpan." };
}

export async function deleteSocialPost(fd: FormData) {
  const supabase = await adminDb();
  await supabase.from("social_posts").delete().eq("id", text(fd, "id", 60));
  refreshPublic(["/", "/konten"]);
  revalidatePath("/admin/sosmed");
}

/* ═══════════════════════════════════════════════════════════════════════════
   Permohonan & pesan
   ═══════════════════════════════════════════════════════════════════════════ */

export async function updateHelpRequest(fd: FormData) {
  const id = text(fd, "id", 60);
  const status = text(fd, "status", 20);
  const notes = text(fd, "admin_notes", 4000);
  const handledBy = text(fd, "handled_by", 120);

  const supabase = await adminDb();
  await supabase
    .from("help_requests")
    .update({
      status,
      admin_notes: nullable(notes),
      handled_by: nullable(handledBy),
    })
    .eq("id", id);

  revalidatePath("/admin/permohonan");
  revalidatePath(`/admin/permohonan/${id}`);
  revalidatePath("/admin");
}

export async function markMessageRead(fd: FormData) {
  const supabase = await adminDb();
  await supabase
    .from("contact_messages")
    .update({ is_read: bool(fd, "next") })
    .eq("id", text(fd, "id", 60));
  revalidatePath("/admin/pesan");
  revalidatePath("/admin");
}

export async function deleteMessage(fd: FormData) {
  const supabase = await adminDb();
  await supabase.from("contact_messages").delete().eq("id", text(fd, "id", 60));
  revalidatePath("/admin/pesan");
  revalidatePath("/admin");
}
