import type { MetadataRoute } from "next";
import { getAllProductSlugs, getCategories } from "@/lib/data";
import { services } from "@/data/services";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const [slugs, categories] = await Promise.all([getAllProductSlugs(), getCategories()]);

  const staticRoutes = ["", "/shop", "/deals", "/services", "/about", "/contact", "/shipping"].map(
    (path) => ({ url: `${base}${path}`, lastModified: new Date() })
  );

  return [
    ...staticRoutes,
    ...categories.map((c) => ({ url: `${base}/category/${c.slug}`, lastModified: new Date() })),
    ...services.map((s) => ({ url: `${base}/services/${s.slug}`, lastModified: new Date() })),
    ...slugs.map((slug) => ({ url: `${base}/product/${slug}`, lastModified: new Date() })),
  ];
}
