"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/lib/cart-context";
import { trackTikTokInitiateCheckout, type TikTokProductContent } from "@/lib/analytics";

function toTikTokContents(
  items: ReturnType<typeof useCart>["items"]
): TikTokProductContent[] {
  return items.map((i) => ({
    content_id: i.slug,
    content_type: "product",
    content_name: i.name,
    quantity: i.quantity,
    price: i.price,
  }));
}

/** Fires InitiateCheckout once when the checkout page loads with cart items. */
export function CheckoutAnalytics() {
  const { items, total } = useCart();
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current || items.length === 0) return;
    tracked.current = true;
    trackTikTokInitiateCheckout({
      value: total,
      contents: toTikTokContents(items),
    });
  }, [items, total]);

  return null;
}
