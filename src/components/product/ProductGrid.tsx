import type { Product } from '@/lib/types'
import { cn } from '@/lib/utils'

import { ProductCard } from './ProductCard'

const LG_COLS: Record<number, string> = {
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-6',
}

export function ProductGrid({ products, columns = 4, className }: { products: Product[]; columns?: number; className?: string }) {
  return (
    <div className={cn('grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-6', LG_COLS[columns] ?? LG_COLS[4], className)}>
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < 2} />
      ))}
    </div>
  )
}
