import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import { AddToCartButton } from "./AddToCartButton";
import { ProductCardMedia } from "./ProductCardMedia";
import { cn } from "@/lib/utils";
import { getBrandSlug } from "@/config/menu";

export function ProductCard({ product }: { product: Product }) {
  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0;
  const lowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;
  const brandSlug = product.brand ? getBrandSlug(product.brand) : null;

  return (
    <div className="card-hover group relative flex flex-col overflow-hidden rounded-xl border bg-white">
      <Link href={`/product/${product.slug}`} className="absolute inset-0 z-10">
        <span className="sr-only">{product.name}</span>
      </Link>

      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <ProductCardMedia productName={product.name} video={product.video} images={product.images} />
        <div className="absolute left-2 top-2 z-20 flex flex-col items-start gap-1">
          {discount > 0 && (
            <span className="rounded-md bg-red-600 px-2 py-0.5 text-xs font-extrabold uppercase tracking-wide text-white shadow-sm">
              Sale -{discount}%
            </span>
          )}
          {product.condition === "USED" && (
            <span className="rounded-md bg-amber-500 px-2 py-0.5 text-xs font-semibold text-white">Used</span>
          )}
          {product.featured && discount === 0 && (
            <span className="rounded-md bg-brand-600 px-2 py-0.5 text-xs font-semibold text-white">Featured</span>
          )}
        </div>
        {product.stock <= 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <span className="rounded-md bg-gray-900 px-3 py-1 text-sm font-semibold text-white">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        {product.brand &&
          (brandSlug ? (
            <Link
              href={`/brand/${brandSlug}`}
              className="relative z-20 text-xs font-medium uppercase tracking-wide text-brand-600 hover:text-brand-700"
            >
              {product.brand}
            </Link>
          ) : (
            <p className="text-xs font-medium uppercase tracking-wide text-brand-600">{product.brand}</p>
          ))}
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-brand-700">
          {product.name}
        </h3>
        {product.shortDescription && (
          <p className="mt-1 line-clamp-2 text-xs text-gray-500">{product.shortDescription}</p>
        )}

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900">{formatCurrency(product.price)}</span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-sm text-gray-400 line-through">{formatCurrency(product.compareAtPrice)}</span>
          )}
        </div>

        <p className={cn("mt-1 text-xs", lowStock ? "font-medium text-accent-700" : "text-gray-400")}>
          {product.stock <= 0 ? "" : lowStock ? `Only ${product.stock} left` : "In stock"}
        </p>

        <div className="relative z-20 mt-3 pt-1">
          <AddToCartButton product={product} size="sm" className="w-full" />
        </div>
      </div>
    </div>
  );
}
