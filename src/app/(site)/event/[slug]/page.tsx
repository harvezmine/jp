import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/reveal";
import { RichText } from "@/components/rich-text";
import { ShareButtons } from "@/components/share-buttons";
import { EventCard } from "@/components/content-cards";
import { Icon } from "@/components/icons";
import { ArrowLink, ButtonLink, Container, Rise } from "@/components/ui";
import { mockPhoto } from "@/lib/mock";
import { getEventBySlug, getEventSlugs, getEvents } from "@/lib/queries";
import { dateParts, formatDate, formatTime } from "@/lib/utils";
import { site, waLink } from "@/lib/site";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getEventSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Event tidak ditemukan" };

  return {
    title: event.title,
    description: event.description?.slice(0, 160) ?? undefined,
    alternates: { canonical: `/event/${event.slug}` },
    openGraph: {
      type: "article",
      title: event.title,
      description: event.description?.slice(0, 160) ?? undefined,
      images: event.cover_url ? [{ url: event.cover_url }] : undefined,
    },
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const isPast = new Date(event.starts_at).getTime() < Date.now();
  const d = dateParts(event.starts_at);
  const cover = event.cover_url ?? mockPhoto(event.slug, "event");

  const others = (await getEvents({ upcoming: true, limit: 3 })).filter(
    (e) => e.slug !== event.slug,
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description ?? undefined,
    startDate: event.starts_at,
    endDate: event.ends_at ?? undefined,
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: event.location ?? site.name,
      address: event.address ?? site.address.line1,
    },
    organizer: { "@type": "Organization", name: site.name, url: site.url },
  };

  const facts = [
    {
      icon: Icon.calendar,
      label: isPast ? "Sudah berlangsung" : "Tanggal",
      value: `${d.weekday}, ${formatDate(event.starts_at)}`,
    },
    {
      icon: Icon.clock,
      label: "Waktu",
      value: `${formatTime(event.starts_at)}${event.ends_at ? ` sampai ${formatTime(event.ends_at)}` : ""}`,
    },
    { icon: Icon.pin, label: "Lokasi", value: event.location ?? "Akan diinformasikan" },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="bg-maroon-deep relative isolate overflow-hidden pb-24 pt-32 sm:pb-28 sm:pt-44">
        <div
          aria-hidden
          className="animate-breathe pointer-events-none absolute -left-20 -top-24 h-80 w-80 rounded-full bg-maroon-500/25 blur-[90px]"
        />
        <div aria-hidden className="bg-grain pointer-events-none absolute inset-0 opacity-[0.1]" />
        <Container size="narrow" className="relative">
          <Link
            href="/event"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-sand-300/70 transition-colors hover:text-gold-400"
          >
            <Icon.arrowLeft className="h-4 w-4" />
            Semua acara
          </Link>

          <Rise delay={60}>
            <h1 className="text-headline mt-8 text-sand-50">{event.title}</h1>
          </Rise>

          <Rise delay={140}>
            <dl className="mt-9 grid gap-3 sm:grid-cols-3">
              {facts.map((f) => (
                <div key={f.label} className="rounded-2xl border border-sand-50/12 bg-sand-50/[0.06] p-4">
                  <dt className="flex items-center gap-2 text-xs font-medium text-gold-400">
                    <f.icon className="h-3.5 w-3.5" />
                    {f.label}
                  </dt>
                  <dd className="mt-2 text-sm font-medium capitalize text-sand-100">{f.value}</dd>
                </div>
              ))}
            </dl>
          </Rise>
        </Container>
      </section>

      <section className="bg-cream pb-24 sm:pb-32">
        <Container size="narrow">
          {cover && (
            <Reveal variant="scale">
              <div className="relative -mt-14 aspect-[16/9] overflow-hidden rounded-[1.75rem] shadow-warm-lg sm:-mt-16">
                <Image
                  src={cover}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover"
                />
              </div>
            </Reveal>
          )}

          <div className={cover ? "mt-12 sm:mt-14" : "pt-14 sm:pt-16"}>
            {event.description ? (
              <RichText content={event.description} />
            ) : (
              <p className="text-sand-600">Detail acara akan segera diperbarui.</p>
            )}
          </div>

          {event.address && (
            <div className="mt-10 flex flex-col gap-4 rounded-2xl bg-sand-100 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-3">
                <Icon.pin className="mt-0.5 h-5 w-5 shrink-0 text-maroon-600" />
                <div>
                  <p className="font-semibold text-ink">{event.location}</p>
                  <p className="mt-0.5 text-sm text-sand-700">{event.address}</p>
                </div>
              </div>
              <ButtonLink
                href={event.map_url ?? site.address.mapUrl}
                external
                variant="outline"
                className="shrink-0"
              >
                Buka peta
                <Icon.arrowUpRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          )}

          {!isPast && (
            <div className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
              {event.register_url ? (
                <ButtonLink href={event.register_url} external size="lg">
                  Daftar sekarang
                  <Icon.arrowUpRight className="h-4 w-4" />
                </ButtonLink>
              ) : (
                <ButtonLink
                  href={waLink(`Halo, saya mau ikut ${event.title}.`)}
                  external
                  size="lg"
                >
                  <Icon.whatsapp className="h-5 w-5" />
                  Konfirmasi kehadiran
                </ButtonLink>
              )}
              <ArrowLink href="/kontak">Tanya lebih lanjut</ArrowLink>
            </div>
          )}

          <div className="mt-14 border-t border-sand-200 pt-8">
            <p className="mb-4 text-sm font-semibold text-ink">Ajak teman untuk datang bersama.</p>
            <ShareButtons title={event.title} path={`/event/${event.slug}`} />
          </div>
        </Container>
      </section>

      {others.length > 0 && (
        <section className="bg-paper py-24 sm:py-28">
          <Container size="wide">
            <h2 className="text-headline text-ink">Acara lainnya</h2>
            <div className="mt-12 grid gap-4 lg:grid-cols-2">
              {others.map((e, i) => (
                <Reveal key={e.id} delay={i * 80}>
                  <EventCard event={e} />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
