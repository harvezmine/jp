import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/reveal";
import { RichText } from "@/components/rich-text";
import { ShareButtons } from "@/components/share-buttons";
import { PostCard } from "@/components/content-cards";
import { Icon } from "@/components/icons";
import { HeroLip } from "@/components/page-hero";
import { ArrowLink, ButtonLink, Container, Rise } from "@/components/ui";
import { mockPhoto } from "@/lib/mock";
import { getPostBySlug, getPostSlugs, getPosts } from "@/lib/queries";
import { POST_CATEGORY_LABEL } from "@/lib/types";
import { formatDate, readingTime } from "@/lib/utils";
import { site, waLink } from "@/lib/site";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Konten tidak ditemukan" };

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: { canonical: `/konten/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt ?? undefined,
      publishedTime: post.published_at ?? undefined,
      images: post.cover_url ? [{ url: post.cover_url }] : undefined,
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const cover = post.cover_url ?? mockPhoto(post.slug);
  const related = (await getPosts({ limit: 4, category: post.category }))
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? undefined,
    datePublished: post.published_at ?? post.created_at,
    dateModified: post.updated_at,
    author: { "@type": "Organization", name: post.author ?? site.name },
    publisher: { "@type": "Organization", name: site.name },
    mainEntityOfPage: `${site.url}/konten/${post.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Kepala tulisan */}
      <section className="bg-maroon-deep relative isolate overflow-hidden pb-24 pt-32 sm:pb-28 sm:pt-44">
        <div
          aria-hidden
          className="animate-breathe pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-maroon-500/25 blur-[90px]"
        />
        <div aria-hidden className="bg-grain pointer-events-none absolute inset-0 opacity-[0.1]" />
        <Container size="narrow" className="relative">
          <Link
            href="/konten"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-sand-300/70 transition-colors hover:text-gold-400"
          >
            <Icon.arrowLeft className="h-4 w-4" />
            Semua konten
          </Link>

          <Rise delay={60}>
            <h1 className="text-headline mt-8 text-sand-50">{post.title}</h1>
          </Rise>

          <Rise delay={120}>
            <p className="mt-6 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-sand-300/80">
              <span className="font-semibold text-gold-400">{POST_CATEGORY_LABEL[post.category]}</span>
              <span aria-hidden>·</span>
              <span>{formatDate(post.published_at ?? post.created_at)}</span>
              <span aria-hidden>·</span>
              <span>{readingTime(post.body)} menit baca</span>
              {post.author && (
                <>
                  <span aria-hidden>·</span>
                  <span>{post.author}</span>
                </>
              )}
            </p>
          </Rise>

          {post.excerpt && (
            <Rise delay={180}>
              <p className="text-lead mt-6 text-sand-200/85">{post.excerpt}</p>
            </Rise>
          )}
        </Container>
        <HeroLip />
      </section>

      <section className="bg-cream pb-24 sm:pb-32">
        <Container size="narrow">
          {cover && (
            <Reveal variant="scale">
              <div className="relative -mt-14 aspect-[16/9] overflow-hidden rounded-[1.75rem] shadow-warm-lg sm:-mt-16">
                <Image
                  src={cover}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover"
                />
              </div>
            </Reveal>
          )}

          <article className={cover ? "mt-12 sm:mt-14" : "pt-14 sm:pt-16"}>
            {post.body ? (
              <RichText content={post.body} />
            ) : (
              <p className="text-sand-600">Isi tulisan belum tersedia.</p>
            )}
          </article>

          <div className="mt-14 border-t border-sand-200 pt-8">
            <p className="mb-4 text-sm font-semibold text-ink">
              Bagikan ke teman yang mungkin sedang butuh ini.
            </p>
            <ShareButtons title={post.title} path={`/konten/${post.slug}`} />
          </div>

          {/* Ajakan lembut ke formulir pertolongan */}
          <div className="bg-maroon-deep relative isolate mt-14 overflow-hidden rounded-[1.75rem] p-7 text-sand-50 sm:p-10">
            <div aria-hidden className="bg-grain pointer-events-none absolute inset-0 -z-10 opacity-[0.08]" />
            <h2 className="font-display text-2xl font-semibold leading-snug sm:text-3xl">
              Sedang menghadapi hal yang berat?
            </h2>
            <p className="mt-3 max-w-lg leading-relaxed text-sand-200/80">
              Cerita saja ke kami, seadanya. Kami akan mendoakan dan menghubungimu.
            </p>
            <div className="mt-7 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
              <ButtonLink href="/pertolongan" variant="light">
                <Icon.hands className="h-4 w-4" />
                Minta pertolongan
              </ButtonLink>
              <ArrowLink href={waLink()} tone="light">
                Chat lewat WhatsApp
              </ArrowLink>
            </div>
          </div>
        </Container>
      </section>

      {related.length > 0 && (
        <section className="bg-paper py-24 sm:py-28">
          <Container size="wide">
            <h2 className="text-headline text-ink">Bacaan lain</h2>
            <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <Reveal key={p.id} delay={i * 80}>
                  <PostCard post={p} />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
