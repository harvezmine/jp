import { photos } from "@/lib/photos";
import { site, waLink } from "@/lib/site";

/**
 * Empat "ruang" pelayanan Janji Pengharapan. Setiap ruang tampil sebagai
 * section sendiri di beranda dan halaman pelayanan, lalu dirangkum di akhir.
 * Deskripsi dan jadwal program masih contoh; ganti sesuai yang sebenarnya.
 */

export type RuangTone = "cream" | "night" | "paper" | "ink";

export type Program = {
  title: string;
  summary: string;
  /** Teks waktu yang ditampilkan, mis. "Rabu, 19.30 WIB" atau "Dengan janji temu". */
  when: string;
  format: string;
  /** Diisi bila programnya rutin mingguan. Hari dihitung dari Senin = 0. */
  weekly?: { day: number; time: string };
};

export type Ruang = {
  slug: string;
  name: string;
  /** Keterangan sangat singkat untuk pintasan di hero dan footer. */
  short: string;
  tagline: string;
  summary: string;
  forWho: string;
  programs: Program[];
  cta: { label: string; href: string };
  secondary: { label: string; href: string };
  image: string;
  imageAlt: string;
  detailImage: string;
  tone: RuangTone;
};

export const ruang: Ruang[] = [
  {
    slug: "ruang-pengharapan",
    name: "Pengharapan",
    short: "Renungan, podcast, dan live",
    tagline: "Renungan, podcast, dan acara untuk menguatkan harimu.",
    summary:
      "Renungan pendek dan obrolan jujur soal hidup. Bisa ditonton online, bisa juga didatangi langsung.",
    forWho: "Untuk kamu yang butuh dikuatkan, atau baru mulai mengenal Tuhan.",
    programs: [
      {
        title: "Insight Message",
        summary: "Satu ayat dan satu langkah kecil untuk hari ini.",
        when: "Setiap hari",
        format: "TikTok, Instagram, YouTube Shorts",
      },
      {
        title: "Podcast & Live",
        summary: "Obrolan santai soal iman, keluarga, kerja, dan kesehatan mental. Kamu bisa bertanya langsung.",
        when: "Senin, 20.00 WIB",
        format: "Live di TikTok dan YouTube",
        weekly: { day: 0, time: "20.00" },
      },
      {
        title: "Live Event",
        summary: "Malam pujian, seminar, dan kesempatan ketemu langsung.",
        when: "Lihat kalender acara",
        format: "Tatap muka di Jakarta",
      },
    ],
    cta: { label: "Follow di TikTok", href: site.socials.tiktok },
    secondary: { label: "Lihat acara terdekat", href: "/event" },
    image: photos.ruangHope,
    imageAlt: "Orang-orang mengangkat tangan dalam acara pujian yang diterangi lampu hangat",
    detailImage: photos.ruangHopeDetail,
    tone: "cream",
  },
  {
    slug: "ruang-doa",
    name: "Doa",
    short: "Doa kesembuhan dan nubuatan",
    tagline: "Ada yang ikut mendoakanmu.",
    summary:
      "Setiap pokok doa yang masuk kami doakan. Kirim kapan saja, ikut doa online, atau minta sesi doa khusus.",
    forWho: "Untuk kamu yang sedang sakit, cemas, atau menunggu jawaban.",
    programs: [
      {
        title: "Doa Kesembuhan",
        summary: "Doa untuk kesembuhan tubuh dan hati, untukmu atau orang yang kamu sayangi.",
        when: "Rabu, 19.30 WIB",
        format: "Zoom, kamera boleh mati",
        weekly: { day: 2, time: "19.30" },
      },
      {
        title: "Pelayanan Nubuatan",
        summary: "Sesi doa untuk menerima penguatan dari Tuhan. Selalu didampingi dan diuji dengan firman.",
        when: "Dengan janji temu",
        format: "Tatap muka atau video call",
      },
      {
        title: "Kirim Pokok Doa",
        summary: "Tulis lewat formulir, boleh tanpa nama. Tim pendoa akan mendoakannya.",
        when: "Kapan saja",
        format: "Formulir atau WhatsApp",
      },
    ],
    cta: { label: "Kirim pokok doa", href: "/pertolongan" },
    secondary: {
      label: "Minta link doa online",
      href: waLink("Halo, saya mau ikut Doa Kesembuhan hari Rabu. Boleh minta link Zoom-nya?"),
    },
    image: photos.ruangPrayer,
    imageAlt: "Tangan-tangan terangkat di ruangan yang gelap",
    detailImage: photos.ruangPrayerDetail,
    tone: "night",
  },
  {
    slug: "ruang-cerita",
    name: "Cerita",
    short: "Konseling dan support group",
    tagline: "Tempat aman untuk bercerita.",
    summary:
      "Ada konseling empat mata, bimbingan rohani, dan kelompok dukungan. Pilih yang paling nyaman untukmu.",
    forWho: "Untuk kamu yang sedang bergumul soal keluarga, relasi, rasa cemas, atau duka.",
    programs: [
      {
        title: "Pastoral Konseling",
        summary: "Bicara empat mata dengan konselor, gratis dan rahasia. Bisa pilih konselor perempuan atau laki-laki.",
        when: "Dengan janji temu",
        format: "Online atau tatap muka",
      },
      {
        title: "Bimbingan Rohani & Pemuridan",
        summary: "Belajar mengenal Yesus bersama pembimbing, pelan-pelan saja.",
        when: "Kamis, 19.30 WIB",
        format: "Kelompok kecil, online",
        weekly: { day: 3, time: "19.30" },
      },
      {
        title: "Support Group",
        summary: "Kelompok kecil untuk yang sedang melewati hal serupa, seperti duka atau pemulihan dari kecanduan.",
        when: "Jumat, 19.30 WIB",
        format: "Tatap muka di Jakarta",
        weekly: { day: 4, time: "19.30" },
      },
    ],
    cta: { label: "Atur sesi konseling", href: "/pertolongan" },
    secondary: {
      label: "Tanya lewat WhatsApp",
      href: waLink("Halo, saya mau tanya soal konseling dan support group."),
    },
    image: photos.ruangStory,
    imageAlt: "Dua orang duduk berdampingan di bangku menghadap laut",
    detailImage: photos.ruangStoryDetail,
    tone: "paper",
  },
  {
    slug: "ruang-belajar",
    name: "Belajar",
    short: "Kelas pengembangan diri",
    tagline: "Kelas untuk terus bertumbuh.",
    summary:
      "Kelas dan komunitas untuk mengembangkan diri. Mulai dari kepemimpinan sampai skill praktis seperti AI dan bahasa Inggris.",
    forWho: "Untuk pelajar, pekerja, dan pemimpin yang mau terus belajar.",
    programs: [
      {
        title: "ProCon",
        summary: "Ketemu dan berjejaring dengan sesama profesional.",
        when: "Sebulan sekali",
        format: "Tatap muka di Jakarta",
      },
      {
        title: "C-Level",
        summary: "Kelas kepemimpinan untuk pemimpin tim, pemilik usaha, dan eksekutif.",
        when: "Per angkatan",
        format: "Tatap muka",
      },
      {
        title: "Kursus Pengembangan Diri",
        summary: "Kelas praktis seperti AI untuk kerja, bahasa Inggris, dan public speaking.",
        when: "Sabtu, 10.00 WIB",
        format: "Online dan tatap muka",
        weekly: { day: 5, time: "10.00" },
      },
    ],
    cta: { label: "Daftar kelas", href: waLink("Halo, saya mau daftar kelas di Ruang Belajar.") },
    secondary: { label: "Lihat jadwal kelas", href: "/event" },
    image: photos.ruangLearn,
    imageAlt: "Beberapa orang tertawa sambil belajar bersama di perpustakaan",
    detailImage: photos.ruangLearnDetail,
    tone: "ink",
  },
];

export const weekDays = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"] as const;

/** Program yang rutin setiap minggu, diurutkan dari Senin. */
export function weeklyPrograms() {
  return ruang
    .flatMap((r) =>
      r.programs.flatMap((p) => (p.weekly ? [{ ...p, weekly: p.weekly, ruang: r }] : [])),
    )
    .sort((a, b) => a.weekly.day - b.weekly.day);
}
