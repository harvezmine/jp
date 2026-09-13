import { MotionProvider } from "@/components/motion";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { site } from "@/lib/site";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  // Structured data, membantu Google menampilkan alamat & jadwal di hasil pencarian.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Church",
    name: site.name,
    description: site.description,
    url: site.url,
    email: site.email,
    telephone: site.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.line1,
      addressLocality: "Jakarta",
      addressCountry: "ID",
    },
    sameAs: [site.socials.instagram, site.socials.tiktok, site.socials.youtube],
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
    </>
  );
}
