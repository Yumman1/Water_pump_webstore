import Image from "next/image";
import Link from "next/link";
import { getAdminProducts } from "@/lib/admin-data";
import { isDbConfigured } from "@/lib/prisma";
import { formatCurrency } from "@/lib/format";
import { PageHeader, StatCard } from "@/components/admin/ui";
import { StockControl } from "@/components/admin/StockControl";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const products = await getAdminProducts();
  const outOfStock = products.filter((p) => p.stock <= 0);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold);
  const inventoryValue = products.reduce((sum, p) => sum + (p.cost ?? p.price) * p.stock, 0);

  // Sort: out of stock first, then low stock, then rest.
  const sorted = [...products].sort((a, b) => {
    const rank = (p: (typeof products)[number]) =>
      p.stock <= 0 ? 0 : p.stock <= p.lowStockThreshold ? 1 : 2;
    return rank(a) - rank(b);
  });

  return (
    <div>
      <PageHeader title="Inventory" description="Track and update stock levels across your catalog." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Inventory Value" value={formatCurrency(inventoryValue)} icon="chart" tone="green" />
        <StatCard label="Low Stock" value={lowStock.length} icon="warning" tone="orange" />
        <StatCard label="Out of Stock" value={outOfStock.length} icon="warning" tone="orange" />
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border bg-white">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Threshold</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {sorted.map((p) => {
              const status =
                p.stock <= 0 ? "Out of stock" : p.stock <= p.lowStockThreshold ? "Low stock" : "In stock";
              const tone =
                p.stock <= 0 ? "bg-red-100 text-red-700" : p.stock <= p.lowStockThreshold ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700";
              return (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        {p.images[0] && <Image src={p.images[0]} alt="" fill sizes="40px" className="object-cover" />}
                      </div>
                      <Link href={`/admin/products/${p.id}`} className="line-clamp-1 font-medium text-gray-900 hover:text-brand-700">
                        {p.name}
                      </Link>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{p.sku}</td>
                  <td className="px-4 py-3 text-gray-500">{p.lowStockThreshold}</td>
                  <td className="px-4 py-3">
                    <span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-semibold", tone)}>{status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <StockControl productId={p.id} stock={p.stock} disabled={!isDbConfigured} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
