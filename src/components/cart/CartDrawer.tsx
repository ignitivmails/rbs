'use client'

import Link from 'next/link'
import { useEffect } from 'react'

import { Icon } from '@/components/Icon'
import { useStore } from '@/components/StoreProvider'
import { formatPrice } from '@/lib/utils'

import { CartLines } from './CartLines'
import { useCartBulkDiscounts } from './discounts'
import { cartSavings, cartSubtotal, useCart, useHydrated } from './store'

export function CartDrawer() {
  const { t, currency } = useStore()
  const items = useCart((s) => s.items)
  const isOpen = useCart((s) => s.isOpen)
  const close = useCart((s) => s.close)
  const hydrated = useHydrated()
  const bulk = useCartBulkDiscounts(items)

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, close])

  if (!hydrated || !isOpen) return null

  const subtotal = cartSubtotal(items) - bulk.total
  const savings = cartSavings(items) + bulk.total

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label={t('cartTitle')}>
      <button type="button" aria-label="Close cart" className="absolute inset-0 bg-black/40" onClick={close} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-surface shadow-2xl">
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-xl">{t('cartTitle')}</h2>
          <button type="button" onClick={close} className="p-1" aria-label="Close cart">
            <Icon name="x" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <Icon name="bag" size={48} className="text-muted" />
            <p className="text-lg">{t('cartEmpty')}</p>
            <Link href="/shop" onClick={close} className="btn btn-primary">
              {t('continueShopping')}
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5">
              <CartLines items={items} onNavigate={close} discounts={bulk.perLine} />
            </div>
            <footer className="space-y-3 border-t border-line px-5 py-4">
              {bulk.total > 0 && (
                <p className="flex justify-between text-sm text-success">
                  <span>{t('quantityDiscount')}</span>
                  <span>− {formatPrice(bulk.total, currency)}</span>
                </p>
              )}
              <div className="flex justify-between text-base font-semibold">
                <span>{t('subtotal')}</span>
                <span>{formatPrice(subtotal, currency)}</span>
              </div>
              {savings > 0 && (
                <p className="flex justify-between text-sm text-success">
                  <span>{t('youSave')}</span>
                  <span>{formatPrice(savings, currency)}</span>
                </p>
              )}
              <Link href="/checkout" onClick={close} className="btn btn-primary w-full py-3.5">
                {t('checkout')}
              </Link>
              <Link href="/cart" onClick={close} className="block text-center text-sm font-medium text-primary hover:underline">
                {t('viewCart')}
              </Link>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}
