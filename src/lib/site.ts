/**
 * Data statis situs. Yang jarang berubah ditaruh di sini supaya halaman tetap
 * bisa dirender walau Supabase belum diisi. Yang sering berubah (tulisan, event,
 * kutipan) diambil dari database lewat admin panel. Struktur pelayanan
 * ("ruang") ada di lib/ruang.ts.
 */
export const site = {
  name: "Janji Pengharapan",
  shortName: "JP",
  tagline: "Tempat bercerita dan didoakan",
  description:
    "Tempat untuk bercerita, didoakan, dan ditolong. Gratis untuk siapa saja yang sedang bergumul.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://janjipengharapan.com",
  email: "halo@janjipengharapan.com",
  phone: "+62 812-0000-0000",
  whatsapp: "6281200000000",
  address: {
    line1: "Jl. Contoh Raya No. 12",
    line2: "Jakarta, DKI Jakarta",
    mapUrl: "https://maps.google.com/?q=janji+pengharapan",
  },
  socials: {
    instagram: "https://instagram.com/janjipengharapan",
    tiktok: "https://tiktok.com/@janjipengharapan",
    youtube: "https://youtube.com/@janjipengharapan",
  },
  /** Gereja lokal yang menaungi pelayanan ini. */
  church: {
    name: "Every Nation Kelapa Gading",
    url: "https://everynationkg.com",
  },
  /** Rekening donasi. Masih contoh, ganti dengan rekening yang sebenarnya. */
  donation: {
    bank: "BCA",
    accountNumber: "0000000000",
    accountName: "Janji Pengharapan",
  },
} as const;

export const navigation = [
  { href: "/", label: "Beranda" },
  { href: "/tentang-kami", label: "Siapa Kami" },
  { href: "/layanan", label: "Pelayanan" },
  { href: "/konten", label: "Konten" },
  { href: "/event", label: "Event" },
  { href: "/donasi", label: "Donasi" },
  { href: "/kontak", label: "Kontak" },
] as const;

/** Tautan WhatsApp ke tim, opsional dengan pesan yang sudah terisi. */
export function waLink(text?: string) {
  return `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export const values = [
  {
    title: "Mendengar dulu",
    body: "Kami dengarkan ceritamu sampai selesai, tanpa menghakimi.",
  },
  {
    title: "Rahasiamu aman",
    body: "Ceritamu hanya dibaca tim yang menanganinya. Mau tanpa nama juga boleh.",
  },
  {
    title: "Bantuan yang nyata",
    body: "Selain mendoakan, kami bantu carikan konselor, sembako, atau teman pendamping.",
  },
] as const;
