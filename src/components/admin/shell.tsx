"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icon } from "@/components/icons";
import { LogoMark } from "@/components/logo";
import { adminNav } from "@/lib/admin-nav";
import { signOut } from "@/app/actions/auth";
import { cn } from "@/lib/utils";

export function AdminShell({
  pendingCount,
  children,
}: {
  pendingCount: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div className="min-h-screen lg:flex">
      {/* ── Sidebar (desktop) ────────────────────────────────────────────── */}
      <aside className="bg-maroon-deep hidden w-64 shrink-0 flex-col lg:sticky lg:top-0 lg:flex lg:h-screen">
        <div className="flex items-center gap-3 px-5 py-6">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-sand-50/10 text-sand-50">
            <LogoMark className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <p className="font-display text-sm font-semibold text-sand-50">Panel Pengurus</p>
            <p className="text-[10px] uppercase tracking-[0.16em] text-sand-300/60">
              Janji Pengharapan
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3" aria-label="Navigasi admin">
          {adminNav.map((item) => {
            const IconComp = Icon[item.icon as keyof typeof Icon];
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-sand-50/12 text-sand-50"
                    : "text-sand-300/70 hover:bg-sand-50/[0.06] hover:text-sand-100",
                )}
              >
                <IconComp className="h-[18px] w-[18px] shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.href === "/admin/permohonan" && pendingCount > 0 && (
                  <span className="grid h-5 min-w-5 place-items-center rounded-full bg-gold-400 px-1.5 text-[11px] font-bold text-maroon-900">
                    {pendingCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sand-50/10 p-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-sand-300/70 transition-colors hover:text-sand-100"
          >
            <Icon.arrowUpRight className="h-[18px] w-[18px]" />
            Lihat situs
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-sand-300/70 transition-colors hover:bg-sand-50/[0.06] hover:text-sand-100"
            >
              <Icon.logout className="h-[18px] w-[18px]" />
              Keluar
            </button>
          </form>
        </div>
      </aside>

      {/* ── Konten ───────────────────────────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header mobile */}
        <header className="bg-maroon-deep sticky top-0 z-30 flex items-center justify-between gap-3 px-4 py-3 lg:hidden">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-sand-50/10 text-sand-50">
              <LogoMark className="h-4.5 w-4.5" />
            </span>
            <p className="font-display text-sm font-semibold text-sand-50">Panel Pengurus</p>
          </div>
          <div className="flex items-center gap-1">
            <Link
              href="/"
              target="_blank"
              aria-label="Lihat situs"
              className="grid h-10 w-10 place-items-center rounded-full text-sand-300/70"
            >
              <Icon.arrowUpRight className="h-5 w-5" />
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                aria-label="Keluar"
                className="grid h-10 w-10 place-items-center rounded-full text-sand-300/70"
              >
                <Icon.logout className="h-5 w-5" />
              </button>
            </form>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:py-10 lg:pb-10">{children}</main>

        {/* Tab bar mobile — jempol-friendly, menggantikan sidebar */}
        <nav
          className="fixed inset-x-0 bottom-0 z-30 border-t border-sand-200 bg-cream/95 backdrop-blur-xl lg:hidden"
          aria-label="Navigasi admin mobile"
        >
          <div className="flex overflow-x-auto">
            {adminNav.map((item) => {
              const IconComp = Icon[item.icon as keyof typeof Icon];
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex min-w-[72px] flex-1 flex-col items-center gap-1 px-2 py-2.5 text-[10px] font-semibold transition-colors",
                    active ? "text-maroon-700" : "text-sand-600",
                  )}
                >
                  <span className="relative">
                    <IconComp className="h-5 w-5" />
                    {item.href === "/admin/permohonan" && pendingCount > 0 && (
                      <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-maroon-700 px-1 text-[9px] font-bold text-sand-50">
                        {pendingCount}
                      </span>
                    )}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </div>
          <div className="h-[env(safe-area-inset-bottom)]" />
        </nav>
      </div>
    </div>
  );
}
