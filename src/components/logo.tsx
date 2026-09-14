import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Monogram JP dari logo resmi (public/logojp.jpg) yang sudah diubah menjadi
 * vektor di /brand/logo-mark.svg. Warnanya mengikuti warna teks induk
 * (currentColor): maroon di latar terang, krem di latar gelap.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center", className)}
      aria-hidden="true"
    >
      <svg viewBox="0 0 492 894" fill="currentColor" className="h-full w-full">
        <use href="/brand/logo-mark.svg#jp" />
      </svg>
    </span>
  );
}

export function Logo({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "light";
}) {
  const light = variant === "light";

  return (
    <Link
      href="/"
      className={cn("group flex items-center gap-3", className)}
      aria-label="Janji Pengharapan, kembali ke beranda"
    >
      <LogoMark
        className={cn(
          "h-10 w-[1.375rem] transition-transform duration-500 group-hover:-translate-y-0.5 sm:h-11 sm:w-6",
          light ? "text-sand-50" : "text-jp",
        )}
      />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display whitespace-nowrap text-[15px] font-semibold tracking-tight sm:text-base",
            light ? "text-sand-50" : "text-ink",
          )}
        >
          Janji Pengharapan
        </span>
        <span
          className={cn(
            "mt-1 whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.18em]",
            light ? "text-sand-300/70" : "text-sand-600",
          )}
        >
          Komunitas
        </span>
      </span>
    </Link>
  );
}
