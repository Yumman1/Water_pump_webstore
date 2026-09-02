import { Suspense } from "react";
import type { Metadata } from "next";
import { getCategories } from "@/lib/data";
import { ProductListing, type NavLink } from "@/components/store/ProductListing";
import { ProductListingSkeleton } from "@/components/store/ProductGridSkeleton";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}): Promise<Metadata> {
  const hasFilters =
    Boolean(searchParams.search) ||
    Boolean(searchParams.sort) ||
    Boolean(searchParams.page);

  return pageMetadata({
    title: "Shop Jawed Pumps, Motors & Complete Sets | Karachi",
    description:
      "Browse the full Jawed Engineering Pumps catalog: copper winding motors, monoblock pressure pumps, bearing donkey pumps and matched sets. Javed water pump prices with nationwide delivery.",
    path: "/shop/browse",
    canonicalPath: hasFilters ? "/shop" : undefined,
  });
}

export default async function ShopBrowsePage({
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
    <Suspense fallback={<ProductListingSkeleton />}>
      <ProductListing
        title="All Products"
        description="Browse our full range of water pumps, motors and accessories. More products and brands are added as we grow."
        query={{ condition: "NEW" }}
        navLinks={navLinks}
        searchParams={searchParams}
        browsePath="/shop/browse"
      />
    </Suspense>
  );
}
