import type { Metadata } from "next";

import { HelpForm } from "@/components/help-form";
import { Reveal } from "@/components/reveal";
import { Icon } from "@/components/icons";
import { ArrowLink, Container, Rise } from "@/components/ui";
import { waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Butuh Pertolongan",
  description:
    "Minta didoakan, konseling, kunjungan, atau bantuan kebutuhan pokok dari Janji Pengharapan. Gratis, rahasia, dan boleh tanpa nama.",
  alternates: { canonical: "/pertolongan" },
};

const assurances = [
  {
    icon: Icon.shield,
    title: "Dijaga kerahasiaannya",
    body: "Hanya pengurus yang menangani permohonanmu yang bisa membacanya.",
  },
  {
    icon: Icon.users,
    title: "Boleh tanpa nama",
    body: "Kirim secara anonim kalau belum siap menyebut identitas.",
  },
  {
    icon: Icon.heart,
    title: "Gratis",
    body: "Doa, konseling, dan pendampingan tidak dipungut biaya.",
  },
  {
    icon: Icon.clock,
    title: "Dibalas secepatnya",
    body: "Permohonan mendesak kami usahakan dijawab di hari yang sama.",
  },
];

export default function PertolonganPage() {
  return (
    <>
      {/* Hero sengaja ringkas supaya formulir cepat terlihat di layar HP */}
      <section className="bg-maroon-deep relative isolate overflow-hidden pb-14 pt-32 sm:pb-20 sm:pt-44">
        <div
          aria-hidden
          className="animate-breathe pointer-events-none absolute -left-24 -top-20 h-80 w-80 rounded-full bg-maroon-500/30 blur-[90px]"
        />
        <div aria-hidden className="bg-grain pointer-events-none absolute inset-0 opacity-[0.12]" />

        <Container className="relative">
          <Rise>
            <h1 className="text-display max-w-3xl text-sand-50">
              Ceritakan yang sedang <span className="italic text-gold-400">kamu hadapi.</span>
            </h1>
          </Rise>
          <Rise delay={90}>
            <p className="text-lead mt-6 max-w-xl text-sand-200/85">
              Tiga langkah singkat, kurang dari dua menit. Tidak ada cerita yang terlalu kecil untuk
              didoakan.
            </p>
          </Rise>
        </Container>
      </section>

      <section className="bg-cream overflow-clip">
        <Container>
          <div className="grid gap-12 py-14 sm:py-20 lg:grid-cols-12 lg:gap-14 lg:py-24">
            {/* Formulir didahulukan di HP */}
            <div className="lg:order-2 lg:col-span-7">
              <HelpForm />
            </div>

            <aside className="lg:order-1 lg:col-span-5">
              <div className="space-y-8 lg:sticky lg:top-28">
                <Reveal variant="left">
                  <h2 className="font-display text-2xl font-semibold text-ink">Sebelum mulai</h2>
                  <ul className="mt-6 space-y-5">
                    {assurances.map((a) => (
                      <li key={a.title} className="flex gap-4">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-maroon-50 text-maroon-700">
                          <a.icon className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="font-semibold text-ink">{a.title}</p>
                          <p className="mt-0.5 text-sm leading-relaxed text-sand-700">{a.body}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Reveal>

                <Reveal variant="left" delay={140}>
                  <figure className="rounded-[1.5rem] bg-paper p-6 sm:p-7">
                    <blockquote className="font-display text-xl italic leading-snug text-maroon-900">
                      &ldquo;Marilah kepada-Ku, semua yang letih lesu dan berbeban berat, Aku akan
                      memberi kelegaan kepadamu.&rdquo;
                    </blockquote>
                    <figcaption className="mt-3 text-sm font-semibold text-maroon-600">Matius 11:28</figcaption>
                  </figure>
                </Reveal>

                <Reveal variant="left" delay={200}>
                  <div className="rounded-[1.5rem] border border-red-200 bg-red-50/60 p-6 sm:p-7">
                    <p className="font-semibold text-red-900">Keadaan darurat?</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-red-900/80">
                      Kalau ada nyawa yang terancam, hubungi <strong>112</strong> sekarang juga.
                      Setelah itu, kabari kami lewat WhatsApp.
                    </p>
                    <div className="mt-4">
                      <ArrowLink href={waLink("DARURAT: ")}>WhatsApp tim kami</ArrowLink>
                    </div>
                  </div>
                </Reveal>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
