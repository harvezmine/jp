import { Icon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { ButtonLink, Container } from "@/components/ui";
import { procon, proconEvents, proconWaLink, type ProconEvent } from "@/lib/procon";
import { cn } from "@/lib/utils";

function formatIsoDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${date}T00:00:00Z`),
  );
}

/** Tombol kartu: detail di situs, link pendaftaran, atau WhatsApp bila belum ada keduanya. */
function cardAction(event: ProconEvent) {
  if (!event.href) return { href: proconWaLink(event.title), label: "Kabari saya", external: true };
  const internal = event.href.startsWith("/");
  return { href: event.href, label: internal ? "Lihat detail" : "Daftar", external: !internal };
}

/** Huruf besar samar di kartu utama: "AI" untuk event AI, selain itu huruf awal topiknya. */
function watermark(event: ProconEvent) {
  return /\bAI\b/.test(event.title) ? "AI" : event.topic.charAt(0).toUpperCase();
}

export function ProconSection({ events = proconEvents, className }: { events?: ProconEvent[]; className?: string }) {
  const shown = events.slice(0, 5);
  // Kartu utama setinggi dua baris hanya bila sisa kartunya genap, supaya kisi tetap rapi.
  const spanFeatured = shown.length % 2 === 1 && shown.length > 1;

  return (
    <section
      id="procon"
      className={cn(
        "relative isolate scroll-mt-20 overflow-hidden bg-sand-950 py-20 text-sand-50 sm:py-28 lg:py-36",
        className,
      )}
    >
      <div aria-hidden className="bg-grain pointer-events-none absolute inset-0 -z-10 opacity-[0.07]" />
      <div
        aria-hidden
        className="animate-breathe pointer-events-none absolute -right-40 -top-40 -z-10 h-[32rem] w-[32rem] rounded-full bg-gold-400/10 blur-[120px]"
      />

      <Container size="wide">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <Reveal className="lg:col-span-7">
            <h2 className="text-display">
              ProCon, <span className="italic text-gold-400">iman dalam keseharian.</span>
            </h2>
          </Reveal>
          <Reveal delay={100} className="lg:col-span-5">
            <p className="text-lead text-sand-300/80">{procon.intro}</p>
            <p className="mt-5 text-sm font-semibold text-gold-400">
              {procon.when} <span className="font-normal text-sand-400">· {procon.format}</span>
            </p>
          </Reveal>
        </div>

        <ul className="mt-12 grid gap-5 sm:mt-14 lg:grid-cols-2">
          {shown.map((event, index) => {
            const featured = index === 0;
            const action = cardAction(event);
            return (
              <Reveal
                as="li"
                key={event.id}
                delay={index * 90}
                className={cn(featured && spanFeatured && "lg:row-span-2")}
              >
                <article
                  className={cn(
                    "group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] p-7 transition duration-300 sm:p-9",
                    featured
                      ? "min-h-[22rem] bg-gold-400 text-maroon-950 shadow-deep"
                      : "bg-sand-50/[0.04] ring-1 ring-sand-50/10 hover:bg-sand-50/[0.07]",
                  )}
                >
                  {featured && (
                    <span
                      aria-hidden
                      className="font-display pointer-events-none absolute -right-4 top-16 select-none text-[16rem] font-semibold italic leading-none tracking-tighter text-maroon-950/10 sm:text-[20rem]"
                    >
                      {watermark(event)}
                    </span>
                  )}
                  <div className="relative flex flex-wrap items-center justify-between gap-3 text-sm">
                    <span className={cn("font-display text-lg italic", featured ? "text-maroon-900" : "text-gold-400")}>
                      {event.topic}
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5",
                        featured ? "text-maroon-950/70" : "text-sand-300/70",
                      )}
                    >
                      <Icon.calendar className="h-4 w-4" />
                      {event.date ? formatIsoDate(event.date) : "Segera hadir"}
                    </span>
                  </div>

                  <div className="relative mt-auto pt-10 sm:pt-14">
                    <h3
                      className={cn(
                        "font-display text-balance font-semibold leading-tight tracking-tight",
                        featured ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl",
                      )}
                    >
                      {event.title}
                    </h3>
                    {event.partner && (
                      <p className={cn("mt-2 font-semibold", featured ? "text-maroon-900" : "text-gold-400")}>
                        {event.partner}
                      </p>
                    )}
                    <p
                      className={cn(
                        "mt-3 max-w-md leading-relaxed",
                        featured ? "text-maroon-950/75" : "text-sand-300/75",
                      )}
                    >
                      {event.summary}
                    </p>
                    <a
                      href={action.href}
                      {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className={cn(
                        "mt-6 inline-flex items-center gap-2 text-sm font-semibold",
                        featured ? "text-maroon-950" : "text-sand-50",
                      )}
                    >
                      <span className="link-sweep pb-0.5">{action.label}</span>
                      <Icon.arrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ul>

        <Reveal className="mt-8 flex flex-col gap-5 rounded-[1.75rem] bg-sand-50/[0.04] p-6 ring-1 ring-sand-50/10 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <p className="max-w-xl text-sand-300/80">
            Jadwal ProCon diumumkan tiap bulan. Tanya jadwal terdekat lewat WhatsApp.
          </p>
          <ButtonLink href={proconWaLink()} external variant="light" className="shrink-0 self-start sm:self-auto">
            <Icon.whatsapp className="h-4 w-4" />
            Tanya jadwal ProCon
          </ButtonLink>
        </Reveal>
      </Container>
    </section>
  );
}
