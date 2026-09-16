import type { MetadataRoute } from "next";

import { getEvents, getPosts } from "@/lib/queries";
import { site } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, events] = await Promise.all([getPosts(), getEvents()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: site.url, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/tentang-kami`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/layanan`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/mitra`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${site.url}/ruang-pengharapan`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/ruang-doa`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/ruang-cerita`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/ruang-belajar`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/konten`, changeFrequency: "daily", priority: 0.9 },
    { url: `${site.url}/event`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/kontak`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${site.url}/pertolongan`, changeFrequency: "monthly", priority: 0.9 },
  ];

  return [
    ...staticRoutes,
    ...posts.map((p) => ({
      url: `${site.url}/konten/${p.slug}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...events.map((e) => ({
      url: `${site.url}/event/${e.slug}`,
      lastModified: new Date(e.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
