import type { Metadata } from "next";

import { DonationSection } from "@/components/donation";
import { FaqSection, type Faq } from "@/components/faq";
import { PageHero } from "@/components/page-hero";
import { photos } from "@/lib/photos";
import { waLink, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Donasi",
  description:
    "Dukung pelayanan Janji Pengharapan: bantuan sembako, konseling gratis, serta konten dan acara.",
  alternates: { canonical: "/donasi" },
};

const faqs: Faq[] = [
  { q: "Bisa minta tanda terima?", a: "Bisa. Kirim bukti transfer lewat WhatsApp, lalu minta tanda terimanya." },
  { q: "Bisa untuk kebutuhan tertentu?", a: "Bisa. Tulis tujuannya saat konfirmasi, misalnya untuk sembako." },
  { q: "Mau memberi barang?", a: "Chat kami lewat WhatsApp untuk atur pengantarannya." },
  { q: "Dananya dipakai untuk apa?", a: "Untuk sembako, konseling, serta konten dan acara. Mau tahu rinciannya? Tanya saja." },
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
        description="Donasimu dipakai untuk sembako, konseling gratis, serta konten dan acara."
      />

      <DonationSection className="bg-cream" />

      <FaqSection
        title="Tentang donasi"
        description="Ada pertanyaan lain?"
        action={{ label: site.whatsapp ? "Tanya lewat WhatsApp" : "Tanya kepada tim JP", href: waLink("Halo, saya mau tanya soal donasi.") }}
        items={faqs}
      />
    </>
  );
}
