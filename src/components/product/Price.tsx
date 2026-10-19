import { cn, formatPrice } from '@/lib/utils'

type Props = {
  price: number
  mrp?: number | null
  from?: boolean
  discount?: number
  fromLabel?: string
  offLabel?: string
  currency?: string
  size?: 'md' | 'lg'
}

/** Selling price, struck-through MRP and % off. Pure — safe in server and client components. */
export function Price({ price, mrp, from, discount = 0, fromLabel = 'From', offLabel, currency = 'INR', size = 'md' }: Props) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <span className={cn('font-semibold text-ink', size === 'lg' ? 'text-2xl md:text-3xl' : 'text-base')}>
        {from && <span className="mr-1 text-sm font-normal text-muted">{fromLabel}</span>}
        {formatPrice(price, currency)}
      </span>
      {mrp && mrp > price ? <s className={cn('text-muted', size === 'lg' ? 'text-base' : 'text-sm')}>{formatPrice(mrp, currency)}</s> : null}
      {discount > 0 && offLabel ? <span className={cn('font-semibold text-success', size === 'lg' ? 'text-base' : 'text-sm')}>{offLabel}</span> : null}
    </div>
  )
}
