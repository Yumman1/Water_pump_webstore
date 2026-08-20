"use client";

import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";

/** One-click show/hide toggle for the admin products table. */
export function VisibilityToggle({
  active,
  action,
}: {
  active: boolean;
  action: () => Promise<void>;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(active);

  function onToggle() {
    setError(null);
    const next = !isActive;
    setIsActive(next);
    start(async () => {
      try {
        await action();
      } catch (e) {
        setIsActive(!next);
        setError((e as Error).message);
      }
    });
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        role="switch"
        aria-checked={isActive}
        disabled={pending}
        onClick={onToggle}
        title={isActive ? "Hide from storefront" : "Show on storefront"}
        className={cn(
          "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors disabled:opacity-50",
          isActive ? "bg-green-600" : "bg-gray-300"
        )}
      >
        <span
          className={cn(
            "inline-block h-5 w-5 rounded-full bg-white shadow transition-transform",
            isActive ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
      <span className={cn("text-[11px] font-medium", isActive ? "text-green-700" : "text-gray-500")}>
        {pending ? "Saving…" : isActive ? "Visible" : "Hidden"}
      </span>
      {error && <span className="max-w-[140px] text-[10px] text-red-500">{error}</span>}
    </div>
  );
}
