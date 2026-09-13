import Image from "next/image";

import { EventCard, PostCard, SocialCard } from "@/components/content-cards";
import { DonationSection } from "@/components/donation";
import { HelpSteps } from "@/components/help-steps";
import { Icon } from "@/components/icons";
import { Parallax, ParallaxImage } from "@/components/parallax";
import { Reveal } from "@/components/reveal";
import { RuangIntro, RuangSections, RuangSummary } from "@/components/ruang";
import { ArrowLink, ButtonLink, Container, Rise } from "@/components/ui";
import { getEvents, getPosts, getQuotes, getSocialPosts } from "@/lib/queries";
import { photos } from "@/lib/photos";
import { ruang } from "@/lib/ruang";
import { site, values, waLink } from "@/lib/site";
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

      {/* Empat ruang: pembuka, satu section per ruang, lalu rangkuman */}
      <RuangIntro />
      <RuangSections />
      <RuangSummary />

      <HelpSteps />
      <DonationSection />
      <Quotes quotes={quotes} />
      <FromSocials socials={socials} />
      <Reading posts={posts} />
      <Events events={events} />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Hero
   ═══════════════════════════════════════════════════════════════════════════ */

function Hero() {
  return (
    <section className="relative isolate flex min-h-svh flex-col overflow-hidden bg-maroon-950 text-sand-50">
      <ParallaxImage
        src={photos.hero}
        alt="Seorang perempuan duduk di atas bukit memandang matahari terbit"
        priority
        cover
        strength={10}
        className="-z-20"
        imageClassName="animate-settle"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-maroon-950 via-maroon-950/55 to-maroon-950/25"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-maroon-950/85 via-maroon-950/35 to-transparent"
      />
      <div aria-hidden className="bg-grain pointer-events-none absolute inset-0 -z-10 opacity-[0.12]" />

      <Container size="wide" className="relative flex flex-1 flex-col justify-end pb-8 pt-36 sm:pb-12 lg:pb-14">
        <div className="max-w-4xl">
          <Rise>
            <h1 className="text-hero text-sand-50">
              Ada janji yang <span className="italic text-gold-400">tidak pernah</span> dibatalkan.
            </h1>
          </Rise>
          <Rise delay={120}>
            <p className="text-lead mt-7 max-w-xl text-sand-100/85">
              Mungkin kamu sampai di sini dari video kami di TikTok atau YouTube. Kalau sekarang ada
              yang sedang berat, ceritakan saja. Tim kami siap mendoakan dan mendengarkan, tanpa
              menghakimi.
            </p>
          </Rise>
          <Rise delay={220}>
            <div className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
              <ButtonLink href="/pertolongan" variant="light" size="lg">
                <Icon.hands className="h-5 w-5" />
                Saya butuh pertolongan
              </ButtonLink>
              <ArrowLink href={waLink("Halo, saya mau cerita.")} tone="light">
                Chat lewat WhatsApp
              </ArrowLink>
            </div>
          </Rise>
        </div>

        {/* Pintasan ke empat ruang */}
        <Rise delay={340}>
          <nav
            aria-label="Ruang pelayanan"
            className="mt-14 overflow-hidden rounded-2xl border border-sand-50/12 bg-maroon-950/35 backdrop-blur-md sm:mt-20"
          >
            <ul className="-mb-px -mr-px grid sm:grid-cols-2 lg:grid-cols-4">
              {ruang.map((r, i) => (
                <li key={r.slug} className="border-b border-r border-sand-50/12">
                  <a
                    href={`#${r.slug}`}
                    className="group flex h-full items-center gap-4 p-5 transition-colors duration-300 hover:bg-sand-50/[0.06] sm:p-6"
                  >
                    <span className="font-display text-sm italic text-gold-400/80">0{i + 1}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-sand-50">Ruang {r.name}</span>
                      <span className="mt-0.5 block text-sm text-sand-200/70">{r.short}</span>
                    </span>
                    <Icon.arrowRight className="h-4 w-4 shrink-0 text-sand-200/60 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-gold-400" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Rise>
      </Container>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Siapa kami
   ═══════════════════════════════════════════════════════════════════════════ */

/** Foto kecil berbentuk kapsul yang duduk di tengah kalimat. */
function InlinePhoto({ src }: { src: string }) {
  return (
    <span className="relative mx-[0.12em] inline-block h-[0.8em] w-[1.7em] overflow-hidden rounded-full align-[-0.06em] sm:w-[2.1em]">
      <Image src={src} alt="" fill sizes="180px" className="object-cover" />
    </span>
  );
}

function About() {
  return (
    <section className="relative overflow-hidden bg-cream py-24 sm:py-32 lg:py-40">
      <Container size="wide">
        <Reveal>
          <h2 className="font-display max-w-5xl text-[clamp(1.75rem,1rem+3.1vw,3.5rem)] font-medium leading-[1.16] tracking-[-0.025em] text-ink">
            Janji Pengharapan dimulai dari <InlinePhoto src={photos.aboutTable} /> video renungan
            pendek. Tidak lama, pesan mulai masuk dari orang yang sedang{" "}
            <span className="italic text-maroon-700">kehilangan arah</span>{" "}
            <InlinePhoto src={photos.aboutPrayer} /> dan butuh teman. Sekarang ada tim yang tugasnya
            mendoakan dan menemani mereka satu per satu.
          </h2>
        </Reveal>

        <div className="mt-20 grid gap-20 lg:mt-28 lg:grid-cols-12 lg:gap-16">
          {/* Kolase foto dengan kecepatan parallax berbeda */}
          <div className="relative lg:col-span-5">
            <Reveal variant="curtain" duration={1100}>
              <ParallaxImage
                src={photos.aboutFriends}
                alt="Sekelompok teman duduk berangkulan menghadap laut"
                sizes="(min-width: 1024px) 38vw, 100vw"
                strength={8}
                className="aspect-[4/5] rounded-[2rem] bg-sand-200"
              />
            </Reveal>
            <Parallax speed={-5} className="absolute -bottom-12 -right-3 hidden w-2/5 sm:block lg:-right-10">
              <Reveal variant="zoom" delay={250}>
                <div className="relative aspect-square overflow-hidden rounded-2xl border-[6px] border-cream bg-sand-200 shadow-deep">
                  <Image src={photos.aboutHands} alt="" fill sizes="240px" className="object-cover" />
                </div>
              </Reveal>
            </Parallax>
          </div>

          <div className="lg:col-span-7 lg:pl-6 lg:pt-8">
            <Reveal>
              <h3 className="text-title text-ink">Yang kami pegang setiap kali menolong</h3>
            </Reveal>
            <ol className="mt-8 border-t border-sand-300/70">
              {values.map((v, i) => (
                <Reveal
                  as="li"
                  key={v.title}
                  delay={i * 90}
                  className="grid gap-3 border-b border-sand-300/70 py-8 sm:grid-cols-[5.5rem_1fr] sm:gap-6"
                >
                  <span className="font-display text-5xl font-semibold leading-none text-transparent [-webkit-text-stroke:1.5px_var(--color-maroon-400)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h4 className="font-display text-2xl font-semibold text-ink">{v.title}</h4>
                    <p className="mt-2 max-w-lg leading-relaxed text-sand-700">{v.body}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
            <Reveal delay={200}>
              <div className="mt-9">
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
    <section className="relative overflow-hidden bg-cream py-24 sm:py-32 lg:py-40">
      <Container size="wide">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="relative lg:col-span-8">
            <Parallax speed={-6} className="pointer-events-none absolute -left-3 -top-20 sm:-left-8 sm:-top-28">
              <span
                aria-hidden
                className="font-display block select-none text-[13rem] leading-none text-maroon-100 sm:text-[19rem]"
              >
                &ldquo;
              </span>
            </Parallax>
            <Reveal className="relative">
              <figure>
                <blockquote className="font-display text-[clamp(1.75rem,1rem+2.9vw,3.1rem)] font-medium leading-[1.18] tracking-[-0.02em] text-maroon-950">
                  {first.content}
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-4 font-semibold text-maroon-700">
                  <span className="h-px w-12 bg-maroon-300" />
                  {first.reference ?? first.author}
                </figcaption>
              </figure>
            </Reveal>
          </div>

          <div className="lg:col-span-4 lg:pt-4">
            <Reveal variant="curtain" duration={1100}>
              <ParallaxImage
                src={photos.quotes}
                alt="Seseorang duduk di ujung dermaga menghadap danau dan pegunungan"
                sizes="(min-width: 1024px) 30vw, 100vw"
                strength={8}
                className="aspect-[4/3] rounded-[1.75rem] bg-sand-200 lg:aspect-[3/4]"
              />
            </Reveal>
          </div>
        </div>

        {rest.length > 0 && (
          <div className="mt-20 grid gap-10 border-t border-sand-300/70 pt-10 sm:grid-cols-3 lg:mt-24">
            {rest.slice(0, 3).map((q, i) => (
              <Reveal key={q.id} delay={i * 90}>
                <figure>
                  <blockquote className="font-display text-lg leading-snug text-ink sm:text-xl">
                    &ldquo;{q.content}&rdquo;
                  </blockquote>
                  <figcaption className="mt-4 text-sm font-semibold text-maroon-700">
                    {q.reference ?? q.author}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        )}

        <Reveal>
          <div className="mt-12">
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
      className="relative isolate overflow-hidden bg-maroon-950 py-24 text-sand-50 sm:py-32 lg:py-40"
    >
      <div aria-hidden className="bg-grain pointer-events-none absolute inset-0 -z-10 opacity-[0.08]" />
      <div
        aria-hidden
        className="animate-breathe pointer-events-none absolute -right-40 top-0 -z-10 h-[520px] w-[520px] rounded-full bg-maroon-600/25 blur-[120px]"
      />

      <Container size="wide">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <h2 className="text-display">
              Dari <span className="italic text-gold-400">TikTok</span> dan YouTube
            </h2>
          </Reveal>
          <Reveal delay={100} className="lg:col-span-5">
            <p className="text-lead text-sand-200/80">
              Kebanyakan orang mengenal kami dari video renungan singkat. Ini beberapa yang sering
              dibagikan ulang.
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
        <div className="-mx-5 mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 lg:mt-20 lg:grid-cols-4 lg:pb-14">
          {socials.map((s, i) => (
            <Reveal
              key={s.id}
              delay={i * 90}
              className={cn("w-[72vw] shrink-0 snap-start sm:w-auto", i % 2 === 1 && "lg:translate-y-14")}
            >
              <SocialCard post={s} />
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
    <section className="bg-cream py-24 sm:py-32 lg:py-40">
      <Container size="wide">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <Reveal>
            <h2 className="text-headline max-w-2xl text-ink">Bacaan untuk hari yang berat</h2>
          </Reveal>
          <Reveal delay={100}>
            <ArrowLink href="/konten">Semua tulisan</ArrowLink>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-14 lg:mt-16 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-7">
            <PostCard post={first} variant="feature" />
          </Reveal>
          {rest.length > 0 && (
            <div className="flex flex-col gap-10 lg:col-span-5 lg:border-l lg:border-sand-300/70 lg:pl-14">
              {rest.map((p, i) => (
                <Reveal key={p.id} delay={(i + 1) * 100}>
                  <PostCard post={p} variant="compact" />
                </Reveal>
              ))}
              <Reveal delay={300}>
                <div className="rounded-2xl bg-sand-100 p-6">
                  <p className="font-display text-lg leading-snug text-ink">
                    Ada tulisan yang pas dengan keadaanmu, tapi masih ada yang mengganjal?
                  </p>
                  <div className="mt-4">
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
    <section className="bg-paper py-24 sm:py-32">
      <Container size="wide">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <h2 className="text-headline text-ink">Acara terdekat</h2>
            <p className="text-lead mt-4 text-sand-700">
              Live event, malam doa, dan kelas. Datang sendiri atau ajak teman.
            </p>
            <div className="mt-8">
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
