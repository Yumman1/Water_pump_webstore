import type { MetadataRoute } from "next";
import { getAllProductSlugs, getCategories } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const [slugs, categories] = await Promise.all([getAllProductSlugs(), getCategories()]);

  const staticRoutes = ["", "/shop", "/about", "/contact", "/shipping"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  return [
    ...staticRoutes,
    ...categories.map((c) => ({ url: `${base}/category/${c.slug}`, lastModified: new Date() })),
    ...slugs.map((slug) => ({ url: `${base}/product/${slug}`, lastModified: new Date() })),
  ];
}
