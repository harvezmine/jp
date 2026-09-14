import Image from "next/image";
import Link from "next/link";

import { Icon } from "@/components/icons";
import { mockPhoto } from "@/lib/mock";
import {
  POST_CATEGORY_LABEL,
  type JPEvent,
  type Post,
  type Quote,
  type SocialPost,
} from "@/lib/types";
import { cn, dateParts, formatDateShort, formatTime, readingTime } from "@/lib/utils";

/* ── Sampul ───────────────────────────────────────────────────────────────── */

function Cover({
  src,
  sizes,
  className,
  fallbackIcon = "book",
}: {
  src: string | null;
  sizes: string;
  className?: string;
  fallbackIcon?: keyof typeof Icon;
}) {
  const FallbackIcon = Icon[fallbackIcon];
  return (
    <div className={cn("relative overflow-hidden bg-sand-200", className)}>
      {src ? (
        <Image
          src={src}
          alt=""
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
        />
      ) : (
        <div className="bg-maroon-deep absolute inset-0 grid place-items-center">
          <FallbackIcon className="h-10 w-10 text-maroon-300/60" />
        </div>
      )}
    </div>
  );
}

/* ── Tulisan ──────────────────────────────────────────────────────────────── */

function PostMeta({ post }: { post: Post }) {
  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-sand-600">
      <span className="font-semibold text-maroon-700">{POST_CATEGORY_LABEL[post.category]}</span>
      <span aria-hidden>·</span>
      <span>{formatDateShort(post.published_at ?? post.created_at)}</span>
      <span aria-hidden>·</span>
      <span>{readingTime(post.body)} menit baca</span>
    </p>
  );
}

export function PostCard({
  post,
  variant = "default",
}: {
  post: Post;
  variant?: "default" | "feature" | "compact";
}) {
  const cover = post.cover_url ?? mockPhoto(post.slug);
  const href = `/konten/${post.slug}`;

  if (variant === "compact") {
    return (
      <Link href={href} className="group grid grid-cols-[6.5rem_1fr] items-center gap-5 sm:grid-cols-[8.5rem_1fr]">
        <Cover src={cover} sizes="136px" className="aspect-square rounded-xl sm:aspect-[4/3]" />
        <div className="min-w-0">
          <PostMeta post={post} />
          <h3 className="font-display mt-2 text-lg font-semibold leading-snug text-ink transition-colors duration-300 group-hover:text-maroon-700 sm:text-xl">
            {post.title}
          </h3>
        </div>
      </Link>
    );
  }

  const feature = variant === "feature";

  return (
    <Link href={href} className="group flex h-full flex-col">
      <Cover
        src={cover}
        sizes={
          feature
            ? "(min-width: 1024px) 55vw, 100vw"
            : "(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
        }
        className={feature ? "aspect-[16/10] rounded-[1.75rem]" : "aspect-[4/3] rounded-2xl"}
      />
      <div className={cn("flex flex-1 flex-col", feature ? "mt-7" : "mt-5")}>
        <PostMeta post={post} />
        <h3
          className={cn(
            "font-display mt-3 font-semibold leading-snug text-ink transition-colors duration-300 group-hover:text-maroon-700",
            feature ? "text-2xl sm:text-3xl lg:text-[2.1rem] lg:leading-tight" : "text-xl",
          )}
        >
          {post.title}
        </h3>
        {post.excerpt && (
          <p
            className={cn(
              "line-clamp-3 text-sand-700",
              feature ? "text-lead mt-4" : "mt-2.5 text-[15px] leading-relaxed",
            )}
          >
            {post.excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}

/* ── Kutipan firman ───────────────────────────────────────────────────────── */

export function QuoteCard({ quote, index = 0 }: { quote: Quote; index?: number }) {
  const tone = index % 4;
  const dark = tone === 0;

  return (
    <figure
      className={cn(
        "flex h-full flex-col justify-between gap-8 rounded-[1.5rem] p-7 transition-transform duration-500 hover:-translate-y-1 sm:p-8",
        tone === 0 && "bg-maroon-900 text-sand-100",
        tone === 1 && "bg-sand-100 text-ink",
        tone === 2 && "bg-white text-ink ring-1 ring-inset ring-sand-200",
        tone === 3 && "bg-clay-500/10 text-ink",
      )}
    >
      <div>
        <span
          aria-hidden
          className={cn(
            "font-display block h-9 text-7xl leading-none",
            dark ? "text-gold-400/70" : "text-maroon-300",
          )}
        >
          &ldquo;
        </span>
        <blockquote className="font-display mt-3 text-xl leading-snug sm:text-[1.35rem]">
          {quote.content}
        </blockquote>
      </div>
      {(quote.reference || quote.author) && (
        <figcaption
          className={cn(
            "flex items-center gap-3 text-sm font-semibold",
            dark ? "text-gold-400" : "text-maroon-700",
          )}
        >
          {quote.reference ?? quote.author}
        </figcaption>
      )}
    </figure>
  );
}

/* ── Event ────────────────────────────────────────────────────────────────── */

export function EventCard({ event, past = false }: { event: JPEvent; past?: boolean }) {
  const d = dateParts(event.starts_at);
  const cover = event.cover_url ?? mockPhoto(event.slug, "event");

  return (
    <Link
      href={`/event/${event.slug}`}
      className={cn(
        "group grid grid-cols-[4.5rem_1fr] items-center gap-5 rounded-[1.5rem] bg-white p-3 pr-5 ring-1 ring-inset ring-sand-200 transition duration-500 hover:-translate-y-1 hover:shadow-warm-lg hover:ring-maroon-200 sm:grid-cols-[5.5rem_1fr_10rem] sm:gap-6 sm:p-4",
        past && "opacity-75",
      )}
    >
      <div className="flex h-full min-h-20 flex-col items-center justify-center rounded-2xl bg-maroon-700 py-3 text-sand-50 sm:min-h-28">
        <span className="font-display text-3xl font-semibold leading-none sm:text-4xl">{d.day}</span>
        <span className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-sand-200">
          {d.month}
        </span>
      </div>

      <div className="min-w-0 py-1">
        <p className="text-xs font-medium capitalize text-sand-600">
          {past ? "Sudah berlangsung" : d.weekday} · {formatTime(event.starts_at)}
        </p>
        <h3 className="font-display mt-1.5 text-lg font-semibold leading-snug text-ink transition-colors duration-300 group-hover:text-maroon-700 sm:text-xl">
          {event.title}
        </h3>
        {event.location && (
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-sand-700">
            <Icon.pin className="h-3.5 w-3.5 shrink-0 text-sand-500" />
            <span className="truncate">{event.location}</span>
          </p>
        )}
      </div>

      <Cover
        src={cover}
        sizes="160px"
        fallbackIcon="calendar"
        className="hidden aspect-[4/3] rounded-xl sm:block"
      />
    </Link>
  );
}

/* ── Konten sosmed (kurasi manual) ────────────────────────────────────────── */

const platformMeta = {
  instagram: { label: "Instagram", icon: Icon.instagram, tone: "from-[#8e2d3f] to-[#c9744a]" },
  tiktok: { label: "TikTok", icon: Icon.tiktok, tone: "from-[#241c19] to-[#4f3d31]" },
  youtube: { label: "YouTube", icon: Icon.youtube, tone: "from-[#74222f] to-[#ab4152]" },
} as const;

export function SocialCard({ post }: { post: SocialPost }) {
  const meta = platformMeta[post.platform];
  const thumb = post.thumbnail_url ?? mockPhoto(post.id, "social");

  return (
    <a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-ink"
    >
      {/* Thumbnail video biasanya sudah berisi tulisan, jadi caption ditaruh di bawahnya, bukan di atasnya */}
      <div className="relative aspect-[4/5] overflow-hidden">
        {thumb ? (
          <Image
            src={thumb}
            alt=""
            fill
            sizes="(max-width: 640px) 72vw, (max-width: 1024px) 45vw, 25vw"
            className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
          />
        ) : (
          <div className={cn("absolute inset-0 bg-gradient-to-br", meta.tone)}>
            <div className="bg-grain absolute inset-0 opacity-20" />
          </div>
        )}

        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
          <meta.icon className="h-3.5 w-3.5" />
          {meta.label}
        </span>

        <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 scale-90 place-items-center rounded-full bg-white/90 text-ink opacity-0 transition duration-300 group-hover:scale-100 group-hover:opacity-100">
          <Icon.play className="h-5 w-5 translate-x-0.5" />
        </span>
      </div>

      {/* Padding di pembungkus: kalau ditaruh di elemen yang di-clamp, baris keempat ikut terlihat */}
      {post.caption && (
        <div className="flex-1 p-5">
          <p className="font-display line-clamp-3 text-base leading-snug text-sand-50 sm:text-[1.05rem]">
            {post.caption}
          </p>
        </div>
      )}
    </a>
  );
}
