import type { Metadata } from "next";

import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { EventCard } from "@/components/content-cards";
import { RuangSummary } from "@/components/ruang";
import { ArrowLink, ButtonLink, Container, EmptyState } from "@/components/ui";
import { Icon } from "@/components/icons";
import { getEvents } from "@/lib/queries";
import { photos } from "@/lib/photos";
import { waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Event",
  description: "Live event, malam doa, dan kelas dari Janji Pengharapan. Terbuka untuk siapa saja.",
};

export const revalidate = 300;

export default async function EventPage() {
  const all = await getEvents();
  const now = Date.now();

  const upcoming = all
    .filter((e) => new Date(e.starts_at).getTime() >= now)
    .sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime());

  const past = all
    .filter((e) => new Date(e.starts_at).getTime() < now)
    .sort((a, b) => new Date(b.starts_at).getTime() - new Date(a.starts_at).getTime())
    .slice(0, 6);

  return (
    <>
      <PageHero
        image={photos.heroEvents}
        imageAlt="Banyak orang berkumpul di bawah lampu gantung"
        title="Acara untuk ketemu langsung."
        description="Live event, malam doa, dan kelas. Datang sendiri juga boleh."
      />

      <section className="bg-cream pb-20 pt-14 sm:pb-28 sm:pt-20">
        <Container size="wide">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-4">
              <h2 className="text-headline text-ink">Yang akan datang</h2>
              <p className="text-lead mt-4 max-w-xs text-sand-700">Klik acara untuk lihat detail dan cara daftar.</p>
            </Reveal>

            <div className="lg:col-span-8">
              {upcoming.length ? (
                <div className="space-y-4">
                  {upcoming.map((e, i) => (
                    <Reveal key={e.id} delay={Math.min(i, 4) * 80} variant="right">
                      <EventCard event={e} />
                    </Reveal>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="Belum ada acara terjadwal"
                  description="Podcast, doa online, dan kelas rutin tetap jalan setiap minggu."
                  action={
                    <ButtonLink href="/kontak" variant="outline">
                      Tanya acara terdekat
                    </ButtonLink>
                  }
                />
              )}
            </div>
          </div>
        </Container>
      </section>

      <RuangSummary
        linkPrefix="/"
        className="bg-paper"
        title="Setiap minggu juga ada ini"
        description="Tidak perlu menunggu acara khusus. Program rutin ini jalan terus."
      />

      {past.length > 0 && (
        <section className="bg-cream py-20 sm:py-28">
          <Container size="wide">
            <Reveal>
              <h2 className="text-headline text-ink">Yang sudah berlangsung</h2>
            </Reveal>
            <div className="mt-10 grid gap-4 sm:mt-12 lg:grid-cols-2">
              {past.map((e, i) => (
                <Reveal key={e.id} delay={(i % 2) * 80}>
                  <EventCard event={e} past />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="bg-maroon-deep relative isolate overflow-hidden py-20 text-sand-50 sm:py-28">
        <div aria-hidden className="bg-grain pointer-events-none absolute inset-0 -z-10 opacity-[0.08]" />
        <div
          aria-hidden
          className="animate-breathe pointer-events-none absolute -right-20 -top-20 -z-10 h-80 w-80 rounded-full bg-gold-400/15 blur-[100px]"
        />
        <Container size="wide">
          <Reveal className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
            <div className="lg:col-span-7">
              <h2 className="text-display">Mau datang tapi masih ragu?</h2>
              <p className="text-lead mt-4 max-w-md text-sand-200/80 sm:mt-5">
                Chat kami dulu. Nanti kami sambut waktu kamu datang.
              </p>
            </div>
            <div className="flex flex-col items-start gap-5 lg:col-span-5 lg:items-end">
              <ButtonLink href={waLink("Halo, saya mau tanya soal acara JP.")} external variant="light" size="lg">
                <Icon.whatsapp className="h-5 w-5" />
                Chat tim kami
              </ButtonLink>
              <ArrowLink href="/kontak" tone="light">
                Halaman kontak
              </ArrowLink>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
