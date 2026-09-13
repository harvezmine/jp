import type { Metadata } from "next";

import { HelpForm } from "@/components/help-form";
import { HeroLip } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { Icon } from "@/components/icons";
import { ArrowLink, Container, Rise } from "@/components/ui";
import { waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Butuh Pertolongan",
  description:
    "Minta didoakan, konseling, kunjungan, atau bantuan sembako dari Janji Pengharapan. Gratis, rahasia, dan boleh tanpa nama.",
  alternates: { canonical: "/pertolongan" },
};

const assurances = [
  { icon: Icon.shield, title: "Rahasia", body: "Hanya dibaca tim yang menanganinya." },
  { icon: Icon.users, title: "Boleh tanpa nama", body: "Kalau belum siap, kirim tanpa nama." },
  { icon: Icon.heart, title: "Gratis", body: "Tidak ada biaya apa pun." },
  { icon: Icon.clock, title: "Dibalas secepatnya", body: "Yang mendesak, kami usahakan hari itu juga." },
];

export default function PertolonganPage() {
  return (
    <>
      {/* Hero sengaja ringkas supaya formulir cepat terlihat di layar HP */}
      <section className="bg-maroon-deep relative isolate overflow-hidden pb-20 pt-28 sm:pb-28 sm:pt-44">
        <div
          aria-hidden
          className="animate-breathe pointer-events-none absolute -left-24 -top-20 h-80 w-80 rounded-full bg-maroon-500/30 blur-[90px]"
        />
        <div aria-hidden className="bg-grain pointer-events-none absolute inset-0 opacity-[0.12]" />

        <Container className="relative">
          <Rise>
            <h1 className="text-display max-w-2xl text-sand-50">
              Ceritakan yang sedang <span className="italic text-gold-400">kamu hadapi.</span>
            </h1>
          </Rise>
          <Rise delay={90}>
            <p className="text-lead mt-5 max-w-md text-sand-200/85 sm:mt-6">
              Tiga langkah singkat, kurang dari dua menit. Tidak ada cerita yang terlalu kecil.
            </p>
          </Rise>
        </Container>

        <HeroLip />
      </section>

      <section className="bg-cream overflow-clip">
        <Container>
          <div className="grid gap-12 pb-20 pt-8 sm:pb-24 sm:pt-12 lg:grid-cols-12 lg:gap-12 lg:pb-28 lg:pt-14">
            {/* Formulir didahulukan di HP */}
            <div className="lg:order-2 lg:col-span-7">
              <div className="sm:rounded-[2rem] sm:bg-white sm:p-8 sm:shadow-warm-lg sm:ring-1 sm:ring-sand-200/70 lg:p-10">
                <HelpForm />
              </div>
            </div>

            <aside className="lg:order-1 lg:col-span-5">
              <div className="space-y-6 lg:sticky lg:top-28 lg:space-y-8">
                <Reveal variant="left">
                  <h2 className="font-display text-2xl font-semibold text-ink">Sebelum mulai</h2>
                  <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:gap-5">
                    {assurances.map((a) => (
                      <li key={a.title} className="flex gap-4">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-maroon-50 text-maroon-700 ring-1 ring-maroon-100">
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
                  <figure className="relative overflow-hidden rounded-2xl bg-paper p-6 shadow-warm sm:p-7">
                    <span
                      aria-hidden
                      className="font-display pointer-events-none absolute -right-2 -top-6 text-9xl leading-none text-maroon-100"
                    >
                      &rdquo;
                    </span>
                    <blockquote className="font-display relative text-xl italic leading-snug text-maroon-900">
                      &ldquo;Marilah kepada-Ku, semua yang letih lesu dan berbeban berat.&rdquo;
                    </blockquote>
                    <figcaption className="relative mt-3 text-sm font-semibold text-maroon-600">Matius 11:28</figcaption>
                  </figure>
                </Reveal>

                <Reveal variant="left" delay={200}>
                  <div className="rounded-2xl border border-red-200 bg-red-50/60 p-6 sm:p-7">
                    <p className="font-semibold text-red-900">Keadaan darurat?</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-red-900/80">
                      Kalau ada nyawa yang terancam, hubungi <strong>112</strong> sekarang. Setelah itu,
                      kabari kami lewat WhatsApp.
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
