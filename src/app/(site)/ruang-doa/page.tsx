import type { Metadata } from "next";

import { FaqSection, type Faq } from "@/components/faq";
import { crisis } from "@/lib/crisis";
import { RuangHero, RuangNav, RuangSection } from "@/components/ruang";
import { PrayerFormSection } from "@/components/sections/form-sections";
import { getRuang } from "@/lib/ruang";

export const metadata: Metadata = {
  title: "Ruang Doa",
  description: "Kirim pokok doamu, boleh tanpa nama. Tim pendoa Janji Pengharapan akan mendoakannya.",
  alternates: { canonical: "/ruang-doa" },
};

const faqs: Faq[] = [
  { q: "Harus menyebut nama?", a: "Tidak. Kamu boleh mengirim pokok doa tanpa nama." },
  { q: "Siapa yang mendoakan?", a: "Tim pendoa Janji Pengharapan. Isinya hanya dibaca tim yang menanganinya." },
  {
    q: "Boleh untuk orang lain?",
    a: 'Boleh. Pilih "Orang lain" di formulir, lalu tulis singkat siapa yang ingin didoakan.',
  },
  {
    q: "Bagaimana ikut Doa Kesembuhan?",
    a: "Setiap Rabu pukul 19.30 WIB lewat Zoom, kamera boleh mati. Minta link-nya lewat WhatsApp.",
  },
  {
    q: "Kalau keadaanku darurat?",
    a: crisis.formNote,
  },
];

export default function RuangDoaPage() {
  const r = getRuang("ruang-doa");
  return (
    <>
      <RuangHero ruang={r} action={{ label: "Kirim pokok doa", href: "#kirim-doa" }} />
      <RuangSection ruang={r} index={0} heading={r.tagline} showSummary={false} showDetail={false} />
      <PrayerFormSection className="bg-cream" />
      <FaqSection
        title="Tentang Ruang Doa"
        description="Yang sering ditanyakan sebelum mengirim pokok doa."
        action={r.secondary}
        items={faqs}
        className="bg-paper"
      />
      <RuangNav current={r.slug} className="bg-cream" />
    </>
  );
}
