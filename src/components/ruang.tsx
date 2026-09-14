import Image from "next/image";
import type { ReactNode } from "react";

import { Icon } from "@/components/icons";
import { Parallax, ParallaxImage } from "@/components/parallax";
import { Reveal } from "@/components/reveal";
import { TodayMarker } from "@/components/today-marker";
import { ArrowLink, ButtonLink, Container } from "@/components/ui";
import { ruang as allRuang, weekDays, weeklyPrograms, type Ruang } from "@/lib/ruang";
import { site, waLink } from "@/lib/site";
import { cn } from "@/lib/utils";

const isExternal = (href: string) => /^https?:\/\//.test(href);

const tones = {
  cream: {
    section: "bg-cream",
    giant: "text-maroon-100",
    title: "text-ink",
    body: "text-sand-700",
    muted: "text-sand-600",
    accent: "text-maroon-700",
    rule: "border-sand-300/70",
    frame: "border-cream",
    placeholder: "bg-sand-200",
    card: "bg-sand-100 text-ink",
    cardRule: "border-sand-300/80",
    button: "primary",
    link: "maroon",
    dark: false,
  },
  paper: {
    section: "bg-paper",
    giant: "text-sand-300/70",
    title: "text-ink",
    body: "text-sand-700",
    muted: "text-sand-600",
    accent: "text-maroon-700",
    rule: "border-sand-300/70",
    frame: "border-sand-100",
    placeholder: "bg-sand-300/60",
    card: "bg-clay-500/10 text-ink",
    cardRule: "border-sand-300/80",
    button: "primary",
    link: "maroon",
    dark: false,
  },
  night: {
    section: "bg-maroon-night",
    giant: "text-maroon-900/80",
    title: "text-sand-50",
    body: "text-sand-200/80",
    muted: "text-sand-300/60",
    accent: "text-gold-400",
    rule: "border-sand-50/12",
    frame: "border-maroon-950",
    placeholder: "bg-maroon-900",
    card: "bg-maroon-900 text-sand-50",
    cardRule: "border-sand-50/15",
    button: "light",
    link: "light",
    dark: true,
  },
  ink: {
    section: "bg-sand-950",
    giant: "text-sand-900",
    title: "text-sand-50",
    body: "text-sand-300/80",
    muted: "text-sand-400",
    accent: "text-gold-400",
    rule: "border-sand-50/10",
    frame: "border-sand-950",
    placeholder: "bg-sand-900",
    card: "bg-sand-950 text-sand-50",
    cardRule: "border-sand-50/15",
    button: "light",
    link: "light",
    dark: true,
  },
} as const;

/**
 * Nama ruang: kata "Ruang" kecil bergaya miring di atas nama yang besar.
 * Spasi di antaranya tetap ada supaya pembaca layar membaca "Ruang Doa".
 */
export function RuangName({
  name,
  className,
  prefixClassName,
}: {
  name: string;
  className?: string;
  prefixClassName?: string;
}) {
  return (
    <span className={cn("block", className)}>
      <span className={cn("block font-normal italic", prefixClassName)}>Ruang</span>{" "}
      <span className="block">{name}</span>
    </span>
  );
}

/* ── Pembuka: empat pintu ─────────────────────────────────────────────────── */

export function RuangIntro({
  title = (
    <>
      Pilih <span className="italic text-maroon-700">ruang</span> yang kamu butuhkan.
    </>
  ),
  description = "Ingin didoakan, punya teman cerita, atau menemukan penguatan? Mulai dari yang terasa nyaman untukmu.",
  linkPrefix = "",
  className = "bg-cream",
}: {
  title?: ReactNode;
  description?: string;
  className?: string;
  linkPrefix?: string;
}) {
  return (
    <section id="ruang" className={cn("relative overflow-hidden pb-16 pt-20 sm:pb-24 sm:pt-28 lg:pt-36", className)}>
      <Container size="wide">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
          <Reveal className="lg:col-span-7">
            <h2 className="text-display text-ink">{title}</h2>
          </Reveal>
          <Reveal delay={100} className="lg:col-span-5">
            <p className="text-lead max-w-md text-sand-700">{description}</p>
          </Reveal>
        </div>

        {/* Di HP bisa digeser; di layar lebar kolomnya berundak */}
        <div className="-mx-5 mt-12 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-6 [scrollbar-width:none] sm:mx-0 sm:scroll-px-0 sm:mt-14 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 lg:mt-20 lg:grid-cols-4 lg:pb-16">
          {allRuang.map((r, i) => (
            <Reveal
              key={r.slug}
              delay={i * 100}
              className={cn(
                "w-[68vw] max-w-72 shrink-0 snap-start sm:w-auto sm:max-w-none",
                i % 2 === 1 && "lg:translate-y-16",
              )}
            >
              <a id={linkPrefix ? r.slug : undefined} href={`${linkPrefix}#${r.slug}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden rounded-b-2xl rounded-t-[20rem] bg-sand-200 shadow-warm transition-shadow duration-500 group-hover:shadow-warm-lg">
                  <Image
                    src={r.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 68vw"
                    className="object-cover transition duration-[1400ms] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/75 via-maroon-950/10 to-transparent" />
                  <span className="font-display absolute bottom-5 left-5 text-sm italic text-sand-100/90">
                    0{i + 1}
                  </span>
                  <span className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-cream text-maroon-700 transition-transform duration-300 group-hover:-rotate-45">
                    <Icon.arrowRight className="h-4 w-4" />
                  </span>
                </div>
                <h3 className="font-display mt-6 text-3xl font-semibold leading-none text-ink transition-colors duration-300 group-hover:text-maroon-700 sm:text-4xl">
                  <RuangName name={r.name} prefixClassName="mb-1.5 text-lg text-maroon-600" />
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-sand-700">{r.tagline}</p>
              </a>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ── Satu section per ruang ───────────────────────────────────────────────── */

export function RuangSection({ ruang: r, index }: { ruang: Ruang; index: number }) {
  const t = tones[r.tone];
  const flip = index % 2 === 1;
  const headingId = `${r.slug}-judul`;

  return (
    <section
      id={r.slug}
      aria-labelledby={headingId}
      className={cn("relative isolate overflow-hidden pb-20 pt-12 sm:pb-28 sm:pt-20 lg:pb-40", t.section)}
    >
      {t.dark && (
        <div aria-hidden className="bg-grain pointer-events-none absolute inset-0 -z-10 opacity-[0.07]" />
      )}

      {/* Nama ruang raksasa di latar, bergeser pelan saat digulir */}
      <Parallax
        translateX={flip ? [5, -5] : [-5, 5]}
        className={cn(
          "pointer-events-none absolute inset-x-0 top-4 -z-10 sm:top-6",
          flip ? "text-right" : "text-left",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "text-giant font-display block select-none whitespace-nowrap px-4 font-semibold italic",
            t.giant,
          )}
        >
          {r.name}
        </span>
      </Parallax>

      <Container size="wide" className="relative">
        <div className="grid items-center gap-12 pt-20 sm:gap-14 sm:pt-32 lg:grid-cols-12 lg:gap-12 lg:pt-40">
          {/* Foto berbentuk lengkung pintu */}
          <div
            className={cn(
              "relative mx-auto w-full max-w-md sm:max-w-lg lg:col-span-5 lg:max-w-none",
              flip && "lg:order-2 lg:col-start-8",
            )}
          >
            {/* Bingkai tipis di belakang foto, bergerak dengan kecepatan berbeda */}
            <Parallax
              speed={-3}
              className={cn(
                "absolute inset-0 hidden translate-y-5 rounded-b-[2rem] rounded-t-[24rem] border sm:block",
                flip ? "-translate-x-5" : "translate-x-5",
                t.dark ? "border-sand-50/15" : "border-maroon-200",
              )}
            />
            <Reveal variant="curtain" duration={1200} className="relative">
              <ParallaxImage
                src={r.image}
                alt={r.imageAlt}
                sizes="(min-width: 1024px) 40vw, (min-width: 640px) 512px, 100vw"
                strength={7}
                className={cn("aspect-[4/5] rounded-b-[2rem] rounded-t-[24rem] shadow-deep", t.placeholder)}
              />
            </Reveal>

            <Parallax
              speed={6}
              className={cn(
                "absolute -bottom-10 hidden w-44 lg:block xl:w-52",
                flip ? "-left-14" : "-right-14",
              )}
            >
              <Reveal variant="zoom" delay={300}>
                <div
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-full border-[6px] shadow-deep",
                    t.frame,
                    t.placeholder,
                  )}
                >
                  <Image src={r.detailImage} alt="" fill sizes="208px" className="object-cover" />
                </div>
              </Reveal>
            </Parallax>
          </div>

          {/* Isi */}
          <div className={cn("lg:col-span-6", flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-7")}>
            <Reveal>
              <h2
                id={headingId}
                className={cn(
                  "font-display text-[clamp(2.75rem,1.4rem+5vw,5.25rem)] font-semibold leading-[0.9] tracking-[-0.04em]",
                  t.title,
                )}
              >
                <RuangName
                  name={r.name}
                  prefixClassName={cn("mb-3 text-[0.36em] tracking-normal", t.accent)}
                />
              </h2>
            </Reveal>
            <Reveal delay={80}>
              <p className={cn("text-lead mt-6 max-w-lg sm:mt-7", t.body)}>{r.summary}</p>
            </Reveal>
            <Reveal delay={120}>
              <p className={cn("font-display mt-4 max-w-lg text-lg italic leading-snug", t.accent)}>
                {r.forWho}
              </p>
            </Reveal>

            <ol className={cn("mt-9 border-t sm:mt-10", t.rule)}>
              {r.programs.map((p, i) => (
                <Reveal
                  as="li"
                  key={p.title}
                  delay={150 + i * 80}
                  className={cn("group/program border-b py-5 sm:py-6", t.rule)}
                >
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                    <h3 className={cn("font-display text-xl font-semibold sm:text-2xl", t.title)}>{p.title}</h3>
                    <p className={cn("shrink-0 text-sm font-semibold tabular-nums", t.accent)}>{p.when}</p>
                  </div>
                  <p className={cn("mt-2 max-w-xl leading-relaxed", t.body)}>{p.summary}</p>
                  <p className={cn("mt-2 text-xs font-medium", t.muted)}>{p.format}</p>
                </Reveal>
              ))}
            </ol>

            <Reveal delay={200}>
              <div className="mt-9 flex flex-col items-start gap-5 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-7">
                <ButtonLink
                  href={r.cta.href}
                  external={isExternal(r.cta.href)}
                  variant={t.button}
                  size="lg"
                >
                  {r.cta.label}
                  {isExternal(r.cta.href) ? (
                    <Icon.arrowUpRight className="h-4 w-4" />
                  ) : (
                    <Icon.arrowRight className="h-4 w-4" />
                  )}
                </ButtonLink>
                <ArrowLink href={r.secondary.href} tone={t.link}>
                  {r.secondary.label}
                </ArrowLink>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function RuangSections() {
  return (
    <>
      {allRuang.map((r, i) => (
        <RuangSection key={r.slug} ruang={r} index={i} />
      ))}
    </>
  );
}

/* ── Rangkuman di akhir rangkaian ─────────────────────────────────────────── */

export function RuangSummary({
  title = "Sekilas tentang empat ruang",
  description = "Program dan jadwal rutin di setiap ruang.",
  className = "bg-cream",
  linkPrefix = "",
}: {
  title?: string;
  description?: string;
  className?: string;
  /** Isi "/" bila dipakai di luar halaman yang memuat section ruang. */
  linkPrefix?: string;
}) {
  const weekly = weeklyPrograms();

  return (
    <section id="ringkasan-ruang" className={cn("relative overflow-hidden py-20 sm:py-28 lg:py-32", className)}>
      <TodayMarker />
      <Container size="wide">
        <Reveal>
          <h2 className="text-headline max-w-3xl text-ink">{title}</h2>
          <p className="text-lead mt-4 max-w-xl text-sand-700">{description}</p>
        </Reveal>

        {/* Ruang dan programnya */}
        <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {allRuang.map((r, i) => {
            const t = tones[r.tone];
            return (
              <Reveal key={r.slug} delay={i * 80}>
                <a
                  href={`${linkPrefix}#${r.slug}`}
                  className={cn(
                    "group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] p-6 shadow-warm transition duration-500 hover:-translate-y-1 hover:shadow-warm-lg sm:p-7",
                    t.card,
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-3xl font-semibold leading-none">
                      <RuangName name={r.name} prefixClassName={cn("mb-1.5 text-base", t.accent)} />
                    </h3>
                    <span className="relative h-16 w-12 shrink-0 overflow-hidden rounded-b-lg rounded-t-full">
                      <Image
                        src={r.image}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </span>
                  </div>
                  <ul className="mt-7 flex-1 space-y-4">
                    {r.programs.map((p) => (
                      <li key={p.title} className={cn("border-t pt-3", t.cardRule)}>
                        <span className="block text-[15px] font-semibold leading-snug">{p.title}</span>
                        <span className={cn("mt-0.5 block text-sm", t.muted)}>{p.when}</span>
                      </li>
                    ))}
                  </ul>
                  <span className={cn("mt-7 inline-flex items-center gap-2 text-sm font-semibold", t.accent)}>
                    Masuk ke ruang ini
                    <Icon.arrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </a>
              </Reveal>
            );
          })}
        </div>

        {/* Kalender mingguan */}
        <Reveal className="mt-16 sm:mt-20 lg:mt-24">
          <h3 className="text-title text-ink">Jadwal mingguan</h3>
        </Reveal>
        <ol className="mt-6 grid grid-cols-7 gap-1 sm:mt-8 sm:gap-2 lg:gap-3" aria-label="Kalender mingguan">
          {weekDays.map((day, i) => {
            const items = weekly.filter((w) => w.weekly.day === i);
            const label = (
              <span className="flex items-center justify-center gap-2 sm:justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[0.1em] sm:text-xs">
                  <span className="xl:hidden">{day.slice(0, 3)}</span>
                  <span className="hidden xl:inline">{day}</span>
                </span>
                <span
                  data-today-label
                  className="hidden rounded-full bg-gold-400 px-2 py-0.5 text-[10px] font-semibold normal-case tracking-normal text-maroon-950"
                >
                  Hari ini
                </span>
              </span>
            );
            return (
              <Reveal as="li" key={day} delay={i * 50} className="min-w-0">
                {items.length ? (
                  <a
                    href={`${linkPrefix}#${items[0].ruang.slug}`}
                    data-weekday={i}
                    aria-label={`${day}: ${items.map((it) => `${it.title} ${it.weekly.time} WIB`).join(", ")}`}
                    className="flex h-full min-h-20 flex-col justify-between rounded-lg bg-maroon-700 p-1.5 text-sand-50 shadow-warm transition-colors duration-300 hover:bg-maroon-800 sm:min-h-32 sm:rounded-2xl sm:p-3 lg:min-h-44 lg:p-4"
                  >
                    <span className="text-sand-200/80">{label}</span>
                    <span className="block">
                      <span className="mx-auto block h-1.5 w-1.5 rounded-full bg-gold-400 sm:hidden" />
                      {items.map((it) => (
                        <span key={it.title} className="hidden sm:block">
                          <span className="font-display hidden text-base leading-tight [overflow-wrap:anywhere] lg:block xl:text-lg">
                            {it.title}
                          </span>
                          <span className="mt-1 block text-xs font-semibold tabular-nums text-gold-400 lg:text-sm">
                            {it.weekly.time}
                          </span>
                        </span>
                      ))}
                    </span>
                  </a>
                ) : (
                  <div
                    data-weekday={i}
                    className="flex h-full min-h-20 flex-col rounded-lg border border-dashed border-sand-300 p-1.5 text-sand-500 sm:min-h-32 sm:rounded-2xl sm:p-3 lg:min-h-44 lg:p-4"
                  >
                    {label}
                  </div>
                )}
              </Reveal>
            );
          })}
        </ol>

        <div className="mt-10 grid gap-10 sm:mt-12 lg:grid-cols-12 lg:gap-16">
          <ol className="border-t border-sand-300/70 lg:col-span-7">
            {weekly.map((w, i) => (
              <Reveal as="li" key={w.title} delay={i * 70} className="border-b border-sand-300/70">
                <a
                  href={`${linkPrefix}#${w.ruang.slug}`}
                  className="group grid grid-cols-[4rem_1fr] gap-x-4 gap-y-1 py-5 sm:grid-cols-[6.5rem_1fr_auto] sm:items-baseline sm:gap-x-6"
                >
                  <span className="font-display text-lg italic text-maroon-700">{weekDays[w.weekly.day]}</span>
                  <span className="min-w-0">
                    <span className="font-display block text-lg font-semibold leading-snug text-ink transition-colors duration-300 group-hover:text-maroon-700 sm:text-xl">
                      {w.title}
                    </span>
                    <span className="mt-1 block text-sm text-sand-600">Ruang {w.ruang.name}</span>
                  </span>
                  <span className="col-start-2 text-sm font-semibold tabular-nums text-sand-800 sm:col-start-auto sm:text-base">
                    {w.weekly.time} WIB
                  </span>
                </a>
              </Reveal>
            ))}
          </ol>

          <Reveal variant="right" className="lg:col-span-5">
            <div className="relative h-full overflow-hidden rounded-[1.75rem] bg-sand-100 p-7 shadow-warm sm:p-9">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-maroon-200/40 blur-3xl"
              />
              <Icon.clock className="relative h-8 w-8 text-maroon-600" />
              <h3 className="font-display relative mt-6 text-2xl font-semibold leading-snug text-ink sm:text-3xl">
                Tidak bisa di jam-jam itu?
              </h3>
              <p className="relative mt-3 leading-relaxed text-sand-700">
                Kamu bisa menulis saat sudah siap. Jika ingin dihubungi, pilih cara yang paling nyaman. Tim akan membaca dan menindaklanjuti ceritamu.
              </p>
              <div className="relative mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <ButtonLink href="/pertolongan">Mulai bercerita</ButtonLink>
                <ArrowLink href={waLink()}>{site.whatsapp ? "Chat WhatsApp" : "Hubungi tim JP"}</ArrowLink>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Jembatan ke gereja lokal */}
        <Reveal className="mt-14 lg:mt-20">
          <a
            href={site.church.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-maroon-deep group relative isolate flex flex-col gap-7 overflow-hidden rounded-[2rem] p-7 text-sand-50 shadow-deep sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:p-14"
          >
            <div aria-hidden className="bg-grain pointer-events-none absolute inset-0 -z-10 opacity-[0.08]" />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-24 -right-10 -z-10 h-72 w-72 rounded-full bg-gold-400/15 blur-3xl transition-transform duration-700 group-hover:scale-125"
            />
            <div className="max-w-2xl">
              <p className="font-display text-lg italic text-gold-400">Cari gereja untuk ibadah Minggu?</p>
              <p className="font-display mt-3 text-2xl font-semibold leading-snug sm:text-3xl">
                Kami berjemaat di {site.church.name}. Jadwal ibadahnya ada di sini.
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-3 self-start rounded-full bg-sand-50 px-6 py-3.5 text-sm font-semibold text-maroon-800 transition-colors duration-300 group-hover:bg-white lg:self-auto">
              everynationkg.com
              <Icon.arrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </a>
        </Reveal>
      </Container>
    </section>
  );
}
