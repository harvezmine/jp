import { waLink } from "@/lib/site";

/**
 * ProCon: pertemuan dan kelas pengembangan diri di Ruang Belajar.
 *
 * PLACEHOLDER: event masih contoh (disalin dari situs ENKG). Ganti judul, tanggal,
 * dan link setelah jadwal resmi keluar. `date: null` tampil sebagai "Segera hadir".
 */
export const procon = {
  name: "ProCon",
  tagline: "Pertemuan dan jejaring untuk para profesional.",
  intro:
    "Kelas dan diskusi pengembangan diri untuk pelajar, mahasiswa, profesional, dan pemimpin yang ingin terus bertumbuh dalam pekerjaan dan kepemimpinan.",
  when: "Sebulan sekali",
  format: "Tatap muka di Jakarta",
} as const;

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
