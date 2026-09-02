import { unstable_cache } from "next/cache";
import { prisma, isDbConfigured } from "@/lib/prisma";
import { siteConfig } from "@/config/site";

export type PromoPopupConfig = {
  enabled: boolean;
  badge: string | null;
  heading: string;
  message: string;
  couponCode: string | null;
  ctaLabel: string;
  ctaHref: string;
  image: string;
};

function defaultPromo(): PromoPopupConfig {
  const p = siteConfig.promoPopup;
  return {
    enabled: p.enabled,
    badge: p.badge ?? null,
    heading: p.heading,
    message: p.message,
    couponCode: p.couponCode ?? null,
    ctaLabel: p.ctaLabel,
    ctaHref: p.ctaHref,
    image: p.image,
  };
}

/** Promo popup content from StoreSettings, with siteConfig fallback. */
export async function getPromoPopupConfig(): Promise<PromoPopupConfig> {
  return unstable_cache(fetchPromoPopupConfig, ["promo-popup-config"], { revalidate: 300 })();
}

async function fetchPromoPopupConfig(): Promise<PromoPopupConfig> {
  const defaults = defaultPromo();
  if (!isDbConfigured) return defaults;

  try {
    const row = await prisma.storeSettings.findUnique({ where: { id: 1 } });
    if (!row) return defaults;
    return {
      enabled: row.promoEnabled ?? defaults.enabled,
      badge: row.promoBadge ?? defaults.badge,
      heading: row.promoHeading ?? defaults.heading,
      message: row.promoMessage ?? defaults.message,
      couponCode: row.promoCouponCode ?? defaults.couponCode,
      ctaLabel: row.promoCtaLabel ?? defaults.ctaLabel,
      ctaHref: row.promoCtaHref ?? defaults.ctaHref,
      image: row.promoImage ?? defaults.image,
    };
  } catch {
    return defaults;
  }
}
