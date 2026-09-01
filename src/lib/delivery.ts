import { siteConfig } from "@/config/site";
import type { InstallationType } from "@/lib/types";
import { computeShippingFee, type PricingConfig } from "@/lib/pricing";

export type DeliveryCityOption = {
  id?: string;
  name: string;
  fee: number;
};

export function getServiceCity(): string {
  return siteConfig.delivery.serviceCity;
}

export function normalizeCityName(city: string): string {
  return city.trim().toLowerCase();
}

export function isServiceCity(city: string, serviceCity = getServiceCity()): boolean {
  if (!city.trim()) return false;
  return normalizeCityName(city) === normalizeCityName(serviceCity);
}

export function resolveOutsideCityFee(
  city: string,
  cities: DeliveryCityOption[],
  fallbackFee: number
): number {
  const key = normalizeCityName(city);
  const match = cities.find((c) => normalizeCityName(c.name) === key);
  return match?.fee ?? fallbackFee;
}

export function computeCheckoutTotals(input: {
  city: string;
  productsSubtotal: number;
  installationType: InstallationType;
  items: { underWarranty?: boolean }[];
  pricing: PricingConfig;
  deliveryCities: DeliveryCityOption[];
  serviceCity?: string;
}): {
  installationFee: number;
  shipping: number;
  total: number;
  installationAvailable: boolean;
  effectiveInstallationType: InstallationType;
} {
  const serviceCity = input.serviceCity ?? getServiceCity();
  const installationAvailable = isServiceCity(input.city, serviceCity);
  const effectiveInstallationType = installationAvailable ? input.installationType : "NONE";

  const installationFee =
    installationAvailable && effectiveInstallationType === "PAID" ? input.pricing.installationFee : 0;

  const hasItems = input.items.length > 0;
  const allWarranty = hasItems && input.items.every((i) => i.underWarranty);

  let shipping = 0;
  if (!input.city.trim()) {
    shipping = 0;
  } else if (installationAvailable) {
    shipping = computeShippingFee(input.productsSubtotal + installationFee, input.pricing);
  } else if (allWarranty) {
    shipping = 0;
  } else {
    shipping = resolveOutsideCityFee(input.city, input.deliveryCities, input.pricing.shippingFlatRate);
  }

  return {
    installationFee,
    shipping,
    total: input.productsSubtotal + installationFee + shipping,
    installationAvailable,
    effectiveInstallationType,
  };
}
