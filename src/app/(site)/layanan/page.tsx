import type { Metadata } from "next";

import { FaqSection, type Faq } from "@/components/faq";
import { HelpSteps } from "@/components/help-steps";
import { Icon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { RuangIntro, RuangSections, RuangSummary } from "@/components/ruang";
import { ArrowLink, ButtonLink } from "@/components/ui";
import { photos } from "@/lib/photos";
import { waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pelayanan",
  description:
    "Ruang Pengharapan, Ruang Doa, Ruang Cerita, dan Ruang Belajar. Gratis dan terbuka untuk siapa saja.",
};

const faqs: Faq[] = [
  { q: "Harus orang Kristen?", a: "Tidak. Siapa pun boleh datang, apa pun agamanya." },
  {
    q: "Benar-benar gratis?",
    a: "Ya. Doa, konseling, dan pendampingan gratis. Kalau ada kelas yang butuh biaya materi, kami kabari di awal.",
  },
  { q: "Siapa yang membaca ceritaku?", a: "Hanya tim yang menanganinya. Boleh juga tanpa nama." },
  {
    q: "Nanti diajak ikut gereja?",
    a: "Kami akan bercerita tentang Yesus kalau kamu mau. Keputusannya tetap di tanganmu.",
  },
  {
    q: "Kalau keadaanku darurat?",
    a: "Kalau ada nyawa yang terancam, hubungi 112 sekarang. Setelah itu, kabari kami lewat WhatsApp.",
  },
  {
    q: "Berapa lama sampai dihubungi?",
    a: "Yang mendesak, kami usahakan hari itu juga. Lainnya biasanya 1 sampai 2 hari.",
  },
];

export default function LayananPage() {
  return (
    <>
      <PageHero
        image={photos.heroServices}
        imageAlt="Tangan beberapa orang saling bertumpuk"
        title={
          <>
            Empat ruang untuk kamu yang <span className="italic text-gold-400">butuh ditolong.</span>
          </>
        }
        description="Gratis dan terbuka untuk siapa saja."
      >
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
          <ButtonLink href="/pertolongan" variant="light" size="lg">
            <Icon.hands className="h-5 w-5" />
            Minta pertolongan
          </ButtonLink>
          <ArrowLink href={waLink()} tone="light">
            Chat lewat WhatsApp
          </ArrowLink>
        </div>
      </PageHero>

      <RuangIntro
        title={
          <>
            Mulai dari <span className="italic text-maroon-700">ruang</span> yang paling pas.
          </>
        }
        description="Bingung pilih yang mana? Isi formulir saja, nanti kami bantu."
      />
      <RuangSections />
      <RuangSummary />

      <HelpSteps />

      <FaqSection
        title="Yang sering ditanyakan"
        description="Pertanyaan lain? Tanya langsung saja."
        action={{ label: "Hubungi kami", href: "/kontak" }}
        items={faqs}
      />
    </>
  );
}
