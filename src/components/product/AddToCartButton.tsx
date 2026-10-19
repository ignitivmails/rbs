'use client'

import { useState } from 'react'

import { useCart, type CartItemInput } from '@/components/cart/store'
import { useStore } from '@/components/StoreProvider'
import { cn } from '@/lib/utils'

type Props = {
  item: CartItemInput | null
  qty?: number
  className?: string
  size?: 'sm' | 'md'
  openCart?: boolean
}

export function AddToCartButton({ item, qty = 1, className, size = 'sm', openCart = true }: Props) {
  const { t } = useStore()
  const add = useCart((s) => s.add)
  const open = useCart((s) => s.open)
  const [added, setAdded] = useState(false)

  if (!item) {
    return (
      <button type="button" disabled className={cn('btn btn-outline', size === 'sm' && 'btn-sm', className)}>
        {t('outOfStock')}
      </button>
    )
  }

  return (
    <button
      type="button"
      className={cn('btn btn-primary', size === 'sm' && 'btn-sm', className)}
      onClick={() => {
        add(item, qty)
        setAdded(true)
        setTimeout(() => setAdded(false), 1500)
        if (openCart) open()
      }}
    >
      {added ? t('added') : t('addToCart')}
    </button>
  )
}
