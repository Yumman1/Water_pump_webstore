"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { trackTikTokAddToCart } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { productCoverMedia, realImages } from "@/lib/utils";
import type { Product } from "@/lib/types";

export function AddToCartButton({
  product,
  quantity = 1,
  size = "md",
  showBuyNow = false,
  className,
}: {
  product: Product;
  quantity?: number;
  size?: "sm" | "md" | "lg";
  showBuyNow?: boolean;
  className?: string;
}) {
  const { addItem } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const outOfStock = product.stock <= 0;

  function add() {
    const cover = productCoverMedia(product);
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      sku: product.sku,
      price: product.price,
      // Still photo when available; video products keep cover video separately.
      image: realImages(product.images)[0] ?? (cover?.type === "image" ? cover.src : ""),
      video: product.video ?? null,
      quantity,
      stock: product.stock,
    });
    trackTikTokAddToCart({
      content_id: product.slug,
      content_type: "product",
      content_name: product.name,
      quantity,
      price: product.price,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  if (outOfStock) {
    return (
      <Button variant="outline" size={size} disabled className={className}>
        Out of Stock
      </Button>
    );
  }

  return (
    <div className={showBuyNow ? "flex flex-col gap-2 sm:flex-row" : ""}>
      <Button variant="primary" size={size} onClick={add} className={className}>
        {added ? <Icons.check className="h-4 w-4" /> : <Icons.cart className="h-4 w-4" />}
        {added ? "Added!" : "Add to Cart"}
      </Button>
      {showBuyNow && (
        <Button
          variant="accent"
          size={size}
          onClick={() => {
            add();
            router.push("/checkout");
          }}
        >
          Buy Now
        </Button>
      )}
    </div>
  );
}
