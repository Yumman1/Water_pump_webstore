import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { brands, getBrandBySlug } from "@/config/menu";
import { ProductListing, type NavLink } from "@/components/store/ProductListing";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 60;

export function generateStaticParams() {
  return brands.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}): Promise<Metadata> {
  const brand = getBrandBySlug(params.slug);
  if (!brand) return { title: "Brand" };

  const hasFilters =
    Boolean(searchParams.search) ||
    Boolean(searchParams.sort) ||
    Boolean(searchParams.page);

  return pageMetadata({
    title: `${brand.label} Water Pumps & Motors | Jawed Pumps Karachi`,
    description: `Shop ${brand.label} water pumps and motors from Jawed Engineering Pumps. Genuine products, copper winding options and nationwide delivery across Pakistan.`,
    path: `/brand/${brand.slug}`,
    canonicalPath: hasFilters ? `/brand/${brand.slug}` : undefined,
  });
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
      description={`Browse ${brand.label} products across our water pump and motor range.`}
      query={{ brand: brand.label }}
      navLinks={navLinks}
      navTitle="Brands"
      searchParams={searchParams}
    />
  );
}
