import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/page-hero";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";
import { Icon } from "@/components/icons";
import { ButtonLink, Container } from "@/components/ui";
import { photos } from "@/lib/photos";
import { weekDays, weeklyPrograms } from "@/lib/ruang";
import { site, socialHandle, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kontak",
  description: "Hubungi Janji Pengharapan lewat WhatsApp atau DM Instagram, atau kirim pesan lewat formulir.",
  alternates: { canonical: "/kontak" },
};

const channels = [
  site.whatsapp
    ? { icon: Icon.whatsapp, label: "WhatsApp", value: site.phoneDisplay, href: waLink(), note: "Sampaikan pesan dengan nyaman" }
    : { icon: Icon.mail, label: "Pesan untuk tim JP", value: "Kami ingin mendengarkan", href: "#kirim-pesan", note: "Tinggalkan kontak agar kami bisa membalas" },
  // Instagram JP memang menerima DM ("Butuh dukungan doa? DM kami!").
  ...(site.socials.instagram
    ? [{ icon: Icon.instagram, label: "Instagram", value: socialHandle(site.socials.instagram), href: site.socials.instagram, note: "Boleh juga lewat DM" }]
    : []),
];

export default function KontakPage() {
  const weekly = weeklyPrograms();

  return (
    <>
      <PageHero
        image={photos.heroContact}
        imageAlt="Tiga perempuan tertawa bersama"
        title="Kami senang mendengar darimu."
        description="Ada yang ingin ditanyakan, ingin bekerja sama, atau sekadar menyapa? Kamu bisa mulai di sini."
      />

      <section className="bg-cream pb-20 pt-14 sm:pb-28 sm:pt-20">
        <Container size="wide">
          <div className={`grid gap-3 sm:gap-4 ${channels.length > 2 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
            {channels.map((c, i) => (
              <Reveal key={c.label} delay={i * 90}>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex h-full items-center gap-4 rounded-2xl bg-sand-100 p-5 shadow-warm transition duration-500 hover:-translate-y-1 hover:bg-maroon-700 hover:shadow-warm-lg sm:flex-col sm:items-start sm:gap-0 sm:p-7"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-maroon-700 transition-colors duration-500 group-hover:bg-sand-50/15 group-hover:text-gold-400">
                    <c.icon className="h-5 w-5" />
                  </span>
                  <Icon.arrowUpRight className="absolute right-5 top-5 h-5 w-5 text-sand-500 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-sand-50 sm:right-6 sm:top-6" />
                  <span className="min-w-0 sm:mt-8">
                    <span className="block text-sm text-sand-600 transition-colors duration-500 group-hover:text-sand-200/80">
                      {c.label}
                    </span>
                    <span className="font-display mt-0.5 block break-all text-lg font-semibold text-ink transition-colors duration-500 group-hover:text-sand-50 sm:mt-1 sm:text-xl">
                      {c.value}
                    </span>
                    <span className="mt-1 hidden text-sm text-sand-600 transition-colors duration-500 group-hover:text-sand-200/80 sm:block">
                      {c.note}
                    </span>
                  </span>
                </a>
              </Reveal>
            ))}
          </div>

          <div className="mt-14 grid gap-12 sm:mt-20 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Reveal>
                <h2 id="kirim-pesan" className="text-headline scroll-mt-28 text-ink">Kirim pesan</h2>
                <p className="mt-3 leading-relaxed text-sand-700">Tinggalkan email atau nomor WhatsApp agar kami bisa membalas.</p>
              </Reveal>
              <div className="form-surface mt-8 rounded-[2rem] p-5 sm:mt-10 sm:p-10">
                <ContactForm />
              </div>
            </div>

            <aside className="space-y-4 lg:col-span-5">
              <Reveal variant="right">
                <div className="bg-maroon-deep relative isolate overflow-hidden rounded-[1.75rem] p-7 text-sand-50 shadow-deep sm:p-9">
                  <div aria-hidden className="bg-grain pointer-events-none absolute inset-0 -z-10 opacity-[0.08]" />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-12 -top-12 -z-10 h-40 w-40 rounded-full bg-gold-400/20 blur-3xl"
                  />
                  <Icon.hands className="h-8 w-8 text-gold-400" />
                  <h2 className="font-display mt-6 text-2xl font-semibold leading-snug">Sedang butuh pertolongan?</h2>
                  <p className="mt-3 max-w-sm leading-relaxed text-sand-200/80">
                    Ada ruang khusus untuk ceritamu, agar tim lebih memahami dukungan yang kamu butuhkan. Kamu boleh bercerita tanpa nama.
                  </p>
                  <div className="mt-7">
                    <ButtonLink href="/pertolongan" variant="light">
                      Saya ingin bercerita
                      <Icon.arrowRight className="h-4 w-4" />
                    </ButtonLink>
                  </div>
                </div>
              </Reveal>

              <Reveal variant="right" delay={120}>
                <div className="rounded-[1.75rem] bg-sand-100 p-7 shadow-warm sm:p-9">
                  <h2 className="font-display text-xl font-semibold text-ink">Jadwal rutin</h2>
                  <ul className="mt-4 divide-y divide-sand-300/70">
                    {weekly.map((w) => (
                      <li key={w.title}>
                        <Link href={`/layanan#${w.ruang.slug}`} className="group flex items-baseline justify-between gap-4 py-4">
                          <span className="min-w-0">
                            <span className="block font-semibold text-ink transition-colors group-hover:text-maroon-700">
                              {w.title}
                            </span>
                            <span className="mt-0.5 block text-sm text-sand-600">Ruang {w.ruang.name}</span>
                          </span>
                          <span className="shrink-0 text-right text-sm font-semibold text-maroon-700">
                            {weekDays[w.weekly.day]}
                            <span className="block font-normal tabular-nums text-sand-700">{w.weekly.time} WIB</span>
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
