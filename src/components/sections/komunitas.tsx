import { Icon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { ButtonLink, Container } from "@/components/ui";
import { komunitas, komunitasWaLink } from "@/lib/komunitas";
import { cn } from "@/lib/utils";

const linkProps = (href: string) => (href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {});

export function KomunitasSection({ className = "bg-cream" }: { className?: string }) {
  return (
    <section id="komunitas" className={cn("scroll-mt-20 overflow-clip py-20 sm:py-28 lg:py-36", className)}>
      <Container size="wide">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <h2 className="text-display text-ink">
                  Belajar <span className="italic text-maroon-700">bareng-bareng.</span>
                </h2>
              </Reveal>
              <Reveal delay={100}>
                <p className="text-lead mt-5 max-w-md text-sand-700">
                  Komunitas kecil untuk belajar hal praktis bersama. Siapa saja boleh ikut, termasuk yang baru mau
                  mencoba.
                </p>
              </Reveal>
              <Reveal delay={150}>
                <div className="mt-8">
                  <ButtonLink href={komunitasWaLink()} external>
                    <Icon.whatsapp className="h-4 w-4" />
                    Tanya soal komunitas
                  </ButtonLink>
                </div>
              </Reveal>
            </div>
          </div>

          <ol className="border-t border-sand-300/70 lg:col-span-7">
            {komunitas.map((k, i) => {
              const href = komunitasWaLink(k.name);
              return (
                <Reveal as="li" key={k.slug} delay={i * 90} className="border-b border-sand-300/70">
                  <a
                    href={href}
                    {...linkProps(href)}
                    className="group grid grid-cols-[1fr_auto] gap-x-6 gap-y-2 py-7 sm:py-9"
                  >
                    <span className="font-display text-2xl font-semibold leading-tight text-ink transition-colors duration-300 group-hover:text-maroon-700 sm:text-3xl">
                      {k.name}
                    </span>
                    <span className="grid h-11 w-11 place-items-center self-start rounded-full border border-sand-300 text-maroon-700 transition-colors duration-300 group-hover:border-maroon-700 group-hover:bg-maroon-700 group-hover:text-sand-50">
                      <Icon.arrowUpRight className="h-4 w-4" />
                    </span>
                    <span className="col-span-2 max-w-lg leading-relaxed text-sand-700">{k.summary}</span>
                    <span className="col-span-2 text-sm font-semibold text-maroon-700">
                      {k.when} <span className="font-normal text-sand-600">· {k.format}</span>
                    </span>
                  </a>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}
