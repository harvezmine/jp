import type { Metadata } from "next";

import { Icon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { ArrowLink, ButtonLink, Container } from "@/components/ui";
import { photos } from "@/lib/photos";
import { site, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mitra Kami",
  description:
    "Janji Pengharapan berjalan bareng teman-teman dari Every Nation Kelapa Gading, mitra gereja kami.",
  alternates: { canonical: "/mitra" },
};

/**
 * PLACEHOLDER: bentuk bantuan di bawah masih gambaran umum. Kalau tim JP punya
 * contoh yang lebih tepat, ganti isinya.
 */
const bantuan = [
  {
    title: "Ikut mendoakan",
    body: "Sebagian yang mendoakan pokok doa yang masuk ke Ruang Doa datang dari sana.",
  },
  {
    title: "Ikut menemani",
    body: "Ada yang menjadi pendamping saat orang ingin bercerita di Ruang Cerita.",
  },
  {
    title: "Ikut menyiapkan acara",
    body: "Untuk pertemuan yang butuh tempat, tenaga, dan tangan tambahan.",
  },
];

export default function MitraPage() {
  return (
    <>
      <PageHero
        image={photos.invite}
        imageAlt="Beberapa orang berjalan bergandengan tangan menghadap senja"
        title={
          <>
            Kami tidak berjalan <span className="italic text-gold-400">sendirian.</span>
          </>
        }
        description="Janji Pengharapan berdiri sendiri. Dalam perjalanannya, kami dibantu teman-teman yang punya hati yang sama."
      />

      {/* Mitra gereja */}
      <section className="bg-cream py-20 sm:py-28 lg:py-32">
        <Container size="wide">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-28">
                <Reveal>
                  <h2 className="text-display text-ink">
                    Every Nation <span className="italic text-maroon-700">Kelapa Gading.</span>
                  </h2>
                  <p className="text-lead mt-5 max-w-md text-sand-700">
                    Mitra gereja kami. Teman-teman di sana ikut menopang pelayanan ini, dari mendoakan sampai menyiapkan
                    acara.
                  </p>
                </Reveal>
                <Reveal delay={150}>
                  <div className="mt-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-7">
                    <ButtonLink href={site.partnerChurch.url} external>
                      Buka everynationkg.com
                      <Icon.arrowUpRight className="h-4 w-4" />
                    </ButtonLink>
                    <ArrowLink href="/layanan">Lihat ruang pelayanan kami</ArrowLink>
                  </div>
                </Reveal>
              </div>
            </div>

            <ol className="border-t border-sand-300/70 lg:col-span-7">
              {bantuan.map((b, i) => (
                <Reveal
                  as="li"
                  key={b.title}
                  delay={i * 90}
                  className="group grid grid-cols-[2.25rem_1fr] gap-x-4 border-b border-sand-300/70 py-7 sm:grid-cols-[3.5rem_1fr] sm:gap-x-6 sm:py-9"
                >
                  <span
                    aria-hidden
                    className="font-display text-2xl font-semibold leading-none text-sand-500 sm:text-3xl"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-ink sm:text-2xl">{b.title}</h3>
                    <p className="mt-2 max-w-md leading-relaxed text-sand-700">{b.body}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* Ibadah Minggu dan ajakan bermitra */}
      <section className="bg-paper py-16 sm:py-20">
        <Container size="wide">
          <div className="grid gap-5 lg:grid-cols-2">
            <Reveal>
              <a
                href={site.partnerChurch.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-maroon-deep group relative isolate flex h-full flex-col justify-between overflow-hidden rounded-[1.75rem] p-7 text-sand-50 shadow-deep sm:p-9"
              >
                <div aria-hidden className="bg-grain pointer-events-none absolute inset-0 -z-10 opacity-[0.08]" />
                <p className="font-display text-lg italic text-gold-400">Cari gereja untuk ibadah Minggu?</p>
                <div className="mt-8">
                  <p className="font-display text-2xl font-semibold leading-snug sm:text-3xl">
                    Jadwal ibadah {site.partnerChurch.name} ada di situsnya.
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold-400">
                    everynationkg.com
                    <Icon.arrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </a>
            </Reveal>

            <Reveal delay={120}>
              <div className="flex h-full flex-col justify-between rounded-[1.75rem] border border-sand-300/70 bg-cream p-7 sm:p-9">
                <p className="font-display text-lg italic text-maroon-600">Ingin ikut bermitra?</p>
                <div className="mt-8">
                  <p className="font-display text-2xl font-semibold leading-snug text-ink sm:text-3xl">
                    Gereja, komunitas, atau siapa pun yang mau menolong bareng, kabari kami.
                  </p>
                  <div className="mt-6">
                    <ButtonLink
                      href={waLink("Halo, saya ingin bermitra dengan Janji Pengharapan.")}
                      external
                      variant="outline"
                    >
                      {site.whatsapp && <Icon.whatsapp className="h-4 w-4" />}
                      Ngobrol lewat WhatsApp
                    </ButtonLink>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
