-- ═══════════════════════════════════════════════════════════════════════════
--  Janji Pengharapan — data awal (opsional)
--  Jalankan SETELAH schema.sql. Aman dijalankan ulang: memakai ON CONFLICT.
--  Ganti isinya dengan data sesungguhnya lewat admin panel setelah ini.
-- ═══════════════════════════════════════════════════════════════════════════

-- Pelayanan pribadi untuk orang yang butuh ditolong (bukan jadwal ibadah gereja).
insert into services (slug, title, summary, icon, schedule, sort_order) values
  ('didoakan',        'Didoakan',                 'Kirim pokok doamu. Tim pendoa akan mendoakannya secara pribadi, dan kamu boleh tetap tanpa nama.',          'hands',  'Setiap hari',            1),
  ('teman-cerita',    'Teman Cerita',             'Butuh didengarkan tanpa dihakimi? Ngobrol lewat chat atau telepon dengan pendamping dari tim kami.',         'users',  'Lewat WhatsApp',         2),
  ('konseling',       'Konseling Pribadi',        'Sesi empat mata dengan konselor untuk masalah keluarga, relasi, kecemasan, atau duka. Gratis dan rahasia.', 'shield', 'Dengan janji temu',      3),
  ('kebutuhan-pokok', 'Bantuan Kebutuhan Pokok',  'Sembako, obat, atau biaya mendesak untuk yang sedang kesulitan, diantar langsung oleh relawan kami.',       'gift',   'Sesuai kebutuhan',       4),
  ('kunjungan',       'Kunjungan & Pendampingan', 'Menjenguk yang sakit, menemani yang berduka, atau mendampingi saat harus menghadapi hal berat sendirian.',   'heart',  'Jakarta dan sekitarnya', 5),
  ('mengenal-yesus',  'Mengenal Yesus',           'Punya pertanyaan soal Tuhan, iman, atau Alkitab? Kita bahas pelan-pelan, tanpa paksaan.',                    'book',   'Online, 4 pertemuan',    6)
on conflict (slug) do nothing;

insert into quotes (content, reference, featured) values
  ('Sebab Aku ini mengetahui rancangan-rancangan apa yang ada pada-Ku mengenai kamu, yaitu rancangan damai sejahtera dan bukan rancangan kecelakaan, untuk memberikan kepadamu hari depan yang penuh harapan.', 'Yeremia 29:11', false),
  ('Pengharapan tidak mengecewakan, karena kasih Allah telah dicurahkan di dalam hati kita.', 'Roma 5:5', false),
  ('Marilah kepada-Ku, semua yang letih lesu dan berbeban berat, Aku akan memberi kelegaan kepadamu.', 'Matius 11:28', true),
  ('Tuhan itu dekat kepada orang-orang yang patah hati, dan Ia menyelamatkan orang-orang yang remuk jiwanya.', 'Mazmur 34:19', true),
  ('Janganlah takut, sebab Aku menyertai engkau, janganlah bimbang, sebab Aku ini Allahmu.', 'Yesaya 41:10', true),
  ('Serahkanlah segala kekuatiranmu kepada-Nya, sebab Ia yang memelihara kamu.', '1 Petrus 5:7', false),
  ('Allahku akan memenuhi segala keperluanmu menurut kekayaan dan kemuliaan-Nya dalam Kristus Yesus.', 'Filipi 4:19', true);

insert into posts (slug, title, excerpt, body, category, author, published, published_at) values
  ('ketika-doa-belum-dijawab',
   'Ketika Doa Belum Juga Dijawab',
   'Menunggu bukan tanda Tuhan diam. Kadang justru di ruang tunggu itulah kita paling banyak dibentuk.',
   E'Ada masa ketika kita berdoa dengan sungguh-sungguh, tetapi langit terasa sunyi.\n\nDalam Mazmur, Daud berkali-kali bertanya "berapa lama lagi, TUHAN?" — dan pertanyaan itu tidak pernah ditegur sebagai dosa. Tuhan cukup besar untuk menampung kejujuran kita.\n\n## Menunggu bukan berarti ditinggalkan\n\nYang berubah dalam penantian sering bukan situasinya, melainkan kita.\n\n## Apa yang bisa kita lakukan\n\nTeruslah berdoa, tapi jangan berdoa sendirian. Bawa pergumulan itu ke komunitas.',
   'renungan', 'Tim JP', true, now() - interval '2 days')
on conflict (slug) do nothing;

-- Pengaturan situs — dibaca publik, diubah lewat admin.
insert into site_settings (key, value) values
  ('kontak', '{"email":"halo@janjipengharapan.com","whatsapp":"6281200000000"}'::jsonb)
on conflict (key) do update set value = excluded.value, updated_at = now();
