import { coverPool, eventPool, pickPhoto, socialPool } from "@/lib/photos";

/**
 * Saklar konten contoh untuk development.
 *
 * Selama `next dev`, daftar di database yang masih pendek dilengkapi konten
 * dari demo.ts dan kartu tanpa gambar memakai foto contoh, supaya desain bisa
 * dinilai sebelum konten asli diisi lewat admin. Build produksi selalu
 * mematikannya. Untuk mematikannya saat development, isi MOCK_CONTENT=0 di
 * .env.local.
 */
export const MOCK_ENABLED =
  process.env.NODE_ENV !== "production" && process.env.MOCK_CONTENT !== "0";

const pools = { cover: coverPool, event: eventPool, social: socialPool } as const;

/** Foto contoh untuk kartu yang belum punya gambar. Selalu null di produksi. */
export function mockPhoto(key: string, kind: keyof typeof pools = "cover") {
  return MOCK_ENABLED ? pickPhoto(key, pools[kind]) : null;
}
