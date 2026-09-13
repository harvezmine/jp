import type { Metadata } from "next";

import { Icon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { ParallaxImage } from "@/components/parallax";
import { Reveal } from "@/components/reveal";
import { ArrowLink, ButtonLink, Container } from "@/components/ui";
import { photos } from "@/lib/photos";
import { values, waLink } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Siapa Kami",
  description:
    "Janji Pengharapan berawal dari video renungan singkat, lalu menjadi tim yang mendoakan, mendengarkan, dan menolong orang yang sedang bergumul.",
};

const story = [
  {
    label: "Awalnya",
    title: "Satu video renungan",
    body: "Kami mulai membagikan renungan pendek di TikTok. Isinya sederhana: satu ayat, satu cerita, dan satu hal kecil yang bisa dilakukan hari itu.",
    image: photos.storyStart,
    alt: "Tangan memegang Alkitab yang terbuka",
  },
  {
    label: "Lalu",
    title: "Pesan mulai berdatangan",
    body: "Ada yang minta didoakan karena orang tuanya sakit. Ada yang menulis jam dua pagi karena merasa tidak sanggup lagi. Pesan seperti itu terlalu penting untuk dibalas seadanya.",
    image: photos.storyGrow,
    alt: "Surat tulisan tangan dan pena di atas meja",
  },
  {
    label: "Sekarang",
    title: "Tim yang siap menolong",
    body: "Kami membentuk tim pendoa, pendamping, dan relawan. Untuk konseling, kunjungan, dan bantuan kebutuhan pokok, kami dibantu jemaat gereja lokal kami.",
    image: photos.storyToday,
    alt: "Relawan mengangkat kardus berisi bantuan",
  },
];

const beliefs = [
  "Alkitab adalah firman Tuhan yang hidup dan relevan untuk hari ini.",
  "Keselamatan adalah anugerah, tidak bisa dibeli dengan usaha atau kelayakan kita.",
  "Gereja adalah orang-orangnya, dan gedung hanyalah tempat berkumpul.",
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
            Berawal dari video renungan,{" "}
            <span className="italic text-gold-400">sekarang menjadi tim yang menolong.</span>
          </>
        }
        description="Janji Pengharapan dijalankan oleh relawan yang ingin memastikan orang yang sedang bergumul punya tempat untuk bercerita dan didoakan."
      />

      {/* Cerita */}
      <section className="bg-cream py-24 sm:py-32 lg:py-40">
        <Container size="wide">
          <Reveal>
            <h2 className="text-headline max-w-2xl text-ink">Bagaimana semuanya dimulai</h2>
          </Reveal>

          <div className="mt-16 space-y-24 sm:mt-20 lg:space-y-36">
            {story.map((s, i) => {
              const flip = i % 2 === 1;
              return (
                <article key={s.title} className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
                  <Reveal
                    variant="curtain"
                    duration={1100}
                    className={cn("lg:col-span-6", flip && "lg:order-2")}
                  >
                    <ParallaxImage
                      src={s.image}
                      alt={s.alt}
                      sizes="(min-width: 1024px) 45vw, 100vw"
                      strength={7}
                      className="aspect-[4/3] rounded-[2rem]"
                    />
                  </Reveal>
                  <div
                    className={cn(
                      "lg:col-span-5",
                      flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-8",
                    )}
                  >
                    <Reveal>
                      <p className="font-display text-xl italic text-maroon-600">{s.label}</p>
                      <h3 className="font-display mt-3 text-3xl font-semibold leading-tight text-ink sm:text-4xl">
                        {s.title}
                      </h3>
                      <p className="text-lead mt-5 text-sand-700">{s.body}</p>
                    </Reveal>
                  </div>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Cara kami menemani */}
      <section className="bg-paper overflow-clip py-24 sm:py-32 lg:py-40">
        <Container size="wide">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-28">
                <Reveal>
                  <h2 className="text-display text-ink">Cara kami menemani</h2>
                  <p className="text-lead mt-6 text-sand-700">
                    Tiga hal ini kami pegang setiap kali ada yang datang meminta tolong.
                  </p>
                </Reveal>
                <Reveal variant="curtain" duration={1100} className="mt-12 hidden lg:block">
                  <ParallaxImage
                    src={photos.aboutPrayer}
                    alt="Sekelompok orang berdoa sambil saling merangkul"
                    sizes="38vw"
                    strength={8}
                    className="aspect-[4/3] rounded-[2rem]"
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
                  className="border-t border-sand-300/70 py-10 first:border-t-0 first:pt-0 sm:py-14"
                >
                  <span className="font-display block text-7xl font-semibold leading-none text-transparent [-webkit-text-stroke:1.5px_var(--color-maroon-300)] sm:text-8xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display mt-6 text-3xl font-semibold text-ink sm:text-4xl">{v.title}</h3>
                  <p className="text-lead mt-4 max-w-xl text-sand-700">{v.body}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* Yang kami percayai */}
      <section className="bg-cream py-24 sm:py-32 lg:py-40">
        <Container size="wide">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <h2 className="text-headline text-ink">Yang kami percayai</h2>
              <p className="text-lead mt-5 text-sand-700">
                Kami tulis dengan bahasa sehari-hari. Kalau ada yang ingin kamu tanyakan lebih
                dalam, kami senang membahasnya.
              </p>
              <div className="mt-8">
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
                  className="flex gap-6 border-b border-sand-300/70 py-7"
                >
                  <span className="font-display w-8 shrink-0 text-lg italic text-maroon-600">{i + 1}.</span>
                  <p className="font-display text-xl leading-snug text-ink sm:text-2xl">{b}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* Ajakan */}
      <section className="relative isolate overflow-hidden bg-maroon-950 py-28 text-sand-50 sm:py-40">
        <ParallaxImage
          src={photos.invite}
          alt="Satu keluarga berjalan bergandengan tangan di pantai saat senja"
          cover
          strength={10}
          className="-z-20"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-r from-maroon-950/90 via-maroon-950/60 to-maroon-950/20"
        />
        <Container size="wide">
          <Reveal className="max-w-2xl">
            <h2 className="text-display">Kamu tidak perlu menunggu siap untuk bercerita.</h2>
            <p className="text-lead mt-6 text-sand-100/85">
              Tulis seadanya. Kami akan membaca, mendoakan, lalu menghubungimu.
            </p>
            <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
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
