import type { Metadata } from "next";

import { HelpSteps } from "@/components/help-steps";
import { Icon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { RuangIntro, RuangSections, RuangSummary } from "@/components/ruang";
import { ArrowLink, ButtonLink, Container } from "@/components/ui";
import { photos } from "@/lib/photos";
import { waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pelayanan",
  description:
    "Ruang Pengharapan, Ruang Doa, Ruang Cerita, dan Ruang Belajar. Pelayanan Janji Pengharapan yang gratis dan terbuka untuk siapa saja.",
};

const faqs = [
  {
    q: "Apakah harus orang Kristen?",
    a: "Tidak. Siapa pun boleh minta didoakan, ditemani, atau ikut kelas, apa pun agama dan latar belakangmu.",
  },
  {
    q: "Apakah benar-benar gratis?",
    a: "Ya. Doa, konseling, dan pendampingan tidak dipungut biaya. Beberapa kelas di Ruang Belajar mungkin punya biaya materi, dan akan disampaikan di awal.",
  },
  {
    q: "Siapa yang akan membaca ceritaku?",
    a: "Hanya pengurus yang menangani permohonanmu. Kamu juga boleh bercerita tanpa menyebut nama.",
  },
  {
    q: "Apakah aku akan diajak ikut gereja?",
    a: "Kami akan mendoakanmu dan bercerita tentang Yesus kalau kamu mau. Selebihnya, keputusan sepenuhnya ada padamu.",
  },
  {
    q: "Bagaimana kalau keadaanku darurat?",
    a: "Kalau ada nyawa yang terancam, hubungi 112 sekarang juga. Setelah itu, kabari kami lewat WhatsApp dan tulis \"darurat\" di awal pesan.",
  },
  {
    q: "Berapa lama sampai dihubungi?",
    a: "Permohonan mendesak kami usahakan dibalas di hari yang sama. Yang lain biasanya dalam satu sampai dua hari.",
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
        description="Semua pelayanan di Janji Pengharapan terbuka untuk siapa saja, dari mana pun kamu mengenal kami."
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
            Mulai dari <span className="italic text-maroon-700">ruang</span> yang paling dekat dengan
            kebutuhanmu.
          </>
        }
        description="Bingung harus pilih yang mana? Isi formulir saja, nanti tim kami yang membantu menentukan."
      />
      <RuangSections />
      <RuangSummary />

      <HelpSteps />

      <section className="bg-paper py-24 sm:py-32">
        <Container size="wide">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-4">
              <h2 className="text-headline text-ink">Yang sering ditanyakan</h2>
              <p className="text-lead mt-4 text-sand-700">Pertanyaan lain? Tanya langsung saja.</p>
              <div className="mt-6">
                <ArrowLink href="/kontak">Hubungi kami</ArrowLink>
              </div>
            </Reveal>
            <dl className="grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:col-span-8">
              {faqs.map((f, i) => (
                <Reveal key={f.q} delay={(i % 2) * 90} className="border-t border-sand-300/70 pt-6">
                  <dt className="font-display text-xl font-semibold leading-snug text-ink">{f.q}</dt>
                  <dd className="mt-3 leading-relaxed text-sand-700">{f.a}</dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </Container>
      </section>
    </>
  );
}
