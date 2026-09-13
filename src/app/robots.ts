import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Panel pengurus tidak perlu diindeks.
        disallow: ["/admin", "/admin/"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
