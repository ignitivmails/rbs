'use client'

import Link from 'next/link'

import { useStore } from '@/components/StoreProvider'
import { formatPrice } from '@/lib/utils'

import { CartLines } from './CartLines'
import { useCartBulkDiscounts } from './discounts'
import { cartSavings, cartSubtotal, useCart, useHydrated } from './store'

export function CartView() {
  const { t, currency } = useStore()
  const items = useCart((s) => s.items)
  const hydrated = useHydrated()
  const bulk = useCartBulkDiscounts(items)

  if (!hydrated) return <div className="h-64 animate-pulse rounded-theme bg-ink/5" />

  if (!items.length) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-lg">{t('cartEmpty')}</p>
        <Link href="/shop" className="btn btn-primary">
          {t('continueShopping')}
        </Link>
      </div>
    )
  }

  const subtotal = cartSubtotal(items) - bulk.total
  const savings = cartSavings(items) + bulk.total

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="card card-border px-5">
        <CartLines items={items} discounts={bulk.perLine} />
      </div>
      <aside className="card card-border h-fit space-y-3 p-5">
        {bulk.total > 0 && (
          <p className="flex justify-between text-sm text-success">
            <span>{t('quantityDiscount')}</span>
            <span>− {formatPrice(bulk.total, currency)}</span>
          </p>
        )}
        <div className="flex justify-between text-lg font-semibold">
          <span>{t('subtotal')}</span>
          <span>{formatPrice(subtotal, currency)}</span>
        </div>
        {savings > 0 && (
          <p className="flex justify-between text-sm text-success">
            <span>{t('youSave')}</span>
            <span>{formatPrice(savings, currency)}</span>
          </p>
        )}
        <p className="text-xs text-muted">{t('taxNote')}</p>
        <Link href="/checkout" className="btn btn-primary w-full py-3.5">
          {t('checkout')}
        </Link>
        <Link href="/shop" className="block text-center text-sm font-medium text-primary hover:underline">
          {t('continueShopping')}
        </Link>
      </aside>
    </div>
  )
}
