import { NextResponse } from "next/server";

import { isAdminSession } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX_BYTES = 5 * 1024 * 1024;

/** Ekstensi diambil dari tipe file, bukan dari nama file kiriman browser. SVG sengaja tidak diterima. */
const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

/** Unggah gambar ke bucket "media". Dipakai komponen ImageUpload di admin panel. */
export async function POST(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Sesi berakhir. Muat ulang halaman lalu masuk lagi." }, { status: 401 });
  }

  const file = (await request.formData()).get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File tidak ditemukan." }, { status: 400 });
  }

  const ext = EXT_BY_TYPE[file.type];
  if (!ext) {
    return NextResponse.json({ error: "Format harus JPG, PNG, WebP, GIF, atau AVIF." }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Ukuran maksimal 5 MB. Perkecil dulu gambarnya." }, { status: 413 });
  }

  const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${ext}`;
  const supabase = createAdminClient();
  const { error } = await supabase.storage
    .from("media")
    .upload(path, file, { contentType: file.type, cacheControl: "31536000", upsert: false });

  if (error) {
    console.error("[upload]", error);
    return NextResponse.json({ error: "Gagal mengunggah. Coba lagi sebentar." }, { status: 500 });
  }

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
