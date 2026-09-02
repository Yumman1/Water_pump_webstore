import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, localBusinessJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact Jawed Pumps | Karachi & Nationwide Support",
  description: `Reach ${siteConfig.legalName} on ${siteConfig.contact.phone} or WhatsApp. Expert advice on Jawed Engineering Pumps, Javed water pumps and motors. ${siteConfig.contact.address}.`,
  path: "/contact",
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={[
          localBusinessJsonLd(),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ]}
      />
      {children}
    </>
  );
}
