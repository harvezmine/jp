import type { Metadata } from "next";

import { RuangHero, RuangNav, RuangSection } from "@/components/ruang";
import { KomunitasSection } from "@/components/sections/komunitas";
import { ProconSection } from "@/components/sections/procon";
import { getRuang } from "@/lib/ruang";

export const metadata: Metadata = {
  title: "Ruang Belajar",
  description: "Komunitas belajar bersama dan ProCon, untuk kamu yang ingin terus bertumbuh.",
  alternates: { canonical: "/ruang-belajar" },
};

export default function RuangBelajarPage() {
  const r = getRuang("ruang-belajar");
  return (
    <>
      <RuangHero ruang={r} action={{ label: "Lihat komunitas", href: "#komunitas" }} />
      <RuangSection ruang={r} index={0} heading={r.tagline} showSummary={false} />
      <KomunitasSection className="bg-cream" />
      <ProconSection />
      <RuangNav current={r.slug} className="bg-cream" />
    </>
  );
}
