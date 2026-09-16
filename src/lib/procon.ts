import { waLink } from "@/lib/site";

/**
 * ProCon: pertemuan dan kelas pengembangan diri di Ruang Belajar.
 *
 * Daftar event disalin dari situs ENKG. Tanggalnya belum diumumkan, jadi `date: null`
 * tampil sebagai "Segera hadir".
 *
 * Situs ProCon nanti ada di procon.janjipengharapan.com (PROCON_SITE). Selama belum
 * aktif, jangan ditautkan: semua ajakan diarahkan ke WhatsApp tim.
 */
export const procon = {
  name: "ProCon",
  tagline: "Tempat belajar bareng untuk yang mau bertumbuh.",
  intro:
    "Kelas dan diskusi pengembangan diri untuk pelajar, mahasiswa, profesional, dan pemimpin yang ingin terus bertumbuh dalam pekerjaan dan kepemimpinan.",
  when: "Sebulan sekali",
  format: "Tatap muka di Jakarta",
  /** Tidak ada syarat khusus. Siapa pun yang mau ikut tinggal mengabari tim. */
  openTo: "Terbuka untuk siapa saja yang mau ikut. Tidak ada syarat khusus.",
} as const;

/** Situs ProCon yang akan datang. Belum aktif, jadi belum ditautkan dari mana pun. */
export const PROCON_SITE = "https://procon.janjipengharapan.com";

export type ProconEvent = {
  id: string;
  title: string;
  topic: string;
  summary: string;
  /** yyyy-mm-dd, atau null bila jadwal belum diumumkan */
  date: string | null;
  partner?: string;
  href?: string;
};

export const proconEvents: ProconEvent[] = [
  {
    id: "monetize-with-ai",
    title: "Monetize with AI",
    topic: "Teknologi & karier",
    summary: "Memanfaatkan AI untuk bekerja lebih produktif dan membuka peluang baru.",
    date: null,
  },
  {
    id: "kelola-uang",
    title: "Mengelola Uang dengan Bijak",
    topic: "Keuangan pribadi",
    summary: "Mengatur arus kas, menabung, dan merencanakan keuangan pribadi maupun keluarga.",
    date: null,
    partner: "Bersama blu by BCA Digital",
  },
  {
    id: "c-level",
    title: "C-Level Leadership Class",
    topic: "Kepemimpinan",
    summary: "Kelas kepemimpinan untuk pemimpin tim, pemilik usaha, dan eksekutif.",
    date: null,
  },
];

export const proconWaLink = (title?: string) =>
  waLink(
    title
      ? `Halo, saya tertarik dengan ProCon (${title}). Boleh minta info jadwalnya?`
      : "Halo, saya tertarik dengan ProCon. Boleh minta info jadwalnya?",
  );
