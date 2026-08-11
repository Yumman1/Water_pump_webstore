import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Icons, type IconName } from "@/components/ui/icons";
import { Certifications } from "@/components/store/Certifications";

export const metadata: Metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <div className="py-12">
      <div className="container">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-900">About {siteConfig.name}</h1>
          <p className="mt-4 text-lg text-gray-600">{siteConfig.description}</p>

          <div className="mt-8 space-y-4 leading-relaxed text-gray-600">
            <p>
              {siteConfig.legalName} supplies copper motors, monoblock pressure pumps, bearing pumps and
              complete motor+pump sets across Pakistan. We focus on genuine products, clear guidance, and
              reliable after-sales support for homes, farms and industry.
            </p>
            <p>
              Head office: {siteConfig.contact.address}. Manufacturing: {siteConfig.contact.manufacturing}.
              With nationwide delivery and cash-on-delivery options, getting the right pump has never been easier.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {siteConfig.features.map((f) => {
              const Icon = Icons[f.icon as IconName] ?? Icons.check;
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
        </div>
      </div>

      <Certifications className="mt-12 border-t bg-gray-50 py-12" />
    </div>
  );
}
