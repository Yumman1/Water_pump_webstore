"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { formatCurrency } from "@/lib/format";
import { siteConfig } from "@/config/site";
import { Button, ButtonLink } from "@/components/ui/button";

type PaymentMethod = "COD" | "BANK_TRANSFER";

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payment, setPayment] = useState<PaymentMethod>("COD");
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    address: "",
    city: "",
    notes: "",
  });

  const shipping = subtotal >= siteConfig.shipping.freeShippingThreshold ? 0 : siteConfig.shipping.flatRate;
  const tax = Math.round(subtotal * siteConfig.taxRate);
  const total = subtotal + shipping + tax;

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

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          paymentMethod: payment,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      clear();
      router.push(`/order-success?order=${encodeURIComponent(data.orderNumber)}`);
    } catch (err) {
      setError((err as Error).message);
      setSubmitting(false);
    }
  }

  const inputClass =
    "h-11 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500";

  return (
    <div className="container py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Checkout</h1>
      <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Details */}
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
                <input required value={form.customerPhone} onChange={(e) => update("customerPhone", e.target.value)} className={inputClass} placeholder="+92 3XX XXXXXXX" />
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
            <p className="mt-3 text-xs text-gray-400">
              💳 Card/online payments (Stripe, etc.) can be wired into <code>/api/orders</code> — see the README.
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="h-fit rounded-xl border bg-white p-6">
          <h2 className="text-lg font-bold text-gray-900">Your Order</h2>
          <div className="mt-4 max-h-64 space-y-3 overflow-y-auto">
            {items.map((i) => (
              <div key={i.productId} className="flex justify-between gap-2 text-sm">
                <span className="text-gray-600">{i.name} × {i.quantity}</span>
                <span className="font-medium">{formatCurrency(i.price * i.quantity)}</span>
              </div>
            ))}
          </div>
          <dl className="mt-4 space-y-2 border-t pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-gray-500">Subtotal</dt><dd>{formatCurrency(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Shipping</dt><dd>{shipping === 0 ? "Free" : formatCurrency(shipping)}</dd></div>
            {tax > 0 && <div className="flex justify-between"><dt className="text-gray-500">Tax</dt><dd>{formatCurrency(tax)}</dd></div>}
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
