'use client'

import { useMemo } from 'react'

import { useStore } from '@/components/StoreProvider'
import { computeQuantityDiscounts } from '@/lib/quantity-discounts'

import type { CartItem } from './store'

/** Live tiered-discount estimate for the cart (the server recomputes it at checkout). */
export function useCartBulkDiscounts(items: CartItem[]) {
  const { qtyRules } = useStore()
  return useMemo(
    () =>
      computeQuantityDiscounts(
        qtyRules,
        items
          .filter((i) => !i.box)
          .map((i) => ({ key: i.key, productId: String(i.productId), categoryIds: i.categoryIds ?? [], unitPrice: i.price, qty: i.qty })),
      ),
    [qtyRules, items],
  )
}
