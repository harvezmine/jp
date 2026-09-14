import type { SocialPost } from "@/lib/types";

/**
 * Postingan asli dari Instagram @janji_pengharapan (diambil 15 September 2026).
 * Tampil saat tabel social_posts di Supabase masih kosong, supaya section sosial tidak
 * pernah berisi contoh palsu. Caption dikutip dari postingannya, tanpa emoji dan tagar.
 * Thumbnail disimpan lokal karena URL gambar Instagram kedaluwarsa.
 */
export const featuredSocialPosts: SocialPost[] = [
  {
    id: "ig-DdEiGfPvQg3",
    platform: "instagram",
    url: "https://www.instagram.com/reel/DdEiGfPvQg3/",
    caption: "Kalau hari ini terasa berat, ingat: kamu tidak menjalaninya sendirian. Tuhan masih memegang kendali.",
    thumbnail_url: "/images/social/ig-DdEiGfPvQg3.jpg",
    sort_order: 1,
    published: true,
    created_at: "2026-09-10T00:00:00.000Z",
  },
  {
    id: "ig-Dc_SXwBpWQb",
    platform: "instagram",
    url: "https://www.instagram.com/reel/Dc_SXwBpWQb/",
    caption: "Tetap bangun hubungan dengan Tuhan, berdoa, menyembah, baca Firman. Percayalah bahwa Tuhan memelihara hidup kita.",
    thumbnail_url: "/images/social/ig-Dc_SXwBpWQb.jpg",
    sort_order: 2,
    published: true,
    created_at: "2026-09-01T00:00:00.000Z",
  },
  {
    id: "ig-Dcyt0_wh5Cu",
    platform: "instagram",
    url: "https://www.instagram.com/reel/Dcyt0_wh5Cu/",
    caption: "Lembah gelap itu nyata. Rasa takut itu nyata. Tapi ada satu hal yang lebih nyata: Dia gak pernah pergi.",
    thumbnail_url: "/images/social/ig-Dcyt0_wh5Cu.jpg",
    sort_order: 3,
    published: true,
    created_at: "2026-08-27T00:00:00.000Z",
  },
  {
    id: "ig-DcoKvunu-Cw",
    platform: "instagram",
    url: "https://www.instagram.com/reel/DcoKvunu-Cw/",
    caption: "Hari ini boleh berat, boleh melelahkan. Tapi malam ini, taruh semuanya di tangan Tuhan dan tidur dengan hati yang tenang.",
    thumbnail_url: "/images/social/ig-DcoKvunu-Cw.jpg",
    sort_order: 4,
    published: true,
    created_at: "2026-08-23T00:00:00.000Z",
  },
];
