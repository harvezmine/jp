import type { Metadata } from "next";

import { Icon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { Parallax, ParallaxImage } from "@/components/parallax";
import { Reveal } from "@/components/reveal";
import { CaraMenemani } from "@/components/sections/cara-menemani";
import { ArrowLink, ButtonLink, Container } from "@/components/ui";
import { photos } from "@/lib/photos";
import { waLink } from "@/lib/site";
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
    alt: "Pembicara Janji Pengharapan menyampaikan renungan di depan kamera",
  },
  {
    label: "Lalu",
    title: "Pesan mulai berdatangan",
    body: "Ada yang minta didoakan karena orang tuanya sakit. Ada yang menulis jam dua pagi karena merasa tidak sanggup lagi. Setiap cerita mengingatkan kami betapa berartinya didengarkan.",
    image: photos.storyGrow,
    alt: "Surat tulisan tangan dan pena di atas meja",
  },
  {
    label: "Sekarang",
    title: "Bertumbuh untuk menemani",
    body: "Ada tim pendoa, konselor, dan relawan. Kami juga bekerja sama dengan mitra gereja.",
    image: photos.storyToday,
    alt: "Sekelompok orang berdoa sambil saling merangkul",
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
            Hadir untuk mendengar. <span className="italic text-gold-400">Belajar menemani.</span>
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

      <CaraMenemani />

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
