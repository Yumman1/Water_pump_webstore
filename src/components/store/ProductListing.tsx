import Link from "next/link";
import { getCategories, getProducts } from "@/lib/data";
import { ProductGrid } from "./ProductGrid";
import { ShopSort } from "./ShopControls";
import { Pagination } from "./Pagination";
import type { ProductQuery } from "@/lib/types";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;

export async function ProductListing({
  title,
  description,
  activeCategorySlug,
  searchParams,
}: {
  title: string;
  description?: string;
  activeCategorySlug?: string;
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const search = typeof searchParams.search === "string" ? searchParams.search : undefined;
  const sort = (typeof searchParams.sort === "string" ? searchParams.sort : "newest") as ProductQuery["sort"];
  const page = Math.max(1, parseInt((searchParams.page as string) ?? "1", 10) || 1);

  const [categories, { products, total }] = await Promise.all([
    getCategories(),
    getProducts({
      categorySlug: activeCategorySlug,
      search,
      sort,
      page,
      pageSize: PAGE_SIZE,
    }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {description && <p className="mt-1 text-gray-500">{description}</p>}
      </div>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        {/* Sidebar */}
        <aside className="hidden lg:block">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Categories</h2>
          <ul className="space-y-1 text-sm">
            <li>
              <Link
                href="/shop"
                className={cn(
                  "block rounded-md px-3 py-2 hover:bg-gray-100",
                  !activeCategorySlug && "bg-brand-50 font-semibold text-brand-700"
                )}
              >
                All Products
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/category/${c.slug}`}
                  className={cn(
                    "flex items-center justify-between rounded-md px-3 py-2 hover:bg-gray-100",
                    activeCategorySlug === c.slug && "bg-brand-50 font-semibold text-brand-700"
                  )}
                >
                  <span>{c.name}</span>
                  <span className="text-xs text-gray-400">{c.productCount ?? 0}</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Results */}
        <div>
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              {total} product{total === 1 ? "" : "s"}
              {search && (
                <>
                  {" "}for <span className="font-medium text-gray-700">“{search}”</span>
                </>
              )}
            </p>
            <ShopSort />
          </div>

          {/* Mobile category chips */}
          <div className="mb-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            <Link
              href="/shop"
              className={cn(
                "whitespace-nowrap rounded-full border px-3 py-1 text-sm",
                !activeCategorySlug ? "border-brand-600 bg-brand-600 text-white" : "bg-white"
              )}
            >
              All
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/category/${c.slug}`}
                className={cn(
                  "whitespace-nowrap rounded-full border px-3 py-1 text-sm",
                  activeCategorySlug === c.slug ? "border-brand-600 bg-brand-600 text-white" : "bg-white"
                )}
              >
                {c.name}
              </Link>
            ))}
          </div>

          <ProductGrid products={products} />
          <Pagination
            page={page}
            totalPages={totalPages}
            baseParams={{ search, sort: sort ?? undefined }}
          />
        </div>
      </div>
    </div>
  );
}
