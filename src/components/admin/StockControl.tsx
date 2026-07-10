"use client";

import { useState, useTransition } from "react";
import { setStock } from "@/app/admin/actions";
import { Icons } from "@/components/ui/icons";

export function StockControl({
  productId,
  stock,
  disabled,
}: {
  productId: string;
  stock: number;
  disabled?: boolean;
}) {
  const [value, setValue] = useState(stock);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const dirty = value !== stock;

  function save() {
    setError(null);
    start(async () => {
      try {
        await setStock(productId, value, "Manual stock update");
      } catch (e) {
        setError((e as Error).message);
        setValue(stock);
      }
    });
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <div className="flex h-9 items-center rounded-lg border">
        <button
          type="button"
          disabled={disabled || pending}
          onClick={() => setValue((v) => Math.max(0, v - 1))}
          className="flex h-9 w-8 items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40"
        >
          <Icons.minus className="h-3.5 w-3.5" />
        </button>
        <input
          type="number"
          value={value}
          disabled={disabled || pending}
          onChange={(e) => setValue(Math.max(0, parseInt(e.target.value || "0", 10)))}
          className="h-9 w-14 border-x text-center text-sm focus:outline-none disabled:bg-gray-50"
        />
        <button
          type="button"
          disabled={disabled || pending}
          onClick={() => setValue((v) => v + 1)}
          className="flex h-9 w-8 items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40"
        >
          <Icons.plus className="h-3.5 w-3.5" />
        </button>
      </div>
      <button
        type="button"
        onClick={save}
        disabled={disabled || pending || !dirty}
        className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700 disabled:opacity-40"
      >
        {pending ? "..." : "Save"}
      </button>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
