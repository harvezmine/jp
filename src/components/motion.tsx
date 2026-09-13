"use client";

import "aos/dist/aos.css";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ParallaxProvider } from "react-scroll-parallax";

type AosModule = typeof import("aos");

/**
 * Menjalankan AOS (animasi saat scroll) dan menyediakan konteks parallax untuk
 * seluruh halaman publik. Keduanya mati bila perangkat pengguna meminta
 * "kurangi gerakan".
 *
 * AOS di-import dinamis karena modulnya menyentuh `window` dan tidak boleh
 * ikut dievaluasi saat render di server.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [reduceMotion, setReduceMotion] = useState(false);
  const aos = useRef<AosModule | null>(null);
  const firstPath = useRef(true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(media.matches);

    let cancelled = false;
    import("aos").then((mod) => {
      if (cancelled || aos.current) return;
      aos.current = mod.default;
      mod.default.init({
        duration: 900,
        easing: "ease-out-cubic",
        once: true,
        offset: 60,
        disable: () => media.matches,
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Navigasi di sisi klien memasang elemen baru yang belum dikenal AOS.
  useEffect(() => {
    if (firstPath.current) {
      firstPath.current = false;
      return;
    }
    aos.current?.refreshHard();
  }, [pathname]);

  return <ParallaxProvider isDisabled={reduceMotion}>{children}</ParallaxProvider>;
}
