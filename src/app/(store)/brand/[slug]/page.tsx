import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { brands, getBrandBySlug } from "@/config/menu";
import { ProductListing, type NavLink } from "@/components/store/ProductListing";
import { BreadcrumbNav } from "@/components/store/BreadcrumbNav";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

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

  const navLinks: NavLink[] = [
    { label: "All Products", href: "/shop", active: false },
    ...brands.map((b) => ({
      label: b.label,
      href: `/brand/${b.slug}`,
      active: b.slug === brand.slug,
    })),
  ];

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: brand.label, path: `/brand/${brand.slug}` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
      <div className="container pt-8">
        <BreadcrumbNav items={breadcrumbs} />
      </div>
      <ProductListing
        title={`${brand.label} Products`}
        description={`Browse ${brand.label} products across our water pump and motor range.`}
        query={{ brand: brand.label }}
        navLinks={navLinks}
        navTitle="Brands"
        searchParams={searchParams}
      />
      <section className="container border-t py-8 text-sm text-gray-600">
        <p>
          View updated PKR prices on the{" "}
          <Link href="/water-pump-price-in-pakistan" className="font-medium text-brand-600 hover:text-brand-700">
            Water pump price in Pakistan
          </Link>
          . Browse by category:{" "}
          <Link href="/category/copper-motors" className="font-medium text-brand-600 hover:text-brand-700">
            copper motors
          </Link>
          ,{" "}
          <Link href="/category/monoblock-pressure-pumps" className="font-medium text-brand-600 hover:text-brand-700">
            monoblock pumps
          </Link>
          ,{" "}
          <Link href="/category/bearing-pumps" className="font-medium text-brand-600 hover:text-brand-700">
            bearing pumps
          </Link>
          .
        </p>
      </section>
    </>
  );
}
