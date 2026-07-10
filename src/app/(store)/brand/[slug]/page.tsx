import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { brands, getBrandBySlug } from "@/config/menu";
import { ProductListing, type NavLink } from "@/components/store/ProductListing";

export const revalidate = 60;

export function generateStaticParams() {
  return brands.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const brand = getBrandBySlug(params.slug);
  return { title: brand ? `${brand.label} Pumps` : "Brand" };
}

export default function BrandPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const brand = getBrandBySlug(params.slug);
  if (!brand) notFound();

  const navLinks: NavLink[] = brands.map((b) => ({
    label: b.label,
    href: `/brand/${b.slug}`,
    active: b.slug === brand.slug,
  }));

  return (
    <ProductListing
      title={`${brand.label} Products`}
      description={`Browse all ${brand.label} pumps, motors and accessories.`}
      query={{ brand: brand.label }}
      navLinks={navLinks}
      navTitle="Brands"
      searchParams={searchParams}
    />
  );
}
