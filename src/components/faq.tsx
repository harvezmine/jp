import { Icon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { ArrowLink, Container } from "@/components/ui";
import { cn } from "@/lib/utils";

export type Faq = { q: string; a: string };

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
            {/* Menempel saat digulir, supaya kolom kiri tidak menyisakan ruang kosong. */}
            <div className="lg:sticky lg:top-28">
              <h2 className="text-headline text-ink">{title}</h2>
              {description && <p className="mt-5 leading-relaxed text-sand-700">{description}</p>}
              {action && (
                <div className="mt-6">
                  <ArrowLink href={action.href}>{action.label}</ArrowLink>
                </div>
              )}
            </div>
          </Reveal>
          <Reveal delay={100} className="form-surface overflow-hidden rounded-3xl px-5 sm:px-8 lg:col-span-8">
            {items.map((item) => (
              <details key={item.q} name="faq" className="group border-b border-sand-200 last:border-b-0">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-6 [&::-webkit-details-marker]:hidden">
                  <h3 className="font-display text-lg leading-snug text-ink sm:text-xl">{item.q}</h3>
                  <span
                    aria-hidden="true"
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-maroon-50 text-maroon-700"
                  >
                    <Icon.plus className="h-4 w-4 transition-transform group-open:rotate-45" />
                  </span>
                </summary>
                <p className="max-w-xl pb-6 pr-5 text-sm leading-7 text-sand-800">{item.a}</p>
              </details>
            ))}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
