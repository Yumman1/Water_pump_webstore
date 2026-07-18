/**
 * ============================================================================
 *  BRANDING CONFIG  —  EDIT THIS FILE TO MAKE THE STORE YOURS
 * ============================================================================
 *  Change the company name, logo, contact details, colors and homepage copy
 *  here. Nothing else in the codebase needs to be touched to rebrand.
 *  (Product data lives in `src/data/seed-data.ts`.)
 */

export const siteConfig = {
  name: "AquaFlow Pumps",
  legalName: "AquaFlow Pumps (Pvt) Ltd.",
  tagline: "Pakistan's Trusted Water Pump Store",
  description:
    "Buy water pumps online — solar pumps, submersible pumps, pressure booster pumps, centrifugal pumps and motors. Genuine products, nationwide delivery, expert support.",

  // Logo: put an image at /public/logo.svg (or .png) to use it automatically.
  // If the file is missing, the name is shown as a styled text logo.
  logo: "/logo.svg",

  currency: {
    code: "PKR",
    symbol: "Rs",
    // "before" => Rs 12,500   |   "after" => 12,500 Rs
    position: "before" as "before" | "after",
    locale: "en-PK",
  },

  contact: {
    phone: "+92 300 1234567",
    whatsapp: "+92 300 1234567",
    email: "sales@aquaflowpumps.example",
    address: "Plot 123, Industrial Area, Lahore, Pakistan",
    mapUrl: "https://maps.google.com/?q=Lahore",
    hours: "Mon – Sat, 9:00 AM – 8:00 PM",
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

  // Homepage promo bar (set text to "" to hide).
  announcement: "🚚 Free delivery on orders over Rs 50,000 — Order now!",

  // Homepage hero.
  hero: {
    heading: "Powerful Pumps for Every Need",
    subheading:
      "From solar-powered irrigation to home pressure boosting — genuine pumps, expert advice, and fast nationwide delivery.",
    ctaLabel: "Shop All Pumps",
    ctaHref: "/shop",
    // Background image for the hero (used as the video poster / fallback).
    image: "https://picsum.photos/seed/pump-hero/1600/900",
    // OPTIONAL background video (muted, looping). Set to "" to use just the image.
    // Replace with your own short, compressed clip (MP4, ideally < 5 MB, ~10-20s).
    video: "/hero.mp4",
  },

  // Homepage video showcase — "creative space" for production / deal / install clips.
  // Replace `src` with your own MP4s and `poster` with a thumbnail image.
  showcase: {
    enabled: true,
    heading: "See Us in Action",
    subheading: "A look inside our warehouse, installations and the products we love.",
    clips: [
      {
        title: "Inside Our Warehouse",
        description: "Genuine stock, ready to ship nationwide.",
        src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        poster: "https://picsum.photos/seed/clip-warehouse/800/500",
      },
      {
        title: "Professional Installation",
        description: "Our team installing a solar submersible pump.",
        src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        poster: "https://picsum.photos/seed/clip-install/800/500",
      },
      {
        title: "This Week's Deals",
        description: "Big savings across pumps, motors & accessories.",
        src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        poster: "https://picsum.photos/seed/clip-deals/800/500",
      },
    ],
  },

  // Deal pop-up shown once per visit when the site loads. Set enabled:false to hide.
  promoPopup: {
    enabled: true,
    badge: "Limited Time Offer",
    heading: "Get 10% Off Your First Order",
    message: "Use code WELCOME10 at checkout on orders over Rs 10,000. Genuine pumps, nationwide delivery.",
    couponCode: "WELCOME10",
    ctaLabel: "Shop the Deals",
    ctaHref: "/deals",
    image: "https://picsum.photos/seed/promo-deal/700/500",
  },

  // Trust badges shown across the storefront.
  features: [
    { title: "Genuine Products", description: "100% authentic with warranty", icon: "shield" },
    { title: "Nationwide Delivery", description: "Fast shipping across Pakistan", icon: "truck" },
    { title: "Expert Support", description: "Help choosing the right pump", icon: "headset" },
    { title: "Secure Checkout", description: "Cash on delivery available", icon: "lock" },
  ],
};

export type SiteConfig = typeof siteConfig;
