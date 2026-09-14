import type { Metadata } from "next";

import { FaqSection, type Faq } from "@/components/faq";
import { HelpSteps } from "@/components/help-steps";
import { Icon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { RuangIntro, RuangSections, RuangSummary } from "@/components/ruang";
import { ArrowLink, ButtonLink } from "@/components/ui";
import { photos } from "@/lib/photos";
import { waLink, site } from "@/lib/site";

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
    a: "Jika keselamatanmu atau orang lain terancam, hubungi layanan darurat setempat dan orang terdekat. Formulir ini bukan layanan darurat.",
  },
  {
    q: "Berapa lama sampai dihubungi?",
    a: "Tim akan membaca ceritamu dan membalas melalui cara yang kamu pilih. Balasan tidak selalu langsung, jadi kamu tidak perlu menunggu di halaman ini.",
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
            Ada ruang untuk <span className="italic text-gold-400">setiap langkahmu.</span>
          </>
        }
        description="Untuk saat kamu ingin didoakan, didengarkan, atau bertumbuh bersama. Kamu tidak harus tahu semua jawabannya dulu."
      >
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
          <ButtonLink href="/pertolongan" variant="light" size="lg">
            <Icon.hands className="h-5 w-5" />
            Mulai bercerita
          </ButtonLink>
          <ArrowLink href={waLink()} tone="light">
            {site.whatsapp ? "Chat lewat WhatsApp" : "Hubungi tim JP"}
          </ArrowLink>
        </div>
      </PageHero>

      <RuangIntro
        title={
          <>
            Mulai dari <span className="italic text-maroon-700">ruang</span> yang paling pas.
          </>
        }
        description="Belum tahu harus mulai dari mana? Ceritakan sedikit tentang keadaanmu, kita cari langkahnya bersama."
      />
      <RuangSections />
      <RuangSummary />

      <HelpSteps />

      <FaqSection
        title="Yang sering ditanyakan"
        description="Wajar kalau masih ada yang ingin kamu ketahui sebelum mulai."
        action={{ label: "Hubungi kami", href: "/kontak" }}
        items={faqs}
      />
    </>
  );
}
