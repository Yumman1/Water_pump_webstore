import { getCategories } from "@/lib/data";
import { siteConfig } from "@/config/site";
import { HeaderClient } from "./HeaderClient";

export async function SiteHeader() {
  const categories = await getCategories();
  return (
    <>
      {siteConfig.announcement && (
        <div className="bg-brand-700 text-center text-sm text-white">
          <div className="container py-2">{siteConfig.announcement}</div>
        </div>
      )}
      <HeaderClient categories={categories} />
    </>
  );
}
