"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";

/** Inline tag editor for the admin products table. */
export function ProductTagsEditor({
  tags,
  action,
}: {
  tags: string[];
  action: (tagsRaw: string) => Promise<void>;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(tags.join(", "));
  const router = useRouter();

  useEffect(() => {
    if (!editing) setValue(tags.join(", "));
  }, [tags, editing]);

  function save() {
    setError(null);
    const trimmed = value.trim();
    start(async () => {
      try {
        await action(trimmed);
        setEditing(false);
        router.refresh();
      } catch (e) {
        setError((e as Error).message);
      }
    });
  }

  if (editing) {
    return (
      <div className="min-w-[180px] max-w-xs">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              save();
            }
            if (e.key === "Escape") {
              setValue(tags.join(", "));
              setEditing(false);
              setError(null);
            }
          }}
          placeholder="monoblock, pressure, 1hp"
          disabled={pending}
          autoFocus
          className="h-8 w-full rounded-md border border-gray-300 px-2 text-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
        <div className="mt-1 flex gap-1">
          <button
            type="button"
            onClick={save}
            disabled={pending}
            className="rounded bg-brand-600 px-2 py-0.5 text-[11px] font-medium text-white hover:bg-brand-700 disabled:opacity-50"
          >
            {pending ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => {
              setValue(tags.join(", "));
              setEditing(false);
              setError(null);
            }}
            disabled={pending}
            className="rounded px-2 py-0.5 text-[11px] text-gray-500 hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
        {error && <p className="mt-1 text-[10px] text-red-500">{error}</p>}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      title="Edit tags (comma-separated)"
      className="group min-w-[120px] max-w-xs text-left"
    >
      {tags.length > 0 ? (
        <span className="flex flex-wrap gap-1">
          {tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600 group-hover:bg-brand-50 group-hover:text-brand-700"
            >
              {tag}
            </span>
          ))}
          {tags.length > 4 && (
            <span className="text-[10px] text-gray-400">+{tags.length - 4}</span>
          )}
        </span>
      ) : (
        <span className="text-xs text-gray-400 group-hover:text-brand-600">Add tags…</span>
      )}
    </button>
  );
}
