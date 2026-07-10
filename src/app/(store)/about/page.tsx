import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Icons, type IconName } from "@/components/ui/icons";

export const metadata: Metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900">About {siteConfig.name}</h1>
        <p className="mt-4 text-lg text-gray-600">{siteConfig.description}</p>

        <div className="mt-8 space-y-4 leading-relaxed text-gray-600">
          <p>
            {siteConfig.legalName} is a leading supplier of water pumps and pumping solutions in Pakistan.
            From solar-powered irrigation systems to home pressure boosters, we stock a wide range of
            genuine, high-quality products backed by manufacturer warranties.
          </p>
          <p>
            Our mission is simple: help every customer find the right pump for their needs at a fair price,
            with expert guidance and reliable after-sales support. With nationwide delivery and cash-on-delivery
            options, getting the pump you need has never been easier.
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
  );
}
