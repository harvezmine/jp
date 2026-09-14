"use client";

import "aos/dist/aos.css";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ParallaxProvider } from "react-scroll-parallax";

type AosModule = typeof import("aos");

export function MotionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [reduceMotion, setReduceMotion] = useState(true);
  const aos = useRef<AosModule | null>(null);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReduceMotion(media.matches);
    updatePreference();
    media.addEventListener("change", updatePreference);
    let cancelled = false;
    let frame = 0;
    const refresh = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => aos.current?.refresh());
    };
    import("aos")
      .then((mod) => {
        if (cancelled) return;
        aos.current = mod.default;
        mod.default.init({ duration: 650, easing: "ease-out-cubic", once: true, offset: 40 });
        document.documentElement.classList.add("motion-ready");
        document.fonts?.ready.then(() => {
          if (!cancelled) refresh();
        });
        refresh();
      })
      .catch(() => {
        if (!cancelled) document.documentElement.classList.remove("motion-ready");
      });
    const observer = new ResizeObserver(refresh);
    observer.observe(document.body);
    document.addEventListener("load", refresh, true);
    document.addEventListener("toggle", refresh, true);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      media.removeEventListener("change", updatePreference);
      document.removeEventListener("load", refresh, true);
      document.removeEventListener("toggle", refresh, true);
      document.documentElement.classList.remove("motion-ready");
    };
  }, []);
  useEffect(() => {
    const frame = requestAnimationFrame(() => aos.current?.refreshHard());
    return () => cancelAnimationFrame(frame);
  }, [pathname]);
  return <ParallaxProvider isDisabled={reduceMotion}>{children}</ParallaxProvider>;
}
