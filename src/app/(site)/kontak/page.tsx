import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/page-hero";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";
import { Icon } from "@/components/icons";
import { ButtonLink, Container } from "@/components/ui";
import { photos } from "@/lib/photos";
import { weekDays, weeklyPrograms } from "@/lib/ruang";
import { site, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kontak",
  description:
    "Hubungi Janji Pengharapan lewat WhatsApp, email, atau TikTok, atau kirim pesan lewat formulir.",
  alternates: { canonical: "/kontak" },
};

const channels = [
  {
    icon: Icon.whatsapp,
    label: "WhatsApp",
    value: site.phone,
    href: waLink(),
    note: "Paling cepat dibalas",
  },
  {
    icon: Icon.mail,
    label: "Email",
    value: site.email,
    href: `mailto:${site.email}`,
    note: "Untuk pertanyaan panjang atau kerja sama",
  },
  {
    icon: Icon.tiktok,
    label: "TikTok",
    value: "@janjipengharapan",
    href: site.socials.tiktok,
    note: "Boleh juga lewat DM",
  },
];

export default function KontakPage() {
  const weekly = weeklyPrograms();

  return (
    <>
      <PageHero
        image={photos.heroContact}
        imageAlt="Tiga perempuan tertawa bersama"
        title="Mau tanya sesuatu? Tulis saja."
        description="Untuk pertanyaan, kerja sama, atau sekadar menyapa. Kalau sedang butuh pertolongan, pakai formulir khusus supaya ceritamu langsung sampai ke tim pendamping."
      />

      <section className="bg-cream py-24 sm:py-32">
        <Container size="wide">
          <div className="grid gap-4 sm:grid-cols-3">
            {channels.map((c, i) => (
              <Reveal key={c.label} delay={i * 90}>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex h-full flex-col rounded-2xl bg-sand-100 p-6 transition-colors duration-500 hover:bg-maroon-700 sm:p-7"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-maroon-700 transition-colors duration-500 group-hover:bg-sand-50/15 group-hover:text-gold-400">
                    <c.icon className="h-5 w-5" />
                  </span>
                  <Icon.arrowUpRight className="absolute right-6 top-6 h-5 w-5 text-sand-500 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-sand-50" />
                  <p className="mt-8 text-sm text-sand-600 transition-colors duration-500 group-hover:text-sand-200/80">
                    {c.label}
                  </p>
                  <p className="font-display mt-1 wrap-break-word text-xl font-semibold text-ink transition-colors duration-500 group-hover:text-sand-50">
                    {c.value}
                  </p>
                  <p className="mt-1.5 text-sm text-sand-600 transition-colors duration-500 group-hover:text-sand-200/80">
                    {c.note}
                  </p>
                </a>
              </Reveal>
            ))}
          </div>

          <div className="mt-20 grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Reveal>
                <h2 className="text-headline text-ink">Kirim pesan</h2>
                <p className="mt-3 leading-relaxed text-sand-700">
                  Kami balas lewat email atau WhatsApp, sesuai data yang kamu isi.
                </p>
              </Reveal>
              <div className="mt-10">
                <ContactForm />
              </div>
            </div>

            <aside className="space-y-4 lg:col-span-5">
              <Reveal variant="right">
                <div className="bg-maroon-deep relative isolate overflow-hidden rounded-[1.75rem] p-7 text-sand-50 sm:p-9">
                  <div aria-hidden className="bg-grain pointer-events-none absolute inset-0 -z-10 opacity-[0.08]" />
                  <Icon.hands className="h-8 w-8 text-gold-400" />
                  <h2 className="font-display mt-6 text-2xl font-semibold leading-snug">
                    Sedang butuh pertolongan?
                  </h2>
                  <p className="mt-3 leading-relaxed text-sand-200/80">
                    Pakai formulir khusus supaya ceritamu langsung sampai ke tim pendamping. Bisa
                    dikirim tanpa nama.
                  </p>
                  <div className="mt-7">
                    <ButtonLink href="/pertolongan" variant="light">
                      Buka formulir pertolongan
                      <Icon.arrowRight className="h-4 w-4" />
                    </ButtonLink>
                  </div>
                </div>
              </Reveal>

              <Reveal variant="right" delay={120}>
                <div className="rounded-[1.75rem] bg-sand-100 p-7 sm:p-9">
                  <h2 className="font-display text-xl font-semibold text-ink">Jadwal rutin</h2>
                  <ul className="mt-4 divide-y divide-sand-300/70">
                    {weekly.map((w) => (
                      <li key={w.title}>
                        <Link
                          href={`/#${w.ruang.slug}`}
                          className="group flex items-baseline justify-between gap-4 py-4"
                        >
                          <span>
                            <span className="block font-semibold text-ink transition-colors group-hover:text-maroon-700">
                              {w.title}
                            </span>
                            <span className="mt-0.5 block text-sm text-sand-600">Ruang {w.ruang.name}</span>
                          </span>
                          <span className="shrink-0 text-right text-sm font-semibold text-maroon-700">
                            {weekDays[w.weekly.day]}
                            <span className="block font-normal tabular-nums text-sand-700">
                              {w.weekly.time} WIB
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
