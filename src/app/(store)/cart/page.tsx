"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { formatCurrency } from "@/lib/format";
import { ButtonLink } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { isPlaceholderImage } from "@/lib/utils";

export default function CartPage() {
  const {
    items,
    setQuantity,
    removeItem,
    clear,
    setUnderWarranty,
    listSubtotal,
    productsSubtotal,
    pricing,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="container py-16 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <Icons.cart className="h-10 w-10" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Your cart is empty</h1>
        <p className="mt-1 text-gray-500">Add some products to get started.</p>
        <ButtonLink href="/shop" className="mt-6" size="lg">
          Continue Shopping
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="divide-y rounded-xl border bg-white">
            {items.map((item) => {
              const list = item.price * item.quantity;
              const charged = item.underWarranty ? 0 : list;
              const thumbImage = item.image && !isPlaceholderImage(item.image) ? item.image : "";
              return (
                <div key={item.productId} className="flex gap-4 p-4">
                  <Link href={`/product/${item.slug}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {item.video ? (
                      <video
                        src={item.video}
                        className="h-full w-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        aria-label={item.name}
                      />
                    ) : thumbImage ? (
                      <Image src={thumbImage} alt={item.name} fill sizes="96px" className="object-cover" />
                    ) : null}
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <Link href={`/product/${item.slug}`} className="font-medium text-gray-900 hover:text-brand-700">
                      {item.name}
                    </Link>
                    <p className="text-xs text-gray-400">SKU: {item.sku}</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {item.underWarranty ? (
                        <>
                          <span className="mr-2 text-gray-400 line-through">{formatCurrency(item.price)}</span>
                          <span className="text-green-700">{formatCurrency(0)}</span>
                        </>
                      ) : (
                        formatCurrency(item.price)
                      )}
                    </p>
                    <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={!!item.underWarranty}
                        onChange={(e) => setUnderWarranty(item.productId, e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                      />
                      Buy under warranty (replacement)
                    </label>
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
                  <div className="text-right text-sm font-semibold text-gray-900">
                    {item.underWarranty ? (
                      <>
                        <span className="mr-1 block text-gray-400 line-through">{formatCurrency(list)}</span>
                        {formatCurrency(charged)}
                      </>
                    ) : (
                      formatCurrency(charged)
                    )}
                  </div>
                </div>
              );
            })}
            <div className="flex justify-between p-4">
              <button onClick={clear} className="text-sm text-gray-500 hover:text-red-600">
                Clear cart
              </button>
              <Link href="/shop" className="text-sm font-medium text-brand-600 hover:text-brand-700">
                Continue shopping →
              </Link>
            </div>
          </div>

          <div className="rounded-xl border bg-brand-50/60 p-5 text-sm text-brand-900">
            <p className="font-medium">Delivery and installation</p>
            <p className="mt-1 text-brand-800/90">
              Select your city at checkout. Installation and removal is available in {pricing.serviceCity} only.
              Outside {pricing.serviceCity}, choose standard delivery or a warranty claim (product cost waived, delivery
              fee applies).
            </p>
          </div>
        </div>

        <div className="h-fit rounded-xl border bg-white p-6">
          <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Products</dt>
              <dd className="font-medium">
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
            <div className="flex justify-between">
              <dt className="text-gray-500">Delivery & installation</dt>
              <dd className="text-gray-500">At checkout</dd>
            </div>
          </dl>
          <div className="mt-4 flex justify-between border-t pt-4">
            <span className="font-bold text-gray-900">Subtotal</span>
            <span className="text-lg font-bold text-gray-900">{formatCurrency(productsSubtotal)}</span>
          </div>
          <ButtonLink href="/checkout" size="lg" className="mt-6 w-full">
            Proceed to Checkout
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
