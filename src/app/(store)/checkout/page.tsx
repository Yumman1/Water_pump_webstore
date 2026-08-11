"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { formatCurrency } from "@/lib/format";
import { siteConfig } from "@/config/site";
import { Button, ButtonLink } from "@/components/ui/button";

type PaymentMethod = "COD" | "BANK_TRANSFER";
type InstallationType = "NONE" | "WARRANTY" | "PAID";

const INSTALL_FEE = siteConfig.installation.fee;

export default function CheckoutPage() {
  const { items, clear } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payment, setPayment] = useState<PaymentMethod>("COD");
  const [installationType, setInstallationType] = useState<InstallationType>("NONE");
  const [replacementSerial, setReplacementSerial] = useState("");
  const [warrantyIds, setWarrantyIds] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    address: "",
    city: "",
    notes: "",
  });

  const linePrices = useMemo(
    () =>
      items.map((i) => {
        const underWarranty = !!warrantyIds[i.productId];
        const list = i.price * i.quantity;
        const charged = underWarranty ? 0 : list;
        return { ...i, underWarranty, list, charged };
      }),
    [items, warrantyIds]
  );

  const productsSubtotal = linePrices.reduce((s, i) => s + i.charged, 0);
  const installationFee = installationType === "PAID" ? INSTALL_FEE : 0;
  const shippingCharge =
    productsSubtotal + installationFee === 0
      ? 0
      : productsSubtotal + installationFee >= siteConfig.shipping.freeShippingThreshold
        ? 0
        : siteConfig.shipping.flatRate;
  const tax = Math.round(productsSubtotal * siteConfig.taxRate);
  const total = productsSubtotal + installationFee + shippingCharge + tax;

  if (items.length === 0 && !submitting) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Your cart is empty</h1>
        <ButtonLink href="/shop" className="mt-6">Continue Shopping</ButtonLink>
      </div>
    );
  }

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function toggleWarranty(productId: string) {
    setWarrantyIds((prev) => ({ ...prev, [productId]: !prev[productId] }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (installationType === "WARRANTY" && !replacementSerial.trim()) {
      setError("Please enter the serial number of the motor being replaced.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          paymentMethod: payment,
          installationType,
          replacementSerial: installationType === "WARRANTY" ? replacementSerial.trim() : undefined,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            underWarranty: !!warrantyIds[i.productId],
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      clear();
      const params = new URLSearchParams({ order: data.orderNumber });
      if (data.installationType) params.set("install", data.installationType);
      if (data.installationFee != null) params.set("fee", String(data.installationFee));
      if (data.replacementSerial) params.set("serial", data.replacementSerial);
      if (data.total != null) params.set("total", String(data.total));
      router.push(`/order-success?${params.toString()}`);
    } catch (err) {
      setError((err as Error).message);
      setSubmitting(false);
    }
  }

  const inputClass =
    "h-11 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500";

  const installOptions: { value: InstallationType; title: string; desc: string }[] = [
    {
      value: "NONE",
      title: "No installation & removal",
      desc: "We deliver the product only. You handle installation yourself.",
    },
    {
      value: "WARRANTY",
      title: "Installation & removal under warranty",
      desc: `Fee waived (normally ${formatCurrency(INSTALL_FEE)}). Enter the serial number of the motor being replaced.`,
    },
    {
      value: "PAID",
      title: "Installation & removal without warranty",
      desc: `${formatCurrency(INSTALL_FEE)} — for any motor not under warranty (our brand or another).`,
    },
  ];

  return (
    <div className="container py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Checkout</h1>
      <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="rounded-xl border bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">Contact & Shipping</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">Full Name *</label>
                <input required value={form.customerName} onChange={(e) => update("customerName", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Phone *</label>
                <input required value={form.customerPhone} onChange={(e) => update("customerPhone", e.target.value)} className={inputClass} placeholder="0304-1088901" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Email *</label>
                <input required type="email" value={form.customerEmail} onChange={(e) => update("customerEmail", e.target.value)} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">Address *</label>
                <input required value={form.address} onChange={(e) => update("address", e.target.value)} className={inputClass} placeholder="House #, Street, Area" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">City *</label>
                <input required value={form.city} onChange={(e) => update("city", e.target.value)} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">Order Notes (optional)</label>
                <textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} rows={2} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">Products & warranty</h2>
            <p className="mt-1 text-sm text-gray-500">
              Select “Buy under warranty” for any item that is a warranty replacement — its price becomes free (shown struck through).
            </p>
            <ul className="mt-4 divide-y">
              {linePrices.map((i) => (
                <li key={i.productId} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{i.name} × {i.quantity}</p>
                    <p className="text-sm text-gray-500">
                      {i.underWarranty ? (
                        <>
                          <span className="mr-2 text-gray-400 line-through">{formatCurrency(i.list)}</span>
                          <span className="font-semibold text-green-700">{formatCurrency(0)}</span>
                          <span className="ml-2 rounded bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700">Warranty</span>
                        </>
                      ) : (
                        formatCurrency(i.list)
                      )}
                    </p>
                  </div>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={!!warrantyIds[i.productId]}
                      onChange={() => toggleWarranty(i.productId)}
                      className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                    />
                    Buy under warranty
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">Installation & removal</h2>
            <div className="mt-4 space-y-3">
              {installOptions.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 ${
                    installationType === opt.value ? "border-brand-600 bg-brand-50" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="installation"
                    checked={installationType === opt.value}
                    onChange={() => setInstallationType(opt.value)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{opt.title}</p>
                    <p className="text-sm text-gray-500">{opt.desc}</p>
                    {opt.value === "WARRANTY" && installationType === "WARRANTY" && (
                      <p className="mt-1 text-sm">
                        <span className="text-gray-400 line-through">{formatCurrency(INSTALL_FEE)}</span>{" "}
                        <span className="font-semibold text-green-700">{formatCurrency(0)}</span>
                      </p>
                    )}
                    {opt.value === "PAID" && (
                      <p className="mt-1 text-sm font-semibold text-gray-900">{formatCurrency(INSTALL_FEE)}</p>
                    )}
                  </div>
                </label>
              ))}
            </div>

            {installationType === "WARRANTY" && (
              <div className="mt-4">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Serial number of motor being replaced *
                </label>
                <input
                  required
                  value={replacementSerial}
                  onChange={(e) => setReplacementSerial(e.target.value)}
                  className={inputClass}
                  placeholder="Enter motor serial number"
                />
              </div>
            )}

            <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
              Note: Your previous motor may be bought back and the amount deducted from the total. The buy-back value
              depends on condition and assessment by our team.
            </p>
          </div>

          <div className="rounded-xl border bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
            <div className="mt-4 space-y-3">
              <label className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 ${payment === "COD" ? "border-brand-600 bg-brand-50" : ""}`}>
                <input type="radio" name="payment" checked={payment === "COD"} onChange={() => setPayment("COD")} className="mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Cash on Delivery</p>
                  <p className="text-sm text-gray-500">Pay with cash when your order is delivered.</p>
                </div>
              </label>
              <label className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 ${payment === "BANK_TRANSFER" ? "border-brand-600 bg-brand-50" : ""}`}>
                <input type="radio" name="payment" checked={payment === "BANK_TRANSFER"} onChange={() => setPayment("BANK_TRANSFER")} className="mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Bank Transfer</p>
                  <p className="text-sm text-gray-500">Our team will share bank details after you place the order.</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="h-fit rounded-xl border bg-white p-6">
          <h2 className="text-lg font-bold text-gray-900">Your Order</h2>
          <div className="mt-4 max-h-64 space-y-3 overflow-y-auto">
            {linePrices.map((i) => (
              <div key={i.productId} className="flex justify-between gap-2 text-sm">
                <span className="text-gray-600">
                  {i.name} × {i.quantity}
                  {i.underWarranty ? " (warranty)" : ""}
                </span>
                <span className="text-right font-medium">
                  {i.underWarranty ? (
                    <>
                      <span className="mr-1 text-gray-400 line-through">{formatCurrency(i.list)}</span>
                      {formatCurrency(0)}
                    </>
                  ) : (
                    formatCurrency(i.charged)
                  )}
                </span>
              </div>
            ))}
          </div>
          <dl className="mt-4 space-y-2 border-t pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Products</dt>
              <dd>{formatCurrency(productsSubtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Installation & removal</dt>
              <dd>
                {installationType === "WARRANTY" ? (
                  <>
                    <span className="mr-1 text-gray-400 line-through">{formatCurrency(INSTALL_FEE)}</span>
                    {formatCurrency(0)}
                  </>
                ) : (
                  formatCurrency(installationFee)
                )}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Shipping</dt>
              <dd>{shippingCharge === 0 ? "Free" : formatCurrency(shippingCharge)}</dd>
            </div>
            {tax > 0 && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Tax</dt>
                <dd>{formatCurrency(tax)}</dd>
              </div>
            )}
          </dl>
          <div className="mt-4 flex justify-between border-t pt-4">
            <span className="font-bold text-gray-900">Total</span>
            <span className="text-lg font-bold text-gray-900">{formatCurrency(total)}</span>
          </div>

          {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}

          <Button type="submit" size="lg" className="mt-6 w-full" disabled={submitting}>
            {submitting ? "Placing Order..." : "Place Order"}
          </Button>
          <p className="mt-3 text-center text-xs text-gray-400">By placing this order you agree to our terms.</p>
        </div>
      </form>
    </div>
  );
}
