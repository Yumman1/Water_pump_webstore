import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base =
    process.env.NEXTAUTH_URL?.trim() ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${base.replace(/\/$/, "")}/sitemap.xml`,
  };
}
