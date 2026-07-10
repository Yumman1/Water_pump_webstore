import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getService, services } from "@/data/services";
import { ServiceRequestForm } from "@/components/store/ServiceRequestForm";
import { Icons } from "@/components/ui/icons";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const service = getService(params.slug);
  return { title: service ? service.title : "Service" };
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = getService(params.slug);
  if (!service) notFound();

  return (
    <div className="container py-8">
      <nav className="mb-6 flex items-center gap-1 text-sm text-gray-500">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>/</span>
        <Link href="/services" className="hover:text-brand-600">Services</Link>
        <span>/</span>
        <span className="text-gray-700">{service.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-brand-50 text-4xl">{service.emoji}</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{service.title}</h1>
              {service.priceFrom && (
                <p className="text-sm text-gray-500">
                  From <span className="font-semibold text-brand-700">{service.priceFrom}</span>
                </p>
              )}
            </div>
          </div>

          <p className="mt-6 leading-relaxed text-gray-600">{service.description}</p>

          <h2 className="mt-8 text-lg font-bold text-gray-900">What&apos;s included</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {service.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-gray-700">
                <Icons.check className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-xl bg-brand-50 p-5">
            <h3 className="font-semibold text-brand-900">Why choose us?</h3>
            <ul className="mt-2 space-y-1 text-sm text-brand-800">
              <li>✓ Experienced, vetted technicians</li>
              <li>✓ Genuine parts &amp; transparent pricing</li>
              <li>✓ Nationwide coverage &amp; fast response</li>
            </ul>
          </div>

          <div className="mt-8">
            <h2 className="mb-4 text-lg font-bold text-gray-900">Other services</h2>
            <div className="flex flex-wrap gap-2">
              {services
                .filter((s) => s.slug !== service.slug)
                .map((s) => (
                  <Link key={s.slug} href={`/services/${s.slug}`} className="rounded-full border bg-white px-3 py-1.5 text-sm text-gray-700 hover:border-brand-400 hover:text-brand-700">
                    {s.emoji} {s.title}
                  </Link>
                ))}
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <ServiceRequestForm serviceTitle={service.title} />
        </div>
      </div>
    </div>
  );
}
