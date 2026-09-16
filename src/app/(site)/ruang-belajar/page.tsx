import type { Metadata } from "next";

import { RuangHero, RuangNav, RuangSection } from "@/components/ruang";
import { ProconSection } from "@/components/sections/procon";
import { getRuang } from "@/lib/ruang";

export const metadata: Metadata = {
  title: "Ruang Belajar",
  description: "Kelas dan diskusi ProCon untuk kamu yang ingin terus bertumbuh. Terbuka untuk siapa saja.",
  alternates: { canonical: "/ruang-belajar" },
};

export default function RuangBelajarPage() {
  const r = getRuang("ruang-belajar");
  return (
    <>
      <RuangHero ruang={r} action={{ label: "Lihat kelas ProCon", href: "#procon" }} />
      <RuangSection ruang={r} index={0} heading={r.tagline} showSummary={false} />
      <ProconSection />
      <RuangNav current={r.slug} className="bg-cream" />
    </>
  );
}
