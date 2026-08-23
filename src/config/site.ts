/**
 * ============================================================================
 *  BRANDING CONFIG  -  EDIT THIS FILE TO MAKE THE STORE YOURS
 * ============================================================================
 *  Change the company name, logo, contact details, colors and homepage copy
 *  here. Nothing else in the codebase needs to be touched to rebrand.
 *  (Product data lives in `src/data/seed-data.ts`.)
 */

export const siteConfig = {
  name: "Jawed",
  legalName: "Jawed Pumps & Motors",
  tagline: "Water pump solutions for homes, farms and industry",
  description:
    "Jawed Pumps & Motors provides industrial-grade water pump solutions for B2B and B2C clients across Pakistan. From motors and pressure systems to bore and deep-well pumping, we help you solve any water lifting or pressure challenge with genuine products, nationwide delivery and expert support.",

  // Logo: put an image at /public/logo.png (or .svg) to use it automatically.
  // If the file is missing, the name is shown as a styled text logo.
  logo: "/logo.png",

  currency: {
    code: "PKR",
    symbol: "Rs",
    // "before" => Rs 12,500   |   "after" => 12,500 Rs
    position: "before" as "before" | "after",
    locale: "en-PK",
  },

  contact: {
    phone: "0304-1088901",
    whatsapp: "0304-1088901",
    email: "jawedmotors@outlook.com",
    address: "F-28 Main Suparco Road-13, Industrial Estate, Karachi (Head Office)",
    manufacturing: "Gujranwala, Punjab (Manufacturing unit)",
    mapUrl: "https://maps.google.com/?q=F-28+Main+Suparco+Road+Industrial+Estate+Karachi",
    hours: "Mon to Sat, 9:00 AM to 8:00 PM",
  },

  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
    twitter: "https://twitter.com",
  },

  // Free-shipping threshold and flat shipping fee (in the store currency).
  shipping: {
    flatRate: 500,
    freeShippingThreshold: 50000,
  },

  // GST / sales tax as a fraction (0.0 = disabled). Applied at checkout.
  taxRate: 0.0,

  // Checkout installation & removal fee (PKR).
  installation: {
    fee: 10000,
  },

  // Shown on checkout when the customer selects Bank Transfer.
  bankTransfer: {
    bankName: "HBL / Askari / Meezan (confirm with Jawed before paying)",
    accountTitle: "Jawed Pumps & Motors",
    accountNumber: "Share order number on WhatsApp to receive exact account details",
    iban: "",
    instructions:
      "Place your order, then WhatsApp or call us with your order number. We will share bank details and confirm payment before dispatch.",
  },

  // Homepage promo bar (set text to "" to hide).
  announcement: "🚚 Free delivery on orders over Rs 50,000. Order now!",

  // Homepage hero.
  hero: {
    heading: "SERVING THE BEST SINCE 1980",
    subheading:
      "A trusted B2B name now serving every water pump need, from homes and farms to industry. Genuine stock, expert guidance and nationwide delivery.",
    ctaLabel: "Shop All Products",
    ctaHref: "/shop",
    // Background image for the hero (used as the video poster / fallback).
    image: "https://picsum.photos/seed/pump-hero/1600/900",
    // OPTIONAL background video (muted, looping). Set to "" to use just the image.
    // Replace with your own short, compressed clip (MP4, ideally < 5 MB, ~10-20s).
    video: "/hero.mp4",
  },

  // Homepage video showcase. Prefer your own clips under /public.
  // Add or swap clips freely as new product lines launch.
  // Videos autoplay muted on loop; poster is optional (first frame of the video is the cover).
  showcase: {
    enabled: true,
    heading: "See Us in Action",
    subheading: "Real products, warehouse stock and water solutions in motion.",
    clips: [
      {
        title: "Copper Motors",
        description: "Industrial-grade motors ready for domestic, farm and factory duty.",
        src: "/videos/copper-motors-industrial-grade.mp4",
      },
      {
        title: "Copper Motors — Production",
        description: "Built for reliability — genuine copper winding and heavy-duty construction.",
        src: "/videos/copper-motors-industrial-grade-1.mp4",
      },
      {
        title: "Copper Motors — In Stock",
        description: "Warehouse-ready motors for homes, farms and light industry across Pakistan.",
        src: "/videos/copper-motors-industrial-grade-2.mp4",
      },
      {
        title: "Monoblock Pressure Pumps",
        description: "Pressure boosting solutions for homes, buildings and light commercial use.",
        src: "/products/1hp-monoblock-pressure-pump-jawed/video.mp4",
        poster: "/products/1hp-monoblock-pressure-pump-jawed/cover.jpg",
      },
      {
        title: "Heavy Duty Pumping",
        description: "Built for tougher water lifting and continuous industrial demand.",
        src: "/products/2hp-monoblock-pressure-pump-jawed-steel-impeller/video.mp4",
        poster: "/products/2hp-monoblock-pressure-pump-jawed-steel-impeller/cover.jpg",
      },
    ] as { title: string; description: string; src: string; poster?: string }[],
  },

  // Deal pop-up shown once per visit when the site loads. Set enabled:false to hide.
  promoPopup: {
    enabled: true,
    badge: "Limited Time Offer",
    heading: "Get 10% Off Your First Order",
    message: "Use code WELCOME10 at checkout on orders over Rs 10,000. Genuine products, nationwide delivery.",
    couponCode: "WELCOME10",
    ctaLabel: "Shop the Deals",
    ctaHref: "/deals",
    image: "https://picsum.photos/seed/promo-deal/700/500",
  },

  // Trust badges shown across the storefront.
  features: [
    { title: "Genuine Products", description: "100% authentic with warranty", icon: "shield" },
    { title: "Nationwide Delivery", description: "Fast shipping across Pakistan", icon: "truck" },
    { title: "Expert Support", description: "Solutions for any water pump problem", icon: "headset" },
    { title: "Secure Checkout", description: "Cash on delivery available", icon: "lock" },
  ],
};

export type SiteConfig = typeof siteConfig;
