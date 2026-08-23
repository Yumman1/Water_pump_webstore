"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const inputClass =
  "h-10 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500";

type Props = {
  name: string;
  label: string;
  hint?: string;
  defaultValue?: string;
  folder?: string;
  /** textarea for multi-line URLs; input for single URL */
  multiline?: boolean;
};

export function ImageUploadField({
  name,
  label,
  hint,
  defaultValue = "",
  folder = "products",
  multiline = false,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onUpload(file: File) {
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      setValue((prev) => {
        if (multiline) {
          const lines = prev.split(/[\n,]/).map((s) => s.trim()).filter(Boolean);
          return [...lines, data.url].join("\n");
        }
        return data.url;
      });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      {multiline ? (
        <textarea
          name={name}
          rows={3}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          placeholder="/products/my-pump/cover.jpg"
        />
      ) : (
        <input
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={inputClass}
          placeholder="https://..."
        />
      )}
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onUpload(f);
          }}
        />
        <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => fileRef.current?.click()}>
          {busy ? "Uploading…" : "Upload image"}
        </Button>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
