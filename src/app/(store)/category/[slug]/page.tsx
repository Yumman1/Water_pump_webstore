import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategories, getCategoryBySlug } from "@/lib/data";
import { ProductListing, type NavLink } from "@/components/store/ProductListing";
import { BreadcrumbNav } from "@/components/store/BreadcrumbNav";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbJsonLd,
  categoryJsonLd,
  faqPageJsonLd,
  pageMetadata,
} from "@/lib/seo";
import {
  categoryPageDescription,
  categoryPageTitle,
  getCategoryFaqs,
} from "@/lib/seo-content";

export const revalidate = 60;

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);
  if (!category) return { title: "Category" };

  const hasFilters =
    Boolean(searchParams.search) ||
    Boolean(searchParams.sort) ||
    Boolean(searchParams.page);

  return pageMetadata({
    title: categoryPageTitle(category),
    description: categoryPageDescription(category),
    path: `/category/${category.slug}`,
    canonicalPath: hasFilters ? `/category/${category.slug}` : undefined,
    image: category.image ?? undefined,
  });
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

  const faqs = getCategoryFaqs(category.slug);
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: category.name, path: `/category/${category.slug}` },
  ];

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
    <>
      <JsonLd data={[categoryJsonLd(category), breadcrumbJsonLd(breadcrumbs), faqPageJsonLd(faqs)]} />
      <div className="container pt-8">
        <BreadcrumbNav items={breadcrumbs} />
      </div>
      <ProductListing
        title={category.name}
        description={category.description ?? undefined}
        query={{ categorySlug: category.slug, condition: "NEW" }}
        navLinks={navLinks}
        searchParams={searchParams}
      />
      <section className="container border-t py-10">
        <h2 className="text-xl font-bold text-gray-900">Frequently asked questions</h2>
        <p className="mt-1 text-sm text-gray-500">
          Common questions about {category.name.toLowerCase()} from Jawed Pumps Karachi.
        </p>
        <dl className="mt-6 space-y-6">
          {faqs.map((faq) => (
            <div key={faq.question} className="rounded-xl border bg-white p-5">
              <dt className="font-semibold text-gray-900">{faq.question}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-gray-600">{faq.answer}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-sm text-gray-500">
          See our full{" "}
          <Link href="/prices/jawed-water-pump-price-list" className="font-medium text-brand-600 hover:text-brand-700">
            Jawed water pump price list
          </Link>{" "}
          or{" "}
          <Link href="/contact" className="font-medium text-brand-600 hover:text-brand-700">
            contact us
          </Link>{" "}
          for expert advice.
        </p>
      </section>
    </>
  );
}
