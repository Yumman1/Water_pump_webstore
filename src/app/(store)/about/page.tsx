import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Icons, type IconName } from "@/components/ui/icons";
import { Certifications } from "@/components/store/Certifications";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About Jawed Pumps & Motors | Serving Pakistan Since 1980",
  description: `Learn about ${siteConfig.legalName}. Four decades of industrial-grade water pump solutions for homes, farms and industry across Pakistan.`,
  path: "/about",
});

const highlights: { title: string; description: string; icon: IconName }[] = [
  {
    title: "Four Decades of Trust",
    description: "Serving the best B2B and B2C clients since 1980.",
    icon: "shield",
  },
  {
    title: "Uncompromised Quality",
    description: "Industrial-grade materials and build quality for lasting durability and efficiency.",
    icon: "check",
  },
  {
    title: "End-to-End Solutions",
    description: "A growing catalog of motors, pumps and complete water systems for every need.",
    icon: "box",
  },
  {
    title: "Nationwide Reach",
    description:
      "Headquartered in Karachi and manufactured in Gujranwala, we deliver anywhere in Pakistan with secure Cash-on-Delivery (COD).",
    icon: "truck",
  },
  {
    title: "Expert Support",
    description: "Transparent guidance and reliable after-sales care to ensure you get the exact right fit.",
    icon: "headset",
  },
];

export default function AboutPage() {
  return (
    <div className="py-12">
      <div className="container">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-900">About {siteConfig.name}</h1>

          <div className="mt-6 space-y-4 text-lg leading-relaxed text-gray-600">
            <p>
              For over four decades, the Jawed name has been synonymous with industrial-grade power and
              unwavering reliability. Established in 1980, we began our journey as a dedicated B2B supplier,
              engineering high-performance motors for industries that demanded nothing but the best.
            </p>
            <p>
              Today, Jawed Pumps &amp; Motors has evolved to bring that exact same industrial strength
              directly to your doorstep. Whether you need motors, pressure systems, bore and deep-well
              pumps, complete sets or future product lines we add to the catalog, we provide water
              solutions that stand the test of time.
            </p>
          </div>

          <section className="mt-10 overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="grid gap-0 md:grid-cols-[minmax(240px,320px)_1fr]">
              <div className="relative aspect-[4/5] min-h-[280px] bg-gray-100 md:aspect-auto md:min-h-full">
                <Image
                  src="/images/ceo-usman-jawed.jpg"
                  alt="Usman Jawed, Chief Executive Officer of Jawed Pumps & Motors"
                  fill
                  sizes="(max-width: 768px) 100vw, 320px"
                  className="object-cover object-top"
                  priority
                />
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-8">
                <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Leadership</p>
                <h2 className="mt-2 text-2xl font-bold text-gray-900">Usman Jawed</h2>
                <p className="mt-1 text-sm font-medium text-gray-500">Chief Executive Officer</p>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  Usman Jawed leads {siteConfig.legalName} with years of experience in manufacturing,
                  product selection, and after-sales support across Pakistan&apos;s water pump and motor
                  industry. He builds on a legacy that began in 1980, bringing genuine industrial solutions
                  to homes, farms, and businesses with the service and reliability the Jawed name is known
                  for.
                </p>
              </div>
            </div>
          </section>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {highlights.map((f) => {
              const Icon = Icons[f.icon] ?? Icons.check;
              return (
                <div key={f.title} className="flex items-start gap-3 rounded-xl border bg-white p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                    <Icon />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{f.title}</p>
                    <p className="text-sm text-gray-500">{f.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 space-y-4 leading-relaxed text-gray-600">
            <p>
              Proudly manufactured in the industrial hub of Gujranwala and distributed through our Karachi
              headquarters ({siteConfig.contact.address}), we bridge the gap between world-class engineering and
              everyday utility. Whether you are powering a large-scale farm, an industrial facility, or securing
              reliable water pressure for your home, Jawed delivers. With nationwide delivery, easy
              cash-on-delivery options, and expert after-sales support, getting the right water solution has never been
              more seamless.
            </p>
          </div>

          <section className="mt-10 rounded-xl border bg-brand-50/50 p-6">
            <h2 className="text-lg font-bold text-gray-900">Explore our catalog</h2>
            <p className="mt-2 text-sm text-gray-600">
              Shop genuine Jawed pumps and motors online with expert support from Karachi.
            </p>
            <ul className="mt-4 flex flex-wrap gap-2 text-sm">
              <li>
                <Link href="/shop" className="rounded-full border bg-white px-3 py-1.5 font-medium text-brand-700 hover:border-brand-400">
                  All products
                </Link>
              </li>
              <li>
                <Link href="/category/copper-motors" className="rounded-full border bg-white px-3 py-1.5 font-medium text-brand-700 hover:border-brand-400">
                  Copper motors
                </Link>
              </li>
              <li>
                <Link href="/category/monoblock-pressure-pumps" className="rounded-full border bg-white px-3 py-1.5 font-medium text-brand-700 hover:border-brand-400">
                  Monoblock pumps
                </Link>
              </li>
              <li>
                <Link href="/category/bearing-pumps" className="rounded-full border bg-white px-3 py-1.5 font-medium text-brand-700 hover:border-brand-400">
                  Bearing pumps
                </Link>
              </li>
              <li>
                <Link href="/services" className="rounded-full border bg-white px-3 py-1.5 font-medium text-brand-700 hover:border-brand-400">
                  Pump services
                </Link>
              </li>
              <li>
                <Link href="/prices/jawed-water-pump-price-list" className="rounded-full border bg-white px-3 py-1.5 font-medium text-brand-700 hover:border-brand-400">
                  Jawed price list
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </div>

      <Certifications className="mt-12 border-t bg-gray-50 py-12" />
    </div>
  );
}
