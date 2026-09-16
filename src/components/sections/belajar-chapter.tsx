import { Icon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { ChapterHeading } from "@/components/ruang";
import { Container } from "@/components/ui";
import { komunitas } from "@/lib/komunitas";
import { procon } from "@/lib/procon";
import { getRuang, ruangHref } from "@/lib/ruang";
import { cn } from "@/lib/utils";

/** Bab Ruang Belajar di beranda: daftar komunitas dan satu kartu ProCon. */
export function BelajarChapter({ className = "bg-paper" }: { className?: string }) {
  const r = getRuang("ruang-belajar");
  const href = ruangHref(r.slug);

  return (
    <section id="bab-belajar" className={cn("relative scroll-mt-20 overflow-hidden py-20 sm:py-28 lg:py-36", className)}>
      <Container size="wide">
        <ChapterHeading ruang={r} />

        <div className="mt-12 grid gap-10 sm:mt-16 lg:grid-cols-12 lg:gap-16">
          <ol className="border-t border-sand-300/70 lg:col-span-7">
            {komunitas.map((k, i) => (
              <Reveal as="li" key={k.slug} delay={i * 80} className="border-b border-sand-300/70">
                <a
                  href={`${href}#komunitas`}
                  className="group grid gap-1 py-5 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-x-6 sm:py-6"
                >
                  <span className="font-display text-xl font-semibold text-ink transition-colors duration-300 group-hover:text-maroon-700 sm:text-2xl">
                    {k.name}
                  </span>
                  <span className="text-sm font-semibold tabular-nums text-maroon-700">{k.when}</span>
                  <span className="text-sand-700 sm:col-span-2">{k.summary}</span>
                </a>
              </Reveal>
            ))}
          </ol>

          <Reveal variant="right" className="lg:col-span-5">
            <a
              href={`${href}#procon`}
              className="group relative isolate flex h-full min-h-72 flex-col justify-between overflow-hidden rounded-[1.75rem] bg-sand-950 p-7 text-sand-50 shadow-deep sm:p-9"
            >
              <div aria-hidden className="bg-grain pointer-events-none absolute inset-0 -z-10 opacity-[0.07]" />
              <p className="text-sm font-semibold text-gold-400">
                {procon.when} <span className="font-normal text-sand-400">· {procon.format}</span>
              </p>
              <div className="mt-10">
                <h3 className="font-display text-4xl font-semibold sm:text-5xl">{procon.name}</h3>
                <p className="mt-3 max-w-sm leading-relaxed text-sand-300/80">{procon.tagline}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold-400">
                  Lihat jadwal ProCon
                  <Icon.arrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </a>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
