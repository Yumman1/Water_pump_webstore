import { getAdminCustomers } from "@/lib/admin-data";
import { formatCurrency, formatDate } from "@/lib/format";
import { PageHeader, EmptyState } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const customers = await getAdminCustomers();

  return (
    <div>
      <PageHeader title="Customers" description={`${customers.length} customers.`} />

      {customers.length === 0 ? (
        <EmptyState title="No customers yet" description="Customers are created automatically when orders are placed." />
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Orders</th>
                <th className="px-4 py-3">Total Spent</th>
                <th className="px-4 py-3">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {customers.map((c) => {
                const spent = (c.orders ?? []).reduce((s: number, o: { total: number }) => s + o.total, 0);
                return (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                    <td className="px-4 py-3 text-gray-500">
                      <p>{c.email}</p>
                      <p className="text-xs">{c.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{c.city ?? "-"}</td>
                    <td className="px-4 py-3">{c._count?.orders ?? 0}</td>
                    <td className="px-4 py-3 font-medium">{formatCurrency(spent)}</td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(c.createdAt)}</td>
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
