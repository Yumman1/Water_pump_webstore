import { siteConfig } from "@/config/site";

/** TikTok Pixel ID — env override optional for per-environment control. */
export function getTikTokPixelId(): string {
  return (
    process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID?.trim() ||
    siteConfig.analytics.tiktokPixelId?.trim() ||
    ""
  );
}
