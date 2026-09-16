import { SocialCard } from "@/components/content-cards";
import { Icon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { ChapterHeading } from "@/components/ruang";
import { Container } from "@/components/ui";
import type { Ruang } from "@/lib/ruang";
import { socialLinks } from "@/lib/site";
import type { SocialPost } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Video renungan pendek. Dengan `chapter`, judulnya menjadi judul bab di beranda. */
export function SocialReels({
  socials,
  chapter,
  id = "konten-sosmed",
}: {
  socials: SocialPost[];
  chapter?: Ruang;
  id?: string;
}) {
  if (!socials.length) return null;

  return (
    <section
      id={id}
      className="relative isolate scroll-mt-20 overflow-hidden bg-maroon-950 py-20 text-sand-50 sm:py-28 lg:py-40"
    >
      <div aria-hidden className="bg-grain pointer-events-none absolute inset-0 -z-10 opacity-[0.08]" />
      <div
        aria-hidden
        className="animate-breathe pointer-events-none absolute -right-40 top-0 -z-10 h-[520px] w-[520px] rounded-full bg-maroon-600/25 blur-[120px]"
      />

      <Container size="wide">
        {chapter ? (
          <ChapterHeading
            ruang={chapter}
            tone="dark"
            description="Renungan pendek yang kami bagikan setiap minggu. Tonton sebentar, lalu lanjut baca tulisannya."
          />
        ) : (
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
            <Reveal className="lg:col-span-7">
              <h2 className="text-display">
                Renungan <span className="italic text-gold-400">singkat</span> untuk harimu
              </h2>
            </Reveal>
            <Reveal delay={100} className="lg:col-span-5">
              <p className="text-lead max-w-sm text-sand-200/80">
                Doa dan renungan pendek yang kami bagikan setiap minggu di media sosial.
              </p>
              <div className="mt-6 flex gap-2">
                {socialLinks.map(({ key, href, label }) => {
                  const SocialIcon = Icon[key];
                  return (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="grid h-11 w-11 place-items-center rounded-full border border-sand-50/20 text-sand-100 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-400/70 hover:text-gold-400"
                    >
                      <SocialIcon className="h-4.5 w-4.5" />
                    </a>
                  );
                })}
              </div>
            </Reveal>
          </div>
        )}

        {/* Di HP bisa digeser seperti feed; di layar lebar kolomnya berundak */}
        <div className="-mx-5 mt-12 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:mx-0 sm:grid sm:scroll-px-0 sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 lg:mt-20 lg:grid-cols-4 lg:pb-14">
          {socials.map((s, i) => (
            <Reveal
              key={s.id}
              delay={i * 90}
              className={cn(
                "w-[68vw] max-w-72 shrink-0 snap-start sm:w-auto sm:max-w-none",
                i % 2 === 1 && "lg:translate-y-14",
              )}
            >
              <div className="rounded-[1.5rem] shadow-deep">
                <SocialCard post={s} />
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
