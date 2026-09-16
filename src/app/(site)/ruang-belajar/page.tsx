import type { Metadata } from "next";

import { FaqSection, type Faq } from "@/components/faq";
import { Icon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { RuangHero, RuangNav, RuangSection } from "@/components/ruang";
import { ProconSection } from "@/components/sections/procon";
import { ButtonLink, Container } from "@/components/ui";
import { proconWaLink } from "@/lib/procon";
import { getRuang } from "@/lib/ruang";

export const metadata: Metadata = {
  title: "Ruang Belajar",
  description: "Kelas dan diskusi ProCon untuk kamu yang ingin terus bertumbuh. Terbuka untuk siapa saja.",
  alternates: { canonical: "/ruang-belajar" },
};

const steps = [
  { title: "Kabari kami", body: "Chat WhatsApp, sebut kelas yang kamu minati atau topik yang ingin kamu pelajari." },
  { title: "Kami kirim detailnya", body: "Tanggal, tempat, dan hal yang perlu kamu siapkan." },
  { title: "Datang, belajar bareng", body: "Tidak perlu pengalaman atau jabatan. Datang saja." },
];

const faqs: Faq[] = [
  { q: "Harus profesional atau punya jabatan?", a: "Tidak. Pelajar dan mahasiswa juga boleh ikut." },
  {
    q: "Ada biayanya?",
    a: "Pertemuannya tidak dipungut biaya. Kalau ada kelas yang butuh biaya materi, kami kabari di awal.",
  },
  { q: "Harus orang Kristen?", a: "Tidak. Siapa pun boleh ikut, apa pun latar belakangnya." },
  { q: "Online atau tatap muka?", a: "Sekarang pertemuannya tatap muka di Jakarta." },
  {
    q: "Mau belajar topik tertentu?",
    a: "Kabari kami lewat WhatsApp. Kalau ada yang mau belajar hal yang sama, kita atur bareng di ProCon.",
  },
];

/** Tiga langkah ikut ProCon. Sengaja sederhana: tidak ada pendaftaran resmi. */
function CaraIkut() {
  return (
    <section id="cara-ikut" className="scroll-mt-20 bg-cream py-20 sm:py-28 lg:py-32">
      <Container size="wide">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <h2 className="text-display text-ink">
                  Cara <span className="italic text-maroon-700">ikut.</span>
                </h2>
                <p className="text-lead mt-5 max-w-sm text-sand-700">
                  Tidak ada pendaftaran yang rumit. Tiga langkah saja.
                </p>
              </Reveal>
              <Reveal delay={150}>
                <div className="mt-8">
                  <ButtonLink href={proconWaLink()} external>
                    <Icon.whatsapp className="h-4 w-4" />
                    Kabari lewat WhatsApp
                  </ButtonLink>
                </div>
              </Reveal>
            </div>
          </div>

          <ol className="lg:col-span-8">
            {steps.map((s, i) => (
              <Reveal
                as="li"
                key={s.title}
                delay={i * 100}
                className="group grid grid-cols-[3rem_1fr] gap-4 border-t border-sand-300/70 py-7 last:border-b sm:grid-cols-[6rem_1fr] sm:gap-8 sm:py-9"
              >
                <span className="font-display text-4xl font-semibold leading-none text-transparent transition-colors duration-500 [-webkit-text-stroke:1.5px_var(--color-maroon-400)] group-hover:text-maroon-400 sm:text-6xl">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{s.title}</h3>
                  <p className="mt-2 max-w-md leading-relaxed text-sand-700">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}

export default function RuangBelajarPage() {
  const r = getRuang("ruang-belajar");
  return (
    <>
      <RuangHero ruang={r} action={{ label: "Lihat kelas ProCon", href: "#procon" }} />
      <RuangSection ruang={r} index={0} heading={r.tagline} showSummary={false} showDetail={false} />
      <ProconSection />
      <CaraIkut />
      <FaqSection
        title="Tentang Ruang Belajar"
        description="Yang sering ditanyakan sebelum ikut."
        action={r.secondary}
        items={faqs}
        className="bg-paper"
      />
      <RuangNav current={r.slug} className="bg-cream" />
    </>
  );
}
