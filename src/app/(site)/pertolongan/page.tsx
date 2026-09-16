import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { CrisisLine } from "@/components/crisis-line";
import { HelpForm } from "@/components/help-form";
import { HeroLip } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { Icon } from "@/components/icons";
import { Container, Rise } from "@/components/ui";
import { HELP_CATEGORIES } from "@/lib/help-validation";
import type { HelpCategory } from "@/lib/types";

export const metadata: Metadata = {
  title: "Butuh Pertolongan",
  description:
    "Ceritakan apa yang sedang kamu bawa. Tim Janji Pengharapan mendengar, mendoakan, dan menemani. Gratis dan boleh tanpa nama.",
  alternates: { canonical: "/pertolongan" },
};

const assurances = [
  { icon: Icon.shield, title: "Ceritamu berarti", body: "Bagikan sebatas yang nyaman kamu ceritakan." },
  { icon: Icon.users, title: "Boleh tanpa nama", body: "Kalau belum siap, kirim tanpa nama." },
  { icon: Icon.heart, title: "Gratis", body: "Tidak ada biaya apa pun." },
  { icon: Icon.clock, title: "Sesuai pilihanmu", body: "Kamu memilih cara dihubungi, atau belum ingin dihubungi." },
];

export default async function PertolonganPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  // Tautan lama ke kategori ini sekarang punya formulir sendiri di halaman ruangnya.
  if (category === "doa") redirect("/ruang-doa#kirim-doa");
  if (category === "konseling") redirect("/ruang-cerita#ceritakan");
  const initialCategory = (HELP_CATEGORIES as readonly string[]).includes(category ?? "")
    ? (category as HelpCategory)
    : undefined;
  return (
    <>
      {/* Hero sengaja ringkas supaya formulir cepat terlihat di layar HP */}
      <section className="bg-maroon-deep relative isolate overflow-hidden pb-20 pt-28 sm:pb-24 sm:pt-36">
        <div
          aria-hidden
          className="animate-breathe pointer-events-none absolute -left-24 -top-20 h-80 w-80 rounded-full bg-maroon-500/30 blur-[90px]"
        />
        <div aria-hidden className="bg-grain pointer-events-none absolute inset-0 opacity-[0.12]" />

        <Container className="relative">
          <Rise>
            <h1 className="text-headline max-w-2xl text-sand-50">
              Ada ruang untuk <span className="italic text-gold-400">ceritamu.</span>
            </h1>
          </Rise>
          <Rise delay={90}>
            <p className="text-lead mt-5 max-w-md text-sand-200/85 sm:mt-6">
              Tidak perlu tahu harus mulai dari mana. Ambil waktu yang kamu butuhkan, lalu ceritakan sedikit demi
              sedikit.
            </p>
          </Rise>
        </Container>

        <HeroLip />
      </section>

      <section className="bg-cream overflow-clip">
        <Container>
          <div className="grid min-w-0 gap-10 pb-20 pt-8 sm:pb-24 sm:pt-12 lg:grid-cols-12 lg:gap-12 lg:pb-28 lg:pt-14">
            {/* Formulir didahulukan di HP */}
            <div className="min-w-0 lg:order-2 lg:col-span-8">
              <div className="form-surface rounded-[1.75rem] p-5 sm:p-8 lg:p-10">
                <HelpForm key={initialCategory ?? "default"} initialCategory={initialCategory} />
              </div>
            </div>

            <aside className="min-w-0 lg:order-1 lg:col-span-4">
              <div className="space-y-6 lg:sticky lg:top-28 lg:space-y-8">
                <Reveal variant="left">
                  <h2 className="font-display text-2xl font-semibold text-ink">Kamu boleh merasa nyaman</h2>
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
                    <figcaption className="relative mt-3 text-sm font-semibold text-maroon-600">
                      Matius 11:28
                    </figcaption>
                  </figure>
                </Reveal>

                <Reveal variant="left" delay={200}>
                  <CrisisLine />
                </Reveal>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
