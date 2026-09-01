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
  pricing: PricingConfig;
  deliveryCities: DeliveryCityOption[];
  serviceCity?: string;
}): {
  installationFee: number;
  shipping: number;
  productsCharge: number;
  total: number;
  installationAvailable: boolean;
  effectiveInstallationType: InstallationType;
  isWarrantyCheckout: boolean;
} {
  const serviceCity = input.serviceCity ?? getServiceCity();
  const installationAvailable = isServiceCity(input.city, serviceCity);
  const isWarrantyCheckout = input.installationType === "WARRANTY";

  let effectiveInstallationType = input.installationType;
  if (!installationAvailable && input.installationType === "PAID") {
    effectiveInstallationType = "NONE";
  }

  const productsCharge = isWarrantyCheckout ? 0 : input.productsSubtotal;

  const installationFee =
    installationAvailable && effectiveInstallationType === "PAID" ? input.pricing.installationFee : 0;

  let shipping = 0;
  if (!input.city.trim()) {
    shipping = 0;
  } else if (isWarrantyCheckout) {
    shipping = installationAvailable
      ? input.pricing.shippingFlatRate
      : resolveOutsideCityFee(input.city, input.deliveryCities, input.pricing.shippingFlatRate);
  } else if (installationAvailable) {
    shipping = computeShippingFee(productsCharge + installationFee, input.pricing);
  } else {
    shipping = resolveOutsideCityFee(input.city, input.deliveryCities, input.pricing.shippingFlatRate);
  }

  return {
    installationFee,
    shipping,
    productsCharge,
    total: productsCharge + installationFee + shipping,
    installationAvailable,
    effectiveInstallationType: isWarrantyCheckout ? "WARRANTY" : effectiveInstallationType,
    isWarrantyCheckout,
  };
}
