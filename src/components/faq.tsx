import { Reveal } from "@/components/reveal";
import { ArrowLink, Container } from "@/components/ui";
import { cn } from "@/lib/utils";

export type Faq = { q: string; a: string };

/** Tanya-jawab dua kolom. Dipakai di halaman pelayanan dan donasi. */
export function FaqSection({
  title,
  description,
  action,
  items,
  className = "bg-paper",
}: {
  title: string;
  description?: string;
  action?: { label: string; href: string };
  items: Faq[];
  className?: string;
}) {
  return (
    <section className={cn("py-20 sm:py-28", className)}>
      <Container size="wide">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <h2 className="text-headline text-ink">{title}</h2>
            {description && <p className="text-lead mt-4 text-sand-700">{description}</p>}
            {action && (
              <div className="mt-6">
                <ArrowLink href={action.href}>{action.label}</ArrowLink>
              </div>
            )}
          </Reveal>

          <div className="grid gap-x-12 gap-y-8 sm:grid-cols-2 sm:gap-y-10 lg:col-span-8">
            {items.map((f, i) => (
              <Reveal key={f.q} delay={(i % 2) * 90} className="relative border-t border-sand-300/70 pt-5 sm:pt-6">
                <Reveal
                  variant="draw"
                  duration={900}
                  delay={150 + (i % 2) * 90}
                  className="absolute -top-px left-0 h-px w-16 bg-maroon-600"
                >
                  {null}
                </Reveal>
                <h3 className="font-display text-xl font-semibold leading-snug text-ink">{f.q}</h3>
                <p className="mt-2.5 leading-relaxed text-sand-700">{f.a}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
