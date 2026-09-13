import { Icon } from "@/components/icons";
import { Parallax, ParallaxImage } from "@/components/parallax";
import { Reveal } from "@/components/reveal";
import { ArrowLink, ButtonLink, Container } from "@/components/ui";
import { photos } from "@/lib/photos";
import { waLink } from "@/lib/site";

const steps = [
  { title: "Ceritakan", body: "Isi formulir singkat atau chat WhatsApp. Boleh tanpa nama." },
  { title: "Kami hubungi", body: "Pendamping akan menghubungimu. Yang mendesak, kami usahakan hari itu juga." },
  { title: "Jalan bersama", body: "Kami doakan, dampingi, atau bantu sesuai kebutuhanmu." },
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
                Minta tolong <span className="italic text-gold-400">tidak perlu ribet.</span>
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="text-lead mt-5 max-w-md text-sand-200/80 sm:mt-6">
                Siapa pun boleh minta tolong. Gratis, dan ceritamu boleh seadanya.
              </p>
            </Reveal>

            <ol className="mt-10 sm:mt-12">
              {steps.map((s, i) => (
                <Reveal
                  as="li"
                  key={s.title}
                  delay={i * 110}
                  className="relative grid grid-cols-[3rem_1fr] gap-4 border-t border-sand-50/10 py-7 sm:grid-cols-[6rem_1fr] sm:gap-8 sm:py-8"
                >
                  {/* Garis emas yang tergambar di atas setiap langkah */}
                  <Reveal
                    variant="draw"
                    duration={1000}
                    delay={200 + i * 150}
                    className="absolute -top-px left-0 h-px w-24 bg-gold-400 sm:w-40"
                  >
                    {null}
                  </Reveal>
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
                <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-sand-200/80">
                  {["Rahasia", "Boleh tanpa nama", "Gratis"].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <Icon.check className="h-4 w-4 text-gold-400" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col items-start gap-5 sm:items-end">
                  <ButtonLink href="/pertolongan" variant="light" size="lg">
                    Mulai cerita
                    <Icon.arrowRight className="h-4 w-4" />
                  </ButtonLink>
                  <ArrowLink href={waLink("Halo, saya mau cerita.")} tone="light">
                    Lebih nyaman lewat WhatsApp
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
