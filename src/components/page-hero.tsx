import type { ReactNode } from "react";

import { ParallaxImage } from "@/components/parallax";
import { Container, Rise } from "@/components/ui";

/**
 * Tepi bawah hero yang melengkung, supaya section berikutnya terlihat seperti
 * lembaran yang menumpuk di atas hero. Warnanya harus sama dengan latar
 * section sesudahnya.
 */
export function HeroLip({ className = "bg-cream" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`absolute inset-x-0 -bottom-px h-8 rounded-t-[2rem] sm:h-12 sm:rounded-t-[3rem] ${className}`}
    />
  );
}

/**
 * Hero untuk halaman selain beranda. Foto latar bergerak pelan (parallax) dan
 * ditutup gradasi maroon supaya teks tetap terbaca. Tingginya dijaga agar isi
 * halaman sudah mengintip di layar HP.
 */
export function PageHero({
  title,
  description,
  image,
  imageAlt = "",
  children,
  lipClassName,
}: {
  title: ReactNode;
  description?: ReactNode;
  image?: string;
  imageAlt?: string;
  children?: ReactNode;
  /** Warna lengkung bawah. Samakan dengan latar section sesudah hero. */
  lipClassName?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-maroon-950 pb-20 pt-28 sm:pb-32 sm:pt-44 lg:pb-36 lg:pt-52">
      {image ? (
        <>
          <ParallaxImage
            src={image}
            alt={imageAlt}
            priority
            cover
            className="-z-20"
            imageClassName="animate-settle"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-gradient-to-t from-maroon-950 via-maroon-950/70 to-maroon-950/35"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-gradient-to-r from-maroon-950/85 via-maroon-950/40 to-transparent"
          />
        </>
      ) : (
        <div aria-hidden className="bg-maroon-deep absolute inset-0 -z-20" />
      )}
      <div aria-hidden className="bg-grain pointer-events-none absolute inset-0 -z-10 opacity-[0.1]" />

      <Container size="wide" className="relative">
        <Rise>
          <h1 className="text-display max-w-3xl text-sand-50">{title}</h1>
        </Rise>
        {description && (
          <Rise delay={90}>
            <p className="text-lead mt-5 max-w-xl text-sand-200/85 sm:mt-6">{description}</p>
          </Rise>
        )}
        {children && (
          <Rise delay={180}>
            <div className="mt-8 sm:mt-9">{children}</div>
          </Rise>
        )}
      </Container>

      <HeroLip className={lipClassName} />
    </section>
  );
}
