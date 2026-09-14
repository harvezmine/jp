/**
 * Data statis situs. Yang jarang berubah ditaruh di sini supaya halaman tetap
 * bisa dirender walau Supabase belum diisi. Yang sering berubah (tulisan, event,
 * kutipan) diambil dari database lewat admin panel. Struktur pelayanan
 * ("ruang") ada di lib/ruang.ts.
 */
// Set the real contact number through the environment; never send visitors to a sample number.
const rawWhatsapp = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");
const normalizedWhatsapp = rawWhatsapp.startsWith("0") ? `62${rawWhatsapp.slice(1)}` : rawWhatsapp;
const whatsapp = /^\d{8,15}$/.test(normalizedWhatsapp) && !/0{7}/.test(normalizedWhatsapp) ? normalizedWhatsapp : "";

export const site = {
  name: "Janji Pengharapan",
  shortName: "JP",
  tagline: "Tempat bercerita dan didoakan",
  description:
    "Ruang untuk bercerita, didoakan, dan menemukan dukungan. Kamu boleh datang dengan ceritamu, apa adanya.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://janjipengharapan.com",
  email: "halo@janjipengharapan.com",
  phone: whatsapp ? `+${whatsapp}` : "",
  whatsapp,
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
  if (!site.whatsapp) return "/kontak#kirim-pesan";
  return `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export const values = [
  {
    title: "Mendengar dulu",
    body: "Kamu boleh bercerita pelan-pelan. Kami mendengarkan untuk memahami, bukan menghakimi.",
  },
  {
    title: "Ceritamu kami jaga",
    body: "Kamu menentukan apa yang ingin dibagikan. Boleh memakai nama panggilan atau bercerita tanpa nama.",
  },
  {
    title: "Mencari langkah bersama",
    body: "Kami mendampingi dan membicarakan bentuk dukungan yang sesuai dengan kebutuhanmu.",
  },
] as const;
