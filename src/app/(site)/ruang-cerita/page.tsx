import type { Metadata } from "next";

import { FaqSection, type Faq } from "@/components/faq";
import { HelpSteps } from "@/components/help-steps";
import { RuangHero, RuangNav, RuangSection } from "@/components/ruang";
import { CaraMenemani } from "@/components/sections/cara-menemani";
import { StoryFormSection } from "@/components/sections/form-sections";
import { getRuang } from "@/lib/ruang";

export const metadata: Metadata = {
  title: "Ruang Cerita",
  description: "Bercerita dan didampingi secara pribadi atau dalam kelompok kecil. Gratis dan boleh tanpa nama.",
  alternates: { canonical: "/ruang-cerita" },
};

const faqs: Faq[] = [
  {
    q: "Dengan siapa aku bercerita?",
    a: "Dengan pendamping rohani dari tim JP. Kamu boleh memilih pendamping perempuan atau laki-laki.",
  },
  { q: "Harus tatap muka?", a: "Tidak. Bisa online atau tatap muka, pilih yang paling nyaman." },
  { q: "Siapa yang membaca ceritaku?", a: "Hanya tim yang menanganinya. Boleh juga tanpa nama." },
  { q: "Benar-benar gratis?", a: "Ya. Pendampingan dan kelompok berbagi tidak dipungut biaya." },
  {
    q: "Kalau keadaanku darurat?",
    a: "Formulir ini tidak dipantau setiap saat. Kalau nyawamu atau orang lain terancam, telepon 119. Kalau butuh bicara sekarang, telepon 119 lalu tekan 8, atau buka healing119.id.",
  },
];

export default function RuangCeritaPage() {
  const r = getRuang("ruang-cerita");
  return (
    <>
      <RuangHero ruang={r} action={{ label: "Mulai bercerita", href: "#ceritakan" }} />
      <RuangSection ruang={r} index={0} heading={r.tagline} showSummary={false} />
      <CaraMenemani className="bg-cream" />
      <HelpSteps ctaHref="#ceritakan" />
      <StoryFormSection className="bg-cream" />
      <FaqSection
        title="Tentang Ruang Cerita"
        description="Wajar kalau masih ada yang ingin kamu ketahui sebelum mulai."
        action={r.secondary}
        items={faqs}
        className="bg-paper"
      />
      <RuangNav current={r.slug} className="bg-cream" />
    </>
  );
}
