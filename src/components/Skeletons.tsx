/** Loading placeholders shown while pages render (Next.js loading.tsx files). */

export function PageLoader() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4" role="status" aria-live="polite">
      <div className="rbs-loader flex items-end gap-2" aria-hidden>
        <span />
        <span />
        <span />
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  )
}

const Bar = ({ className = '' }: { className?: string }) => <div className={`skeleton rounded-theme ${className}`} />

export function ProductGridSkeleton({ count = 8, withHeader = true }: { count?: number; withHeader?: boolean }) {
  return (
    <div className="container-x py-8 md:py-12" role="status" aria-label="Loading products">
      {withHeader && (
        <>
          <Bar className="mb-6 h-10 w-64" />
          <div className="mb-6 flex gap-2">
            {Array.from({ length: 5 }, (_, i) => (
              <Bar key={i} className="h-8 w-24 rounded-full" />
            ))}
          </div>
        </>
      )}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="card card-border overflow-hidden">
            <div className="skeleton aspect-square" />
            <div className="space-y-2 p-3 md:p-4">
              <Bar className="h-4 w-3/4" />
              <Bar className="h-4 w-1/3" />
              <Bar className="mt-3 h-8 w-28" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ProductPageSkeleton() {
  return (
    <div className="container-x py-6 md:py-10" role="status" aria-label="Loading product">
      <Bar className="mb-6 h-4 w-60" />
      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <div className="skeleton aspect-square rounded-theme" />
        <div className="space-y-4">
          <Bar className="h-6 w-28 rounded-full" />
          <Bar className="h-10 w-4/5" />
          <Bar className="h-4 w-32" />
          <Bar className="h-16 w-full" />
          <Bar className="h-9 w-40" />
          <div className="flex gap-2">
            <Bar className="h-10 w-28" />
            <Bar className="h-10 w-28" />
          </div>
          <div className="flex gap-3">
            <Bar className="h-12 w-32" />
            <Bar className="h-12 flex-1" />
          </div>
          <Bar className="h-24 w-full" />
        </div>
      </div>
    </div>
  )
}
