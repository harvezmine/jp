"use client";

import Image from "next/image";
import type { ComponentProps } from "react";
import { Parallax as ParallaxBase } from "react-scroll-parallax";

import { cn } from "@/lib/utils";

/** Bisa dipakai langsung dari server component (hanya props serializable). */
export function Parallax(props: ComponentProps<typeof ParallaxBase>) {
  return <ParallaxBase {...props} />;
}

/**
 * Foto yang bergerak lebih lambat dari halaman. Lapisan gambar dibuat 30% lebih
 * tinggi dari bingkainya, lalu digeser maksimal 10% ke atas/bawah, sehingga
 * tepi gambar tidak pernah terlihat.
 */
export function ParallaxImage({
  src,
  alt,
  sizes = "100vw",
  priority,
  strength = 10,
  cover = false,
  className,
  imageClassName,
}: {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  /** Persentase geser, 0 sampai 10. */
  strength?: number;
  /** true: menutupi induknya (absolute inset-0) alih-alih mengikuti alur. */
  cover?: boolean;
  className?: string;
  imageClassName?: string;
}) {
  const s = Math.min(10, Math.max(0, strength));
  return (
    <div className={cn(cover ? "absolute inset-0" : "relative", "overflow-hidden", className)}>
      <ParallaxBase translateY={[-s, s]} className="absolute inset-x-0 -inset-y-[15%]">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn("object-cover", imageClassName)}
        />
      </ParallaxBase>
    </div>
  );
}
