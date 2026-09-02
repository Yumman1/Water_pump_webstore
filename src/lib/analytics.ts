import { siteConfig } from "@/config/site";

/** TikTok Pixel ID — env override optional for per-environment control. */
export function getTikTokPixelId(): string {
  return (
    process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID?.trim() ||
    siteConfig.analytics.tiktokPixelId?.trim() ||
    ""
  );
}

/** Meta (Facebook) Pixel ID — env override optional for per-environment control. */
export function getMetaPixelId(): string {
  return (
    process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() ||
    siteConfig.analytics.metaPixelId?.trim() ||
    ""
  );
}

export type TikTokProductContent = {
  content_id: string;
  content_type: "product";
  content_name: string;
  quantity: number;
  price: number;
};

declare global {
  interface Window {
    ttq?: {
      page: () => void;
      track: (event: string, payload?: Record<string, unknown>) => void;
    };
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

function canTrackTikTok(): boolean {
  return (
    typeof window !== "undefined" &&
    Boolean(getTikTokPixelId()) &&
    typeof window.ttq?.track === "function"
  );
}

function canTrackMeta(): boolean {
  return typeof window !== "undefined" && Boolean(getMetaPixelId()) && typeof window.fbq === "function";
}

function metaContents(contents: TikTokProductContent[]) {
  return contents.map((item) => ({
    id: item.content_id,
    quantity: item.quantity,
    item_price: item.price,
  }));
}

/** Standard TikTok AddToCart event. */
export function trackTikTokAddToCart(item: TikTokProductContent): void {
  if (!canTrackTikTok()) return;

  const value = item.price * item.quantity;
  window.ttq!.track("AddToCart", {
    contents: [item],
    content_type: "product",
    content_id: item.content_id,
    content_name: item.content_name,
    quantity: item.quantity,
    value,
    currency: siteConfig.currency.code,
  });
}

/** Standard Meta AddToCart event. */
export function trackMetaAddToCart(item: TikTokProductContent): void {
  if (!canTrackMeta()) return;

  const value = item.price * item.quantity;
  window.fbq!("track", "AddToCart", {
    content_ids: [item.content_id],
    content_name: item.content_name,
    content_type: "product",
    contents: metaContents([item]),
    value,
    currency: siteConfig.currency.code,
  });
}

/** Standard TikTok purchase event (CompletePayment). */
export function trackTikTokPurchase(params: {
  orderId: string;
  value: number;
  contents: TikTokProductContent[];
}): void {
  if (!canTrackTikTok()) return;

  const quantity = params.contents.reduce((sum, c) => sum + c.quantity, 0);

  window.ttq!.track("CompletePayment", {
    contents: params.contents,
    content_type: "product",
    quantity,
    value: params.value,
    currency: siteConfig.currency.code,
    description: params.orderId,
  });
}

/** Standard Meta Purchase event. */
export function trackMetaPurchase(params: {
  orderId: string;
  value: number;
  contents: TikTokProductContent[];
}): void {
  if (!canTrackMeta()) return;

  window.fbq!("track", "Purchase", {
    content_ids: params.contents.map((item) => item.content_id),
    content_type: "product",
    contents: metaContents(params.contents),
    value: params.value,
    currency: siteConfig.currency.code,
    order_id: params.orderId,
  });
}

/** Fired when checkout page loads with items in cart. */
export function trackTikTokInitiateCheckout(params: {
  value: number;
  contents: TikTokProductContent[];
}): void {
  if (!canTrackTikTok()) return;

  window.ttq!.track("InitiateCheckout", {
    contents: params.contents,
    content_type: "product",
    value: params.value,
    currency: siteConfig.currency.code,
  });
}

/** Standard Meta InitiateCheckout event. */
export function trackMetaInitiateCheckout(params: {
  value: number;
  contents: TikTokProductContent[];
}): void {
  if (!canTrackMeta()) return;

  window.fbq!("track", "InitiateCheckout", {
    content_ids: params.contents.map((item) => item.content_id),
    content_type: "product",
    contents: metaContents(params.contents),
    value: params.value,
    currency: siteConfig.currency.code,
  });
}
