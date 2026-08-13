import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminOrder } from "@/lib/admin-data";
import { isDbConfigured } from "@/lib/prisma";
import { updateOrder, dispatchOrder } from "@/app/admin/actions";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { getPricingConfig } from "@/lib/pricing";
import { PageHeader, StatusBadge } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

export const dynamic = "force-dynamic";

const inputClass = "h-10 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-brand-500 focus:outline-none";

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = await getAdminOrder(params.id);
  if (!order) notFound();
  const pricing = await getPricingConfig();

  const action = updateOrder.bind(null, order.id);
  const dispatch = dispatchOrder.bind(null, order.id);
  const canDispatch = !["SHIPPED", "DELIVERED", "CANCELLED"].includes(order.status);

  return (
    <div>
      <div className="mb-4">
        <Link href="/admin/orders" className="text-sm text-gray-500 hover:text-brand-600">← Back to orders</Link>
      </div>
      <PageHeader
        title={order.orderNumber}
        description={`Placed ${formatDateTime(order.createdAt)}`}
        action={<StatusBadge status={order.status} />}
      />

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Items */}
        <div className="space-y-6">
          <div className="rounded-xl border bg-white">
            <div className="border-b p-4"><h2 className="font-semibold text-gray-900">Items</h2></div>
            <div className="divide-y">
              {order.items?.map((it: {
                id: string;
                name: string;
                sku: string;
                price: number;
                quantity: number;
                underWarranty?: boolean;
                listPrice?: number | null;
              }) => (
                <div key={it.id} className="flex items-center justify-between p-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-900">
                      {it.name}
                      {it.underWarranty ? (
                        <span className="ml-2 rounded bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700">
                          Warranty
                        </span>
                      ) : null}
                    </p>
                    <p className="text-xs text-gray-400">SKU: {it.sku} · Qty: {it.quantity}</p>
                  </div>
                  <p className="text-right font-medium">
                    {it.underWarranty && it.listPrice != null ? (
                      <>
                        <span className="mr-1 text-gray-400 line-through">{formatCurrency(it.listPrice * it.quantity)}</span>
                        {formatCurrency(0)}
                      </>
                    ) : (
                      formatCurrency(it.price * it.quantity)
                    )}
                  </p>
                </div>
              ))}
            </div>
            <div className="space-y-2 border-t p-4 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
              <div className="flex justify-between">
                <span className="text-gray-500">Installation & removal</span>
                <span>
                  {order.installationType === "WARRANTY" ? (
                    <>
                      <span className="mr-1 text-gray-400 line-through">{formatCurrency(pricing.installationFee)}</span>
                      {formatCurrency(0)}
                    </>
                  ) : (
                    formatCurrency(order.installationFee ?? 0)
                  )}
                </span>
              </div>
              {order.installationType && (
                <div className="flex justify-between text-xs text-gray-500">
                  <span>
                    {order.installationType === "NONE" && "No installation"}
                    {order.installationType === "WARRANTY" && "Under warranty"}
                    {order.installationType === "PAID" && "Without warranty"}
                  </span>
                  {order.replacementSerial && <span>Serial: {order.replacementSerial}</span>}
                </div>
              )}
              <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>{order.shipping === 0 ? "Free" : formatCurrency(order.shipping)}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount{order.couponCode ? ` (${order.couponCode})` : ""}</span><span>-{formatCurrency(order.discount)}</span></div>}
              {order.tax > 0 && <div className="flex justify-between"><span className="text-gray-500">Tax</span><span>{formatCurrency(order.tax)}</span></div>}
              <div className="flex justify-between border-t pt-2 text-base font-bold"><span>Total</span><span>{formatCurrency(order.total)}</span></div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-xl border bg-white p-5">
            <h2 className="font-semibold text-gray-900">Customer</h2>
            <div className="mt-3 space-y-1 text-sm text-gray-600">
              <p className="font-medium text-gray-900">{order.customerName}</p>
              <p>{order.customerEmail}</p>
              <p>{order.customerPhone}</p>
              <p className="pt-2">{order.address}</p>
              <p>{order.city}, {order.country}</p>
            </div>
            {order.notes && (
              <div className="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                <span className="font-medium text-gray-700">Notes: </span>{order.notes}
              </div>
            )}
            {(order.installationType || order.replacementSerial) && (
              <div className="mt-3 rounded-lg bg-brand-50 p-3 text-sm text-gray-700">
                <p className="font-medium text-gray-900">Installation</p>
                <p className="mt-1">
                  {order.installationType === "NONE" && "No installation & removal"}
                  {order.installationType === "WARRANTY" && "Under warranty (fee waived)"}
                  {order.installationType === "PAID" && "Without warranty"}
                  {" — "}
                  {formatCurrency(order.installationFee ?? 0)}
                </p>
                {order.replacementSerial && (
                  <p className="mt-1">Replacement serial: <span className="font-semibold">{order.replacementSerial}</span></p>
                )}
              </div>
            )}
          </div>

          {/* Dispatch */}
          <div className="rounded-xl border bg-white p-5">
            <h2 className="font-semibold text-gray-900">Dispatch</h2>
            <p className="mt-1 text-sm text-gray-500">
              Marks the order as shipped and sends the customer a dispatch confirmation by email &amp; WhatsApp.
            </p>
            {order.status === "SHIPPED" || order.status === "DELIVERED" ? (
              <p className="mt-3 flex items-center gap-2 text-sm font-medium text-green-700">
                <Icons.check className="h-4 w-4" /> Order dispatched
              </p>
            ) : (
              <form action={dispatch} className="mt-3">
                <Button type="submit" variant="accent" className="w-full" disabled={!isDbConfigured || !canDispatch}>
                  <Icons.truck className="h-4 w-4" /> Mark as Dispatched &amp; Notify Customer
                </Button>
              </form>
            )}
          </div>

          <form action={action} className="space-y-4 rounded-xl border bg-white p-5">
            <h2 className="font-semibold text-gray-900">Update Status</h2>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Order Status</label>
              <select name="status" defaultValue={order.status} disabled={!isDbConfigured} className={inputClass}>
                {["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Payment Status</label>
              <select name="paymentStatus" defaultValue={order.paymentStatus} disabled={!isDbConfigured} className={inputClass}>
                {["UNPAID", "PAID", "REFUNDED"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="text-sm text-gray-500">
              Payment method: <span className="font-medium text-gray-700">{order.paymentMethod}</span>
            </div>
            <Button type="submit" className="w-full" disabled={!isDbConfigured}>Save</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
