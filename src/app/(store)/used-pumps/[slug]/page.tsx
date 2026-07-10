import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUsedCategory, usedCategories } from "@/data/used-pumps";
import { ProductListing, type NavLink } from "@/components/store/ProductListing";

export const revalidate = 60;

export function generateStaticParams() {
  return usedCategories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const cat = getUsedCategory(params.slug);
  return { title: cat ? cat.label : "Used Pumps" };
}

export default function UsedPumpCategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const cat = getUsedCategory(params.slug);
  if (!cat) notFound();

  const navLinks: NavLink[] = [
    { label: "All Used Pumps", href: "/used-pumps", active: false },
    ...usedCategories.map((c) => ({
      label: c.label,
      href: `/used-pumps/${c.slug}`,
      active: c.slug === cat.slug,
    })),
  ];

  return (
    <ProductListing
      title={cat.label}
      description={cat.description}
      query={{ condition: "USED", categorySlug: cat.categorySlug }}
      navLinks={navLinks}
      navTitle="Used Pumps"
      searchParams={searchParams}
    />
  );
}
