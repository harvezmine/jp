/**
 * Data statis situs. Yang jarang berubah ditaruh di sini supaya halaman tetap
 * bisa dirender walau Supabase belum diisi. Yang sering berubah (tulisan, event,
 * kutipan) diambil dari database lewat admin panel. Struktur pelayanan
 * ("ruang") ada di lib/ruang.ts.
 */
// Nomor WhatsApp tim JP (dikonfirmasi 15 September 2026). Env boleh menimpanya, tapi jangan pernah nomor contoh.
const rawWhatsapp = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+62 817-9168-016").replace(/\D/g, "");
const normalizedWhatsapp = rawWhatsapp.startsWith("0") ? `62${rawWhatsapp.slice(1)}` : rawWhatsapp;
const whatsapp = /^\d{8,15}$/.test(normalizedWhatsapp) && !/0{7}/.test(normalizedWhatsapp) ? normalizedWhatsapp : "";

export const site = {
  name: "Janji Pengharapan",
  shortName: "JP",
  tagline: "Tempat bercerita dan didoakan",
  description:
    "Tempat untuk bercerita dan didoakan saat hidup terasa berat. Kamu boleh datang apa adanya.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://janjipengharapan.com",
  // Belum ada alamat email yang aktif, jadi email sengaja tidak ditampilkan di mana pun.
  phone: whatsapp ? `+${whatsapp}` : "",
  /** Nomor untuk dibaca orang, mis. "+62 817-9168-016". */
  phoneDisplay: whatsapp.startsWith("62") ? `+62 ${whatsapp.slice(2, 5)}-${whatsapp.slice(5, 9)}-${whatsapp.slice(9)}` : whatsapp ? `+${whatsapp}` : "",
  whatsapp,
  /**
   * Akun sosial yang sudah dicek benar milik JP (15 September 2026). Kalau sebuah
   * akun belum pasti, kosongkan nilainya: tombolnya otomatis disembunyikan di
   * seluruh situs. Alamat sengaja tidak disimpan sampai ada alamat yang benar.
   */
  socials: {
    instagram: "https://www.instagram.com/janji_pengharapan/",
    tiktok: "https://www.tiktok.com/@janji.pengharapan",
    // Channel asli JP, tapi unggahan terakhirnya Mei 2024.
    youtube: "https://youtube.com/@janjipengharapan",
  },
  /**
   * Mitra gereja JP. Janji Pengharapan berdiri sendiri. Gereja ini rekan kerja
   * yang bisa kami kenalkan kalau ada yang sedang mencari gereja.
   */
  partnerChurch: {
    name: "Every Nation Kelapa Gading",
    url: "https://everynationkg.com",
  },
  /** Rekening untuk support. Masih contoh, ganti dengan rekening yang sebenarnya. */
  support: {
    bank: "BCA",
    accountNumber: "0000000000",
    accountName: "Janji Pengharapan",
  },
} as const;

export const navigation = [
  { href: "/", label: "Beranda" },
  { href: "/tentang-kami", label: "Siapa Kami" },
  { href: "/layanan", label: "Pelayanan" },
  { href: "/mitra", label: "Mitra Kami" },
  { href: "/event", label: "Event" },
  { href: "/kontak", label: "Kontak" },
] as const;

/** Footer memuat semua halaman, termasuk Konten yang tidak lagi tampil di navbar. */
export const footerLinks = [
  ...navigation.slice(0, 4),
  { href: "/konten", label: "Konten" },
  ...navigation.slice(4),
] as const;

/** Tombol sosial yang tautannya terisi, dalam urutan tampil yang sama di mana-mana. */
export const socialLinks = (
  [
    { key: "instagram", label: "Instagram", href: site.socials.instagram },
    { key: "tiktok", label: "TikTok", href: site.socials.tiktok },
    { key: "youtube", label: "YouTube", href: site.socials.youtube },
  ] as const
).filter((s) => Boolean(s.href));

/** "https://www.instagram.com/janji_pengharapan/" menjadi "@janji_pengharapan". */
export function socialHandle(url: string) {
  const first = new URL(url).pathname.split("/").filter(Boolean)[0] ?? "";
  return first.startsWith("@") ? first : `@${first}`;
}

/** Tautan WhatsApp ke tim, opsional dengan pesan yang sudah terisi. */
export function waLink(text?: string) {
  if (!site.whatsapp) return "/kontak#kirim-pesan";
  return `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export const values = [
  {
    title: "Mendengar dulu",
    body: "Kamu boleh bercerita pelan-pelan. Kami mendengarkan dulu, dan kamu tidak akan dihakimi di sini.",
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
