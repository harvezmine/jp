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
    short: "Pesan singkat, podcast, dan live",
    tagline: "Pesan singkat, podcast, dan acara langsung untuk menguatkan harimu.",
    summary:
      "Kebanyakan orang mengenal kami lewat ruang ini. Isinya renungan pendek dan obrolan jujur soal hidup, dibagikan di TikTok, YouTube, dan lewat acara tatap muka.",
    forWho: "Untuk kamu yang sedang butuh dikuatkan, atau baru mulai mencari tahu tentang Tuhan.",
    programs: [
      {
        title: "Insight Message",
        summary: "Pesan pendek berisi satu ayat dan satu hal sederhana yang bisa kamu lakukan hari itu.",
        when: "Setiap hari",
        format: "TikTok, Instagram, dan YouTube Shorts",
      },
      {
        title: "Podcast & Live",
        summary:
          "Obrolan santai soal iman, keluarga, pekerjaan, dan kesehatan mental. Pertanyaanmu bisa dijawab langsung saat siaran.",
        when: "Senin, 20.00 WIB",
        format: "Live di TikTok dan YouTube",
        weekly: { day: 0, time: "20.00" },
      },
      {
        title: "Live Event",
        summary: "Malam pujian, seminar, dan pertemuan tatap muka untuk bertemu tim dan teman-teman baru.",
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
    tagline: "Didoakan secara pribadi, termasuk untuk kesembuhan.",
    summary:
      "Tim pendoa kami mendoakan setiap permohonan yang masuk. Kamu bisa mengirim pokok doa kapan saja, ikut doa bersama secara online, atau meminta sesi doa khusus.",
    forWho: "Untuk kamu yang sedang sakit, cemas, menunggu jawaban, atau butuh tuntunan.",
    programs: [
      {
        title: "Doa Kesembuhan",
        summary: "Doa untuk kesembuhan fisik maupun batin, bagi dirimu atau orang yang kamu kasihi.",
        when: "Rabu, 19.30 WIB",
        format: "Online lewat Zoom, kamera boleh mati",
        weekly: { day: 2, time: "19.30" },
      },
      {
        title: "Pelayanan Nubuatan",
        summary:
          "Sesi doa bersama tim untuk menerima penguatan dan dorongan dari Tuhan. Setiap sesi didampingi pengurus dan diuji dengan firman.",
        when: "Dengan janji temu",
        format: "Tatap muka atau video call",
      },
      {
        title: "Kirim Pokok Doa",
        summary:
          "Tulis permohonan doamu lewat formulir, boleh tanpa nama. Tim pendoa akan mendoakannya secara pribadi.",
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
    tagline: "Didengarkan dan didampingi, supaya tidak berjalan sendirian.",
    summary:
      "Tempat untuk bercerita dengan aman. Ada konseling empat mata, bimbingan rohani, dan kelompok kecil berisi orang-orang yang sedang melewati hal serupa.",
    forWho:
      "Untuk kamu yang sedang bergumul dengan keluarga, relasi, kecemasan, duka, atau pertanyaan tentang iman.",
    programs: [
      {
        title: "Pastoral Konseling",
        summary:
          "Sesi empat mata dengan konselor pastoral. Gratis, rahasia, dan kamu bisa meminta pendamping perempuan atau laki-laki.",
        when: "Dengan janji temu",
        format: "Online atau tatap muka",
      },
      {
        title: "Bimbingan Rohani & Pemuridan",
        summary: "Mengenal Yesus dan bertumbuh dalam iman bersama seorang pembimbing, sesuai kecepatanmu.",
        when: "Kamis, 19.30 WIB",
        format: "Kelompok kecil, online",
        weekly: { day: 3, time: "19.30" },
      },
      {
        title: "Support Group",
        summary:
          "Kelompok dukungan untuk yang sedang melewati pergumulan serupa, misalnya duka atau pemulihan dari kecanduan.",
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
    tagline: "Kelas dan komunitas untuk bertumbuh sebagai pribadi dan profesional.",
    summary:
      "Iman juga dijalani di tempat kerja dan di kampus. Ruang ini berisi kelas dan komunitas untuk mengembangkan diri, dari kepemimpinan sampai keterampilan praktis seperti AI dan bahasa Inggris.",
    forWho: "Untuk pelajar, mahasiswa, profesional, dan pemimpin yang ingin terus bertumbuh.",
    programs: [
      {
        title: "ProCon",
        summary: "Pertemuan dan jejaring untuk para profesional.",
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
        summary:
          "Kelas praktis yang bisa langsung dipakai, misalnya AI untuk bekerja, bahasa Inggris, dan public speaking.",
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
