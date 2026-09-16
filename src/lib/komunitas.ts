import { waLink } from "@/lib/site";

/**
 * Komunitas belajar bersama di Ruang Belajar.
 *
 * PLACEHOLDER: nama, isi, jadwal, dan format masih contoh. Ganti setelah dikonfirmasi tim JP.
 */
export type Komunitas = { slug: string; name: string; summary: string; when: string; format: string };

export const komunitas: Komunitas[] = [
  {
    slug: "ai-untuk-kerja",
    name: "AI untuk Kerja",
    summary: "Belajar memakai AI supaya pekerjaan sehari-hari terasa lebih ringan.",
    when: "Sabtu, 10.00 WIB",
    format: "Online",
  },
  {
    slug: "english-club",
    name: "English Club",
    summary: "Latihan ngobrol bahasa Inggris bareng. Salah sedikit tidak apa-apa.",
    when: "Selasa, 19.30 WIB",
    format: "Online",
  },
  {
    slug: "public-speaking",
    name: "Public Speaking",
    summary: "Berlatih bicara di depan orang, pelan-pelan dan saling menyemangati.",
    when: "Dua minggu sekali",
    format: "Tatap muka di Jakarta",
  },
];

export const komunitasWaLink = (name?: string) =>
  waLink(
    name
      ? `Halo, saya mau ikut komunitas ${name} di Ruang Belajar.`
      : "Halo, saya mau tanya soal komunitas di Ruang Belajar.",
  );
