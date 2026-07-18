import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/data";
import { usedCategories } from "@/data/used-pumps";
import { ProductGrid } from "@/components/store/ProductGrid";
import { Icons } from "@/components/ui/icons";

export const metadata: Metadata = { title: "Used Pumps" };
export const revalidate = 60;

export default async function UsedPumpsPage() {
  const { products } = await getProducts({ condition: "USED", pageSize: 8 });

  // Count per used sub-category.
  const counts = await Promise.all(
    usedCategories.map(async (c) => {
      const { total } = await getProducts({ condition: "USED", categorySlug: c.categorySlug, pageSize: 1 });
      return { ...c, total };
    })
  );

  return (
    <div>
      <section className="bg-brand-900 text-white">
        <div className="container py-12">
          <h1 className="text-3xl font-extrabold sm:text-4xl">Used &amp; Refurbished Pumps</h1>
          <p className="mt-2 max-w-2xl text-brand-100">
            Quality pre-owned pumps, tested and serviced by our workshop — reliable performance at a fraction of the price.
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-2"><Icons.check className="h-4 w-4 text-brand-300" /> Tested &amp; inspected</span>
            <span className="flex items-center gap-2"><Icons.shield className="h-4 w-4 text-brand-300" /> Workshop warranty</span>
            <span className="flex items-center gap-2"><Icons.tag className="h-4 w-4 text-brand-300" /> Budget-friendly</span>
          </div>
        </div>
      </section>

      {/* Sub-categories */}
      <section className="container py-10">
        <h2 className="mb-4 text-xl font-bold text-gray-900">Browse by type</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {counts.map((c) => (
            <Link
              key={c.slug}
              href={`/used-pumps/${c.slug}`}
              className="card-hover group flex items-center gap-4 rounded-xl border bg-white p-5"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <Icons.box className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 group-hover:text-brand-700">{c.label}</p>
                <p className="text-sm text-gray-500">{c.description}</p>
              </div>
              <span className="text-sm text-gray-400">{c.total} →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest used pumps */}
      {products.length > 0 && (
        <section className="container pb-12">
          <h2 className="mb-6 text-xl font-bold text-gray-900">Latest Used Pumps</h2>
          <ProductGrid products={products} />
        </section>
      )}
    </div>
  );
}
