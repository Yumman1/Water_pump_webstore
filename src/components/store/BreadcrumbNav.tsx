import Link from "next/link";

export type BreadcrumbItem = { name: string; path: string };

/** Visible breadcrumb navigation for nested store pages. */
export function BreadcrumbNav({
  items,
  className,
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={className ?? "mb-6 flex flex-wrap items-center gap-1 text-sm text-gray-500"}
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={item.path} className="inline-flex items-center gap-1">
            {i > 0 && <span>/</span>}
            {isLast ? (
              <span className="text-gray-700">{item.name}</span>
            ) : (
              <Link href={item.path} className="hover:text-brand-600">
                {item.name}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
