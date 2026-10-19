import Link from 'next/link'

import { SortSelect } from '@/components/ui'
import { getSite, SORT_OPTIONS, type SortKey } from '@/lib/data'
import type { Product } from '@/lib/types'
import { cn } from '@/lib/utils'

import { ProductGrid } from './ProductGrid'

export type Chip = { label: string; href: string; active: boolean }

/** Filter chips + sort + product grid, shared by /shop, /collections/[slug] and /search. */
export async function Listing({
  products,
  chips = [],
  sort,
  query = {},
}: {
  products: Product[]
  chips?: Chip[]
  sort: SortKey
  query?: Record<string, string>
}) {
  const { t } = await getSite()
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {chips.length > 0 ? (
          <nav aria-label="Filters" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
            {chips.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                aria-current={c.active ? 'page' : undefined}
                className={cn(
                  'shrink-0 rounded-full border px-4 py-1.5 text-sm transition-colors',
                  c.active ? 'border-primary bg-primary text-primary-fg' : 'border-line bg-surface hover:border-primary hover:text-primary',
                )}
              >
                {c.label}
              </Link>
            ))}
          </nav>
        ) : (
          <span />
        )}
        <div className="flex items-center justify-between gap-4 md:justify-end">
          <span className="text-sm text-muted">{products.length} products</span>
          <SortSelect options={SORT_OPTIONS} value={sort} label={t('sortBy')} query={query} />
        </div>
      </div>
      {products.length ? <ProductGrid products={products} /> : <p className="py-16 text-center text-muted">{t('noResults')}</p>}
    </div>
  )
}

export const withQuery = (base: string, params: Record<string, string | undefined>) => {
  const qs = new URLSearchParams(Object.entries(params).filter((e): e is [string, string] => Boolean(e[1]))).toString()
  return qs ? `${base}?${qs}` : base
}
