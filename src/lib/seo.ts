import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import type { Category, Product } from "@/lib/types";

/** Canonical public site URL (no trailing slash). */
export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.NEXTAUTH_URL?.trim() ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  return raw.replace(/\/$/, "");
}

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

/** E.164-ish phone for schema.org (+92…). */
export function schemaPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("92")) return `+${digits}`;
  if (digits.startsWith("0")) return `+92${digits.slice(1)}`;
  return `+${digits}`;
}

function ogImageUrl(): string {
  return absoluteUrl(siteConfig.seo.ogImage);
}

/** Root metadata shared by every page. */
export function buildRootMetadata(): Metadata {
  const siteUrl = getSiteUrl();
  const googleVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim();

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: siteConfig.seo.defaultTitle,
      template: `%s | ${siteConfig.seo.brandShort}`,
    },
    description: siteConfig.seo.defaultDescription,
    keywords: siteConfig.seo.keywords,
    authors: [{ name: siteConfig.legalName, url: siteUrl }],
    creator: siteConfig.legalName,
    publisher: siteConfig.legalName,
    category: "shopping",
    alternates: {
      canonical: siteUrl,
      languages: { "en-PK": siteUrl },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon.png", type: "image/png", sizes: "512x512" },
        { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
        { url: "/icon-48.png", type: "image/png", sizes: "48x48" },
      ],
      shortcut: "/favicon.ico",
      apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    },
    openGraph: {
      type: "website",
      locale: siteConfig.seo.locale,
      url: siteUrl,
      siteName: siteConfig.seo.brandShort,
      title: siteConfig.seo.defaultTitle,
      description: siteConfig.seo.defaultDescription,
      images: [
        {
          url: ogImageUrl(),
          width: 1200,
          height: 630,
          alt: `${siteConfig.legalName}, water pumps and motors`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.seo.defaultTitle,
      description: siteConfig.seo.defaultDescription,
      images: [ogImageUrl()],
    },
    ...(googleVerification
      ? { verification: { google: googleVerification } }
      : {}),
  };
}

export function pageMetadata({
  title,
  description,
  path,
  canonicalPath,
  image,
  noIndex,
}: {
  title: string;
  description: string;
  path: string;
  /** Canonical URL path without query filters (defaults to `path`). */
  canonicalPath?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  const canonical = absoluteUrl(canonicalPath ?? path);
  const imageUrl = image ? absoluteUrl(image) : ogImageUrl();

  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url,
      images: [{ url: imageUrl, alt: title }],
    },
    twitter: {
      title,
      description,
      images: [imageUrl],
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

export function organizationJsonLd() {
  const siteUrl = getSiteUrl();
  const { contact, social, legalName, logo, seo } = siteConfig;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: legalName,
    alternateName: seo.alternateNames,
    url: siteUrl,
    logo: absoluteUrl(logo),
    image: ogImageUrl(),
    description: siteConfig.description,
    foundingDate: seo.foundingDate,
    email: contact.email,
    telephone: schemaPhone(contact.phone),
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.address,
      addressLocality: "Karachi",
      addressRegion: "Sindh",
      addressCountry: "PK",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: schemaPhone(contact.phone),
        contactType: "customer service",
        areaServed: "PK",
        availableLanguage: ["English", "Urdu"],
      },
    ],
    sameAs: [social.facebook, social.instagram, social.tiktok].filter(Boolean),
  };
}

export function localBusinessJsonLd() {
  const siteUrl = getSiteUrl();
  const { contact, legalName, seo } = siteConfig;

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/#localbusiness`,
    name: legalName,
    alternateName: seo.alternateNames,
    url: siteUrl,
    image: ogImageUrl(),
    telephone: schemaPhone(contact.phone),
    email: contact.email,
    priceRange: "$$",
    currenciesAccepted: "PKR",
    paymentAccepted: "Cash, Bank Transfer",
    areaServed: { "@type": "Country", name: "Pakistan" },
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.address,
      addressLocality: "Karachi",
      addressRegion: "Sindh",
      addressCountry: "PK",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "20:00",
    },
  };
}

export function webSiteJsonLd() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: siteConfig.seo.brandShort,
    alternateName: siteConfig.seo.alternateNames,
    url: siteUrl,
    publisher: { "@id": `${siteUrl}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/shop?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function faqPageJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function itemListJsonLd(items: { name: string; url: string }[], listName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

export function productJsonLd(product: Product) {
  const siteUrl = getSiteUrl();
  const images = product.images.length
    ? product.images.map((src) => absoluteUrl(src))
    : [absoluteUrl(product.video ?? siteConfig.seo.ogImage)];

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription ?? product.description.slice(0, 500),
    sku: product.sku,
    mpn: product.sku,
    brand: { "@type": "Brand", name: product.brand ?? "Jawed" },
    image: images,
    url: `${siteUrl}/product/${product.slug}`,
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/product/${product.slug}`,
      priceCurrency: siteConfig.currency.code,
      price: product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": `${siteUrl}/#organization` },
    },
    ...(product.category ? { category: product.category.name } : {}),
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function categoryJsonLd(category: Category) {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    description: category.description,
    url: `${siteUrl}/category/${category.slug}`,
    isPartOf: { "@id": `${siteUrl}/#website` },
    ...(category.image ? { image: absoluteUrl(category.image) } : {}),
  };
}
