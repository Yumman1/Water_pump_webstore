import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Icons, type IconName } from "@/components/ui/icons";
import { Certifications } from "@/components/store/Certifications";

export const metadata: Metadata = { title: "About Us" };

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
              headquarters (F-28 Main Suparco Road-13), we bridge the gap between world-class engineering and
              everyday utility. Whether you are powering a large-scale farm, an industrial facility, or securing
              reliable water pressure for your home, Jawed delivers. With nationwide delivery, easy
              cash-on-delivery options, and expert after-sales support, getting the right water solution has never been
              more seamless.
            </p>
          </div>
        </div>
      </div>

      <Certifications className="mt-12 border-t bg-gray-50 py-12" />
    </div>
  );
}
