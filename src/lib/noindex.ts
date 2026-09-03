import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

/** Checkout-flow pages should not compete with the storefront in search. */
export function noIndexMetadata(path: string): Metadata {
  return {
    robots: { index: false, follow: false },
    alternates: { canonical: absoluteUrl(path) },
  };
}
