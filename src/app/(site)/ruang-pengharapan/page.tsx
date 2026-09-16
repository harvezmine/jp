import type { Metadata } from "next";

import { RuangHero, RuangNav, RuangSection } from "@/components/ruang";
import { QuotesSection } from "@/components/sections/quotes";
import { RenunganSection } from "@/components/sections/renungan";
import { SocialReels } from "@/components/sections/social-reels";
import { getPosts, getQuotes, getSocialPosts } from "@/lib/queries";
import { getRuang } from "@/lib/ruang";

export const metadata: Metadata = {
  title: "Ruang Pengharapan",
  description: "Renungan pendek, tulisan, dan video untuk menguatkan harimu. Gratis dan terbuka untuk siapa saja.",
  alternates: { canonical: "/ruang-pengharapan" },
};

export default async function RuangPengharapanPage() {
  const r = getRuang("ruang-pengharapan");
  const [renungan, quotes, socials] = await Promise.all([
    getPosts({ category: "renungan", limit: 3 }),
    getQuotes({ limit: 4, featuredOnly: true }),
    getSocialPosts({ limit: 4 }),
  ]);
  // Belum ada renungan? Tampilkan tulisan terbaru apa pun supaya section tidak kosong.
  const posts = renungan.length ? renungan : await getPosts({ limit: 3 });

  return (
    <>
      <RuangHero
        ruang={r}
        action={
          posts.length
            ? { label: "Baca renungan", href: "#renungan" }
            : { label: "Tonton renungan", href: "#konten-sosmed" }
        }
      />
      <RuangSection ruang={r} index={0} heading={r.tagline} showSummary={false} showDetail={false} />
      <RenunganSection id="renungan" posts={posts} storyHref="/ruang-cerita#ceritakan" className="bg-paper" />
      <SocialReels socials={socials} />
      <QuotesSection quotes={quotes} className="bg-cream" />
      <RuangNav current={r.slug} className="bg-paper" />
    </>
  );
}
