"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { formatCurrency } from "@/lib/format";
import { siteConfig } from "@/config/site";
import { Button, ButtonLink } from "@/components/ui/button";
import { trackTikTokPurchase } from "@/lib/analytics";
import { CheckoutAnalytics } from "@/components/analytics/CheckoutAnalytics";
import { computeCheckoutTotals, isServiceCity } from "@/lib/delivery";
import type { InstallationType } from "@/lib/types";

type PaymentMethod = "COD" | "BANK_TRANSFER";

export default function CheckoutPage() {
  const { items, clear, productsSubtotal, listSubtotal, pricing } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payment, setPayment] = useState<PaymentMethod>("COD");
  const [couponInput, setCouponInput] = useState("");
  const [couponBusy, setCouponBusy] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [installationType, setInstallationType] = useState<InstallationType>("NONE");
  const [replacementSerial, setReplacementSerial] = useState("");
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    address: "",
    city: "",
    notes: "",
  });

  const cityOptions = useMemo(() => {
    const service = pricing.serviceCity;
    return [
      { value: service, label: `${service} (installation available)` },
      ...pricing.deliveryCities.map((c) => ({
        value: c.name,
        label: c.fee > 0 ? `${c.name} (delivery from ${formatCurrency(c.fee)})` : c.name,
      })),
    ];
  }, [pricing]);

  const karachiSelected = isServiceCity(form.city, pricing.serviceCity);

  useEffect(() => {
    if (!karachiSelected && installationType !== "NONE") {
      setInstallationType("NONE");
      setReplacementSerial("");
    }
  }, [karachiSelected, installationType]);

  const checkoutTotals = useMemo(
    () =>
      computeCheckoutTotals({
        city: form.city,
        productsSubtotal,
        installationType,
        items,
        pricing,
        deliveryCities: pricing.deliveryCities,
        serviceCity: pricing.serviceCity,
      }),
    [form.city, productsSubtotal, installationType, items, pricing]
  );

  const payableTotal = useMemo(() => {
    const discount = appliedCoupon?.discount ?? 0;
    return Math.max(0, checkoutTotals.total - discount);
  }, [checkoutTotals.total, appliedCoupon]);

  const installOptions: { value: InstallationType; title: string; desc: string }[] = [
    {
      value: "NONE",
      title: "No installation & removal",
      desc: "We deliver the product only. You handle installation yourself.",
    },
    {
      value: "WARRANTY",
      title: "Installation & removal under warranty",
      desc: `Fee waived (normally ${formatCurrency(pricing.installationFee)}). Enter the serial number of the unit being replaced.`,
    },
    {
      value: "PAID",
      title: "Installation & removal without warranty",
      desc: `${formatCurrency(pricing.installationFee)} for any motor or pump not under warranty (our brand or another).`,
    },
  ];

  const canSubmit =
    form.city.trim().length > 0 &&
    (installationType !== "WARRANTY" || replacementSerial.trim().length > 0);

  if (items.length === 0 && !submitting) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Your cart is empty</h1>
        <ButtonLink href="/shop" className="mt-6">
          Continue Shopping
        </ButtonLink>
      </div>
    );
  }

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function applyCoupon() {
    setCouponError(null);
    const code = couponInput.trim();
    if (!code) {
      setCouponError("Enter a coupon code.");
      return;
    }
    setCouponBusy(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal: productsSubtotal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Coupon could not be applied");
      setAppliedCoupon({ code: data.code, discount: data.discount });
      setCouponInput(data.code);
    } catch (err) {
      setAppliedCoupon(null);
      setCouponError((err as Error).message);
    } finally {
      setCouponBusy(false);
    }
  }

  function clearCoupon() {
    setAppliedCoupon(null);
    setCouponError(null);
    setCouponInput("");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.city.trim()) {
      setError("Please select a delivery city.");
      return;
    }
    if (karachiSelected && installationType === "WARRANTY" && !replacementSerial.trim()) {
      setError("Please enter the serial number for warranty installation.");
      return;
    }
    if (!karachiSelected && installationType !== "NONE") {
      setError(`Installation is only available in ${pricing.serviceCity}.`);
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
          couponCode: appliedCoupon?.code,
          installationType: checkoutTotals.effectiveInstallationType,
          replacementSerial:
            checkoutTotals.effectiveInstallationType === "WARRANTY" ? replacementSerial.trim() : undefined,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            underWarranty: !!i.underWarranty,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");

      trackTikTokPurchase({
        orderId: data.orderNumber,
        value: Number(data.total ?? payableTotal),
        contents: items.map((i) => ({
          content_id: i.slug,
          content_type: "product" as const,
          content_name: i.name,
          quantity: i.quantity,
          price: i.price,
        })),
      });

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

  const installLabel =
    checkoutTotals.effectiveInstallationType === "WARRANTY"
      ? "Installation & removal under warranty"
      : checkoutTotals.effectiveInstallationType === "PAID"
        ? "Installation & removal without warranty"
        : "No installation & removal";

  const bank = siteConfig.bankTransfer;
  const allWarranty = items.length > 0 && items.every((i) => i.underWarranty);

  return (
    <div className="container py-8">
      <CheckoutAnalytics />
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
                <input required value={form.customerPhone} onChange={(e) => update("customerPhone", e.target.value)} className={inputClass} placeholder="03053770002" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Email *</label>
                <input required type="email" value={form.customerEmail} onChange={(e) => update("customerEmail", e.target.value)} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">Address *</label>
                <input required value={form.address} onChange={(e) => update("address", e.target.value)} className={inputClass} placeholder="House #, Street, Area" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">City *</label>
                <select
                  required
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  className={inputClass}
                >
                  <option value="" disabled>
                    Select delivery city
                  </option>
                  {cityOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {form.city && !karachiSelected && (
                  <p className="mt-2 text-xs text-gray-500">
                    {allWarranty
                      ? "Warranty replacement: free delivery outside Karachi. Installation is not available."
                      : `Delivery fee for ${form.city}: ${formatCurrency(checkoutTotals.shipping)}. Installation is not available outside ${pricing.serviceCity}.`}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">Order Notes (optional)</label>
                <textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} rows={2} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none" />
              </div>
            </div>
          </div>

          {karachiSelected && (
            <div className="rounded-xl border bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900">Installation & removal ({pricing.serviceCity} only)</h2>
              <p className="mt-1 text-sm text-gray-500">Available because you selected {pricing.serviceCity}.</p>
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
                    </div>
                  </label>
                ))}
              </div>
              {installationType === "WARRANTY" && (
                <div className="mt-4">
                  <label className="mb-1 block text-sm font-medium text-gray-700">Serial number of unit being replaced *</label>
                  <input
                    value={replacementSerial}
                    onChange={(e) => setReplacementSerial(e.target.value)}
                    className={inputClass}
                    placeholder="Enter unit serial number"
                  />
                </div>
              )}
              <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
                Note: Your previous motor may be bought back and the amount deducted from the total. The buy-back value
                depends on condition and assessment by our team.
              </p>
            </div>
          )}

          <div className="rounded-xl border bg-white p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-gray-900">Order items</h2>
              <ButtonLink href="/cart" variant="outline" size="sm">
                Edit cart
              </ButtonLink>
            </div>
            <ul className="mt-4 divide-y text-sm">
              {items.map((i) => (
                <li key={i.productId} className="flex justify-between gap-2 py-3">
                  <span className="text-gray-700">
                    {i.name} × {i.quantity}
                    {i.underWarranty ? (
                      <span className="ml-2 rounded bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700">Warranty</span>
                    ) : null}
                  </span>
                  <span className="font-medium">
                    {i.underWarranty ? (
                      <>
                        <span className="mr-1 text-gray-400 line-through">{formatCurrency(i.price * i.quantity)}</span>
                        {formatCurrency(0)}
                      </>
                    ) : (
                      formatCurrency(i.price * i.quantity)
                    )}
                  </span>
                </li>
              ))}
            </ul>
            {karachiSelected && (
              <div className="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                <p>
                  <span className="font-medium">Installation:</span> {installLabel}
                  {checkoutTotals.effectiveInstallationType === "WARRANTY" ? (
                    <>
                      {": "}
                      <span className="text-gray-400 line-through">{formatCurrency(pricing.installationFee)}</span>{" "}
                      {formatCurrency(0)}
                    </>
                  ) : (
                    <>: {formatCurrency(checkoutTotals.installationFee)}</>
                  )}
                </p>
                {replacementSerial && (
                  <p className="mt-1">
                    <span className="font-medium">Replacement serial:</span> {replacementSerial}
                  </p>
                )}
              </div>
            )}
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
                  <p className="text-sm text-gray-500">Pay via bank deposit before dispatch.</p>
                </div>
              </label>
            </div>
            {payment === "BANK_TRANSFER" && (
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
                <p className="font-semibold">{bank.bankName}</p>
                <p className="mt-1"><span className="font-medium">Account title:</span> {bank.accountTitle}</p>
                <p className="mt-1"><span className="font-medium">Account:</span> {bank.accountNumber}</p>
                {bank.iban ? <p className="mt-1"><span className="font-medium">IBAN:</span> {bank.iban}</p> : null}
                <p className="mt-2 text-amber-900/90">{bank.instructions}</p>
              </div>
            )}
          </div>
        </div>

        <div className="h-fit rounded-xl border bg-white p-6">
          <h2 className="text-lg font-bold text-gray-900">Your Order</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Products</dt>
              <dd>
                {productsSubtotal < listSubtotal ? (
                  <>
                    <span className="mr-1 text-gray-400 line-through">{formatCurrency(listSubtotal)}</span>
                    {formatCurrency(productsSubtotal)}
                  </>
                ) : (
                  formatCurrency(productsSubtotal)
                )}
              </dd>
            </div>
            {karachiSelected && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Installation</dt>
                <dd>
                  {checkoutTotals.effectiveInstallationType === "WARRANTY" ? (
                    <>
                      <span className="mr-1 text-gray-400 line-through">{formatCurrency(pricing.installationFee)}</span>
                      {formatCurrency(0)}
                    </>
                  ) : (
                    formatCurrency(checkoutTotals.installationFee)
                  )}
                </dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-gray-500">Delivery</dt>
              <dd>{!form.city ? "Select city" : checkoutTotals.shipping === 0 ? "Free" : formatCurrency(checkoutTotals.shipping)}</dd>
            </div>
            {appliedCoupon ? (
              <div className="flex justify-between text-green-700">
                <dt>Discount ({appliedCoupon.code})</dt>
                <dd>-{formatCurrency(appliedCoupon.discount)}</dd>
              </div>
            ) : null}
          </dl>

          <div className="mt-4 space-y-2 border-t pt-4">
            <label className="block text-sm font-medium text-gray-700">Coupon code</label>
            <div className="flex gap-2">
              <input value={couponInput} onChange={(e) => setCouponInput(e.target.value.toUpperCase())} className={inputClass} placeholder="WELCOME10" disabled={!!appliedCoupon} />
              {appliedCoupon ? (
                <Button type="button" variant="outline" onClick={clearCoupon}>Remove</Button>
              ) : (
                <Button type="button" variant="outline" onClick={applyCoupon} disabled={couponBusy}>{couponBusy ? "…" : "Apply"}</Button>
              )}
            </div>
            {couponError && <p className="text-xs text-red-600">{couponError}</p>}
          </div>

          <div className="mt-4 flex justify-between border-t pt-4">
            <span className="font-bold text-gray-900">Total</span>
            <span className="text-lg font-bold text-gray-900">{formatCurrency(payableTotal)}</span>
          </div>

          {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
          {!canSubmit && form.city && karachiSelected && installationType === "WARRANTY" && (
            <p className="mt-3 text-sm text-red-600">Enter the replacement unit serial number to continue.</p>
          )}

          <Button type="submit" size="lg" className="mt-6 w-full" disabled={submitting || !canSubmit}>
            {submitting ? "Placing Order..." : "Place Order"}
          </Button>
          <p className="mt-3 text-center text-xs text-gray-400">By placing this order you agree to our terms.</p>
        </div>
      </form>
    </div>
  );
}
