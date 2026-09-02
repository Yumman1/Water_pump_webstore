"use client";

import dynamic from "next/dynamic";
import type { PromoPopupConfig } from "@/lib/promo";

const DealPopup = dynamic(() => import("./DealPopup").then((m) => m.DealPopup), { ssr: false });

/** Homepage-only promo popup — avoids loading popup JS on every store route. */
export function HomepagePromoPopup({ promo }: { promo: PromoPopupConfig }) {
  if (!promo.enabled) return null;
  return <DealPopup promo={promo} />;
}
