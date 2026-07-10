import Link from "next/link";
import { cn } from "@/lib/utils";

export function Pagination({
  page,
  totalPages,
  baseParams,
}: {
  page: number;
  totalPages: number;
  baseParams: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  const makeHref = (p: number) => {
    const params = new URLSearchParams();
    Object.entries(baseParams).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    params.set("page", String(p));
    return `?${params.toString()}`;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="mt-8 flex items-center justify-center gap-1">
      {page > 1 && (
        <Link href={makeHref(page - 1)} className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50">
          Prev
        </Link>
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
      {page < totalPages && (
        <Link href={makeHref(page + 1)} className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50">
          Next
        </Link>
      )}
    </nav>
  );
}
