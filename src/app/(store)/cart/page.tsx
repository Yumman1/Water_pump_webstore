"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { formatCurrency } from "@/lib/format";
import { siteConfig } from "@/config/site";
import { Button, ButtonLink } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

export default function CartPage() {
  const { items, setQuantity, removeItem, subtotal, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="container py-16 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <Icons.cart className="h-10 w-10" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Your cart is empty</h1>
        <p className="mt-1 text-gray-500">Add some products to get started.</p>
        <ButtonLink href="/shop" className="mt-6" size="lg">Continue Shopping</ButtonLink>
      </div>
    );
  }

  const shipping = subtotal >= siteConfig.shipping.freeShippingThreshold ? 0 : siteConfig.shipping.flatRate;
  const total = subtotal + shipping;

  return (
    <div className="container py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Items */}
        <div className="divide-y rounded-xl border bg-white">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 p-4">
              <Link href={`/product/${item.slug}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                {item.image && <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />}
              </Link>
              <div className="flex flex-1 flex-col">
                <Link href={`/product/${item.slug}`} className="font-medium text-gray-900 hover:text-brand-700">
                  {item.name}
                </Link>
                <p className="text-xs text-gray-400">SKU: {item.sku}</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">{formatCurrency(item.price)}</p>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex h-9 items-center rounded-lg border">
                    <button onClick={() => setQuantity(item.productId, item.quantity - 1)} className="flex h-9 w-9 items-center justify-center text-gray-600 hover:bg-gray-50" aria-label="Decrease">
                      <Icons.minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button onClick={() => setQuantity(item.productId, item.quantity + 1)} className="flex h-9 w-9 items-center justify-center text-gray-600 hover:bg-gray-50" aria-label="Increase">
                      <Icons.plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.productId)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600">
                    <Icons.trash className="h-4 w-4" /> Remove
                  </button>
                </div>
              </div>
              <div className="text-right font-semibold text-gray-900">{formatCurrency(item.price * item.quantity)}</div>
            </div>
          ))}
          <div className="flex justify-between p-4">
            <button onClick={clear} className="text-sm text-gray-500 hover:text-red-600">Clear cart</button>
            <Link href="/shop" className="text-sm font-medium text-brand-600 hover:text-brand-700">Continue shopping →</Link>
          </div>
        </div>

        {/* Summary */}
        <div className="h-fit rounded-xl border bg-white p-6">
          <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-gray-500">Subtotal</dt><dd className="font-medium">{formatCurrency(subtotal)}</dd></div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Shipping</dt>
              <dd className="font-medium">{shipping === 0 ? "Free" : formatCurrency(shipping)}</dd>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-gray-400">
                Add {formatCurrency(siteConfig.shipping.freeShippingThreshold - subtotal)} more for free shipping.
              </p>
            )}
          </dl>
          <div className="mt-4 flex justify-between border-t pt-4">
            <span className="font-bold text-gray-900">Total</span>
            <span className="text-lg font-bold text-gray-900">{formatCurrency(total)}</span>
          </div>
          <ButtonLink href="/checkout" size="lg" className="mt-6 w-full">Proceed to Checkout</ButtonLink>
        </div>
      </div>
    </div>
  );
}
