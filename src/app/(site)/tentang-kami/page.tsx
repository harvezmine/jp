import type { Metadata } from "next";

import { Icon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { Parallax, ParallaxImage } from "@/components/parallax";
import { Reveal } from "@/components/reveal";
import { ArrowLink, ButtonLink, Container } from "@/components/ui";
import { photos } from "@/lib/photos";
import { values, waLink } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Siapa Kami",
  description:
    "Janji Pengharapan berawal dari satu video renungan, lalu tumbuh menjadi tim yang mendoakan dan menolong orang yang sedang bergumul.",
};

const story = [
  {
    label: "Awalnya",
    title: "Satu video renungan",
    body: "Kami mulai membagikan renungan pendek di media sosial. Isinya sederhana: satu ayat dan satu cerita.",
    image: photos.storyStart,
    alt: "Tangan memegang Alkitab yang terbuka",
  },
  {
    label: "Lalu",
    title: "Pesan mulai berdatangan",
    body: "Ada yang minta didoakan karena orang tuanya sakit. Ada yang menulis jam dua pagi karena merasa tidak sanggup lagi. Kami tidak mau membalasnya asal-asalan.",
    image: photos.storyGrow,
    alt: "Surat tulisan tangan dan pena di atas meja",
  },
  {
    label: "Sekarang",
    title: "Tim yang siap menolong",
    body: "Ada tim pendoa, konselor, dan relawan, dibantu jemaat gereja lokal kami.",
    image: photos.storyToday,
    alt: "Relawan mengangkat kardus berisi bantuan",
  },
];

const beliefs = [
  "Alkitab adalah firman Tuhan yang hidup dan relevan untuk hari ini.",
  "Keselamatan adalah anugerah dari Tuhan, tidak bisa kita usahakan sendiri.",
  "Gereja adalah orang-orangnya. Gedung hanya tempat berkumpul.",
  "Setiap orang berharga, apa pun latar belakang dan masa lalunya.",
];

export default function TentangKamiPage() {
  return (
    <>
      <PageHero
        image={photos.heroAbout}
        imageAlt="Empat teman berangkulan menghadap matahari terbenam"
        title={
          <>
            Dari satu video, <span className="italic text-gold-400">jadi tim yang menolong.</span>
          </>
        }
        description="Kami relawan yang ingin setiap orang punya tempat untuk bercerita dan didoakan."
      />

      {/* Cerita */}
      <section className="bg-cream pb-20 pt-14 sm:pb-28 sm:pt-20 lg:pb-40 lg:pt-28">
        <Container size="wide">
          <Reveal>
            <h2 className="text-headline max-w-2xl text-ink">Awal ceritanya</h2>
          </Reveal>

          <div className="mt-12 space-y-20 sm:mt-16 lg:mt-20 lg:space-y-32">
            {story.map((s, i) => {
              const flip = i % 2 === 1;
              return (
                <article key={s.title} className="grid items-center gap-9 lg:grid-cols-12 lg:gap-16">
                  <div
                    className={cn(
                      "relative mx-auto w-full max-w-xl lg:col-span-6 lg:max-w-none",
                      flip && "lg:order-2",
                    )}
                  >
                    <Parallax
                      speed={-3}
                      className={cn(
                        "absolute inset-0 hidden translate-y-4 rounded-[2rem] border border-maroon-200 sm:block",
                        flip ? "-translate-x-4" : "translate-x-4",
                      )}
                    />
                    <Reveal variant="curtain" duration={1100} className="relative">
                      <ParallaxImage
                        src={s.image}
                        alt={s.alt}
                        sizes="(min-width: 1024px) 45vw, 576px"
                        strength={7}
                        className="aspect-[4/3] rounded-[2rem] bg-sand-200 shadow-warm-lg"
                      />
                    </Reveal>
                    <span className="font-display absolute -top-5 left-6 grid h-12 w-12 place-items-center rounded-full bg-maroon-700 text-lg italic text-sand-50 shadow-warm-lg sm:h-14 sm:w-14">
                      {i + 1}
                    </span>
                  </div>
                  <div
                    className={cn(
                      "lg:col-span-5",
                      flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-8",
                    )}
                  >
                    <Reveal>
                      <p className="font-display text-xl italic text-maroon-600">{s.label}</p>
                      <h3 className="font-display mt-2 text-3xl font-semibold leading-tight text-ink sm:mt-3 sm:text-4xl">
                        {s.title}
                      </h3>
                      <p className="text-lead mt-4 max-w-md text-sand-700 sm:mt-5">{s.body}</p>
                    </Reveal>
                  </div>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Cara kami menemani */}
      <section className="bg-paper overflow-clip py-20 sm:py-28 lg:py-40">
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
                    src={photos.aboutPrayer}
                    alt="Sekelompok orang berdoa sambil saling merangkul"
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
                  {i > 0 && (
                    <Reveal
                      variant="draw"
                      duration={900}
                      delay={200}
                      className="absolute -top-px left-0 h-px w-24 bg-maroon-600"
                    >
                      {null}
                    </Reveal>
                  )}
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

      {/* Yang kami percayai */}
      <section className="bg-cream py-20 sm:py-28 lg:py-40">
        <Container size="wide">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <h2 className="text-headline text-ink">Yang kami percayai</h2>
              <p className="text-lead mt-4 max-w-sm text-sand-700 sm:mt-5">
                Ditulis dengan bahasa sehari-hari. Ada yang mau ditanyakan? Kami senang membahasnya.
              </p>
              <div className="mt-7 sm:mt-8">
                <ArrowLink href="/kontak">Ajukan pertanyaan</ArrowLink>
              </div>
            </Reveal>

            <ol className="border-t border-sand-300/70 lg:col-span-7">
              {beliefs.map((b, i) => (
                <Reveal
                  as="li"
                  key={b}
                  delay={i * 80}
                  variant="right"
                  className="group flex gap-5 border-b border-sand-300/70 py-6 sm:gap-6 sm:py-7"
                >
                  <span className="font-display w-7 shrink-0 text-lg italic text-maroon-600 transition-transform duration-300 group-hover:translate-x-1">
                    {i + 1}.
                  </span>
                  <p className="font-display text-xl leading-snug text-ink sm:text-2xl">{b}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* Ajakan */}
      <section className="relative isolate overflow-hidden bg-maroon-950 py-24 text-sand-50 sm:py-40">
        <ParallaxImage
          src={photos.invite}
          alt="Satu keluarga berjalan bergandengan tangan di pantai saat senja"
          cover
          strength={10}
          className="-z-20"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-r from-maroon-950/90 via-maroon-950/65 to-maroon-950/25"
        />
        <Container size="wide">
          <Reveal className="max-w-xl">
            <h2 className="text-display">Tidak perlu menunggu siap untuk bercerita.</h2>
            <p className="text-lead mt-5 text-sand-100/85 sm:mt-6">
              Tulis seadanya. Kami akan membaca, mendoakan, lalu menghubungimu.
            </p>
            <div className="mt-9 flex flex-col items-start gap-5 sm:mt-10 sm:flex-row sm:items-center sm:gap-8">
              <ButtonLink href="/pertolongan" variant="light" size="lg">
                <Icon.hands className="h-5 w-5" />
                Mulai bercerita
              </ButtonLink>
              <ArrowLink href={waLink()} tone="light">
                Tanya dulu lewat WhatsApp
              </ArrowLink>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
