import Image from "next/image";
import type { ReactNode } from "react";

import { Icon } from "@/components/icons";
import { Parallax, ParallaxImage } from "@/components/parallax";
import { Reveal } from "@/components/reveal";
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
  description = "Setiap pelayanan kami ada di salah satu dari empat ruang ini. Semuanya gratis dan terbuka, termasuk untuk kamu yang belum pernah ke gereja.",
  className = "bg-cream",
}: {
  title?: ReactNode;
  description?: string;
  className?: string;
}) {
  return (
    <section id="ruang" className={cn("relative overflow-hidden pb-16 pt-24 sm:pb-24 sm:pt-32 lg:pt-40", className)}>
      <Container size="wide">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <Reveal className="lg:col-span-7">
            <h2 className="text-display text-ink">{title}</h2>
          </Reveal>
          <Reveal delay={100} className="lg:col-span-5">
            <p className="text-lead text-sand-700">{description}</p>
          </Reveal>
        </div>

        {/* Di HP bisa digeser; di layar lebar kolomnya berundak */}
        <div className="-mx-5 mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-6 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 lg:mt-20 lg:grid-cols-4 lg:pb-16">
          {allRuang.map((r, i) => (
            <Reveal
              key={r.slug}
              delay={i * 100}
              className={cn("w-[70vw] shrink-0 snap-start sm:w-auto", i % 2 === 1 && "lg:translate-y-16")}
            >
              <a href={`#${r.slug}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden rounded-b-2xl rounded-t-[20rem] bg-sand-200">
                  <Image
                    src={r.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 70vw"
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
                <h3 className="font-display mt-6 text-4xl font-semibold leading-none text-ink transition-colors duration-300 group-hover:text-maroon-700">
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
      className={cn("relative isolate overflow-hidden pb-24 pt-16 sm:pb-32 sm:pt-20 lg:pb-40", t.section)}
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
        <div className="grid items-center gap-14 pt-24 sm:pt-32 lg:grid-cols-12 lg:gap-12 lg:pt-40">
          {/* Foto berbentuk lengkung pintu */}
          <div className={cn("relative lg:col-span-5", flip && "lg:order-2 lg:col-start-8")}>
            <Reveal variant="curtain" duration={1200}>
              <ParallaxImage
                src={r.image}
                alt={r.imageAlt}
                sizes="(min-width: 1024px) 40vw, 100vw"
                strength={7}
                className={cn("aspect-[4/5] rounded-b-[2rem] rounded-t-[24rem]", t.placeholder)}
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
                  "font-display text-[clamp(3rem,1.5rem+5vw,5.25rem)] font-semibold leading-[0.9] tracking-[-0.04em]",
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
              <p className={cn("text-lead mt-7 max-w-xl", t.body)}>{r.summary}</p>
            </Reveal>
            <Reveal delay={120}>
              <p className={cn("font-display mt-5 max-w-xl text-lg italic leading-snug", t.accent)}>
                {r.forWho}
              </p>
            </Reveal>

            <ol className={cn("mt-10 border-t", t.rule)}>
              {r.programs.map((p, i) => (
                <Reveal as="li" key={p.title} delay={150 + i * 80} className={cn("border-b py-6", t.rule)}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <h3 className={cn("font-display text-2xl font-semibold", t.title)}>{p.title}</h3>
                    <p className={cn("text-sm font-semibold tabular-nums", t.accent)}>{p.when}</p>
                  </div>
                  <p className={cn("mt-2 max-w-xl leading-relaxed", t.body)}>{p.summary}</p>
                  <p className={cn("mt-2 text-xs font-medium", t.muted)}>{p.format}</p>
                </Reveal>
              ))}
            </ol>

            <Reveal delay={200}>
              <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
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
  title = "Semua ruang dalam satu tampilan",
  description = "Ringkasan program di setiap ruang, lengkap dengan jadwal rutinnya setiap minggu.",
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
      <Container size="wide">
        <Reveal>
          <h2 className="text-headline max-w-3xl text-ink">{title}</h2>
          <p className="text-lead mt-4 max-w-2xl text-sand-700">{description}</p>
        </Reveal>

        {/* Ruang dan programnya */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {allRuang.map((r, i) => {
            const t = tones[r.tone];
            return (
              <Reveal key={r.slug} delay={i * 80}>
                <a
                  href={`${linkPrefix}#${r.slug}`}
                  className={cn(
                    "group flex h-full flex-col rounded-[1.75rem] p-6 transition duration-500 hover:-translate-y-1 hover:shadow-warm-lg sm:p-7",
                    t.card,
                  )}
                >
                  <h3 className="font-display text-3xl font-semibold leading-none">
                    <RuangName name={r.name} prefixClassName={cn("mb-1.5 text-base", t.accent)} />
                  </h3>
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
        <Reveal className="mt-20 lg:mt-24">
          <h3 className="text-title text-ink">Jadwal rutin setiap minggu</h3>
        </Reveal>
        <ol className="mt-8 grid grid-cols-7 gap-1.5 sm:gap-3" aria-label="Kalender mingguan">
          {weekDays.map((day, i) => {
            const items = weekly.filter((w) => w.weekly.day === i);
            const label = (
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] sm:text-xs">
                <span className="sm:hidden">{day.slice(0, 3)}</span>
                <span className="hidden sm:inline">{day}</span>
              </span>
            );
            return (
              <Reveal as="li" key={day} delay={i * 50} className="min-w-0">
                {items.length ? (
                  <a
                    href={`${linkPrefix}#${items[0].ruang.slug}`}
                    className="flex h-full min-h-28 flex-col justify-between rounded-xl bg-maroon-700 p-2 text-sand-50 transition-colors duration-300 hover:bg-maroon-800 sm:min-h-44 sm:rounded-2xl sm:p-4"
                  >
                    <span className="text-sand-200/80">{label}</span>
                    <span>
                      {items.map((it) => (
                        <span key={it.title} className="block">
                          <span className="font-display hidden text-base leading-tight sm:block lg:text-lg">
                            {it.title}
                          </span>
                          <span className="mt-1 block text-[10px] font-semibold tabular-nums text-gold-400 sm:text-sm">
                            {it.weekly.time}
                          </span>
                        </span>
                      ))}
                    </span>
                  </a>
                ) : (
                  <div className="flex h-full min-h-28 flex-col rounded-xl border border-dashed border-sand-300 p-2 text-sand-500 sm:min-h-44 sm:rounded-2xl sm:p-4">
                    {label}
                  </div>
                )}
              </Reveal>
            );
          })}
        </ol>

        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <ol className="border-t border-sand-300/70 lg:col-span-7">
            {weekly.map((w, i) => (
              <Reveal as="li" key={w.title} delay={i * 70} className="border-b border-sand-300/70">
                <a
                  href={`${linkPrefix}#${w.ruang.slug}`}
                  className="group grid grid-cols-[4.5rem_1fr] gap-x-4 gap-y-2 py-5 sm:grid-cols-[6.5rem_1fr_auto] sm:items-baseline sm:gap-x-6"
                >
                  <span className="font-display text-lg italic text-maroon-700">{weekDays[w.weekly.day]}</span>
                  <span className="min-w-0">
                    <span className="font-display block text-xl font-semibold text-ink transition-colors duration-300 group-hover:text-maroon-700">
                      {w.title}
                    </span>
                    <span className="mt-1 block text-sm text-sand-600">
                      Ruang {w.ruang.name} · {w.format}
                    </span>
                  </span>
                  <span className="col-start-2 text-sm font-semibold tabular-nums text-sand-800 sm:col-start-auto sm:text-base">
                    {w.weekly.time} WIB
                  </span>
                </a>
              </Reveal>
            ))}
          </ol>

          <Reveal variant="right" className="lg:col-span-5">
            <div className="h-full rounded-[1.75rem] bg-sand-100 p-7 sm:p-9">
              <Icon.clock className="h-8 w-8 text-maroon-600" />
              <h3 className="font-display mt-6 text-2xl font-semibold leading-snug text-ink sm:text-3xl">
                Butuh bicara di luar jadwal ini?
              </h3>
              <p className="mt-3 leading-relaxed text-sand-700">
                Formulir pertolongan bisa diisi kapan saja, dan WhatsApp kami dibalas setiap hari.
                Kalau keadaannya darurat, tulis di awal pesan supaya kami dahulukan.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <ButtonLink href="/pertolongan">Isi formulir</ButtonLink>
                <ArrowLink href={waLink()}>Chat WhatsApp</ArrowLink>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Jembatan ke gereja lokal */}
        <Reveal className="mt-16 lg:mt-20">
          <a
            href={site.church.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-maroon-deep group relative isolate flex flex-col gap-8 overflow-hidden rounded-[2rem] p-8 text-sand-50 sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:p-14"
          >
            <div aria-hidden className="bg-grain pointer-events-none absolute inset-0 -z-10 opacity-[0.08]" />
            <div className="max-w-2xl">
              <p className="font-display text-lg italic text-gold-400">Mencari gereja untuk ibadah Minggu?</p>
              <p className="font-display mt-3 text-2xl font-semibold leading-snug sm:text-3xl">
                Kami berjemaat di {site.church.name}. Jadwal ibadah dan komselnya ada di situs gereja.
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
