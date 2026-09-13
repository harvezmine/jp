import Link from "next/link";

import { Logo } from "@/components/logo";
import { Icon } from "@/components/icons";
import { ArrowLink, ButtonLink, Container } from "@/components/ui";
import { ruang } from "@/lib/ruang";
import { navigation, site, waLink } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-maroon-deep relative isolate overflow-hidden text-sand-200">
      <div aria-hidden className="bg-grain pointer-events-none absolute inset-0 -z-10 opacity-[0.08]" />

      <Container size="wide" className="pt-20 sm:pt-28">
        {/* Penutup */}
        <div className="grid gap-10 border-b border-sand-50/10 pb-16 sm:pb-20 lg:grid-cols-12 lg:items-end">
          <h2 className="text-display text-sand-50 lg:col-span-8">
            Kalau hari ini terasa berat, <span className="italic text-gold-400">cerita saja.</span>
          </h2>
          <div className="flex flex-col items-start gap-5 lg:col-span-4 lg:items-end">
            <ButtonLink href="/pertolongan" variant="light" size="lg">
              <Icon.hands className="h-5 w-5" />
              Minta pertolongan
            </ButtonLink>
            <ArrowLink href={waLink()} tone="light">
              Atau chat lewat WhatsApp
            </ArrowLink>
          </div>
        </div>

        <div className="grid gap-12 py-14 sm:grid-cols-2 sm:py-16 lg:grid-cols-12 lg:gap-8">
          {/* Identitas */}
          <div className="lg:col-span-4">
            <Logo variant="light" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-sand-300/80">
              Pelayanan doa dan pendampingan untuk siapa saja yang sedang bergumul.
            </p>
            <div className="mt-6 flex gap-2">
              {[
                { href: site.socials.tiktok, icon: Icon.tiktok, label: "TikTok" },
                { href: site.socials.youtube, icon: Icon.youtube, label: "YouTube" },
                { href: site.socials.instagram, icon: Icon.instagram, label: "Instagram" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid h-11 w-11 place-items-center rounded-full border border-sand-50/15 text-sand-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-400/60 hover:text-gold-400"
                >
                  <s.icon className="h-4.5 w-4.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigasi */}
          <nav className="lg:col-span-2" aria-label="Navigasi footer">
            <h3 className="font-display text-base font-semibold text-sand-50">Jelajahi</h3>
            <ul className="mt-4 space-y-2.5">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-sand-300/80 transition-colors hover:text-gold-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Ruang pelayanan */}
          <div className="lg:col-span-3">
            <h3 className="font-display text-base font-semibold text-sand-50">Ruang pelayanan</h3>
            <ul className="mt-4 space-y-3.5">
              {ruang.map((r) => (
                <li key={r.slug} className="text-sm">
                  <Link href={`/#${r.slug}`} className="group">
                    <span className="font-medium text-sand-100 transition-colors group-hover:text-gold-400">
                      Ruang {r.name}
                    </span>
                    <span className="mt-0.5 block text-sand-300/70">{r.short}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div className="lg:col-span-3">
            <h3 className="font-display text-base font-semibold text-sand-50">Hubungi kami</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-3">
                <Icon.whatsapp className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                <a
                  href={waLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sand-300/80 hover:text-gold-400"
                >
                  {site.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Icon.mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                <a href={`mailto:${site.email}`} className="text-sand-300/80 hover:text-gold-400">
                  {site.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Icon.gift className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                <Link href="/donasi" className="text-sand-300/80 hover:text-gold-400">
                  Dukung lewat donasi
                </Link>
              </li>
              <li className="flex gap-3">
                <Icon.arrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                <a
                  href={site.church.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sand-300/80 hover:text-gold-400"
                >
                  Gereja kami: {site.church.name}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-sand-50/10 py-7 text-xs text-sand-300/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}
          </p>
          <p className="font-display italic text-sand-300/70">
            &ldquo;Rancangan damai sejahtera, untuk memberikan kepadamu hari depan yang penuh
            harapan.&rdquo; <span className="not-italic">Yeremia 29:11</span>
          </p>
        </div>
      </Container>
    </footer>
  );
}
