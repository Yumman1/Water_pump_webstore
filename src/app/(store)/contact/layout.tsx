import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact Jawed Pumps | Karachi & Nationwide Support",
  description: `Reach ${siteConfig.legalName} on ${siteConfig.contact.phone} or WhatsApp. Expert advice on Jawed pumps, motors and complete sets. ${siteConfig.contact.address}.`,
  path: "/contact",
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
