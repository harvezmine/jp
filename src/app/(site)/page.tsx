import Image from "next/image";

import { EventCard, PostCard, SocialCard } from "@/components/content-cards";
import { DonationSection } from "@/components/donation";
import { HelpSteps } from "@/components/help-steps";
import { Icon } from "@/components/icons";
import { HeroLip } from "@/components/page-hero";
import { Parallax, ParallaxImage } from "@/components/parallax";
import { Reveal } from "@/components/reveal";
import { RuangIntro } from "@/components/ruang";
import { ArrowLink, ButtonLink, Container, Rise } from "@/components/ui";
import { getEvents, getPosts, getQuotes, getSocialPosts } from "@/lib/queries";
import { photos } from "@/lib/photos";
import { site, values } from "@/lib/site";
import { cn } from "@/lib/utils";

export default async function HomePage() {
  const [posts, quotes, events, socials] = await Promise.all([
    getPosts({ limit: 3 }),
    getQuotes({ limit: 4, featuredOnly: true }),
    getEvents({ limit: 3, upcoming: true }),
    getSocialPosts({ limit: 4 }),
  ]);

  return (
    <>
      <Hero />
      <About />

      <RuangIntro linkPrefix="/layanan" />

      <HelpSteps />
      <Quotes quotes={quotes} />
      <FromSocials socials={socials} />
      <Reading posts={posts} />
      <Events events={events} />
      <DonationSection />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Hero
   ═══════════════════════════════════════════════════════════════════════════ */

function Hero() {
  const choices = [
    {
      icon: Icon.hands,
      title: "Saya ingin didoakan",
      description: "Bawa yang sedang kamu rasakan dalam doa.",
      category: "doa",
    },
    {
      icon: Icon.users,
      title: "Saya butuh teman cerita",
      description: "Ada ruang untuk didengar, tanpa dihakimi.",
      category: "konseling",
    },
    {
      icon: Icon.heart,
      title: "Saya belum tahu harus mulai dari mana",
      description: "Tidak apa-apa. Kita cari langkahnya bersama.",
      category: "lainnya",
    },
  ];
  return (
    <section className="jp-home-hero relative isolate overflow-hidden bg-maroon-950 text-sand-50">
      <ParallaxImage
        src={photos.hero}
        alt="Cahaya matahari di atas perbukitan"
        priority
        cover
        strength={5}
        className="-z-20"
        imageClassName="animate-settle"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-maroon-950/95 via-maroon-950/75 to-maroon-950/35"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-maroon-950/80 via-transparent to-maroon-950/20"
      />
      <Container size="wide" className="relative pb-20 pt-32 sm:pb-24 sm:pt-40 lg:pb-28 lg:pt-44">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Rise>
              <p className="mb-6 flex items-center gap-3 text-xs font-medium tracking-wide text-sand-100/80">
                <span className="h-px w-8 bg-gold-400" />
                Tempat bercerita dan menemukan pengharapan
              </p>
            </Rise>
            <Rise delay={80}>
              <h1 className="jp-hero-heading">
                Kamu tidak harus
                <br />
                melewati ini
                <br />
                <span className="italic text-gold-400">sendirian.</span>
              </h1>
            </Rise>
            <Rise delay={160}>
              <p className="mt-7 max-w-md text-base leading-7 text-sand-100/85 sm:text-lg sm:leading-8">
                Saat hidup terasa berat, kamu boleh berhenti sejenak. Kami ada untuk mendengar, mendoakan, dan mencari
                langkah berikutnya bersamamu.
              </p>
            </Rise>
            <Rise delay={240}>
              <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
                <ButtonLink href="/pertolongan" variant="light" size="lg">
                  Mulai bercerita <Icon.arrowRight className="h-4 w-4" />
                </ButtonLink>
                <ArrowLink href="#ruang" tone="light">
                  Kenali ruang untukmu
                </ArrowLink>
              </div>
            </Rise>
          </div>
          <Rise delay={250} className="lg:col-span-5">
            <div className="hero-welcome-card relative rounded-[1.75rem] bg-sand-50 p-6 text-ink sm:p-8">
              <span
                aria-hidden="true"
                className="mb-5 grid h-12 w-12 place-items-center rounded-full bg-maroon-50 text-maroon-700 ring-1 ring-maroon-100"
              >
                <Icon.heart className="h-5 w-5" />
              </span>
              <h2 className="font-display text-2xl leading-tight sm:text-3xl">Apa yang kamu butuhkan hari ini?</h2>
              <p className="mt-3 text-sm leading-relaxed text-sand-700">Pilih yang paling dekat dengan perasaanmu.</p>
              <ul className="mt-6 divide-y divide-sand-300/70 border-y border-sand-300/70">
                {choices.map(({ icon: ChoiceIcon, ...choice }) => (
                  <li key={choice.category}>
                    <a
                      href={`/pertolongan?category=${choice.category}`}
                      className="group flex min-h-24 items-center gap-3 py-5"
                    >
                      <ChoiceIcon className="h-5 w-5 shrink-0 text-maroon-600" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-maroon-800">{choice.title}</span>
                        <span className="mt-1 block text-xs leading-relaxed text-sand-700">{choice.description}</span>
                      </span>
                      <Icon.arrowUpRight className="h-4 w-4 shrink-0 text-maroon-600 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-sand-700">
                <Icon.shield className="h-4 w-4 shrink-0 text-maroon-600" />
                Kamu boleh memakai nama panggilan atau bercerita tanpa nama.
              </p>
            </div>
          </Rise>
        </div>
        <Rise delay={320}>
          <p className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-sand-100/75 lg:mt-14">
            {["Kamu didengarkan", "Boleh mulai dari cerita singkat", "Sesuai kenyamananmu"].map((text) => (
              <span key={text} className="flex items-center gap-2">
                <Icon.check className="h-3.5 w-3.5 text-gold-400" />
                {text}
              </span>
            ))}
          </p>
        </Rise>
      </Container>
      <HeroLip />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Siapa kami
   ═══════════════════════════════════════════════════════════════════════════ */

/** Foto kecil berbentuk kapsul yang duduk di tengah kalimat. */
function InlinePhoto({ src }: { src: string }) {
  return (
    <span className="relative mx-[0.12em] inline-block h-[0.8em] w-[1.7em] overflow-hidden rounded-full align-[-0.06em] shadow-warm sm:w-[2.1em]">
      <Image src={src} alt="" fill sizes="180px" className="object-cover" />
    </span>
  );
}

function About() {
  return (
    <section className="relative overflow-hidden bg-cream pb-20 pt-16 sm:pb-28 sm:pt-24 lg:pb-40 lg:pt-32">
      <Container size="wide">
        <Reveal>
          <h2 className="font-display max-w-4xl text-[clamp(1.75rem,1rem+3.1vw,3.5rem)] font-medium leading-[1.16] tracking-[-0.025em] text-ink">
            Ada hari ketika <span className="italic text-maroon-700">didengarkan</span> saja sudah berarti banyak. Di
            sini, kamu boleh datang dengan ceritamu, <InlinePhoto src={photos.aboutFriends} /> apa adanya.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-16 sm:mt-20 lg:mt-28 lg:grid-cols-12 lg:gap-16">
          {/* Kolase foto dengan kecepatan parallax berbeda */}
          <div className="relative mx-auto w-full max-w-md sm:max-w-lg lg:col-span-5 lg:max-w-none">
            <Parallax
              speed={-3}
              className="absolute inset-0 hidden -translate-x-4 translate-y-4 rounded-[2rem] border border-maroon-200 sm:block"
            />
            <Reveal variant="curtain" duration={1100} className="relative">
              <ParallaxImage
                src={photos.aboutFriends}
                alt="Sekelompok teman duduk berangkulan menghadap laut"
                sizes="(min-width: 1024px) 38vw, 512px"
                strength={8}
                className="aspect-[4/5] rounded-[2rem] bg-sand-200 shadow-warm-lg"
              />
            </Reveal>
            <Parallax speed={-5} className="absolute -bottom-10 -right-3 hidden w-2/5 sm:block lg:-right-10">
              <Reveal variant="zoom" delay={250}>
                <div className="relative aspect-square overflow-hidden rounded-2xl border-[6px] border-cream bg-sand-200 shadow-deep">
                  <Image src={photos.aboutHands} alt="" fill sizes="240px" className="object-cover" />
                </div>
              </Reveal>
            </Parallax>
          </div>

          <div className="lg:col-span-7 lg:pl-6 lg:pt-8">
            <Reveal>
              <h3 className="text-title text-ink">Cara kami menemanimu</h3>
            </Reveal>
            <ol className="mt-6 border-t border-sand-300/70 sm:mt-8">
              {values.map((v, i) => (
                <Reveal
                  as="li"
                  key={v.title}
                  delay={i * 90}
                  className="group relative grid grid-cols-[3.5rem_1fr] gap-4 border-b border-sand-300/70 py-7 sm:grid-cols-[5.5rem_1fr] sm:gap-6 sm:py-8"
                >
                  <Reveal
                    variant="draw"
                    duration={900}
                    delay={200 + i * 120}
                    className="absolute -bottom-px left-0 h-px w-20 bg-maroon-600"
                  >
                    {null}
                  </Reveal>
                  <span className="font-display text-4xl font-semibold leading-none text-transparent transition-colors duration-500 [-webkit-text-stroke:1.5px_var(--color-maroon-400)] group-hover:text-maroon-400 sm:text-5xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h4 className="font-display text-xl font-semibold text-ink sm:text-2xl">{v.title}</h4>
                    <p className="mt-1.5 max-w-md leading-relaxed text-sand-700">{v.body}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
            <Reveal delay={200}>
              <div className="mt-8 sm:mt-9">
                <ArrowLink href="/tentang-kami">Kenali kami lebih jauh</ArrowLink>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Kutipan
   ═══════════════════════════════════════════════════════════════════════════ */

function Quotes({ quotes }: { quotes: Awaited<ReturnType<typeof getQuotes>> }) {
  if (!quotes.length) return null;
  const [first, ...rest] = quotes;

  return (
    <section className="relative overflow-hidden bg-cream py-20 sm:py-28 lg:py-40">
      <Container size="wide">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="relative lg:col-span-8">
            <Parallax speed={-6} className="pointer-events-none absolute -left-2 -top-16 sm:-left-8 sm:-top-28">
              <span
                aria-hidden
                className="font-display block select-none text-[10rem] leading-none text-maroon-100 sm:text-[19rem]"
              >
                &ldquo;
              </span>
            </Parallax>
            <Reveal className="relative">
              <figure>
                <blockquote className="font-display text-[clamp(1.6rem,1rem+2.7vw,3rem)] font-medium leading-[1.2] tracking-[-0.02em] text-maroon-950">
                  {first.content}
                </blockquote>
                <figcaption className="mt-7 flex items-center gap-4 font-semibold text-maroon-700 sm:mt-8">
                  <span className="h-px w-12 bg-maroon-300" />
                  {first.reference ?? first.author}
                </figcaption>
              </figure>
            </Reveal>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:col-span-4 lg:max-w-none">
            <Parallax
              speed={-3}
              className="absolute inset-0 hidden translate-x-4 translate-y-4 rounded-[1.75rem] border border-maroon-200 sm:block"
            />
            <Reveal variant="curtain" duration={1100} className="relative">
              <ParallaxImage
                src={photos.quotes}
                alt="Seseorang duduk di ujung dermaga menghadap danau dan pegunungan"
                sizes="(min-width: 1024px) 30vw, 448px"
                strength={8}
                className="aspect-[4/3] rounded-[1.75rem] bg-sand-200 shadow-warm-lg lg:aspect-[3/4]"
              />
            </Reveal>
          </div>
        </div>

        {rest.length > 0 && (
          <div className="mt-16 grid gap-8 border-t border-sand-300/70 pt-10 sm:grid-cols-3 sm:gap-10 lg:mt-24">
            {rest.slice(0, 3).map((q, i) => (
              <Reveal key={q.id} delay={i * 90}>
                <figure>
                  <blockquote className="font-display text-lg leading-snug text-ink sm:text-xl">
                    &ldquo;{q.content}&rdquo;
                  </blockquote>
                  <figcaption className="mt-3 text-sm font-semibold text-maroon-700 sm:mt-4">
                    {q.reference ?? q.author}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        )}

        <Reveal>
          <div className="mt-10 sm:mt-12">
            <ArrowLink href="/konten?tab=quotes">Semua kutipan</ArrowLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Dari TikTok & YouTube
   ═══════════════════════════════════════════════════════════════════════════ */

function FromSocials({ socials }: { socials: Awaited<ReturnType<typeof getSocialPosts>> }) {
  if (!socials.length) return null;

  return (
    <section
      id="konten-sosmed"
      className="relative isolate overflow-hidden bg-maroon-950 py-20 text-sand-50 sm:py-28 lg:py-40"
    >
      <div aria-hidden className="bg-grain pointer-events-none absolute inset-0 -z-10 opacity-[0.08]" />
      <div
        aria-hidden
        className="animate-breathe pointer-events-none absolute -right-40 top-0 -z-10 h-[520px] w-[520px] rounded-full bg-maroon-600/25 blur-[120px]"
      />

      <Container size="wide">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
          <Reveal className="lg:col-span-7">
            <h2 className="text-display">
              Dari <span className="italic text-gold-400">TikTok</span> dan YouTube
            </h2>
          </Reveal>
          <Reveal delay={100} className="lg:col-span-5">
            <p className="text-lead max-w-sm text-sand-200/80">
              Video renungan singkat yang paling sering dibagikan ulang.
            </p>
            <div className="mt-6 flex gap-2">
              {[
                { href: site.socials.tiktok, icon: Icon.tiktok, label: "TikTok" },
                { href: site.socials.youtube, icon: Icon.youtube, label: "YouTube" },
                { href: site.socials.instagram, icon: Icon.instagram, label: "Instagram" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid h-11 w-11 place-items-center rounded-full border border-sand-50/20 text-sand-100 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-400/70 hover:text-gold-400"
                >
                  <s.icon className="h-4.5 w-4.5" />
                </a>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Di HP bisa digeser seperti feed; di layar lebar kolomnya berundak */}
        <div className="-mx-5 mt-12 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:mx-0 sm:scroll-px-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 lg:mt-20 lg:grid-cols-4 lg:pb-14">
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

/* ═══════════════════════════════════════════════════════════════════════════
   Tulisan
   ═══════════════════════════════════════════════════════════════════════════ */

function Reading({ posts }: { posts: Awaited<ReturnType<typeof getPosts>> }) {
  if (!posts.length) return null;
  const [first, ...rest] = posts;

  return (
    <section className="bg-cream py-20 sm:py-28 lg:py-40">
      <Container size="wide">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <Reveal>
            <h2 className="text-headline max-w-xl text-ink">Bacaan untuk hari yang berat</h2>
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
              {rest.map((p, i) => (
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
                    <ArrowLink href="/pertolongan">Ceritakan ke kami</ArrowLink>
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

/* ═══════════════════════════════════════════════════════════════════════════
   Event
   ═══════════════════════════════════════════════════════════════════════════ */

function Events({ events }: { events: Awaited<ReturnType<typeof getEvents>> }) {
  if (!events.length) return null;

  return (
    <section className="bg-paper py-20 sm:py-28">
      <Container size="wide">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <h2 className="text-headline text-ink">Acara terdekat</h2>
            <p className="text-lead mt-4 max-w-sm text-sand-700">
              Live event, malam doa, dan kelas. Datang sendiri atau ajak teman.
            </p>
            <div className="mt-7 sm:mt-8">
              <ArrowLink href="/event">Semua acara</ArrowLink>
            </div>
          </Reveal>
          <div className="space-y-4 lg:col-span-8">
            {events.map((e, i) => (
              <Reveal key={e.id} delay={i * 90} variant="right">
                <EventCard event={e} />
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
