import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategories, getCategoryBySlug } from "@/lib/data";
import { ProductListing, type NavLink } from "@/components/store/ProductListing";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);
  return { title: category ? category.name : "Category" };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [category, categories] = await Promise.all([
    getCategoryBySlug(params.slug),
    getCategories(),
  ]);
  if (!category) notFound();

  const navLinks: NavLink[] = [
    { label: "All Products", href: "/shop", active: false },
    ...categories.map((c) => ({
      label: c.name,
      href: `/category/${c.slug}`,
      active: c.slug === category.slug,
      count: c.productCount,
    })),
  ];

  return (
    <ProductListing
      title={category.name}
      description={category.description ?? undefined}
      query={{ categorySlug: category.slug, condition: "NEW" }}
      navLinks={navLinks}
      searchParams={searchParams}
    />
  );
}
