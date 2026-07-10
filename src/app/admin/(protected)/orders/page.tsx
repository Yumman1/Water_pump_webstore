import Link from "next/link";
import { getAdminOrders } from "@/lib/admin-data";
import { formatCurrency, formatDate } from "@/lib/format";
import { PageHeader, StatusBadge, EmptyState } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <div>
      <PageHeader title="Orders" description={`${orders.length} orders total.`} />

      {orders.length === 0 ? (
        <EmptyState title="No orders yet" description="Orders placed on the storefront appear here. (Connect a database to receive real orders.)" />
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="border-b bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((o) => (
                <tr key={o.id} className="cursor-pointer hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${o.id}`} className="font-medium text-brand-600 hover:underline">
                      {o.orderNumber}
                    </Link>
                    <p className="text-xs text-gray-400">{o.items?.length ?? 0} item(s)</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-gray-900">{o.customerName}</p>
                    <p className="text-xs text-gray-400">{o.city}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(o.createdAt)}</td>
                  <td className="px-4 py-3 font-medium">{formatCurrency(o.total)}</td>
                  <td className="px-4 py-3"><StatusBadge status={o.paymentStatus} /></td>
                  <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
