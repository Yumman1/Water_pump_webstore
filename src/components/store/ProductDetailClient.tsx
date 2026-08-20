"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import { AddToCartButton } from "./AddToCartButton";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export function ProductDetailClient({ product }: { product: Product }) {
  // Prefer real photos; skip placeholder when a product video is the cover.
  const images = product.images.length
    ? product.images
    : product.video
      ? []
      : ["https://picsum.photos/seed/placeholder/800/800"];
  // Gallery items: video first when present, then still images.
  const media: { type: "video" | "image"; src: string }[] = [
    ...(product.video ? [{ type: "video" as const, src: product.video }] : []),
    ...images.map((src) => ({ type: "image" as const, src })),
  ];
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const current = media[active] ?? media[0];
  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0;
  const lowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Gallery */}
      <div>
        <div className="relative aspect-square overflow-hidden rounded-xl border bg-gray-100">
          {current?.type === "video" ? (
            <video
              key={current.src}
              src={current.src}
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              controls
              preload="metadata"
              aria-label={product.name}
            />
          ) : (
            <Image
              src={current?.src ?? images[0]}
              alt={product.name}
              fill
              priority
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover"
            />
          )}
          {discount > 0 && (
            <span className="absolute left-3 top-3 rounded-md bg-accent px-2 py-1 text-sm font-bold text-white">-{discount}%</span>
          )}
        </div>
        {media.length > 1 && (
          <div className="mt-3 flex gap-2">
            {media.map((item, i) => (
              <button
                key={`${item.type}-${item.src}-${i}`}
                onClick={() => setActive(i)}
                className={cn(
                  "relative h-20 w-20 overflow-hidden rounded-lg border-2",
                  i === active ? "border-brand-600" : "border-transparent"
                )}
              >
                {item.type === "video" ? (
                  <video src={item.src} className="h-full w-full object-cover" muted playsInline preload="metadata" />
                ) : (
                  <Image src={item.src} alt="" fill sizes="80px" className="object-cover" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        {product.brand && <p className="text-sm font-medium uppercase tracking-wide text-brand-600">{product.brand}</p>}
        <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">{product.name}</h1>
        <p className="mt-1 text-sm text-gray-500">SKU: {product.sku}</p>

        {discount > 0 && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
            <span className="rounded bg-red-600 px-2 py-0.5 text-xs font-extrabold uppercase text-white">Sale!</span>
            Save {formatCurrency(product.compareAtPrice! - product.price)} ({discount}% off) — limited time
          </div>
        )}

        <div className="mt-4 flex items-baseline gap-3">
          <span className={cn("text-3xl font-bold", discount > 0 ? "text-red-600" : "text-gray-900")}>{formatCurrency(product.price)}</span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-lg text-gray-400 line-through">{formatCurrency(product.compareAtPrice)}</span>
          )}
        </div>

        <div className="mt-2">
          {product.stock <= 0 ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-600">Out of stock</span>
          ) : lowStock ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-600">
              <Icons.warning className="h-4 w-4" /> Only {product.stock} left in stock
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
              <Icons.check className="h-4 w-4" /> In stock
            </span>
          )}
        </div>

        {product.shortDescription && <p className="mt-4 text-gray-600">{product.shortDescription}</p>}

        {/* Quantity + actions */}
        {product.stock > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex h-10 items-center rounded-lg border">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-10 w-10 items-center justify-center text-gray-600 hover:bg-gray-50" aria-label="Decrease">
                <Icons.minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm font-medium">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="flex h-10 w-10 items-center justify-center text-gray-600 hover:bg-gray-50" aria-label="Increase">
                <Icons.plus className="h-4 w-4" />
              </button>
            </div>
            <AddToCartButton product={product} quantity={qty} size="lg" showBuyNow />
          </div>
        )}

        {/* Highlights */}
        <ul className="mt-6 grid gap-2 text-sm text-gray-600">
          <li className="flex items-center gap-2"><Icons.truck className="h-4 w-4 text-brand-600" /> Nationwide delivery available</li>
          <li className="flex items-center gap-2"><Icons.shield className="h-4 w-4 text-brand-600" /> Genuine product with warranty</li>
          <li className="flex items-center gap-2"><Icons.lock className="h-4 w-4 text-brand-600" /> Cash on delivery accepted</li>
        </ul>
      </div>
    </div>
  );
}
