'use client'

import { useMemo, useState } from 'react'

import { useCart } from '@/components/cart/store'
import { Icon } from '@/components/Icon'
import { Img } from '@/components/Img'
import { useStore } from '@/components/StoreProvider'
import { boxKey } from '@/lib/box'
import type { ImageData } from '@/lib/types'
import { cn, formatPrice } from '@/lib/utils'

export type BoxBuilderData = {
  id: string
  slug: string
  name: string
  image: string | null
  zoneIds: string[]
  allowMessage: boolean
  sizes: Array<{ id: string; label: string; pieces: number; price: number; mrp: number | null }>
  items: Array<{ id: string; name: string; image: ImageData | null; extraPrice: number; maxPerBox: number | null; description: string }>
  packaging: Array<{ id: string; label: string; price: number; description: string }>
}

/** Choose a size → fill the slots → packaging & message → add to cart as one line. */
export function BoxBuilder({ box }: { box: BoxBuilderData }) {
  const { t, currency } = useStore()
  const add = useCart((s) => s.add)
  const open = useCart((s) => s.open)
  const [sizeId, setSizeId] = useState(box.sizes[0]?.id ?? '')
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [packagingId, setPackagingId] = useState(box.packaging[0]?.id ?? '')
  const [message, setMessage] = useState('')

  const size = box.sizes.find((s) => s.id === sizeId) ?? box.sizes[0]
  const filled = Object.values(counts).reduce((n, c) => n + c, 0)
  const capacity = size?.pieces ?? 0
  const full = filled === capacity && capacity > 0
  const packaging = box.packaging.find((p) => p.id === packagingId)
  const extras = box.items.reduce((n, i) => n + (counts[i.id] ?? 0) * i.extraPrice, 0)
  const price = (size?.price ?? 0) + extras + (packaging?.price ?? 0)
  const mrp = size?.mrp && size.mrp > size.price ? size.mrp + extras + (packaging?.price ?? 0) : null

  // Visual slots in fill order.
  const slots = useMemo(() => {
    const list: Array<{ id: string; name: string; image: ImageData | null }> = []
    for (const item of box.items) for (let i = 0; i < (counts[item.id] ?? 0); i++) list.push(item)
    return list
  }, [box.items, counts])

  const changeSize = (id: string) => {
    setSizeId(id)
    const next = box.sizes.find((s) => s.id === id)
    if (next && filled > next.pieces) setCounts({}) // contents no longer fit
  }

  const bump = (itemId: string, delta: 1 | -1) =>
    setCounts((c) => {
      const item = box.items.find((i) => i.id === itemId)
      const current = c[itemId] ?? 0
      if (delta > 0 && (filled >= capacity || (item?.maxPerBox && current >= item.maxPerBox))) return c
      const next = Math.max(0, current + delta)
      return { ...c, [itemId]: next }
    })

  const addToCart = () => {
    if (!size || !full) return
    const contents = Object.entries(counts)
      .filter(([, q]) => q > 0)
      .map(([itemId, qty]) => ({ itemId, qty }))
    const selection = { boxId: box.id, sizeId: size.id, contents, packagingId: packaging?.id ?? '', message: box.allowMessage ? message : '' }
    add(
      {
        key: boxKey(selection),
        productId: `box:${box.id}`,
        slug: box.slug,
        href: `/build-your-box/${box.slug}`,
        name: `${box.name} — ${size.label}`,
        variantId: size.id,
        variantLabel: contents.map((c) => `${c.qty}× ${box.items.find((i) => i.id === c.itemId)?.name ?? ''}`).join(', '),
        price,
        mrp,
        image: box.image,
        zoneIds: box.zoneIds,
        box: selection,
      },
      1,
    )
    open()
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="space-y-8">
        {/* 1. Size */}
        <section>
          <h2 className="mb-3 text-xl">1. {t('boxChooseSize')}</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {box.sizes.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={s.id === sizeId}
                onClick={() => changeSize(s.id)}
                className={cn('rounded-theme border p-4 text-left transition-colors', s.id === sizeId ? 'border-primary bg-primary/5' : 'border-line bg-surface hover:border-primary')}
              >
                <span className="block font-semibold">{s.label}</span>
                <span className="block text-sm text-muted">{t('boxPieces', { count: s.pieces })}</span>
                <span className="mt-1 block font-semibold text-primary">{formatPrice(s.price, currency)}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 2. Fill */}
        <section>
          <div className="mb-3 flex items-end justify-between gap-3">
            <h2 className="text-xl">2. {t('boxFill')}</h2>
            {filled > 0 && (
              <button type="button" className="text-sm text-muted underline" onClick={() => setCounts({})}>
                {t('boxClear')}
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {box.items.map((item) => {
              const count = counts[item.id] ?? 0
              const atMax = Boolean(item.maxPerBox && count >= item.maxPerBox)
              return (
                <div key={item.id} className={cn('card card-border overflow-hidden', count > 0 && 'ring-2 ring-primary')}>
                  <div className="relative aspect-square bg-ink/5">
                    <Img image={item.image} fill sizes="200px" />
                    {count > 0 && <span className="absolute right-2 top-2 rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-fg">×{count}</span>}
                  </div>
                  <div className="space-y-2 p-3">
                    <p className="text-sm font-medium leading-snug">{item.name}</p>
                    {item.extraPrice > 0 && <p className="text-xs text-muted">+{formatPrice(item.extraPrice, currency)} / piece</p>}
                    <div className="flex items-center justify-between rounded-theme border border-line">
                      <button type="button" className="p-2 disabled:opacity-30" disabled={count === 0} onClick={() => bump(item.id, -1)} aria-label={`Remove one ${item.name}`}>
                        <Icon name="minus" size={14} />
                      </button>
                      <span className="text-sm font-semibold">{count}</span>
                      <button type="button" className="p-2 disabled:opacity-30" disabled={filled >= capacity || atMax} onClick={() => bump(item.id, 1)} aria-label={`Add one ${item.name}`}>
                        <Icon name="plus" size={14} />
                      </button>
                    </div>
                    {atMax && <p className="text-[11px] text-muted">{t('boxMaxReached', { max: item.maxPerBox! })}</p>}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* 3. Packaging & message */}
        {(box.packaging.length > 0 || box.allowMessage) && (
          <section className="space-y-4">
            <h2 className="text-xl">3. {t('boxPackaging')}</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {box.packaging.map((p) => (
                <label key={p.id} className={cn('cursor-pointer rounded-theme border p-4 text-sm', p.id === packagingId ? 'border-primary bg-primary/5' : 'border-line bg-surface')}>
                  <input type="radio" name="packaging" className="sr-only" checked={p.id === packagingId} onChange={() => setPackagingId(p.id)} />
                  <span className="block font-semibold">{p.label}</span>
                  {p.description && <span className="block text-muted">{p.description}</span>}
                  <span className="mt-1 block font-medium">{p.price ? `+${formatPrice(p.price, currency)}` : t('free')}</span>
                </label>
              ))}
            </div>
            {box.allowMessage && (
              <label className="block text-sm">
                <span className="mb-1 block font-medium">{t('boxMessage')}</span>
                <textarea
                  rows={2}
                  maxLength={200}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-theme border border-line bg-surface px-3 py-2 outline-none focus:border-primary"
                />
              </label>
            )}
          </section>
        )}
      </div>

      {/* Summary */}
      <aside className="card card-border h-fit space-y-4 p-5 lg:sticky lg:top-28">
        <div>
          <p className="font-heading text-xl">{box.name}</p>
          <p className="text-sm text-muted">{size?.label}</p>
        </div>
        <div>
          <div className="mb-2 flex justify-between text-sm">
            <span>{t('boxFilled', { count: filled, total: capacity })}</span>
            <span className="text-muted">{Math.round((filled / Math.max(1, capacity)) * 100)}%</span>
          </div>
          <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${Math.min(capacity, 6)}, minmax(0, 1fr))` }}>
            {Array.from({ length: capacity }, (_, i) => {
              const slot = slots[i]
              return (
                <span key={i} className={cn('relative aspect-square overflow-hidden rounded-full border-2', slot ? 'border-primary' : 'border-dashed border-line')} title={slot?.name}>
                  {slot && <Img image={slot.image} fill sizes="48px" />}
                </span>
              )
            })}
          </div>
        </div>
        <div className="flex items-baseline gap-2 border-t border-line pt-4">
          <span className="text-2xl font-semibold">{formatPrice(price, currency)}</span>
          {mrp && <s className="text-sm text-muted">{formatPrice(mrp, currency)}</s>}
        </div>
        <button type="button" className="btn btn-primary w-full py-3.5" disabled={!full} onClick={addToCart}>
          <Icon name="bag" size={18} /> {t('boxAdd')}
        </button>
        {!full && <p className="text-center text-xs text-muted">{t('boxFillToContinue', { total: capacity })}</p>}
      </aside>
    </div>
  )
}
