"use client";

import { useState, useTransition } from "react";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/** A button that runs a bound server action after a confirmation prompt. */
export function ConfirmButton({
  action,
  confirmText = "Are you sure? This cannot be undone.",
  label,
  className,
  iconOnly = false,
}: {
  action: () => Promise<void>;
  confirmText?: string;
  label?: string;
  className?: string;
  iconOnly?: boolean;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onClick() {
    if (!confirm(confirmText)) return;
    setError(null);
    start(async () => {
      try {
        await action();
      } catch (e) {
        setError((e as Error).message);
      }
    });
  }

  return (
    <>
      <button
        onClick={onClick}
        disabled={pending}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50",
          iconOnly ? "h-9 w-9 justify-center" : "px-3 py-1.5",
          className
        )}
        title="Delete"
      >
        <Icons.trash className="h-4 w-4" />
        {!iconOnly && (label ?? "Delete")}
      </button>
      {error && <span className="ml-2 text-xs text-red-500">{error}</span>}
    </>
  );
}
