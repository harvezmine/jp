import { MotionProvider } from "@/components/motion";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { site, socialLinks } from "@/lib/site";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  // Structured data untuk Google. JP adalah pelayanan pertolongan, bukan gereja, jadi
  // tipenya Organization. Alamat tidak dicantumkan sampai ada alamat yang benar.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    description: site.description,
    url: site.url,
    logo: `${site.url}/brand/logo.png`,
    ...(site.phone ? { telephone: site.phone } : {}),
    sameAs: socialLinks.map((s) => s.href),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MotionProvider>
        <SiteHeader />
        <main id="konten-utama">{children}</main>
        <SiteFooter />
      </MotionProvider>
      {/* Butiran halus di atas seluruh halaman, supaya permukaan terasa seperti kertas */}
      <div
        aria-hidden
        className="bg-grain pointer-events-none fixed inset-0 z-[60] opacity-[0.035]"
      />
    </>
  );
}
