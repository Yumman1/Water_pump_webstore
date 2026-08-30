import Link from "next/link";
import { cn } from "@/lib/utils";

export function Pagination({
  page,
  totalPages,
  baseParams,
  browsePath,
}: {
  page: number;
  totalPages: number;
  baseParams: Record<string, string | undefined>;
  browsePath?: string;
}) {
  if (totalPages <= 1) return null;

  const makeHref = (p: number) => {
    const params = new URLSearchParams();
    Object.entries(baseParams).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    params.set("page", String(p));
    const qs = params.toString();
    const base = browsePath ?? "";
    return base ? `${base}?${qs}` : `?${qs}`;
  };

  // Windowed page numbers — avoid O(n) DOM nodes on large catalogs.
  const windowSize = 5;
  let start = Math.max(1, page - Math.floor(windowSize / 2));
  const end = Math.min(totalPages, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <nav className="mt-8 flex items-center justify-center gap-1">
      {page > 1 && (
        <Link href={makeHref(page - 1)} className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50">
          Prev
        </Link>
      )}
      {start > 1 && (
        <>
          <Link href={makeHref(1)} className="min-w-[2.25rem] rounded-md border px-3 py-1.5 text-center text-sm hover:bg-gray-50">
            1
          </Link>
          {start > 2 && <span className="px-1 text-gray-400">…</span>}
        </>
      )}
      {pages.map((p) => (
        <Link
          key={p}
          href={makeHref(p)}
          className={cn(
            "min-w-[2.25rem] rounded-md border px-3 py-1.5 text-center text-sm",
            p === page ? "border-brand-600 bg-brand-600 text-white" : "hover:bg-gray-50"
          )}
        >
          {p}
        </Link>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1 text-gray-400">…</span>}
          <Link
            href={makeHref(totalPages)}
            className="min-w-[2.25rem] rounded-md border px-3 py-1.5 text-center text-sm hover:bg-gray-50"
          >
            {totalPages}
          </Link>
        </>
      )}
      {page < totalPages && (
        <Link href={makeHref(page + 1)} className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50">
          Next
        </Link>
      )}
    </nav>
  );
}
