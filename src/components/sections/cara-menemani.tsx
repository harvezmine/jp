import { ParallaxImage } from "@/components/parallax";
import { Reveal } from "@/components/reveal";
import { Container } from "@/components/ui";
import { photos } from "@/lib/photos";
import { values } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Tiga hal yang dipegang tim saat menemani. Dipakai di Tentang Kami dan Ruang Cerita. */
export function CaraMenemani({ className = "bg-paper" }: { className?: string }) {
  return (
    <section className={cn("overflow-clip py-20 sm:py-28 lg:py-40", className)}>
      <Container size="wide">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <h2 className="text-display text-ink">Cara kami menemani</h2>
                <p className="text-lead mt-5 text-sand-700 sm:mt-6">Tiga hal yang selalu kami pegang.</p>
              </Reveal>
              <Reveal variant="curtain" duration={1100} className="mt-12 hidden lg:block">
                <ParallaxImage
                  src={photos.aboutHands}
                  alt="Tangan terlipat berdoa di atas Alkitab yang terbuka"
                  sizes="38vw"
                  strength={8}
                  className="aspect-[4/3] rounded-[2rem] bg-sand-200 shadow-warm-lg"
                />
              </Reveal>
            </div>
          </div>

          <ol className="lg:col-span-7 lg:pt-4">
            {values.map((v, i) => (
              <Reveal
                as="li"
                key={v.title}
                delay={i * 100}
                className="group relative border-t border-sand-300/70 py-9 first:border-t-0 first:pt-0 sm:py-12"
              >
                <span className="font-display block text-6xl font-semibold leading-none text-transparent transition-colors duration-500 [-webkit-text-stroke:1.5px_var(--color-maroon-300)] group-hover:text-maroon-300 sm:text-8xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display mt-5 text-3xl font-semibold text-ink sm:mt-6 sm:text-4xl">{v.title}</h3>
                <p className="text-lead mt-3 max-w-md text-sand-700 sm:mt-4">{v.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
