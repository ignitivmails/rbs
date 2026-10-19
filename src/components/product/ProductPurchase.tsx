'use client'

import { useState } from 'react'

import { useCart } from '@/components/cart/store'
import { Icon } from '@/components/Icon'
import { useStore } from '@/components/StoreProvider'
import { computeQuantityDiscounts } from '@/lib/quantity-discounts'
import type { ID, Variant } from '@/lib/types'
import { cn, discountPercent, formatPrice } from '@/lib/utils'

import { PincodeChecker } from './PincodeChecker'
import { Price } from './Price'

type Props = {
  product: { id: ID; slug: string; name: string; image: string | null; zoneIds: string[]; categoryIds: string[] }
  variants: Variant[]
}

export function ProductPurchase({ product, variants }: Props) {
  const { t, currency, qtyRules } = useStore()
  const add = useCart((s) => s.add)
  const open = useCart((s) => s.open)
  const firstAvailable = variants.find((v) => (v.stock ?? 1) > 0) ?? variants[0]
  const [variantId, setVariantId] = useState(firstAvailable?.id ?? '')
  const [qty, setQty] = useState(1)

  const variant = variants.find((v) => v.id === variantId) ?? firstAvailable
  if (!variant) return null
  const discount = discountPercent(variant.price, variant.mrp)
  const outOfStock = (variant.stock ?? 1) <= 0
  // Live "buy more, save more" estimate for the chosen quantity of this product.
  const bulk = computeQuantityDiscounts(qtyRules, [
    { key: 'this', productId: String(product.id), categoryIds: product.categoryIds, unitPrice: variant.price, qty },
  ]).perLine.this

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Price
          size="lg"
          price={variant.price}
          mrp={variant.mrp}
          discount={discount}
          offLabel={t('off', { percent: discount })}
          currency={currency}
        />
        <p className="mt-1 text-xs text-muted">{t('taxNote')}</p>
      </div>

      {variants.length > 1 && (
        <fieldset>
          <legend className="mb-2 text-sm font-semibold">{t('selectVariant')}</legend>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => {
              const disabled = (v.stock ?? 1) <= 0
              const selected = v.id === variant.id
              return (
                <button
                  key={v.id ?? v.label}
                  type="button"
                  disabled={disabled}
                  aria-pressed={selected}
                  onClick={() => v.id && setVariantId(v.id)}
                  className={cn(
                    'rounded-theme border px-4 py-2 text-sm transition-colors',
                    selected ? 'border-primary bg-primary/5 font-semibold text-primary' : 'border-line bg-surface hover:border-ink/40',
                    disabled && 'cursor-not-allowed line-through opacity-50',
                  )}
                >
                  {v.label}
                </button>
              )
            })}
          </div>
        </fieldset>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center rounded-theme border border-line bg-surface" role="group" aria-label={t('quantity')}>
          <button type="button" className="p-3 disabled:opacity-40" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Decrease quantity">
            <Icon name="minus" size={16} />
          </button>
          <span className="w-8 text-center text-sm font-semibold" aria-live="polite">
            {qty}
          </span>
          <button type="button" className="p-3" onClick={() => setQty((q) => Math.min(50, q + 1))} aria-label="Increase quantity">
            <Icon name="plus" size={16} />
          </button>
        </div>
        <button
          type="button"
          disabled={outOfStock || !variant.id}
          className="btn btn-primary flex-1 py-3.5"
          onClick={() => {
            if (!variant.id) return
            add(
              {
                productId: product.id,
                slug: product.slug,
                name: product.name,
                variantId: variant.id,
                variantLabel: variant.label,
                price: variant.price,
                mrp: variant.mrp ?? null,
                image: product.image,
                zoneIds: product.zoneIds,
                categoryIds: product.categoryIds,
              },
              qty,
            )
            open()
          }}
        >
          <Icon name="bag" size={18} />
          {outOfStock ? t('outOfStock') : t('addToCart')}
        </button>
      </div>

      {bulk && (bulk.amount > 0 || bulk.next) && (
        <div className="-mt-2 space-y-0.5 text-sm" aria-live="polite">
          {bulk.amount > 0 && (
            <p className="font-medium text-success">
              {t('qtyApplied', { off: bulk.label })} · {t('youSave')} {formatPrice(bulk.amount, currency)}
            </p>
          )}
          {bulk.next && <p className="text-accent">{t('qtyNextHint', { count: bulk.next.count, off: bulk.next.label })}</p>}
        </div>
      )}

      <PincodeChecker productId={product.id} />
    </div>
  )
}
