import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/data/services";
import { siteConfig } from "@/config/site";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = { title: "Our Services" };

export default function ServicesPage() {
  return (
    <div>
      <section className="bg-brand-900 text-white">
        <div className="container py-12 text-center">
          <h1 className="text-3xl font-extrabold sm:text-4xl">Our Services</h1>
          <p className="mx-auto mt-2 max-w-2xl text-brand-100">
            Beyond selling pumps, we offer complete installation, maintenance and water solutions —
            delivered by experienced, trusted professionals.
          </p>
        </div>
      </section>

      <section className="container py-10">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s.slug} className="flex flex-col rounded-xl border bg-white p-6 transition-shadow hover:shadow-md">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-50 text-3xl">
                {s.emoji}
              </div>
              <h2 className="mt-4 text-lg font-bold text-gray-900">{s.title}</h2>
              <p className="mt-1 flex-1 text-sm text-gray-600">{s.short}</p>
              {s.priceFrom && (
                <p className="mt-3 text-sm">
                  <span className="text-gray-400">From </span>
                  <span className="font-semibold text-brand-700">{s.priceFrom}</span>
                </p>
              )}
              <Link href={`/services/${s.slug}`} className="mt-4 text-sm font-semibold text-brand-600 hover:text-brand-700">
                Learn more &amp; request →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-brand-600">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 text-center md:flex-row md:text-left">
          <div>
            <h2 className="text-2xl font-bold text-white">Need a service not listed here?</h2>
            <p className="text-brand-100">Get in touch — our team handles all kinds of water &amp; pump work.</p>
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
