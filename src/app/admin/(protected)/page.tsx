import Link from "next/link";
import { getDashboardStats } from "@/lib/admin-data";
import { formatCurrency, formatDate } from "@/lib/format";
import { PageHeader, StatCard, StatusBadge, EmptyState } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div>
      <PageHeader title="Dashboard" description="Overview of your store's performance." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Revenue" value={formatCurrency(stats.revenue)} icon="chart" tone="green" />
        <StatCard label="Orders" value={stats.orderCount} icon="clipboard" tone="brand" />
        <StatCard label="Products" value={stats.productCount} icon="box" tone="purple" />
        <StatCard label="Customers" value={stats.customerCount} icon="users" tone="brand" />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pending Orders" value={stats.pendingOrders} icon="warning" tone="orange" />
        <StatCard label="Low Stock Items" value={stats.lowStockCount} icon="warning" tone="orange" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Recent orders */}
        <div className="rounded-xl border bg-white">
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="font-semibold text-gray-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm font-medium text-brand-600 hover:text-brand-700">View all →</Link>
          </div>
          {stats.recentOrders.length === 0 ? (
            <div className="p-6">
              <EmptyState title="No orders yet" description="Orders placed on the storefront will appear here." />
            </div>
          ) : (
            <div className="divide-y">
              {stats.recentOrders.map((o) => (
                <Link key={o.id} href={`/admin/orders/${o.id}`} className="flex items-center justify-between p-4 hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">{o.orderNumber}</p>
                    <p className="text-sm text-gray-500">{o.customerName} · {formatDate(o.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(o.total)}</p>
                    <StatusBadge status={o.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Top products */}
        <div className="rounded-xl border bg-white">
          <div className="border-b p-4">
            <h2 className="font-semibold text-gray-900">Top Products</h2>
          </div>
          <div className="divide-y">
            {stats.topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600">{i + 1}</span>
                  <span className="line-clamp-1 text-sm text-gray-800">{p.name}</span>
                </div>
                <span className="shrink-0 text-sm font-medium text-gray-500">{p.sold} sold</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
