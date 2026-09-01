import { NextResponse } from "next/server";
import { getPricingConfig } from "@/lib/pricing";
import { getDeliveryCities } from "@/lib/delivery-cities";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

export async function GET() {
  const [pricing, deliveryCities] = await Promise.all([getPricingConfig(), getDeliveryCities()]);
  return NextResponse.json(
    {
      ...pricing,
      serviceCity: siteConfig.delivery.serviceCity,
      deliveryCities,
    },
    {
      headers: { "Cache-Control": "no-store" },
    }
  );
}
