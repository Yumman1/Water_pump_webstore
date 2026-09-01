"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

/** One-click featured toggle for homepage product list. */
export function FeaturedToggle({
  featured,
  action,
}: {
  featured: boolean;
  action: () => Promise<void>;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isFeatured, setIsFeatured] = useState(featured);
  const router = useRouter();

  function onToggle() {
    setError(null);
    const next = !isFeatured;
    setIsFeatured(next);
    start(async () => {
      try {
        await action();
        router.refresh();
      } catch (e) {
        setIsFeatured(!next);
        setError((e as Error).message);
      }
    });
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        role="switch"
        aria-checked={isFeatured}
        disabled={pending}
        onClick={onToggle}
        title={isFeatured ? "Remove from homepage featured" : "Add to homepage featured"}
        className={cn(
          "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors disabled:opacity-50",
          isFeatured ? "bg-accent" : "bg-gray-300"
        )}
      >
        <span
          className={cn(
            "inline-block h-5 w-5 rounded-full bg-white shadow transition-transform",
            isFeatured ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
      <span className={cn("text-[11px] font-medium", isFeatured ? "text-accent-700" : "text-gray-500")}>
        {pending ? "Saving…" : isFeatured ? "Featured" : "Not featured"}
      </span>
      {error && <span className="max-w-[140px] text-[10px] text-red-500">{error}</span>}
    </div>
  );
}
