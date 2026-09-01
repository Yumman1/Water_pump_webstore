import { prisma, isDbConfigured } from "@/lib/prisma";
import { siteConfig } from "@/config/site";
import type { DeliveryCityOption } from "@/lib/delivery";

export async function getDeliveryCities(): Promise<DeliveryCityOption[]> {
  if (!isDbConfigured) {
    return siteConfig.delivery.outsideCities.map((c) => ({ name: c.name, fee: c.fee }));
  }
  try {
    const rows = await prisma.deliveryCity.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });
    if (rows.length === 0) {
      return siteConfig.delivery.outsideCities.map((c) => ({ name: c.name, fee: c.fee }));
    }
    return rows.map((r) => ({ id: r.id, name: r.name, fee: r.fee }));
  } catch {
    return siteConfig.delivery.outsideCities.map((c) => ({ name: c.name, fee: c.fee }));
  }
}

/** Cities shown on checkout: service city first, then configured delivery cities. */
export async function getCheckoutCityOptions(): Promise<{ value: string; label: string; fee?: number }[]> {
  const serviceCity = siteConfig.delivery.serviceCity;
  const outside = await getDeliveryCities();
  return [
    { value: serviceCity, label: `${serviceCity} (installation available)` },
    ...outside.map((c) => ({
      value: c.name,
      label: c.fee > 0 ? `${c.name} (delivery ${c.fee.toLocaleString("en-PK")} PKR)` : c.name,
      fee: c.fee,
    })),
  ];
}
