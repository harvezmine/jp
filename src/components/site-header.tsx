"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Logo } from "@/components/logo";
import { Icon } from "@/components/icons";
import { ButtonLink } from "@/components/ui";
import { navigation, site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Header berubah padat setelah pengguna mulai menggulir.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Tutup menu saat pindah halaman.
  useEffect(() => setOpen(false), [pathname]);

  // Kunci scroll body selama menu mobile terbuka.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Esc menutup menu.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  /*
    Setiap halaman diawali hero maroon gelap. Selama header masih transparan di
    atasnya, seluruh isinya harus memakai warna terang; begitu header berubah
    padat (digulir) atau menu mobile terbuka, latarnya krem sehingga warna gelap
    yang justru terbaca.
  */
  const onDark = !scrolled && !open;

  return (
    <>
      <a
        href="#konten-utama"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-maroon-700 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-sand-50"
      >
        Lompat ke konten
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled || open
            ? "border-b border-sand-200/80 bg-cream/85 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:h-18 sm:px-6 lg:px-8">
          <Logo variant={onDark ? "light" : "default"} />

          {/* Navigasi desktop */}
          <nav className="hidden items-center gap-1 xl:flex" aria-label="Navigasi utama">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-300",
                  onDark
                    ? isActive(item.href)
                      ? "text-sand-50"
                      : "text-sand-200/75 hover:text-sand-50"
                    : isActive(item.href)
                      ? "text-maroon-800"
                      : "text-sand-700 hover:text-maroon-700",
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute inset-x-3.5 -bottom-0.5 h-0.5 origin-left rounded-full transition-transform duration-300",
                    onDark ? "bg-gold-400" : "bg-maroon-600",
                    isActive(item.href) ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/*
              Disembunyikan lewat pembungkus, bukan lewat kelas "hidden" pada
              tombolnya: kelas display bawaan tombol (inline-flex) dan "hidden"
              punya kekhususan yang sama, jadi mana yang menang bergantung pada
              urutan aturan di stylesheet, bukan urutan penulisan kelas.
            */}
            <span className="hidden sm:block">
              <ButtonLink href="/pertolongan" variant={onDark ? "light" : "primary"} className="whitespace-nowrap">
                <Icon.hands className="h-4 w-4" />
                Butuh Pertolongan
              </ButtonLink>
            </span>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? "Tutup menu" : "Buka menu"}
              className={cn(
                "grid h-11 w-11 place-items-center rounded-full border transition-colors xl:hidden",
                onDark
                  ? "border-sand-50/30 text-sand-50 hover:bg-sand-50/10"
                  : "border-sand-300 text-ink hover:bg-sand-100",
              )}
            >
              {open ? <Icon.close className="h-5 w-5" /> : <Icon.menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Menu mobile: panel penuh, mudah dijangkau jempol */}
      {open && (
        <div
          id="menu-mobile"
          className="animate-fade fixed inset-0 z-40 bg-cream xl:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi"
        >
          <div className="flex h-full flex-col overflow-y-auto px-5 pb-8 pt-20 sm:px-6">
            <nav className="flex flex-col" aria-label="Navigasi mobile">
              {navigation.map((item, i) => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{ animationDelay: `${i * 45}ms` }}
                  className={cn(
                    "animate-rise flex items-center justify-between border-b border-sand-200 py-4 text-xl font-display font-semibold transition-colors",
                    isActive(item.href) ? "text-maroon-700" : "text-ink",
                  )}
                >
                  {item.label}
                  <Icon.arrowUpRight className="h-5 w-5 text-sand-400" />
                </Link>
              ))}
            </nav>

            <div
              className="animate-rise mt-8 space-y-3"
              style={{ animationDelay: `${navigation.length * 45}ms` }}
            >
              <ButtonLink href="/pertolongan" size="lg" className="w-full">
                <Icon.hands className="h-5 w-5" />
                Butuh Pertolongan
              </ButtonLink>
              <ButtonLink
                href={`https://wa.me/${site.whatsapp}`}
                external
                variant="outline"
                size="lg"
                className="w-full"
              >
                <Icon.whatsapp className="h-5 w-5" />
                Chat WhatsApp
              </ButtonLink>
            </div>

            <div className="mt-auto pt-10">
              <p className="text-xs uppercase tracking-[0.2em] text-sand-600">Ikuti kami</p>
              <div className="mt-3 flex gap-2">
                {[
                  { href: site.socials.instagram, icon: Icon.instagram, label: "Instagram" },
                  { href: site.socials.tiktok, icon: Icon.tiktok, label: "TikTok" },
                  { href: site.socials.youtube, icon: Icon.youtube, label: "YouTube" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="grid h-12 w-12 place-items-center rounded-full border border-sand-300 text-sand-700 transition-colors hover:border-maroon-400 hover:text-maroon-700"
                  >
                    <s.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
