import type { Metadata } from "next";
import { getCategories } from "@/lib/data";
import { ProductListing, type NavLink } from "@/components/store/ProductListing";

export const metadata: Metadata = { title: "Shop All Products" };
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
      description="Browse our full range of new pumps, motors and accessories."
      query={{ condition: "NEW" }}
      navLinks={navLinks}
      searchParams={searchParams}
    />
  );
}
