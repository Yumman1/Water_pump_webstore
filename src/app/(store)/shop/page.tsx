import type { Metadata } from "next";
import { ProductListing } from "@/components/store/ProductListing";

export const metadata: Metadata = { title: "Shop All Products" };
export const revalidate = 60;

export default function ShopPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <ProductListing
      title="All Products"
      description="Browse our full range of pumps, motors and accessories."
      searchParams={searchParams}
    />
  );
}
