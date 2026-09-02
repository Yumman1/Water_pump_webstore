"use client";

import dynamic from "next/dynamic";

const MetaPixel = dynamic(() => import("@/components/analytics/MetaPixel").then((m) => m.MetaPixel), {
  ssr: false,
});
const TikTokPixel = dynamic(
  () => import("@/components/analytics/TikTokPixel").then((m) => m.TikTokPixel),
  { ssr: false }
);

/** Analytics pixels loaded off the critical path. */
export function StoreAnalytics() {
  return (
    <>
      <MetaPixel />
      <TikTokPixel />
    </>
  );
}
