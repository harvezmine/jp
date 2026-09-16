import { PostCard } from "@/components/content-cards";
import { Reveal } from "@/components/reveal";
import { ArrowLink, Container } from "@/components/ui";
import type { Post } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Satu tulisan besar dan dua tulisan ringkas, ditutup ajakan bercerita. */
export function RenunganSection({
  posts,
  title = "Bacaan untuk hari yang berat",
  storyHref = "#cerita",
  className = "bg-cream",
  id,
}: {
  posts: Post[];
  title?: string;
  /** Tujuan ajakan "Ceritakan ke kami" setelah membaca. */
  storyHref?: string;
  className?: string;
  id?: string;
}) {
  if (!posts.length) return null;
  const [first, ...rest] = posts;

  return (
    <section id={id} className={cn("scroll-mt-20 py-20 sm:py-28 lg:py-40", className)}>
      <Container size="wide">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <Reveal>
            <h2 className="text-headline max-w-xl text-ink">{title}</h2>
          </Reveal>
          <Reveal delay={100}>
            <ArrowLink href="/konten">Semua tulisan</ArrowLink>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-12 sm:mt-12 lg:mt-16 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-7">
            <PostCard post={first} variant="feature" />
          </Reveal>
          {rest.length > 0 && (
            <div className="flex flex-col gap-8 lg:col-span-5 lg:border-l lg:border-sand-300/70 lg:pl-14">
              {rest.slice(0, 2).map((p, i) => (
                <Reveal key={p.id} delay={(i + 1) * 100}>
                  <PostCard post={p} variant="compact" />
                </Reveal>
              ))}
              <Reveal delay={300}>
                <div className="relative overflow-hidden rounded-2xl bg-sand-100 p-6 shadow-warm">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-maroon-200/50 blur-2xl"
                  />
                  <p className="font-display relative text-lg leading-snug text-ink">
                    Masih ada yang mengganjal setelah membaca?
                  </p>
                  <div className="relative mt-4">
                    <ArrowLink href={storyHref}>Ceritakan ke kami</ArrowLink>
                  </div>
                </div>
              </Reveal>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
