'use client'

import Image from 'next/image'
import Link from 'next/link'

import { Icon } from '@/components/Icon'
import { useStore } from '@/components/StoreProvider'
import { formatPrice } from '@/lib/utils'

import type { LineDiscount } from '@/lib/quantity-discounts'

import { useCart, type CartItem } from './store'

export function CartLines({
  items,
  onNavigate,
  discounts = {},
}: {
  items: CartItem[]
  onNavigate?: () => void
  discounts?: Record<string, LineDiscount>
}) {
  const { t, currency } = useStore()
  const setQty = useCart((s) => s.setQty)
  const remove = useCart((s) => s.remove)

  return (
    <ul className="divide-y divide-line">
      {items.map((item) => (
        <li key={item.key} className="flex gap-3 py-4">
          <Link href={item.href ?? `/products/${item.slug}`} onClick={onNavigate} className="relative size-20 shrink-0 overflow-hidden rounded-theme bg-ink/5">
            {item.image && <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />}
          </Link>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="flex items-start justify-between gap-2">
              <Link href={item.href ?? `/products/${item.slug}`} onClick={onNavigate} className="font-medium leading-snug hover:text-primary">
                {item.name}
              </Link>
              <button type="button" onClick={() => remove(item.key)} className="p-1 text-muted hover:text-danger" aria-label={`${t('remove')} ${item.name}`}>
                <Icon name="trash" size={16} />
              </button>
            </div>
            <p className="text-xs text-muted">{item.variantLabel}</p>
            {discounts[item.key]?.amount ? (
              <p className="text-xs font-medium text-success">{t('qtyApplied', { off: discounts[item.key].label })}</p>
            ) : null}
            {discounts[item.key]?.next ? (
              <p className="text-xs text-accent">{t('qtyNextHint', { count: discounts[item.key].next!.count, off: discounts[item.key].next!.label })}</p>
            ) : null}
            <div className="mt-auto flex items-center justify-between gap-2">
              <div className="flex items-center rounded-theme border border-line">
                <button type="button" className="p-1.5" onClick={() => setQty(item.key, item.qty - 1)} aria-label="Decrease quantity">
                  <Icon name="minus" size={14} />
                </button>
                <span className="w-7 text-center text-sm">{item.qty}</span>
                <button type="button" className="p-1.5" onClick={() => setQty(item.key, item.qty + 1)} aria-label="Increase quantity">
                  <Icon name="plus" size={14} />
                </button>
              </div>
              <div className="text-right text-sm">
                <span className="font-semibold">{formatPrice(item.price * item.qty, currency)}</span>
                {item.mrp && item.mrp > item.price ? (
                  <s className="ml-1.5 text-xs text-muted">{formatPrice(item.mrp * item.qty, currency)}</s>
                ) : null}
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
