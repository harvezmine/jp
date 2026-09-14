# Aset merek Janji Pengharapan

Sumber logo: `public/logojp.jpg` (monogram JP maroon di atas latar putih).
Semua file di bawah dibuat dari logo itu, dengan monogram yang sudah diubah
menjadi vektor. Warna logo: `#660f2f` (token `--color-jp` di `globals.css`).

| File | Dipakai di | Ukuran |
|---|---|---|
| `src/components/logo.tsx` | Header, footer, admin panel. Monogram vektor yang warnanya mengikuti teks (maroon di latar terang, krem di latar gelap) | SVG inline |
| `logo.svg` | Logo maroon untuk dipakai di luar situs | SVG |
| `logo.png` | Logo maroon transparan, dipakai data terstruktur Google | 512 px tinggi |
| `src/app/icon.svg` | Favicon di browser modern | SVG |
| `src/app/favicon.ico` | Favicon cadangan untuk browser lama | 16, 32, 48 px |
| `src/app/apple-icon.png` | Ikon saat disimpan ke layar utama iPhone | 180 × 180 |
| `icon-192.png`, `icon-512.png` | Ikon aplikasi Android (lihat `src/app/manifest.ts`) | 192, 512 |
| `icon-maskable-512.png` | Ikon Android yang dipotong bulat atau kotak oleh sistem | 512 × 512 |
| `og-image.jpg` | Preview saat link dibagikan ke WhatsApp, Instagram, dsb. | 1200 × 630 |

Foto untuk hero, event, dan artikel ada di `src/lib/photos.ts`.
Gambar yang di-upload lewat admin panel tersimpan di Supabase Storage, bukan di sini.
