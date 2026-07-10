"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
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
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      sku: product.sku,
      price: product.price,
      image: product.images[0] ?? "",
      quantity,
      stock: product.stock,
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
