import type { Metadata } from "next";

import { DonationSection } from "@/components/donation";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { ArrowLink, Container } from "@/components/ui";
import { photos } from "@/lib/photos";
import { waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Donasi",
  description:
    "Dukung pelayanan Janji Pengharapan: bantuan kebutuhan pokok, konseling tanpa biaya, serta konten dan acara yang menguatkan banyak orang.",
  alternates: { canonical: "/donasi" },
};

const faqs = [
  {
    q: "Bisa minta tanda terima?",
    a: "Bisa. Kirim bukti transfer lewat WhatsApp dan sebutkan kalau kamu butuh tanda terima.",
  },
  {
    q: "Bisakah donasi untuk kebutuhan tertentu?",
    a: "Bisa. Tulis tujuannya di pesan konfirmasi, misalnya untuk bantuan sembako atau Ruang Belajar.",
  },
  {
    q: "Bagaimana kalau ingin memberi barang?",
    a: "Hubungi kami lewat WhatsApp untuk mengatur pengantaran sembako, obat, atau barang layak pakai.",
  },
  {
    q: "Dananya dipakai untuk apa saja?",
    a: "Untuk bantuan kebutuhan pokok, konseling, serta konten dan acara. Kalau ingin tahu rinciannya, tanyakan saja.",
  },
];

export default function DonasiPage() {
  return (
    <>
      <PageHero
        image={photos.heroDonation}
        imageAlt="Relawan mengangkat kardus berisi bantuan"
        title={
          <>
            Setiap pemberian <span className="italic text-gold-400">sampai ke seseorang.</span>
          </>
        }
        description="Donasimu dipakai untuk bantuan kebutuhan pokok, konseling tanpa biaya, serta konten dan acara yang menguatkan banyak orang."
      />

      <DonationSection className="bg-cream" />

      <section className="bg-paper py-24 sm:py-32">
        <Container size="wide">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-4">
              <h2 className="text-headline text-ink">Tentang donasi</h2>
              <p className="text-lead mt-4 text-sand-700">Ada pertanyaan lain soal donasi?</p>
              <div className="mt-6">
                <ArrowLink href={waLink("Halo, saya mau tanya soal donasi.")}>Tanya lewat WhatsApp</ArrowLink>
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
