import Link from "next/link";
import { getAdminProducts, getDashboardStats } from "@/lib/admin-data";
import { formatCurrency } from "@/lib/format";
import { PageHeader, EmptyState } from "@/components/admin/ui";
import { ButtonLink } from "@/components/ui/button";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { VisibilityToggle } from "@/components/admin/VisibilityToggle";
import { FeaturedToggle } from "@/components/admin/FeaturedToggle";
import { ProductTagsEditor } from "@/components/admin/ProductTagsEditor";
import { AdminProductThumb } from "@/components/admin/AdminProductThumb";
import { deleteProduct, toggleProductActive, toggleProductFeatured, updateProductTags } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const HOMEPAGE_FEATURED_LIMIT = 8;

export default async function AdminProductsPage() {
  const [products, stats] = await Promise.all([getAdminProducts(), getDashboardStats()]);
  const featuredProducts = products.filter((p) => p.featured);

  return (
    <div>
      <PageHeader
        title="Products"
        description={`${products.length} products in your catalog.`}
        action={<ButtonLink href="/admin/products/new">+ Add Product</ButtonLink>}
      />

      {stats.demo && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Database is not connected, so create / edit / hide changes will not save yet. Connect{" "}
          <code className="rounded bg-amber-100 px-1">DATABASE_URL</code> and run migrations to enable full product
          management.
        </div>
      )}

      <div className="mb-6 rounded-xl border bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Homepage featured products</h2>
            <p className="mt-1 text-xs text-gray-500">
              Toggle <strong className="font-medium text-gray-700">Featured</strong> below to add or remove products
              from the homepage. Up to {HOMEPAGE_FEATURED_LIMIT} featured products are shown. Tags help with shop search
              and can be edited inline.
            </p>
          </div>
          <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent-700">
            {featuredProducts.length} featured
          </span>
        </div>
        {featuredProducts.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {featuredProducts.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/admin/products/${p.id}`}
                  className="inline-flex items-center gap-1.5 rounded-full border bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-gray-500">No featured products yet. Turn on Featured for any product below.</p>
        )}
        {featuredProducts.length > HOMEPAGE_FEATURED_LIMIT && (
          <p className="mt-3 text-xs font-medium text-amber-700">
            You have {featuredProducts.length} featured products. Only the first {HOMEPAGE_FEATURED_LIMIT} appear on the
            homepage.
          </p>
        )}
      </div>

      {products.length === 0 ? (
        <EmptyState title="No products" description="Add your first product to get started." />
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full min-w-[1080px] text-sm">
            <thead className="border-b bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Tags</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3">Storefront</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((p) => {
                const low = p.stock <= p.lowStockThreshold;
                const canToggle = !stats.demo && !p.id.startsWith("prod-");
                return (
                  <tr key={p.id} className={cn("hover:bg-gray-50", !p.active && "bg-gray-50/80")}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <AdminProductThumb product={p} />
                        <div className="min-w-0">
                          <span className="line-clamp-1 font-medium text-gray-900">{p.name}</span>
                          {!p.active && (
                            <span className="mt-0.5 block text-[11px] font-medium uppercase tracking-wide text-gray-400">
                              Hidden from shop
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{p.sku}</td>
                    <td className="px-4 py-3 text-gray-500">{p.category?.name ?? "-"}</td>
                    <td className="px-4 py-3 align-top">
                      {canToggle ? (
                        <ProductTagsEditor tags={p.tags} action={updateProductTags.bind(null, p.id)} />
                      ) : (
                        <span className="flex flex-wrap gap-1">
                          {p.tags.length > 0 ? (
                            p.tags.map((tag) => (
                              <span key={tag} className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600">
                                {tag}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium">{formatCurrency(p.price)}</span>
                      {p.compareAtPrice && p.compareAtPrice > p.price && (
                        <span className="ml-2 inline-flex rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-red-700">
                          Sale
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "font-medium",
                          p.stock <= 0 ? "text-red-600" : low ? "text-orange-600" : "text-gray-700"
                        )}
                      >
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {canToggle ? (
                        <FeaturedToggle featured={p.featured} action={toggleProductFeatured.bind(null, p.id)} />
                      ) : (
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold",
                            p.featured ? "bg-accent/10 text-accent-700" : "bg-gray-100 text-gray-500"
                          )}
                        >
                          {p.featured ? "Featured" : "No"}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {canToggle ? (
                        <VisibilityToggle active={p.active} action={toggleProductActive.bind(null, p.id)} />
                      ) : (
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold",
                            p.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                          )}
                        >
                          {p.active ? "Visible" : "Hidden"}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="rounded-lg px-3 py-1.5 text-sm font-medium text-brand-600 hover:bg-brand-50"
                        >
                          Edit
                        </Link>
                        {canToggle && (
                          <ConfirmButton action={deleteProduct.bind(null, p.id)} iconOnly confirmText={`Delete "${p.name}"?`} />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
