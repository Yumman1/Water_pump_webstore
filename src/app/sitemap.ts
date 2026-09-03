import type { MetadataRoute } from "next";
import { getAllProductSlugs, getCategories } from "@/lib/data";
import { services } from "@/data/services";
import { brands } from "@/config/menu";
import { getSiteUrl } from "@/lib/seo";

function staticRoutes(base: string, now: Date): MetadataRoute.Sitemap {
  return [
    { url: base, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/shop`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/deals`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/shipping`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/water-pump-price-in-pakistan`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    ...services.map((s) => ({
      url: `${base}/services/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...brands.map((b) => ({
      url: `${base}/brand/${b.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    })),
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();
  const fallback = staticRoutes(base, now);

  try {
    const [slugs, categories] = await Promise.all([
      getAllProductSlugs().catch(() => [] as string[]),
      getCategories().catch(() => [] as Awaited<ReturnType<typeof getCategories>>),
    ]);

    return [
      ...fallback,
      ...categories.map((c) => ({
        url: `${base}/category/${c.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.85,
      })),
      ...slugs.map((slug) => ({
        url: `${base}/product/${slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ];
  } catch {
    return fallback;
  }
}
