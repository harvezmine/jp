import { coverPool, eventPool } from "@/lib/photos";
import type { JPEvent, Post, Quote, Service, SocialPost } from "@/lib/types";

/**
 * Konten contoh. Dipakai saat variabel Supabase belum diisi, dan saat
 * development untuk melengkapi database yang masih kosong (lihat lib/mock.ts).
 * Gunanya supaya desain bisa dilihat sebelum konten asli siap.
 */

const now = Date.now();
const day = 86_400_000;
const iso = (offsetDays: number) => new Date(now + offsetDays * day).toISOString();

/** Pelayanan pribadi untuk orang yang butuh ditolong, bukan jadwal ibadah gereja. */
export const demoServices: Service[] = [
  {
    id: "s1", slug: "didoakan", title: "Didoakan",
    summary: "Kirim pokok doamu. Tim pendoa akan mendoakannya secara pribadi, dan kamu boleh tetap tanpa nama.",
    description: null, icon: "hands", schedule: "Setiap hari",
    sort_order: 1, published: true, created_at: iso(0),
  },
  {
    id: "s2", slug: "teman-cerita", title: "Teman Cerita",
    summary: "Butuh didengarkan tanpa dihakimi? Ngobrol lewat chat atau telepon dengan pendamping dari tim kami.",
    description: null, icon: "users", schedule: "Lewat WhatsApp",
    sort_order: 2, published: true, created_at: iso(0),
  },
  {
    id: "s3", slug: "konseling", title: "Konseling Pribadi",
    summary: "Sesi empat mata dengan konselor untuk masalah keluarga, relasi, kecemasan, atau duka. Gratis dan rahasia.",
    description: null, icon: "shield", schedule: "Dengan janji temu",
    sort_order: 3, published: true, created_at: iso(0),
  },
  {
    id: "s4", slug: "kebutuhan-pokok", title: "Bantuan Kebutuhan Pokok",
    summary: "Sembako, obat, atau biaya mendesak untuk yang sedang kesulitan, diantar langsung oleh relawan kami.",
    description: null, icon: "gift", schedule: "Sesuai kebutuhan",
    sort_order: 4, published: true, created_at: iso(0),
  },
  {
    id: "s5", slug: "kunjungan", title: "Kunjungan & Pendampingan",
    summary: "Menjenguk yang sakit, menemani yang berduka, atau mendampingi saat harus menghadapi hal berat sendirian.",
    description: null, icon: "heart", schedule: "Jakarta dan sekitarnya",
    sort_order: 5, published: true, created_at: iso(0),
  },
  {
    id: "s6", slug: "mengenal-yesus", title: "Mengenal Yesus",
    summary: "Punya pertanyaan soal Tuhan, iman, atau Alkitab? Kita bahas pelan-pelan, tanpa paksaan.",
    description: null, icon: "book", schedule: "Online, 4 pertemuan",
    sort_order: 6, published: true, created_at: iso(0),
  },
];

// Empat kutipan unggulan: satu pembuka, lalu satu untuk tiap pergumulan yang paling sering
// dibawa orang (hati yang patah karena hubungan, sakit dan takut, keuangan).
export const demoQuotes: Quote[] = [
  {
    id: "q1",
    content: "Marilah kepada-Ku, semua yang letih lesu dan berbeban berat, Aku akan memberi kelegaan kepadamu.",
    reference: "Matius 11:28", author: null, published: true, featured: true, created_at: iso(-1),
  },
  {
    id: "q2",
    content: "Tuhan itu dekat kepada orang-orang yang patah hati, dan Ia menyelamatkan orang-orang yang remuk jiwanya.",
    reference: "Mazmur 34:19", author: null, published: true, featured: true, created_at: iso(-3),
  },
  {
    id: "q3",
    content: "Janganlah takut, sebab Aku menyertai engkau, janganlah bimbang, sebab Aku ini Allahmu.",
    reference: "Yesaya 41:10", author: null, published: true, featured: true, created_at: iso(-5),
  },
  {
    id: "q4",
    content: "Allahku akan memenuhi segala keperluanmu menurut kekayaan dan kemuliaan-Nya dalam Kristus Yesus.",
    reference: "Filipi 4:19", author: null, published: true, featured: true, created_at: iso(-7),
  },
  {
    id: "q5",
    content: "Sebab Aku ini mengetahui rancangan-rancangan apa yang ada pada-Ku mengenai kamu, yaitu rancangan damai sejahtera dan bukan rancangan kecelakaan, untuk memberikan kepadamu hari depan yang penuh harapan.",
    reference: "Yeremia 29:11", author: null, published: true, featured: false, created_at: iso(-9),
  },
  {
    id: "q6",
    content: "Pengharapan tidak mengecewakan, karena kasih Allah telah dicurahkan di dalam hati kita.",
    reference: "Roma 5:5", author: null, published: true, featured: false, created_at: iso(-11),
  },
  {
    id: "q7",
    content: "Serahkanlah segala kekuatiranmu kepada-Nya, sebab Ia yang memelihara kamu.",
    reference: "1 Petrus 5:7", author: null, published: true, featured: false, created_at: iso(-13),
  },
];

export const demoPosts: Post[] = [
  {
    id: "p1", slug: "ketika-doa-belum-dijawab",
    title: "Ketika Doa Belum Juga Dijawab",
    excerpt: "Menunggu jawaban doa itu melelahkan. Tapi justru di masa menunggu, banyak hal dalam diri kita dibentuk.",
    body: "Ada masa ketika kita berdoa dengan sungguh-sungguh, tetapi langit terasa sunyi.\n\nDalam Mazmur, Daud berkali-kali bertanya, \"Berapa lama lagi, TUHAN?\" Pertanyaan itu tidak pernah ditegur sebagai dosa. Tuhan cukup besar untuk menampung kejujuran kita.\n\n## Menunggu tidak sama dengan ditinggalkan\n\nYang berubah dalam penantian sering kali diri kita sendiri. Kesabaran tumbuh, kesombongan luruh, dan pelan-pelan kita sadar bahwa yang paling kita butuhkan adalah Tuhan sendiri.\n\n## Apa yang bisa kita lakukan\n\nTeruslah berdoa, dan jangan berdoa sendirian. Bawa pergumulan itu ke komunitas. Sering kali Tuhan menjawab lewat orang-orang yang Ia tempatkan di sekitar kita.",
    cover_url: coverPool[0], category: "renungan", author: "Tim JP", published: true,
    published_at: iso(-2), created_at: iso(-2), updated_at: iso(-2),
  },
  {
    id: "p2", slug: "hidup-yang-tidak-viral",
    title: "Hidup yang Tidak Viral",
    excerpt: "Media sosial mengukur nilai dari jangkauan. Tuhan menghitung dengan cara yang sama sekali lain.",
    body: "Linimasa mengajari kita bahwa yang tidak terlihat berarti tidak penting.\n\nPadahal sebagian besar pekerjaan Tuhan terjadi di tempat yang tidak difoto: di dapur, di ruang tunggu rumah sakit, di doa jam tiga pagi.\n\n## Setia di ruang kecil\n\nYesus menghabiskan tiga puluh tahun tanpa mukjizat yang tercatat. Tiga tahun pelayanan-Nya berdiri di atas tiga puluh tahun kesetiaan yang sunyi.",
    cover_url: coverPool[5], category: "artikel", author: "Tim JP", published: true,
    published_at: iso(-6), created_at: iso(-6), updated_at: iso(-6),
  },
  {
    id: "p3", slug: "kesaksian-dipulihkan-dari-kehilangan",
    title: "Dipulihkan dari Kehilangan",
    excerpt: "Dalam satu tahun, Rina kehilangan pekerjaan dan ayahnya. Ini ceritanya tentang pelan-pelan bisa bernapas lagi.",
    body: "Tahun itu saya kehilangan dua hal sekaligus: pekerjaan dan ayah saya.\n\nSaya berhenti datang ke gereja karena lelah, bukan karena marah. Yang membuat saya kembali adalah seorang ibu komsel yang setiap Selasa mengirim pesan singkat, tanpa pernah menuntut dibalas.\n\n## Pemulihan itu bertahap\n\nTidak ada satu momen dramatis. Yang ada hanya kehadiran yang konsisten, sampai suatu hari saya sadar sudah bisa bernapas lagi.",
    cover_url: coverPool[3], category: "kesaksian", author: "Rina, anggota JP", published: true,
    published_at: iso(-11), created_at: iso(-11), updated_at: iso(-11),
  },
  {
    id: "p4", slug: "laporan-bakti-sosial-oktober",
    title: "Laporan Bakti Sosial: 127 Paket Tersalurkan",
    excerpt: "Laporan singkat kegiatan diakonia bulan ini, dari pengumpulan sampai pengantaran paket ke tiga wilayah.",
    body: "Bulan ini komunitas menyalurkan 127 paket sembako ke tiga wilayah.\n\n## Rincian\n\nSetiap paket berisi beras 5 kg, minyak, gula, dan kebutuhan dapur dasar. Penyaluran dilakukan bersama pengurus komsel di masing-masing wilayah.\n\nTerima kasih untuk semua yang menyumbang, mengemas, dan mengantar paket.",
    cover_url: coverPool[8], category: "berita", author: "Tim Diakonia", published: true,
    published_at: iso(-16), created_at: iso(-16), updated_at: iso(-16),
  },
  {
    id: "p5", slug: "belajar-mengampuni-yang-tidak-minta-maaf",
    title: "Belajar Mengampuni yang Tidak Minta Maaf",
    excerpt: "Mengampuni tidak berarti membenarkan. Mengampuni berarti berhenti memikul beban yang bukan milik kita.",
    body: "Yang paling sulit dari mengampuni adalah ketika orang itu tidak pernah merasa bersalah.\n\n## Mengampuni tidak sama dengan melupakan\n\nMengampuni berarti melepaskan hak untuk membalas. Luka itu tetap nyata, dan boleh diakui.\n\n## Mulai dari yang kecil\n\nKita tidak perlu langsung merasa damai. Cukup mulai dengan berhenti mendoakan kejatuhan mereka.",
    cover_url: coverPool[6], category: "renungan", author: "Tim JP", published: true,
    published_at: iso(-21), created_at: iso(-21), updated_at: iso(-21),
  },
  {
    id: "p6", slug: "mengapa-komunitas-itu-perlu",
    title: "Kita Tidak Diciptakan untuk Sendirian",
    excerpt: "Iman bisa tumbuh sendiri, tapi jarang bertahan lama kalau dijalani sendiri. Paulus punya gambaran yang pas untuk ini.",
    body: "Hal pertama yang disebut \"tidak baik\" dalam Alkitab adalah manusia yang sendirian.\n\n## Satu tubuh\n\nPaulus memakai gambaran tubuh untuk jemaat. Tangan tidak bisa bekerja kalau terlepas dari lengan, dan mata tidak bisa melihat kalau terpisah dari kepala.",
    cover_url: coverPool[1], category: "artikel", author: "Tim JP", published: true,
    published_at: iso(-27), created_at: iso(-27), updated_at: iso(-27),
  },
];

export const demoEvents: JPEvent[] = [
  {
    id: "e1", slug: "malam-doa-pengharapan",
    title: "Malam Doa Pengharapan",
    description: "Satu malam untuk berhenti sejenak, bersyukur, dan mendoakan pergumulan satu sama lain. Terbuka untuk siapa saja, termasuk yang baru pertama kali datang.",
    starts_at: iso(9), ends_at: null, location: "Aula JP", address: "Jl. Contoh Raya No. 12, Jakarta Selatan",
    map_url: null, cover_url: eventPool[0], register_url: null, published: true,
    created_at: iso(-4), updated_at: iso(-4),
  },
  {
    id: "e2", slug: "kelas-dasar-iman",
    title: "Kelas Dasar Iman, Angkatan 5",
    description: "Enam pertemuan untuk memahami pokok-pokok iman Kristen dengan bahasa sehari-hari. Cocok untuk yang baru mengenal iman maupun yang ingin merapikan pemahamannya.",
    starts_at: iso(17), ends_at: null, location: "Ruang Komunitas", address: "Jl. Contoh Raya No. 12, Jakarta Selatan",
    map_url: null, cover_url: eventPool[1], register_url: null, published: true,
    created_at: iso(-4), updated_at: iso(-4),
  },
  {
    id: "e3", slug: "bakti-sosial-desember",
    title: "Bakti Sosial Akhir Tahun",
    description: "Penyaluran paket kebutuhan pokok bersama warga sekitar. Kami masih butuh relawan untuk mengemas dan mengantar.",
    starts_at: iso(31), ends_at: null, location: "Halaman Gereja", address: "Jl. Contoh Raya No. 12, Jakarta Selatan",
    map_url: null, cover_url: eventPool[2], register_url: null, published: true,
    created_at: iso(-4), updated_at: iso(-4),
  },
  {
    id: "e4", slug: "retreat-pemuda",
    title: "Retreat Pemuda: Ditemukan",
    description: "Dua hari menepi dari kesibukan untuk memikirkan ulang arah hidup bersama teman seperjalanan.",
    starts_at: iso(-14), ends_at: null, location: "Puncak, Bogor", address: null,
    map_url: null, cover_url: eventPool[3], register_url: null, published: true,
    created_at: iso(-40), updated_at: iso(-40),
  },
];

