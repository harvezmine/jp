import Image from "next/image";

import { HelpSteps } from "@/components/help-steps";
import { Icon } from "@/components/icons";
import { HeroLip } from "@/components/page-hero";
import { Parallax, ParallaxImage } from "@/components/parallax";
import { Reveal } from "@/components/reveal";
import { ChapterHeading, RuangIntro, RuangSection, RuangTiles } from "@/components/ruang";
import { GeneralFormSection } from "@/components/sections/form-sections";
import { RenunganSection } from "@/components/sections/renungan";
import { SocialReels } from "@/components/sections/social-reels";
import { SupportSection } from "@/components/support";
import { ArrowLink, ButtonLink, Container, Rise } from "@/components/ui";
import { getPosts, getSocialPosts } from "@/lib/queries";
import { photos } from "@/lib/photos";
import { getRuang } from "@/lib/ruang";
import { values } from "@/lib/site";

export default async function HomePage() {
  const [renungan, socials] = await Promise.all([
    getPosts({ category: "renungan", limit: 3 }),
    getSocialPosts({ limit: 4 }),
  ]);
  // Belum ada renungan? Tampilkan tulisan terbaru apa pun supaya section tidak kosong.
  const posts = renungan.length ? renungan : await getPosts({ limit: 3 });

  return (
    <>
      <Hero />
      <Intro />
      <RuangIntro className="bg-paper" />

      {/* 01 Ruang Pengharapan */}
      <SocialReels socials={socials} chapter={getRuang("ruang-pengharapan")} id="bab-pengharapan" />
      <RenunganSection posts={posts} className="bg-paper" />

      {/* 02 Ruang Doa */}
      <RuangSection
        ruang={getRuang("ruang-doa")}
        index={1}
        id="bab-doa"
        secondary={{ label: "Masuk ke Ruang Doa", href: "/ruang-doa" }}
      />

      {/* 03 Ruang Cerita */}
      <CeritaChapter />
      <HelpSteps ctaHref="/ruang-cerita#ceritakan" />

      {/* 04 Ruang Belajar */}
      <RuangSection
        ruang={getRuang("ruang-belajar")}
        index={0}
        id="bab-belajar"
        secondary={{ label: "Masuk ke Ruang Belajar", href: "/ruang-belajar" }}
      />

      <GeneralFormSection className="bg-cream" />
      <SupportSection className="bg-paper" />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Hero
   ═══════════════════════════════════════════════════════════════════════════ */

function Hero() {
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
        className="absolute inset-0 -z-10 bg-gradient-to-t from-maroon-950/85 via-maroon-950/10 to-maroon-950/20"
      />
      {/*
        Dibuat ringkas untuk orang yang membuka dari HP dalam keadaan lelah: judul, satu
        kalimat, satu tombol, lalu empat Ruang. Semuanya muat di layar pertama ponsel.
      */}
      <Container
        size="wide"
        className="relative flex flex-col justify-center pb-20 pt-28 sm:pb-24 sm:pt-36 lg:min-h-[min(100svh,58rem)] lg:pb-28 lg:pt-40"
      >
        <Rise>
          <h1 className="jp-hero-heading max-w-3xl">
            Kamu tidak harus
            <br />
            melewati ini <span className="italic text-gold-400">sendirian.</span>
          </h1>
        </Rise>
        <Rise delay={100}>
          <p className="mt-5 max-w-md text-base leading-7 text-sand-100/85 sm:mt-7 sm:text-lg sm:leading-8">
            Apa pun yang sedang kamu bawa hari ini, ceritakan saja. Kami mau mendengar dan mendoakan.
          </p>
        </Rise>
        <Rise delay={180}>
          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 sm:mt-9">
            <ButtonLink href="/pertolongan" variant="light" size="lg">
              Mulai bercerita <Icon.arrowRight className="h-4 w-4" />
            </ButtonLink>
            <p className="text-sm text-sand-100/65">Gratis, tidak dipungut biaya.</p>
          </div>
        </Rise>
        <Rise delay={260}>
          <RuangTiles className="mt-10 sm:mt-14" />
        </Rise>
      </Container>
      <HeroLip />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Pembuka: apa ini sebenarnya
   ═══════════════════════════════════════════════════════════════════════════ */

/** Foto kecil berbentuk kapsul yang duduk di tengah kalimat. */
function InlinePhoto({ src }: { src: string }) {
  return (
    <span className="relative mx-[0.12em] inline-block h-[0.8em] w-[1.7em] overflow-hidden rounded-full align-[-0.06em] shadow-warm sm:w-[2.1em]">
      <Image src={src} alt="" fill sizes="180px" className="object-cover" />
    </span>
  );
}

function Intro() {
  return (
    <section className="relative overflow-hidden bg-cream py-16 sm:py-20 lg:py-24">
      <Container size="wide">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-16">
          <Reveal className="lg:col-span-8">
            <h2 className="font-display max-w-3xl text-[clamp(1.75rem,1rem+3.1vw,3.5rem)] font-medium leading-[1.16] tracking-[-0.025em] text-ink">
              Ada hari ketika <span className="italic text-maroon-700">didengarkan</span> saja sudah berarti banyak. Di
              sini, kamu boleh datang dengan ceritamu, <InlinePhoto src={photos.aboutFriends} /> apa adanya.
            </h2>
          </Reveal>
          <Reveal delay={100} className="lg:col-span-4">
            <p className="text-lead text-sand-700">
              Kami menemani lewat empat ruang: dikuatkan, didoakan, ditemani bercerita, dan bertumbuh. Semuanya gratis,
              dan kamu boleh tanpa nama.
            </p>
            <div className="mt-6">
              <ArrowLink href="/tentang-kami">Kenali kami lebih jauh</ArrowLink>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Bab Ruang Cerita
   ═══════════════════════════════════════════════════════════════════════════ */

function CeritaChapter() {
  return (
    <section id="bab-cerita" className="relative scroll-mt-20 overflow-hidden bg-cream py-20 sm:py-28 lg:py-40">
      <Container size="wide">
        <ChapterHeading ruang={getRuang("ruang-cerita")} />

        <div className="mt-16 grid gap-16 sm:mt-20 lg:mt-24 lg:grid-cols-12 lg:gap-16">
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
                  className="group grid grid-cols-[3.5rem_1fr] gap-4 border-b border-sand-300/70 py-7 sm:grid-cols-[5.5rem_1fr] sm:gap-6 sm:py-8"
                >
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
          </div>
        </div>
      </Container>
    </section>
  );
}
