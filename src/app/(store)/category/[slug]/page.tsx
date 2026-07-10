import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/data";
import { ProductListing } from "@/components/store/ProductListing";

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
  const category = await getCategoryBySlug(params.slug);
  if (!category) notFound();

  return (
    <ProductListing
      title={category.name}
      description={category.description ?? undefined}
      activeCategorySlug={category.slug}
      searchParams={searchParams}
    />
  );
}
