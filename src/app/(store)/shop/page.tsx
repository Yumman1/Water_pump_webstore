import type { Metadata } from "next";
import { getCategories } from "@/lib/data";
import { ProductListing, type NavLink } from "@/components/store/ProductListing";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Shop Jawed Pumps, Motors & Complete Sets",
  description:
    "Browse the full Jawed Pumps catalog — copper motors, monoblock pressure pumps, bearing pumps and matched sets. Genuine stock with nationwide delivery across Pakistan.",
  path: "/shop",
});
export const revalidate = 60;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const categories = await getCategories();
  const navLinks: NavLink[] = [
    { label: "All Products", href: "/shop", active: true },
    ...categories.map((c) => ({
      label: c.name,
      href: `/category/${c.slug}`,
      active: false,
      count: c.productCount,
    })),
  ];

  return (
    <ProductListing
      title="All Products"
      description="Browse our full range of water pumps, motors and accessories. More products and brands are added as we grow."
      query={{ condition: "NEW" }}
      navLinks={navLinks}
      searchParams={searchParams}
    />
  );
}
