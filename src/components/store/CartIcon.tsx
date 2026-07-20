"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export function CartIcon({ light }: { light?: boolean }) {
  const { count } = useCart();
  return (
    <Link
      href="/cart"
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-lg",
        light ? "text-white hover:bg-white/10" : "text-gray-700 hover:bg-gray-100"
      )}
      aria-label="Cart"
    >
      <Icons.cart />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-accent px-1 text-xs font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
