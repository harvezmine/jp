import { Parallax, ParallaxImage } from "@/components/parallax";
import { Reveal } from "@/components/reveal";
import { ArrowLink, Container } from "@/components/ui";
import { photos } from "@/lib/photos";
import type { Quote } from "@/lib/types";
import { cn } from "@/lib/utils";

export function QuotesSection({ quotes, className = "bg-cream" }: { quotes: Quote[]; className?: string }) {
  if (!quotes.length) return null;
  const [first, ...rest] = quotes;

  return (
    <section className={cn("relative overflow-hidden py-20 sm:py-28 lg:py-36", className)}>
      <Container size="wide">
        {/*
          Di layar lebar foto mengisi kolom kanan setinggi dua baris, dan kutipan pendek naik
          ke bawah ayat utama, supaya ayat yang pendek tidak meninggalkan ruang kosong.
        */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-16 lg:gap-y-14">
          <div className="relative lg:col-span-8">
            <Parallax speed={-6} className="pointer-events-none absolute -left-2 -top-16 sm:-top-28 lg:-left-8">
              <span
                aria-hidden
                className="font-display block select-none text-[10rem] leading-none text-maroon-100 sm:text-[19rem]"
              >
                &ldquo;
              </span>
            </Parallax>
            <Reveal className="relative">
              <figure>
                <blockquote className="font-display text-[clamp(1.6rem,1rem+2.7vw,3rem)] font-medium leading-[1.2] tracking-[-0.02em] text-maroon-950">
                  {first.content}
                </blockquote>
                <figcaption className="font-display mt-6 text-lg italic text-maroon-700 sm:mt-7 sm:text-xl">
                  {first.reference ?? first.author}
                </figcaption>
              </figure>
            </Reveal>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:col-span-4 lg:row-span-2 lg:max-w-none lg:self-center">
            <Parallax
              speed={-3}
              className="absolute inset-0 hidden translate-x-4 translate-y-4 rounded-[1.75rem] border border-maroon-200 sm:block"
            />
            <Reveal variant="curtain" duration={1100} className="relative">
              <ParallaxImage
                src={photos.quotes}
                alt="Seseorang duduk di ujung dermaga menghadap danau dan pegunungan"
                sizes="(min-width: 1024px) 30vw, 448px"
                strength={8}
                className="aspect-[4/3] rounded-[1.75rem] bg-sand-200 shadow-warm-lg lg:aspect-[3/4]"
              />
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            {rest.length > 0 && (
              <div className="grid gap-8 border-t border-sand-300/70 pt-10 sm:grid-cols-3">
                {rest.slice(0, 3).map((q, i) => (
                  <Reveal key={q.id} delay={i * 90}>
                    <figure>
                      <blockquote className="font-display text-lg leading-snug text-ink sm:text-base xl:text-lg">
                        &ldquo;{q.content}&rdquo;
                      </blockquote>
                      <figcaption className="mt-3 text-sm font-semibold text-maroon-700 sm:mt-4">
                        {q.reference ?? q.author}
                      </figcaption>
                    </figure>
                  </Reveal>
                ))}
              </div>
            )}
            <Reveal>
              <div className="mt-10 sm:mt-12">
                <ArrowLink href="/konten?tab=quotes">Semua kutipan</ArrowLink>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
