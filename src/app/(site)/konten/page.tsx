import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { PostCard, QuoteCard, SocialCard } from "@/components/content-cards";
import { ButtonLink, Container, EmptyState } from "@/components/ui";
import { Icon } from "@/components/icons";
import { getPosts, getQuotes, getSocialPosts } from "@/lib/queries";
import { photos } from "@/lib/photos";
import { POST_CATEGORY_LABEL } from "@/lib/types";
import { cn } from "@/lib/utils";
import { socialLinks } from "@/lib/site";

const SOCIAL_CTA = { instagram: "Ikuti di Instagram", tiktok: "Follow di TikTok", youtube: "Subscribe di YouTube" } as const;

export const metadata: Metadata = {
  title: "Konten",
  description:
    "Renungan, artikel, kesaksian, kutipan ayat, dan video dari Janji Pengharapan di TikTok, YouTube, dan Instagram.",
};

const tabs = [
  { key: "tulisan", label: "Tulisan" },
  { key: "quotes", label: "Kutipan" },
  { key: "sosmed", label: "Video & sosmed" },
] as const;

const categories = [
  { key: "semua", label: "Semua" },
  ...Object.entries(POST_CATEGORY_LABEL).map(([key, label]) => ({ key, label })),
];

type Search = { tab?: string; kategori?: string };

export default async function KontenPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const params = await searchParams;
  const tab = tabs.some((t) => t.key === params.tab) ? params.tab! : "tulisan";
  const kategori = params.kategori ?? "semua";

  const [posts, quotes, socials] = await Promise.all([
    tab === "tulisan" ? getPosts({ category: kategori }) : Promise.resolve([]),
    tab === "quotes" ? getQuotes() : Promise.resolve([]),
    tab === "sosmed" ? getSocialPosts() : Promise.resolve([]),
  ]);

  const href = (next: Partial<Search>) => {
    const sp = new URLSearchParams();
    const t = next.tab ?? tab;
    if (t !== "tulisan") sp.set("tab", t);
    const k = next.kategori ?? kategori;
    if (t === "tulisan" && k !== "semua") sp.set("kategori", k);
    const qs = sp.toString();
    return qs ? `/konten?${qs}` : "/konten";
  };

  return (
    <>
      <PageHero
        image={photos.heroContent}
        imageAlt="Alkitab terbuka di samping cangkir kopi"
        title="Tulisan, ayat, dan video untuk dibaca ulang."
        description="Semua yang pernah kami bagikan, dikumpulkan di sini."
      />

      {/* Navigasi tab, bisa digeser di layar sempit */}
      <div className="sticky top-16 z-30 border-b border-sand-200 bg-cream/90 backdrop-blur-xl sm:top-18">
        <Container size="wide">
          <div className="-mx-1 flex gap-1 overflow-x-auto py-3">
            {tabs.map((t) => (
              <Link
                key={t.key}
                href={href({ tab: t.key })}
                scroll={false}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors",
                  tab === t.key
                    ? "bg-maroon-700 text-sand-50"
                    : "text-sand-700 hover:bg-sand-100",
                )}
              >
                {t.label}
              </Link>
            ))}
          </div>
        </Container>
      </div>

      <section className="bg-cream pb-24 pt-12 sm:pb-32 sm:pt-16">
        <Container size="wide">
          {tab === "tulisan" && (
            <>
              <div className="-mx-1 mb-12 flex gap-2 overflow-x-auto px-1 pb-1">
                {categories.map((c) => (
                  <Link
                    key={c.key}
                    href={href({ kategori: c.key })}
                    scroll={false}
                    className={cn(
                      "shrink-0 rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors",
                      kategori === c.key
                        ? "border-maroon-600 bg-maroon-50 text-maroon-700"
                        : "border-sand-300 text-sand-700 hover:border-maroon-300",
                    )}
                  >
                    {c.label}
                  </Link>
                ))}
              </div>

              {posts.length ? (
                <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                  {posts.map((p, i) => (
                    <Reveal
                      key={p.id}
                      delay={(i % 3) * 80}
                      className={cn(i === 0 && posts.length > 2 && "sm:col-span-2")}
                    >
                      <PostCard post={p} variant={i === 0 && posts.length > 2 ? "feature" : "default"} />
                    </Reveal>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="Belum ada tulisan di kategori ini"
                  description="Coba pilih kategori lain. Tulisan baru kami tambahkan setiap minggu."
                  action={
                    <ButtonLink href="/konten" variant="outline">
                      Lihat semua tulisan
                    </ButtonLink>
                  }
                />
              )}
            </>
          )}

          {tab === "quotes" &&
            (quotes.length ? (
              <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
                {quotes.map((q, i) => (
                  <Reveal key={q.id} delay={(i % 3) * 70} className="mb-5 break-inside-avoid">
                    <QuoteCard quote={q} index={i} />
                  </Reveal>
                ))}
              </div>
            ) : (
              <EmptyState
                title="Belum ada kutipan"
                description="Kutipan ayat akan muncul di sini setelah ditambahkan lewat admin panel."
              />
            ))}

          {tab === "sosmed" &&
            (socials.length ? (
              <>
                <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
                  {socials.map((s, i) => (
                    <Reveal key={s.id} delay={(i % 4) * 70}>
                      <SocialCard post={s} />
                    </Reveal>
                  ))}
                </div>
                <Reveal delay={150}>
                  <div className="mt-14 flex flex-col justify-center gap-3 sm:flex-row">
                    {socialLinks.map(({ key, href }) => {
                      const SocialIcon = Icon[key];
                      return (
                        <ButtonLink key={key} href={href} external variant="outline">
                          <SocialIcon className="h-4 w-4" />
                          {SOCIAL_CTA[key]}
                        </ButtonLink>
                      );
                    })}
                  </div>
                </Reveal>
              </>
            ) : (
              <EmptyState
                title="Belum ada video yang dipilih"
                description="Tambahkan tautan TikTok, YouTube, atau Instagram lewat admin panel untuk menampilkannya di sini."
                action={
                  socialLinks[0] ? (
                    <ButtonLink href={socialLinks[0].href} external>
                      Buka {socialLinks[0].label} kami
                    </ButtonLink>
                  ) : undefined
                }
              />
            ))}
        </Container>
      </section>
    </>
  );
}
