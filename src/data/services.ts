/**
 * SERVICES - edit to match the services your business offers.
 * Images live under /public/services/.
 * Each service gets its own page at /services/[slug].
 * Set `availableAtCheckout: true` when the service is selected on the cart (not via request form).
 */
import { siteConfig } from "@/config/site";

export type Service = {
  slug: string;
  title: string;
  image: string;
  short: string;
  description: string;
  features: string[];
  priceFrom?: string;
  /** Booked during checkout on the cart page — no standalone request form. */
  availableAtCheckout?: boolean;
  /** Step-by-step shown on the service detail page for checkout services. */
  checkoutSteps?: string[];
  /** CSS aspect-ratio for hero/card image (default detail: 16/9, listing: 4/3). */
  imageAspect?: string;
};

const installFee = siteConfig.installation.fee;

export const services: Service[] = [
  {
    slug: "pump-installation-removal",
    title: "Pump Installation & Removal",
    image: "/services/pump-installation-removal.jpg",
    imageAspect: "3/4",
    short: "Professional install and removal of motors and pumps — add this service when you checkout.",
    description:
      "When you buy a motor or pump from Jawed, you can add installation and removal directly in your cart before checkout. " +
      "Our team installs your new unit and removes the old one. Choose the option that matches your warranty status; " +
      "fees are shown clearly in your order summary before you pay.",
    features: [
      "No installation & removal — delivery only (install yourself)",
      `Under warranty — fee waived (normally Rs ${installFee.toLocaleString("en-PK")}); provide the serial number of the unit being replaced`,
      `Without warranty — Rs ${installFee.toLocaleString("en-PK")} for Jawed or other-brand motors and pumps`,
      "Previous motor may be bought back; value assessed by our team and deducted from your total",
      "Installation details confirmed on your order — we contact you after checkout to schedule",
    ],
    priceFrom: `From Rs ${installFee.toLocaleString("en-PK")} (free under warranty)`,
    availableAtCheckout: true,
    checkoutSteps: [
      "Browse the shop and add the motor, pump or complete set you need to your cart.",
      "On the cart page, scroll to **Installation & removal** and pick one of three options: delivery only, under warranty, or without warranty.",
      "If you choose **under warranty**, enter the serial number of the unit being replaced (required before checkout).",
      "Check the **Installation & removal** line in your order summary — the fee is Rs 0 under warranty or the standard fee for non-warranty installs.",
      "Proceed to checkout, enter delivery details and payment method (COD or bank transfer). Your installation choice is saved on the order.",
      "After we receive your order, our team contacts you to confirm timing and any buy-back assessment for your old unit.",
    ],
  },
  {
    slug: "deep-well-boring",
    title: "Deep Well Boring",
    image: "/services/deep-well-boring.png",
    short: "Professional borehole drilling for reliable groundwater.",
    description:
      "We drill deep wells and boreholes for domestic, agricultural and commercial water supply using modern rigs. Includes site survey, drilling, casing and pump installation.",
    features: [
      "Site survey & water-table assessment",
      "Borehole drilling (various depths)",
      "Casing & development",
      "Submersible pump installation",
      "Water yield testing",
    ],
    priceFrom: "Request a quote",
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
