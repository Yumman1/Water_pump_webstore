import Link from "next/link";
import { getProducts } from "@/lib/data";
import { ProductGrid } from "./ProductGrid";
import { ShopSort } from "./ShopControls";
import { Pagination } from "./Pagination";
import type { ProductQuery } from "@/lib/types";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;

export type NavLink = { label: string; href: string; active: boolean; count?: number };

export async function ProductListing({
  title,
  description,
  query = {},
  navLinks,
  navTitle = "Categories",
  searchParams,
}: {
  title: string;
  description?: string;
  query?: ProductQuery;
  navLinks?: NavLink[];
  navTitle?: string;
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const search = typeof searchParams.search === "string" ? searchParams.search : undefined;
  const sort = (typeof searchParams.sort === "string" ? searchParams.sort : "newest") as ProductQuery["sort"];
  const page = Math.max(1, parseInt((searchParams.page as string) ?? "1", 10) || 1);

  const { products, total } = await getProducts({
    ...query,
    search,
    sort,
    page,
    pageSize: PAGE_SIZE,
  });

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const hasNav = navLinks && navLinks.length > 0;

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {description && <p className="mt-1 text-gray-500">{description}</p>}
      </div>

      <div className={cn("grid gap-8", hasNav && "lg:grid-cols-[220px_1fr]")}>
        {/* Sidebar */}
        {hasNav && (
          <aside className="hidden lg:block">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">{navTitle}</h2>
            <ul className="space-y-1 text-sm">
              {navLinks!.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center justify-between rounded-md px-3 py-2 hover:bg-gray-100",
                      link.active && "bg-brand-50 font-semibold text-brand-700"
                    )}
                  >
                    <span>{link.label}</span>
                    {link.count !== undefined && <span className="text-xs text-gray-400">{link.count}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}

        {/* Results (min-w-0 lets the inner horizontal-scroll chips shrink instead
             of forcing the whole page wide on mobile) */}
        <div className="min-w-0">
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

          {/* Mobile nav chips */}
          {hasNav && (
            <div className="mb-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {navLinks!.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "whitespace-nowrap rounded-full border px-3 py-1 text-sm",
                    link.active ? "border-brand-600 bg-brand-600 text-white" : "bg-white"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          <ProductGrid products={products} />
          <Pagination page={page} totalPages={totalPages} baseParams={{ search, sort: sort ?? undefined }} />
        </div>
      </div>
    </div>
  );
}
