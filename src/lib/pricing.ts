/**
 * Store pricing (delivery + installation fees).
 * Reads from StoreSettings when a DB is configured; otherwise falls back to siteConfig.
 */
import { prisma, isDbConfigured } from "@/lib/prisma";
import { siteConfig } from "@/config/site";

export type PricingConfig = {
  shippingFlatRate: number;
  freeShippingThreshold: number;
  installationFee: number;
};

export function defaultPricing(): PricingConfig {
  return {
    shippingFlatRate: siteConfig.shipping.flatRate,
    freeShippingThreshold: siteConfig.shipping.freeShippingThreshold,
    installationFee: siteConfig.installation.fee,
  };
}

export async function getPricingConfig(): Promise<PricingConfig> {
  const defaults = defaultPricing();
  if (!isDbConfigured) return defaults;
  try {
    const row = await prisma.storeSettings.findUnique({ where: { id: 1 } });
    if (!row) return defaults;
    return {
      shippingFlatRate: row.shippingFlatRate ?? defaults.shippingFlatRate,
      freeShippingThreshold: row.freeShippingThreshold ?? defaults.freeShippingThreshold,
      installationFee: row.installationFee ?? defaults.installationFee,
    };
  } catch {
    return defaults;
  }
}

export function computeShippingFee(
  merchandisePlusInstall: number,
  pricing: PricingConfig
): number {
  if (merchandisePlusInstall === 0) return 0;
  if (merchandisePlusInstall >= pricing.freeShippingThreshold) return 0;
  return pricing.shippingFlatRate;
}
