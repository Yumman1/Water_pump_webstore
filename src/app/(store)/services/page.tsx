import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { services } from "@/data/services";
import { siteConfig } from "@/config/site";
import { ButtonLink } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Jawed Pumps Installation & Water Services",
  description:
    "Pump installation and removal at checkout, plus deep well boring from Jawed Pumps & Motors. Expert water pump services across Pakistan.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <div>
      <section className="bg-brand-900 text-white">
        <div className="container py-12 text-center">
          <h1 className="text-3xl font-extrabold sm:text-4xl">Our Services</h1>
          <p className="mx-auto mt-2 max-w-2xl text-brand-100">
            Professional pump installation at checkout, deep well boring and expert support, delivered by
            experienced, trusted professionals.
          </p>
        </div>
      </section>

      <section className="container py-10">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="card-hover group flex flex-col overflow-hidden rounded-xl border bg-white"
            >
              <div
                className="relative overflow-hidden bg-gray-100"
                style={{ aspectRatio: s.imageAspect ?? "4/3" }}
              >
                <Image src={s.image} alt={s.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h2 className="text-lg font-bold text-gray-900 group-hover:text-brand-700">{s.title}</h2>
                <p className="mt-1 flex-1 text-sm text-gray-600">{s.short}</p>
                {s.priceFrom && (
                  <p className="mt-3 text-sm">
                    <span className="text-gray-400">From </span>
                    <span className="font-semibold text-brand-700">{s.priceFrom}</span>
                  </p>
                )}
                <span className="mt-3 text-sm font-semibold text-brand-600">
                  {s.availableAtCheckout ? "How it works at checkout →" : "Learn more & request →"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-brand-600">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 text-center md:flex-row md:text-left">
          <div>
            <h2 className="text-2xl font-bold text-white">Need a service not listed here?</h2>
            <p className="text-brand-100">Get in touch. Our team handles all kinds of water &amp; pump work.</p>
          </div>
          <ButtonLink href="/contact" size="lg" variant="accent" className="shrink-0">
            Contact Us
          </ButtonLink>
        </div>
      </section>

      <p className="container pb-10 pt-6 text-center text-sm text-gray-500">
        Or call us directly at{" "}
        <a href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`} className="font-medium text-brand-600">
          {siteConfig.contact.phone}
        </a>
      </p>
    </div>
  );
}
