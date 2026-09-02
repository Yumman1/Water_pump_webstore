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
    phone: "03053770002",
    whatsapp: "03053770002",
    email: "jawedmotors@outlook.com",
    address: "Industrial Estate, Karachi (Head Office)",
    manufacturing: "Gujranwala, Punjab (Manufacturing unit)",
    mapUrl: "https://maps.google.com/?q=Industrial+Estate+Karachi",
    hours: "Mon to Sat, 9:00 AM to 8:00 PM",
  },

  social: {
    facebook: "https://www.facebook.com/profile.php?id=61593465285271",
    instagram: "https://www.instagram.com/jawedpumps/",
    tiktok: "https://www.tiktok.com/@jawedmotors",
  },

  // Free-shipping threshold and flat shipping fee (in the store currency).
  shipping: {
    flatRate: 1000,
    freeShippingThreshold: 50000,
  },

  // GST / sales tax as a fraction (0.0 = disabled). Applied at checkout.
  taxRate: 0.0,

  // Checkout installation & removal fee (PKR). Available in serviceCity only.
  installation: {
    fee: 5000,
  },

  /** City where install/removal is offered. Other cities use deliveryCities fees. */
  delivery: {
    serviceCity: "Karachi",
    /** Demo/fallback fees when no DB. Manage live fees in Admin → Settings. */
    outsideCities: [
      { name: "Lahore", fee: 2500 },
      { name: "Islamabad", fee: 3000 },
      { name: "Rawalpindi", fee: 3000 },
      { name: "Hyderabad", fee: 2000 },
      { name: "Multan", fee: 2800 },
      { name: "Faisalabad", fee: 2500 },
      { name: "Peshawar", fee: 3500 },
      { name: "Quetta", fee: 4000 },
    ],
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
      "Genuine Jawed motors and pumps with factory backed quality and expert support on every order, delivered anywhere in Pakistan.",
    ctaLabel: "Shop All Products",
    ctaHref: "/shop",
    // Fallback image only when hero.video is empty. Not used as a video poster.
    image: "",
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
        title: "High Grade Copper",
        description: "Industrial-grade motors built for homes, farms, factories and every pumping need.",
        src: "/videos/copper-motors-industrial-grade.mp4",
      },
      {
        title: "Production",
        description: "Built for reliability by an expert team with genuine copper winding and heavy-duty industrial-grade equipment.",
        src: "/videos/copper-motors-industrial-grade-1.mp4",
      },
      {
        title: "Tested",
        description: "Every motor is tested before it enters inventory, so our quality standards are never compromised.",
        src: "/videos/copper-motors-industrial-grade-2.mp4",
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
    image: "/images/promo-popup.jpg",
  },

  // Trust badges shown across the storefront.
  features: [
    { title: "Genuine Products", description: "100% authentic with warranty", icon: "shield" },
    { title: "Nationwide Delivery", description: "Fast shipping across Pakistan", icon: "truck" },
    { title: "Expert Support", description: "Solutions for any water pump problem", icon: "headset" },
    { title: "Secure Checkout", description: "Cash on delivery available", icon: "lock" },
  ],

  /** Search-engine & social metadata (titles, keywords, structured data helpers). */
  seo: {
    brandShort: "Jawed Pumps",
    defaultTitle: "Jawed Pumps & Motors | Official Water Pump Store Pakistan",
    defaultDescription:
      "Buy genuine Jawed pumps, copper motors, monoblock pressure pumps and bearing pumps online. Serving homes, farms and industry across Pakistan since 1980. Nationwide delivery & cash on delivery.",
    homeTitle: "Jawed Pumps & Motors | Genuine Water Pumps Since 1980",
    homeDescription:
      "Official Jawed Pumps online store. Shop copper motors, monoblock pressure pumps, bearing pumps and complete motor pump sets with expert support and delivery across Pakistan.",
    locale: "en_PK",
    foundingDate: "1980",
    ogImage: "/logo.png",
    alternateNames: [
      "Jawed Pumps",
      "Jawed Motors",
      "Jawed Pumps & Motors",
      "Jawed Water Pumps",
      "Jawed Pump",
    ],
    keywords: [
      "Jawed pumps",
      "Jawed pumps Pakistan",
      "Jawed motors",
      "Jawed water pump",
      "copper motor",
      "monoblock pressure pump",
      "bearing pump",
      "water pump Karachi",
      "donkey pump",
      "bore pump",
      "deep well pump",
      "agricultural water pump",
      "industrial water pump",
      "water pump online Pakistan",
      "Jawed Pumps & Motors",
    ],
  },

  /** Third-party analytics (override IDs via env vars when needed). */
  analytics: {
    tiktokPixelId: "DA7J23JC77U208UL92BG",
    metaPixelId: "1704456783970202",
  },
};

export type SiteConfig = typeof siteConfig;
