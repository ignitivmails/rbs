import { cn } from '@/lib/utils'

export function Stars({ rating, count, className, size = 14 }: { rating: number; count?: number | null; className?: string; size?: number }) {
  const rounded = Math.round(rating * 2) / 2
  return (
    <div className={cn('flex items-center gap-1 text-sm', className)} aria-label={`Rated ${rating} out of 5`}>
      <div className="flex text-accent" aria-hidden>
        {[1, 2, 3, 4, 5].map((i) => (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24">
            <defs>
              <linearGradient id={`half-${i}`}>
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="currentColor" stopOpacity="0.25" />
              </linearGradient>
            </defs>
            <path
              d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8L12 2.5z"
              fill={rounded >= i ? 'currentColor' : rounded >= i - 0.5 ? `url(#half-${i})` : 'currentColor'}
              fillOpacity={rounded >= i - 0.5 ? 1 : 0.25}
            />
          </svg>
        ))}
      </div>
      <span className="font-medium text-ink">{rating.toFixed(1)}</span>
      {count ? <span className="text-muted">({count})</span> : null}
    </div>
  )
}
