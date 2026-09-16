"use client";

import { usePathname } from "next/navigation";

import { Icon } from "@/components/icons";
import { ArrowLink, ButtonLink } from "@/components/ui";
import { site, waLink } from "@/lib/site";

/**
 * Ajakan penutup di footer. Di Ruang Doa ajakannya minta didoakan, bukan bercerita,
 * supaya nyambung dengan halaman yang baru saja dibaca.
 */
export function FooterCta() {
  const pathname = usePathname();
  const prayer = pathname.startsWith("/ruang-doa");

  const cta = prayer
    ? {
        title: (
          <>
            Kalau hari ini berat, <span className="italic text-gold-400">minta didoakan.</span>
          </>
        ),
        label: "Kirim pokok doa",
        href: "/ruang-doa#kirim-doa",
        whatsapp: "Halo, saya mau minta didoakan.",
      }
    : {
        title: (
          <>
            Kalau hari ini berat, <span className="italic text-gold-400">cerita saja.</span>
          </>
        ),
        label: "Mulai bercerita",
        href: "/pertolongan",
        whatsapp: "Halo, saya mau cerita.",
      };

  return (
    <div className="grid gap-8 border-b border-sand-50/10 pb-14 sm:pb-20 lg:grid-cols-12 lg:items-end lg:gap-10">
      <h2 className="text-display text-sand-50 lg:col-span-8">{cta.title}</h2>
      <div className="flex flex-col items-start gap-5 lg:col-span-4 lg:items-end">
        <ButtonLink href={cta.href} variant="light" size="lg">
          <Icon.hands className="h-5 w-5" />
          {cta.label}
        </ButtonLink>
        <ArrowLink href={waLink(cta.whatsapp)} tone="light">
          {site.whatsapp ? "Atau chat lewat WhatsApp" : "Hubungi tim JP"}
        </ArrowLink>
      </div>
    </div>
  );
}
