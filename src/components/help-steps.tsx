import { Icon } from "@/components/icons";
import { Parallax, ParallaxImage } from "@/components/parallax";
import { Reveal } from "@/components/reveal";
import { ArrowLink, ButtonLink, Container } from "@/components/ui";
import { photos } from "@/lib/photos";
import { waLink, site } from "@/lib/site";

const steps = [
  { title: "Mulai dari ceritamu", body: "Bagikan yang nyaman kamu ceritakan. Singkat pun tidak apa-apa." },
  { title: "Kami mendengarkan", body: "Jika kamu ingin dihubungi, tim akan membalas melalui cara yang kamu pilih." },
  { title: "Melangkah bersama", body: "Kita bicarakan dukungan yang kamu butuhkan, sesuai kenyamananmu." },
];

/** Alur minta pertolongan. Dipakai di beranda dan halaman pelayanan. */
export function HelpSteps() {
  return (
    <section className="bg-maroon-deep relative isolate overflow-clip py-20 text-sand-50 sm:py-28 lg:py-40">
      <div aria-hidden className="bg-grain pointer-events-none absolute inset-0 -z-10 opacity-[0.08]" />
      <div
        aria-hidden
        className="animate-breathe pointer-events-none absolute -left-40 top-1/3 -z-10 h-[28rem] w-[28rem] rounded-full bg-maroon-500/20 blur-[120px]"
      />

      <Container size="wide">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:sticky lg:top-28 lg:max-w-none">
              {/* Bingkai tipis di belakang foto untuk memberi lapisan */}
              <Parallax
                speed={-3}
                className="absolute inset-0 hidden -translate-x-4 translate-y-4 rounded-[2rem] border border-sand-50/15 sm:block"
              />
              <Reveal variant="curtain" duration={1100} className="relative">
                <ParallaxImage
                  src={photos.help}
                  alt="Dua tangan saling menggapai"
                  sizes="(min-width: 1024px) 38vw, 448px"
                  strength={8}
                  className="aspect-[4/3] rounded-[2rem] bg-maroon-900 shadow-deep lg:aspect-[4/5]"
                />
                <figure className="absolute inset-x-4 bottom-4 rounded-2xl border border-sand-50/10 bg-maroon-950/70 p-5 backdrop-blur-md sm:inset-x-6 sm:bottom-6 sm:p-6">
                  <blockquote className="font-display text-lg italic leading-snug text-sand-50 sm:text-xl">
                    &ldquo;Bertolong-tolonganlah menanggung bebanmu.&rdquo;
                  </blockquote>
                  <figcaption className="mt-2 text-sm font-semibold text-gold-400">Galatia 6:2</figcaption>
                </figure>
              </Reveal>
            </div>
          </div>

          <div className="lg:col-span-7 lg:pt-6">
            <Reveal>
              <h2 className="text-display text-sand-50">
                Satu langkah kecil. <span className="italic text-gold-400">Kita mulai bersama.</span>
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="text-lead mt-5 max-w-md text-sand-200/80 sm:mt-6">
                Tidak perlu menunggu semuanya terasa terlalu berat. Kamu boleh mulai bercerita kapan pun kamu siap.
              </p>
            </Reveal>

            <ol className="mt-10 sm:mt-12">
              {steps.map((s, i) => (
                <Reveal
                  as="li"
                  key={s.title}
                  delay={i * 110}
                  className="grid grid-cols-[3rem_1fr] gap-4 border-t border-sand-50/10 py-7 sm:grid-cols-[6rem_1fr] sm:gap-8 sm:py-8"
                >
                  <span className="font-display text-5xl font-semibold leading-none text-gold-400/90 sm:text-6xl">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl font-semibold text-sand-50 sm:text-3xl">{s.title}</h3>
                    <p className="mt-2 max-w-sm leading-relaxed text-sand-200/75">{s.body}</p>
                  </div>
                </Reveal>
              ))}
            </ol>

            <Reveal delay={150}>
              <div className="flex flex-col gap-7 border-t border-sand-50/10 pt-9 sm:flex-row sm:items-center sm:justify-between sm:pt-10">
                <p className="flex items-center gap-3 text-sm text-sand-200/80">
                  <Icon.lock className="h-5 w-5 shrink-0 text-gold-400" />
                  Ceritamu dijaga, dan boleh tanpa nama.
                </p>
                <div className="flex flex-col items-start gap-5 sm:items-end">
                  <ButtonLink href="/pertolongan" variant="light" size="lg">
                    Mulai cerita
                    <Icon.arrowRight className="h-4 w-4" />
                  </ButtonLink>
                  <ArrowLink href={waLink("Halo, saya mau cerita.")} tone="light">
                    {site.whatsapp ? "Lebih nyaman lewat WhatsApp" : "Hubungi tim JP"}
                  </ArrowLink>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
