export default function ProductLoading() {
  return (
    <article className="container py-8" aria-busy="true" aria-label="Loading product">
      <div className="mb-6 h-4 w-56 max-w-full animate-pulse rounded bg-gray-200" />
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="aspect-square animate-pulse rounded-xl bg-gray-200" />
          <div className="mt-3 flex gap-2">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-20 w-20 animate-pulse rounded-lg bg-gray-100" />
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
          <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-32 animate-pulse rounded bg-gray-100" />
          <div className="mt-4 h-9 w-36 animate-pulse rounded bg-gray-200" />
          <div className="h-6 w-24 animate-pulse rounded-full bg-gray-100" />
          <div className="mt-4 h-16 w-full animate-pulse rounded bg-gray-100" />
          <div className="mt-6 h-12 w-full max-w-sm animate-pulse rounded-lg bg-gray-200" />
        </div>
      </div>
    </article>
  );
}
