# Audit Janji Pengharapan: lensa tiga pergumulan

Ditulis 15 September 2026. Semua section publik diperiksa lewat kode, screenshot desktop
(1440px) dan mobile (390px), serta akun sosial JP yang sebenarnya.

Lensa audit: orang yang datang ke JP sedang merasa hancur, letih lesu, atau pasrah, dan
kebanyakan karena tiga hal: **ekonomi**, **hubungan**, dan **kesehatan**.

> **Klarifikasi dari pengurus (15 September 2026).** JP tidak menyalurkan bantuan ekonomi
> secara khusus. Ekonomi, hubungan (dengan pasangan, orang tua, atau partner), dan
> kesehatan adalah tiga pokok doa yang paling sering dibawa orang saat berada di titik
> terendah. Jadi ketiganya adalah bahasa untuk menyapa orang, bukan jenis layanan.
> Formulir pertolongan dinilai sudah cukup baik dan hanya disesuaikan seperlunya.
> Rekomendasi di bawah sudah dikoreksi sesuai klarifikasi ini.

---

## 0. Ringkasan: enam hal yang paling penting

1. **Tiga pergumulan itu tidak terlihat di halaman publik.** Kartu pilihan di hero
   menawarkan "didoakan / teman cerita / belum tahu". Keempat Ruang disusun menurut jenis
   layanan JP, bukan menurut apa yang sedang dialami orangnya. "Kesulitan keuangan" baru
   muncul di langkah pertama formulir. "Hubungan" tidak pernah jadi kategori sendiri.
   Ruang Belajar berisi ProCon, C-Level, dan kelas AI, yang ditujukan untuk profesional
   yang sedang bertumbuh, bukan untuk orang yang sedang terpuruk secara finansial.

2. **Tidak ada satu pun nomor krisis, padahal audiensnya berisiko.** Opsi "Darurat" di
   formulir hanya menyuruh menghubungi "layanan darurat setempat". Halaman Tentang Kami
   sendiri menceritakan orang yang menulis "jam dua pagi karena merasa tidak sanggup lagi",
   dan channel YouTube JP punya video "Gagal Bunuh Diri Jadi Sadar". Nomor yang sudah
   diverifikasi ada di bagian 4.

3. **Tautan Instagram dan TikTok di situs mengarah ke akun yang salah.**
   - `instagram.com/janjipengharapan`: profilnya tidak ada.
   - `tiktok.com/@janjipengharapan`: akunnya ada, tapi 1 follower, 0 video, dan bio kosong.
   - `youtube.com/@janjipengharapan`: channel JP yang asli, tapi unggahan terakhirnya
     Mei 2024.

   Ketiganya hanya tebakan di `src/lib/site.ts`. **Sudah diperbaiki di P0:** Instagram asli
   `@janji_pengharapan` (486 follower) dan TikTok asli `@janji.pengharapan` (5.528 follower,
   407 video).

4. **Data terstruktur untuk Google menyebut JP sebagai gereja dengan alamat palsu.**
   `src/app/(site)/layout.tsx` mengirim `@type: "Church"` dengan alamat
   `Jl. Contoh Raya No. 12`. JP bukan situs gereja.

5. **Semua foto adalah foto stok Unsplash dengan wajah orang asing**, termasuk foto
   anak-anak miskin yang tersenyum di bagian donasi. Foto itu mengesankan mereka penerima
   bantuan JP.

6. **Konten JP sendiri sudah membahas tiga pergumulan itu, tapi situsnya belum.** Judul
   video YouTube JP antara lain "Penuduhan Terhadap Diri Sendiri Berakhir Depresi",
   "Cerita Orang Yang Terkena Penyakit MS", "Gagal Bunuh Diri Jadi Sadar, Dari Menyerah
   Jadi Berserah", "Mamon Yang Tidak Jujur", "Kaya Di Hadapan Allah", dan "Bapamu Tahu
   Bahwa Kamu Memerlukannya".

---

## 1. Siapa yang datang, dan apa yang ada di kepalanya

| Pergumulan | Contoh keadaan | Pertanyaan yang tidak diucapkan |
|---|---|---|
| **Ekonomi** | Kehilangan kerja, utang, usaha bangkrut, tidak sanggup bayar sekolah atau kontrakan | "Mereka bisa bantu secara nyata, atau cuma mendoakan?" Ditambah rasa malu. |
| **Hubungan** | Pernikahan retak, konflik keluarga, ditinggalkan, kesepian | "Apa aku akan dihakimi kalau cerita?" |
| **Kesehatan** | Diagnosis berat, sakit menahun, merawat orang tua yang sakit, depresi, cemas | "Apa ada yang mau menemani? Apa ini aman?" |

Keadaan yang sama untuk ketiganya: **energinya habis.** Orang yang letih lesu tidak
sanggup mempelajari istilah internal seperti "Ruang Pengharapan" atau "Ruang Cerita".
Mereka butuh sedikit pilihan, jalur yang pendek, dan pintu yang menyebut keadaan mereka
dengan bahasa mereka sendiri.

Frasa dari video JP sendiri, **"Dari menyerah jadi berserah"**, sangat pas dengan kata
"pasrah" yang dipakai untuk menggambarkan audiens ini. Frasa itu layak dijadikan aset
suara situs.

---

## 2. Beranda, per section

Urutan sekarang: Header, Hero, Siapa Kami, Pilih Ruang, Satu Langkah Kecil, Kutipan, Dari
TikTok dan YouTube, Bacaan, Acara, Donasi, Footer. Tinggi halaman 10.409px di desktop dan
11.863px di mobile. Tidak ada overflow horizontal di kedua lebar.

### Header dan navigasi
- **Sudah baik:** tombol "Mulai bercerita" selalu terlihat.
- **Temuan:** navigasinya disusun dari sudut pandang organisasi (Pelayanan, Konten, Event).
  Orang yang baru datang harus sudah paham JP dulu untuk tahu harus klik ke mana.
- **Saran:** pertahankan "Mulai bercerita" sebagai tombol utama. Pertimbangkan satu pintu
  "Butuh pertolongan" di navigasi mobile.

### Hero
- **Sudah baik:** judul "Kamu tidak harus melewati ini sendirian." kuat dan layak
  dipertahankan. Suasana fotonya tepat.
- **Temuan:**
  - Ada label kecil di atas judul ("Tempat bercerita dan menemukan pengharapan") dengan
    garis emas di depannya (`page.tsx:90-91`). Ini melanggar aturan yang sudah kamu tetapkan
    (tidak ada eyebrow di atas judul hero), dan pola garis di depan label sudah kamu tolak
    di ENKG.
  - Kata "ini" di judul masih kabur. Tiga pergumulan itulah yang bisa memberinya nama.
  - Kartu "Apa yang kamu butuhkan hari ini?" menawarkan jenis bantuan, dan tidak ada satu
    pun pilihan yang menyebut ekonomi, hubungan, atau kesehatan.
  - Baris "Kamu didengarkan / Boleh mulai dari cerita singkat / Sesuai kenyamananmu" adalah
    tricolon slogan.
  - **Di mobile, kartu pilihan jatuh di bawah lipatan layar** (mulai sekitar 610px pada
    layar 390×844). Orang yang datang dari HP hanya melihat judul umum dan satu tombol.
- **Saran:** ubah kartunya jadi pertanyaan tentang beban orangnya, lalu tiap pilihan
  langsung membuka formulir dengan kategori terisi.

  > **Apa yang paling berat buatmu sekarang?**
  > - Uang atau pekerjaan: *Kehilangan kerja, utang, atau kebutuhan harian.*
  > - Hubungan atau keluarga: *Pernikahan, keluarga, atau merasa sendirian.*
  > - Kesehatan: *Sakit, merawat yang sakit, atau lelah secara batin.*
  > - Belum tahu, pokoknya berat: *Tidak apa-apa. Kita cari bersama.*

  Di mobile, tampilkan keempat pilihan ini sebagai tombol ringkas tepat di bawah judul,
  sebelum paragraf yang panjang.

### Siapa Kami ("Ada hari ketika didengarkan saja sudah berarti banyak")
- **Sudah baik:** kalimat pembukanya hangat, dan foto kapsul di tengah kalimat terlihat
  unik.
- **Temuan:**
  - Nilai "Mendengar dulu" memakai pola "Kami mendengarkan untuk memahami, bukan
    menghakimi" (`site.ts:64`), pola yang kamu tandai terasa seperti tulisan AI.
  - Fotonya turis asing di tempat wisata kereta gantung, sehingga lebih terasa seperti iklan
    wisata daripada komunitas Indonesia.
- **Saran:** tulis ulang jadi "Kami mendengarkan dulu. Kamu tidak akan dihakimi di sini."
  Ganti fotonya.

### Pilih Ruang
- **Sudah baik:** secara visual ini section terkuat, dengan kartu berbentuk lengkung pintu
  yang disusun berundak.
- **Temuan:**
  - Pembagiannya istilah internal JP. Bagi orang luar, "Pengharapan", "Doa", dan "Cerita"
    terdengar mirip. Orang yang terlilit utang tidak tahu harus masuk pintu yang mana.
  - **Ruang Belajar** ("Kelas untuk terus bertumbuh", ProCon, C-Level) muncul sejajar di
    beranda yang ditujukan untuk orang yang sedang hancur. Orang yang terpuruk secara
    ekonomi tidak menemukan apa pun untuknya di sini.
- **Saran:** keempat Ruang tetap dipertahankan sebagai struktur layanan (kamu memang minta
  tiap Ruang punya section sendiri). Tambahkan satu lapisan "pergumulan" sebelumnya yang
  memetakan tiap pergumulan ke program yang relevan:
  - Kesehatan: Doa Kesembuhan, Konseling pastoral, dan Kunjungan
  - Hubungan: Konseling pastoral dan Kelompok berbagi
  - Ekonomi: Kirim Pokok Doa di Ruang Doa dan Konseling pastoral di Ruang Cerita. Jangan
    menjanjikan bantuan materi, karena JP tidak menyalurkannya secara khusus.

### Satu Langkah Kecil
- **Sudah baik:** tiga langkahnya jelas, nadanya tenang, dan ayat Galatia 6:2 pas.
  Daftar "Rahasia / Boleh tanpa nama / Gratis" bersifat informasi, jadi masih wajar.
- **Saran:** perubahan kecil saja. Kalau sudah ada, tambahkan perkiraan waktu balasan yang
  jujur.

### Kutipan
- **Sudah baik:** tipografinya indah.
- **Temuan:** isinya empat ayat berturut-turut tanpa pijakan manusia. Bagi orang yang sudah
  kehilangan harapan, dinding ayat bisa terasa jauh.
- **Saran:** pasangkan tiap ayat dengan satu pergumulan, misalnya Matius 6:31-32 atau
  Filipi 4:19 untuk ekonomi, Mazmur 34:19 untuk hati yang patah karena hubungan, dan
  Yesaya 41:10 untuk sakit. Cukup diubah dari admin kutipan.

### Dari TikTok dan YouTube
- **Temuan:**
  - Section ini melayani pengikut yang sudah kenal JP, bukan orang yang sedang butuh
    pertolongan.
  - Semua tombolnya mengarah ke akun yang salah (lihat bagian 4).
  - Kartu di screenshot hanya konten contoh dengan foto stok.
- **Saran:** perbaiki handle-nya dulu. Setelah itu tampilkan video JP yang asli, karena
  kesaksian soal depresi, penyakit MS, dan percobaan bunuh diri itu justru pas dengan tiga
  pergumulan ini. Beri peringatan konten pada video soal bunuh diri. Pertimbangkan
  memindahkan section ini lebih ke bawah.

### Bacaan untuk hari yang berat
- **Sudah baik:** judulnya tepat. Kartu "Masih ada yang mengganjal setelah membaca?
  Ceritakan ke kami" adalah jembatan yang sangat baik.
- **Temuan:** kategorinya (renungan, artikel, berita, kesaksian) adalah jenis tulisan, bukan
  pergumulan. Orang yang sedang kesulitan uang tidak bisa menyaring bacaan untuknya.
- **Saran:** tambahkan tag topik (ekonomi, hubungan, kesehatan, duka, iman) di admin dan
  filter halaman `/konten`.

### Acara terdekat
- **Temuan:** di konten contoh, jam acara tampil "00.09 WIB" karena waktunya dibuat relatif
  terhadap jam saat halaman dirender, dan lokasinya ditulis "Halaman Gereja". Keduanya
  hanya muncul di konten contoh.

### Donasi
- **Sudah baik:** saat nomor rekening masih kosong, kartunya otomatis beralih ke "Tanya cara
  berdonasi". Daftar penggunaan dananya jelas.
- **Temuan:**
  - Foto anak-anak miskin dari Unsplash mengesankan mereka penerima bantuan JP. Untuk
    penggalangan dana, ini masalah etika, bukan sekadar soal estetika.
  - Situs menjanjikan "Bantuan kebutuhan pokok (sembako, obat, biaya mendesak)", padahal JP
    tidak menyalurkan bantuan ekonomi secara khusus.
- **Saran:** ganti foto dengan gambar simbolis tanpa wajah orang (sudah dikerjakan di P0).
  Tinjau ulang klaim "sembako, obat, dan biaya mendesak" di bagian ini, di hero dan FAQ
  halaman Donasi, serta di kategori formulir "Kebutuhan pokok" dan "Kesulitan keuangan".

### Footer
- **Sudah baik:** "Kalau hari ini berat, cerita saja." adalah kalimat penutup yang kuat.
- **Temuan:** tagline "Tempat bercerita, didoakan, dan ditolong." adalah tricolon, ikon
  sosialnya mengarah ke akun yang salah, dan tidak ada nomor krisis.
- **Saran:** tambahkan satu baris krisis yang selalu terlihat (bagian 4). Tagline bisa
  diganti "Tempat untuk bercerita saat hidup terasa berat."

---

## 3. Halaman lain

### /pertolongan
- **Sudah baik:** formulir tampil lebih dulu di mobile, alurnya tiga langkah, ada opsi tanpa
  nama, ada pilihan "belum ingin dihubungi", ada opsi menjaga isi cerita tetap pribadi, dan
  ada catatan darurat.
- **Temuan:**
  - Enam kategorinya mencampur dua hal berbeda. Sebagian adalah jenis bantuan (Didoakan,
    Teman bercerita, Ditemani atau dijenguk), sebagian adalah masalah (Kebutuhan pokok,
    Kesulitan keuangan).
  - "Hubungan" tidak ada.
  - Kesehatan tersembunyi di dalam "Ditemani atau dijenguk: sakit, berduka".
  - Catatan untuk opsi "Darurat" tidak mencantumkan nomor apa pun.
- **Saran:** pisahkan langkah pertama jadi dua pertanyaan pendek:
  1. **Yang sedang kamu hadapi:** Ekonomi dan pekerjaan, Hubungan dan keluarga, Kesehatan
     fisik dan batin, Duka, atau Lainnya.
  2. **Bantuan yang kamu harapkan:** Didoakan, Teman cerita, Bantuan kebutuhan, atau
     Dijenguk.

  Saat "Darurat" dipilih, tampilkan nomor krisis dengan jelas sebelum orangnya melanjutkan.

  ⚠️ Perubahan kategori ini menyentuh `HELP_CATEGORIES` di `src/lib/help-validation.ts`,
  `src/lib/types.ts`, enum di Supabase, dan admin panel, yang juga sedang dikerjakan sesi
  Claude lain. Perlu dikoordinasikan.

### /layanan
- **Sudah baik:** section per Ruang tampil indah, ringkasan dan kalender mingguannya
  berguna, dan FAQ-nya menjawab pertanyaan yang tepat ("Harus orang Kristen? Tidak.").
- **Temuan:**
  - Kesehatan sudah terwakili di Ruang Doa ("sedang sakit, cemas") dan hubungan di Ruang
    Cerita ("keluarga, hubungan"), tapi hanya sebagai kalimat kecil bercetak miring.
  - Ekonomi tidak punya tempat sama sekali.
  - "Podcast & Live, Senin 20.00, live di TikTok dan YouTube" perlu dicek kebenarannya,
    karena channel YouTube tidak aktif sejak Mei 2024 dan handle TikTok-nya salah.

### /tentang-kami
- **Sudah baik:** ceritanya manusiawi dan jujur, dan pernyataan iman ditulis dengan bahasa
  sehari-hari.
- **Temuan:**
  - Semua fotonya stok. Foto `storyToday` dan `heroDonation` bahkan memakai foto Unsplash
    yang sama.
  - Situs menyebut "konselor", sedangkan program resminya "Konseling pastoral". Kalau
    pendampingnya bukan psikolog berizin, istilah "pendamping" lebih aman supaya orang
    dalam krisis tidak mengira sedang menerima layanan klinis.

### /donasi, /kontak, /konten, /event
- `/donasi`: masalah foto sama seperti di beranda. FAQ-nya baik.
- `/kontak`: kanal TikTok ditulis "@janjipengharapan", yang salah. Kartu "Sedang butuh
  pertolongan?" yang menuju formulir sudah tepat.
- `/konten` dan `/event`: tampilan kosong (empty state) sudah rapi. Masalah kategori
  sama seperti di Bacaan.

---

## 4. Temuan lintas halaman

### Nomor krisis (belum ada sama sekali)
Sumber resmi yang sudah dicek:
- **119 lalu tekan 8 (SEJIWA, Kemenkes):** konseling psikologis. Layanan ini tidak
  mencakup pertolongan pertama pada percobaan bunuh diri.
- **119:** ambulans dan gawat darurat, kalau nyawa sedang terancam.
- **Healing119.id:** dukungan psikologis awal untuk tekanan berat, keputusasaan, dan
  pikiran bunuh diri.

Contoh baris untuk footer, formulir, dan halaman pertolongan:

> Kalau keselamatanmu terancam, telepon 119. Butuh bicara sekarang? Telepon 119 lalu tekan
> 8, atau buka healing119.id.

### Akun sosial

| Akun di `site.ts` | Hasil pengecekan |
|---|---|
| `instagram.com/janjipengharapan` | Profil tidak ada |
| `tiktok.com/@janjipengharapan` | Ada, tapi 1 follower, 0 video, bio kosong |
| `youtube.com/@janjipengharapan` | Channel JP asli, 67 subscriber, unggahan terakhir Mei 2024 |

Tautan yang salah muncul di: `site.ts`, `demo.ts`, halaman Kontak, `sameAs` pada data
terstruktur, footer, menu mobile, section sosial di beranda, tab sosial di `/konten`, dan
tombol "Follow di TikTok" di Ruang Pengharapan.

### Data terstruktur (JSON-LD)
`@type: "Church"`, dengan alamat `Jl. Contoh Raya No. 12` dan telepon kosong, dikirim ke
Google. **Saran:** ganti ke `Organization`, hapus alamat sampai ada yang asli, dan isi
`sameAs` hanya dengan akun yang sudah terverifikasi.

### Konten contoh di produksi
`MOCK_ENABLED` otomatis mati di build produksi (`src/lib/mock.ts`), dan
`ecosystem.config.js` menyetel `NODE_ENV=production`. Jadi dalam kondisi normal konten
contoh tidak ikut tampil.

Tapi `query()` di `src/lib/queries.ts` **tetap mengembalikan konten contoh kalau env
Supabase lupa diisi saat deploy**. Konten itu termasuk testimoni fiktif "Rina, anggota JP"
dan "Laporan Bakti Sosial: 127 Paket Tersalurkan". Untuk pelayanan pertolongan, testimoni
fiktif adalah pelanggaran kepercayaan. **Saran:** di produksi, kembalikan empty state,
bukan konten contoh.

### Foto
Seluruh `src/lib/photos.ts` berisi foto Unsplash, sebagian besar wajah non-Indonesia.
Pelajaran dari ENKG: begitu handle Instagram JP yang asli diketahui, foto kegiatan asli bisa
diambil dengan cara yang sama.

### Aturan copy
| Aturan | Status |
|---|---|
| Tanpa em dash di copy publik | ✓ bersih |
| Tanpa eyebrow di atas judul hero | ✗ `src/app/(site)/page.tsx:90` |
| Hindari pola "bukan X" | ✗ `src/lib/site.ts:64`. Kalimat "Formulir ini bukan layanan darurat" tetap wajar karena peringatan keselamatan. |
| Hindari tricolon slogan | ✗ baris kepercayaan di hero dan tagline footer |

---

## 5. Usulan urutan kerja

**P0: keselamatan dan kepercayaan.** Perubahannya kecil dan cepat.
1. Nomor krisis di footer, formulir (opsi darurat), dan sisi halaman pertolongan.
2. Perbaiki atau sembunyikan dulu tautan Instagram dan TikTok yang salah.
3. Perbaiki JSON-LD: `Organization`, tanpa alamat palsu.
4. Pengaman di produksi: empty state, bukan konten contoh.
5. Ganti foto anak-anak di bagian donasi.

**P1: inti lensa tiga pergumulan.**
1. Kartu pilihan di hero disusun menurut pergumulan, ditambah tombol ringkas di mobile.
2. Kategori formulir pertolongan dirombak (perlu koordinasi database dan admin).
3. Lapisan "pergumulan" di atas Pilih Ruang di beranda.
4. Tag topik untuk bacaan.

**P2: copy dan visual.** Hapus eyebrow di hero, tulis ulang "bukan menghakimi" dan tricolon,
pasangkan kutipan dengan pergumulan, turunkan posisi section sosial, dan tinjau ulang posisi
Ruang Belajar di beranda.

**P3: aset.** Foto asli, handle sosial asli, konfirmasi jadwal, dan kebenaran klaim
"Podcast & Live setiap Senin".

---

## 6. Yang perlu kamu jawab

1. ~~Handle Instagram dan TikTok JP yang asli.~~ **Terjawab:** `@janji_pengharapan` dan
   `@janji.pengharapan`.
2. Apakah **Podcast & Live setiap Senin 20.00** memang berjalan?
3. Apakah pendamping di Ruang Cerita **konselor berizin** atau **pendamping pastoral**?
   Jawabannya menentukan istilah yang aman dipakai.
4. ~~Bantuan ekonomi yang sanggup diberikan JP.~~ **Terjawab:** tidak ada bantuan ekonomi
   secara khusus. Tersisa satu keputusan: klaim sembako, obat, dan biaya mendesak di situs
   dipertahankan, diperhalus, atau dihapus?
5. ~~Koordinasi perubahan kategori formulir.~~ **Tidak jadi:** formulir dinilai sudah cukup
   baik.

---

## 7. Status P0 (15 September 2026)

| # | Pekerjaan | Status |
|---|---|---|
| 1 | Nomor krisis di footer, catatan "Darurat" di formulir, sisi halaman pertolongan, dan FAQ Layanan (`src/lib/crisis.ts`, `src/components/crisis-line.tsx`) | Selesai |
| 2 | Tautan sosial ke akun asli. Semua tombol lewat `socialLinks` di `site.ts` dan otomatis tersembunyi kalau tautannya kosong | Selesai |
| 3 | JSON-LD jadi `Organization` tanpa alamat. Alamat dan peta palsu juga dibuang dari detail event | Selesai |
| 4 | Pengaman produksi: tanpa env Supabase, halaman menampilkan empty state, bukan konten contoh | Selesai |
| 5 | Foto anak-anak di bagian donasi diganti foto lilin yang simbolis | Selesai |

---

### Sumber nomor krisis
- [Hotline Bunuh Diri di Indonesia, Into The Light Indonesia](https://www.intothelightid.org/tentang-bunuh-diri/hotline-bunuh-diri-di-indonesia/)
- [Kenali Layanan Healing119.id, Kemenkes](https://kesprimkom.kemkes.go.id/konten/158/151/0/cegah-bunuh-diri-dukung-kesehatan-jiwa-kenali-layanan-healing119-id)
- [Healing119.id: Layanan Kesehatan Mental 24 Jam, InfoPublik](https://infopublik.id/kategori/layanan-publik/952502/healing119-id-layanan-kesehatan-mental-24-jam-teman-bicara-yang-siap-mendengar)
- [Hotline Sejiwa (119 ext 8), Seribu Tujuan](https://www.seributujuan.id/resource/hotline-sejiwa-119-ext-8)

---

## 8. Status P1 dan P2 (15 September 2026)

| # | Pekerjaan | Status |
|---|---|---|
| P1.1 | Hero dipangkas: judul, satu kalimat yang menyebut sakit, keuangan, dan hubungan, satu tombol, lalu empat Ruang ringkas. Muat di layar pertama HP 390×844 | Selesai |
| P1.2 | Kategori formulir | Tidak dikerjakan. Formulir dinilai sudah cukup baik |
| P1.3 | Lapisan pergumulan di Pilih Ruang: deskripsi menyebut tiga pergumulan, kartu memakai `forWho` (Doa: sakit dan keuangan, Cerita: pasangan dan keluarga) | Selesai |
| P1.4 | Tag topik bacaan | Ditunda. Butuh kolom baru di Supabase dan field di admin panel |
| P2 | Eyebrow dan tricolon hero dihapus, "bukan menghakimi" ditulis ulang, tagline footer dan deskripsi situs diganti, strip dekoratif dihapus, centang di Satu Langkah Kecil diganti ikon gembok | Selesai |
| P2 | Kutipan unggulan di data contoh dan seed: Matius 11:28, Mazmur 34:19, Yesaya 41:10, Filipi 4:19. Kutipan di database asli diatur dari admin | Selesai |
| P2 | Section sosial diturunkan ke bawah | Selesai |
| Lain | Formulir pertolongan dipasang di akhir beranda (`#cerita`) | Selesai |
| Lain | Donasi disembunyikan lewat `features.donation` di `site.ts` (beranda, navigasi, footer, `/donasi` jadi 404). Acara terdekat dihapus dari beranda | Selesai |

---

## 9. Arahan lanjutan dan status P3 (15 September 2026)

**Koreksi arah copy.** Tiga pergumulan tetap jadi lensa internal untuk memahami pengunjung,
tapi tidak disebutkan satu per satu di halaman. Menyebut "sakit, keuangan, atau hubungan"
terasa menebak alasan orang datang dan bisa membuat mereka merasa dihakimi. Copy memakai
bahasa yang terbuka, misalnya "Apa pun yang sedang kamu bawa hari ini".

| # | Pekerjaan | Status |
|---|---|---|
| 1 | Hero, Pilih Ruang, Ruang Doa, dan Ruang Cerita tidak lagi menyebut jenis pergumulan | Selesai |
| 2 | Formulir: dua pilihan soal ekonomi disatukan jadi "Pekerjaan atau keuangan" dengan bahasa yang lembut. "Kebutuhan sehari-hari" tetap sah di database untuk data lama, tapi tidak ditawarkan lagi. Deskripsi `/pertolongan` tidak lagi menyebut sembako | Selesai |
| 3 | Program Podcast & Live dihapus dari Ruang Pengharapan dan dari teks kosong halaman Event | Selesai |
| 4 | WhatsApp tim `+62 817-9168-016` dipasang sebagai nilai bawaan di `site.ts` (env tetap bisa menimpa) | Selesai |
| 5 | Email `halo@janjipengharapan.com` dihapus dari footer, Kontak, dan JSON-LD karena belum aktif | Selesai |
| 6 | Section sosial beranda dan tab sosial `/konten` memakai 4 reel asli Instagram JP (`src/lib/social-featured.ts`) saat tabel `social_posts` kosong. Caption dipindah ke bawah thumbnail supaya tidak bertabrakan dengan tulisan di video | Selesai |
| 7 | Foto asli dari reel JP: pembicara di studio untuk lingkaran detail Ruang Pengharapan dan langkah "Awalnya" di Tentang Kami | Selesai |
| 8 | Foto "Sekarang" di Tentang Kami (relawan mengangkat kardus bantuan) diganti foto orang berdoa bersama | Selesai |
| 9 | Konten TikTok | Tidak bisa diambil otomatis: TikTok menampilkan captcha untuk pengunjung yang tidak login. Butuh tautan video dari tim, atau diisi lewat admin |
| 10 | Foto kegiatan asli (komunitas, doa, kelas) | Belum ada. Instagram JP hanya berisi reel teks di atas video stok dan pembicara di studio |

Bahan mentah hasil pengambilan ada di `jp/resources/social/` (12 reel Instagram beserta caption).
