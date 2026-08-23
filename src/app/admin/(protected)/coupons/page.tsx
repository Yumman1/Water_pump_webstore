import { getAdminCoupons } from "@/lib/admin-coupons";
import { deleteCoupon, saveCoupon, toggleCouponActive } from "@/app/admin/actions";
import { PageHeader } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import Link from "next/link";
import { isDbConfigured } from "@/lib/prisma";
import { formatCurrency } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  const coupons = await getAdminCoupons();

  return (
    <div>
      <PageHeader
        title="Coupons"
        description="Promo codes customers can apply at checkout."
        action={
          <Link href="/admin/coupons/new">
            <Button>Add Coupon</Button>
          </Link>
        }
      />

      {!isDbConfigured && (
        <p className="mb-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Connect a database to manage coupons.
        </p>
      )}

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Discount</th>
              <th className="px-4 py-3">Min order</th>
              <th className="px-4 py-3">Usage</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {coupons.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No coupons yet. Add WELCOME10 or create a new one.
                </td>
              </tr>
            ) : (
              coupons.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono font-semibold text-gray-900">{c.code}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {c.type === "PERCENTAGE" ? `${c.value}%` : formatCurrency(c.value)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{formatCurrency(c.minSubtotal)}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {c.usageCount}
                    {c.usageLimit != null ? ` / ${c.usageLimit}` : ""}
                  </td>
                  <td className="px-4 py-3">
                    <form action={toggleCouponActive.bind(null, c.id)}>
                      <button
                        type="submit"
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${c.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}
                      >
                        {c.active ? "Active" : "Inactive"}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/coupons/${c.id}`}
                        className="rounded-lg border px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Edit
                      </Link>
                      <ConfirmButton
                        action={deleteCoupon.bind(null, c.id)}
                        iconOnly
                        confirmText={`Delete coupon ${c.code}?`}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
