import Link from "next/link";
import Image from "next/image";
import { getAdminProducts } from "@/lib/admin-data";
import { formatCurrency } from "@/lib/format";
import { PageHeader, EmptyState } from "@/components/admin/ui";
import { ButtonLink } from "@/components/ui/button";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { deleteProduct } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div>
      <PageHeader
        title="Products"
        description={`${products.length} products in your catalog.`}
        action={<ButtonLink href="/admin/products/new">+ Add Product</ButtonLink>}
      />

      {products.length === 0 ? (
        <EmptyState title="No products" description="Add your first product to get started." />
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="border-b bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((p) => {
                const low = p.stock <= p.lowStockThreshold;
                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          {p.images[0] && <Image src={p.images[0]} alt="" fill sizes="40px" className="object-cover" />}
                        </div>
                        <span className="line-clamp-1 font-medium text-gray-900">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{p.sku}</td>
                    <td className="px-4 py-3 text-gray-500">{p.category?.name ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className="font-medium">{formatCurrency(p.price)}</span>
                      {p.compareAtPrice && p.compareAtPrice > p.price && (
                        <span className="ml-2 inline-flex rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-red-700">Sale</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("font-medium", p.stock <= 0 ? "text-red-600" : low ? "text-orange-600" : "text-gray-700")}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-semibold", p.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500")}>
                        {p.active ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/products/${p.id}`} className="rounded-lg px-3 py-1.5 text-sm font-medium text-brand-600 hover:bg-brand-50">
                          Edit
                        </Link>
                        <ConfirmButton action={deleteProduct.bind(null, p.id)} iconOnly confirmText={`Delete "${p.name}"?`} />
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
