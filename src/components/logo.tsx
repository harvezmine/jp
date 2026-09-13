import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Lambang JP. Menunjuk ke /brand/logo.svg; timpa file itu dengan logo asli
 * dan seluruh situs ikut berubah, tanpa menyentuh kode.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center", className)}
      aria-hidden="true"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/logo.svg" alt="" className="h-full w-full object-contain" />
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
      className={cn("group flex items-center gap-2.5 sm:gap-3", className)}
      aria-label={`${"Janji Pengharapan"}, kembali ke beranda`}
    >
      <span
        className={cn(
          "grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-transform duration-500 group-hover:scale-105 sm:h-11 sm:w-11",
          light ? "bg-sand-50/10 text-sand-50" : "bg-maroon-700 text-sand-50",
        )}
      >
        <LogoMark className="h-6 w-6 sm:h-6.5 sm:w-6.5" />
      </span>
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
