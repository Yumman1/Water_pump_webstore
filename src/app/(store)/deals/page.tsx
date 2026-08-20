import type { Metadata } from "next";
import { getDealsProducts } from "@/lib/data";
import { ProductGrid } from "@/components/store/ProductGrid";
import { Icons } from "@/components/ui/icons";

export const metadata: Metadata = { title: "Special Offers & Deals" };
export const revalidate = 60;

export default async function DealsPage() {
  const deals = await getDealsProducts(48);

  return (
    <div>
      {/* Promo hero */}
      <section className="bg-gradient-to-r from-accent to-orange-500 text-white">
        <div className="container py-12 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1 text-sm font-semibold">
            <Icons.tag className="h-4 w-4" /> Limited Time
          </span>
          <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">Special Offers &amp; Deals</h1>
          <p className="mx-auto mt-2 max-w-xl text-white/90">
            Grab our best-priced water pumps, motors and accessories. Discounts you won&apos;t find anywhere else while stocks last!
          </p>
        </div>
      </section>

      <div className="container py-10">
        {deals.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-white py-16 text-center">
            <p className="font-medium text-gray-700">No active deals right now</p>
            <p className="mt-1 text-sm text-gray-500">Check back soon. New offers are added regularly.</p>
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-gray-500">
              {deals.length} product{deals.length === 1 ? "" : "s"} on sale
            </p>
            <ProductGrid products={deals} />
          </>
        )}
      </div>
    </div>
  );
}
