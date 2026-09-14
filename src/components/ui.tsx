import Link from "next/link";
import type { ComponentProps, ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/icons";

/* ── Wadah & jarak ────────────────────────────────────────────────────────── */

export function Container({
  children,
  className,
  size = "default",
}: {
  children: ReactNode;
  className?: string;
  size?: "default" | "narrow" | "wide";
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-6 lg:px-8",
        size === "narrow" && "max-w-3xl",
        size === "default" && "max-w-6xl",
        size === "wide" && "max-w-7xl",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-20 sm:py-28 lg:py-32", className)}>
      {children}
    </section>
  );
}

/* ── Animasi masuk tanpa JavaScript ───────────────────────────────────────── */

/**
 * Untuk konten di atas lipatan (hero). Berbeda dari <Reveal>, animasinya murni
 * CSS: elemen tidak pernah tersembunyi menunggu JavaScript, sehingga teks utama
 * langsung terlihat dan LCP tidak tertunda.
 */
export function Rise({
  children,
  delay = 0,
  as: Tag = "div",
  className,
}: {
  children: ReactNode;
  delay?: number;
  as?: ElementType;
  className?: string;
}) {
  return (
    <Tag
      className={cn("animate-rise", className)}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

/* ── Judul section ────────────────────────────────────────────────────────── */

export function SectionHeading({
  title,
  description,
  variant = "default",
  align = "left",
  size = "default",
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  variant?: "default" | "light";
  align?: "left" | "center";
  size?: "default" | "large";
  className?: string;
}) {
  const light = variant === "light";
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <h2
        className={cn(
          size === "large" ? "text-display" : "text-headline",
          light ? "text-sand-50" : "text-ink",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "text-lead mt-5",
            light ? "text-sand-200/80" : "text-sand-700",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

/* ── Tombol ───────────────────────────────────────────────────────────────── */

const buttonBase =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-all duration-300 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-55";

const buttonVariants = {
  primary:
    "bg-maroon-700 text-sand-50 shadow-warm hover:bg-maroon-800 hover:shadow-warm-lg",
  secondary:
    "bg-ink text-sand-50 hover:bg-sand-900",
  outline:
    "border border-sand-300 bg-transparent text-ink hover:border-maroon-400 hover:bg-maroon-50",
  light:
    "bg-sand-50 text-maroon-800 hover:bg-white",
  ghostLight:
    "border border-sand-50/25 text-sand-50 hover:border-sand-50/60 hover:bg-sand-50/10",
  ghost:
    "text-maroon-700 hover:bg-maroon-50",
} as const;

type ButtonVariant = keyof typeof buttonVariants;

export function Button({
  variant = "primary",
  size = "default",
  className,
  children,
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant; size?: "default" | "lg" }) {
  return (
    <button
      className={cn(buttonBase, buttonVariants[variant], size === "lg" && "min-h-13 px-7 text-base", className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "default",
  className,
  children,
  href,
  external,
  ...props
}: ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: "default" | "lg";
  external?: boolean;
}) {
  const cls = cn(
    buttonBase,
    buttonVariants[variant],
    size === "lg" && "min-h-13 px-7 text-base",
    className,
  );

  if (external && typeof href === "string" && !href.startsWith("/")) {
    return (
      <a href={href as string} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cls} {...props}>
      {children}
    </Link>
  );
}

/* ── Kartu & label ────────────────────────────────────────────────────────── */

export function Card({
  children,
  className,
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-sand-200 bg-white",
        interactive &&
          "transition-all duration-500 hover:-translate-y-1 hover:border-maroon-200 hover:shadow-warm-lg",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  tone = "maroon",
  className,
}: {
  children: ReactNode;
  tone?: "maroon" | "sand" | "gold" | "clay" | "green" | "red" | "light";
  className?: string;
}) {
  const tones = {
    maroon: "bg-maroon-50 text-maroon-700 ring-maroon-200",
    sand: "bg-sand-100 text-sand-700 ring-sand-300",
    gold: "bg-gold-400/15 text-[#8a6a1f] ring-gold-400/40",
    clay: "bg-clay-500/12 text-clay-600 ring-clay-500/30",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    red: "bg-red-50 text-red-700 ring-red-200",
    light: "bg-sand-50/12 text-sand-100 ring-sand-50/25",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * Tautan teks dengan garis bawah yang menyapu dan panah yang bergeser saat
 * hover. Alamat http(s) otomatis dibuka di tab baru.
 */
export function ArrowLink({
  href,
  children,
  className,
  external,
  tone = "maroon",
}: {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
  tone?: "maroon" | "light";
}) {
  const isExternal = external ?? /^https?:\/\//.test(href);
  const inner = (
    <>
      <span className="link-sweep pb-0.5">{children}</span>
      <Icon.arrowRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
    </>
  );
  const cls = cn(
    "group inline-flex items-center gap-2 text-sm font-semibold transition-colors",
    tone === "light" ? "text-gold-400 hover:text-sand-50" : "text-maroon-700 hover:text-maroon-900",
    className,
  );

  return isExternal ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
  ) : (
    <Link href={href} className={cls}>{inner}</Link>
  );
}

/** Ditampilkan saat daftar kosong, supaya halaman tidak terasa rusak. */
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-sand-300 bg-sand-50 px-6 py-14 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-maroon-50 text-maroon-600">
        <Icon.spark className="h-5 w-5" />
      </div>
      <p className="font-display mt-4 text-lg font-semibold text-ink">{title}</p>
      {description && (
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-sand-700">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
