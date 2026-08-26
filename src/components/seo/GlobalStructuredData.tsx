import {
  localBusinessJsonLd,
  organizationJsonLd,
  webSiteJsonLd,
} from "@/lib/seo";
import { JsonLd } from "./JsonLd";

/** Site-wide Organization, LocalBusiness and WebSite schema on every storefront page. */
export function GlobalStructuredData() {
  return (
    <JsonLd
      data={[organizationJsonLd(), localBusinessJsonLd(), webSiteJsonLd()]}
    />
  );
}
