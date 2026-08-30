export function ProductGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="overflow-hidden rounded-xl border bg-white">
          <div className="aspect-square animate-pulse bg-gray-200" />
          <div className="space-y-2 p-4">
            <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
            <div className="mt-3 h-6 w-24 animate-pulse rounded bg-gray-200" />
            <div className="mt-3 h-9 w-full animate-pulse rounded bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductListingSkeleton() {
  return (
    <div className="container py-8">
      <div className="mb-6">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="mt-2 h-4 w-96 max-w-full animate-pulse rounded bg-gray-100" />
      </div>
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="hidden space-y-2 lg:block">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="h-9 animate-pulse rounded-md bg-gray-100" />
          ))}
        </aside>
        <div>
          <div className="mb-4 flex justify-between">
            <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
            <div className="h-10 w-36 animate-pulse rounded-lg bg-gray-100" />
          </div>
          <ProductGridSkeleton />
        </div>
      </div>
    </div>
  );
}
