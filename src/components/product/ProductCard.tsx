import Link from 'next/link'

import type { CartItemInput } from '@/components/cart/store'
import { Img } from '@/components/Img'
import { BADGE_LABELS } from '@/lib/constants'
import { getQuantityRules, getSite } from '@/lib/data'
import { rulesForProduct } from '@/lib/quantity-discounts'
import type { Product } from '@/lib/types'
import { cn, priceInfo, relId, toImage } from '@/lib/utils'

import { AddToCartButton } from './AddToCartButton'
import { Price } from './Price'
import { Stars } from './Stars'

const RATIO: Record<string, string> = {
  square: 'aspect-square',
  portrait: 'aspect-[4/5]',
  landscape: 'aspect-[4/3]',
}

const CARD: Record<string, string> = {
  border: 'card-border',
  shadow: 'card-shadow',
  flat: '',
}

export function toCartItem(product: Product): CartItemInput | null {
  const variant = (product.variants ?? []).find((v) => (v.stock ?? 1) > 0)
  if (!variant?.id) return null
  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    variantId: variant.id,
    variantLabel: variant.label,
    price: variant.price,
    mrp: variant.mrp ?? null,
    image: toImage(product.gallery?.[0], 'thumbnail')?.src ?? null,
    zoneIds: (product.deliveryZones ?? []).map((z) => String(relId(z))),
    categoryIds: (product.categories ?? []).map((c) => String(relId(c))),
  }
}

/** Product tile. Every visual option comes from the Theme global → Product cards. */
export async function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const [{ theme, t, settings }, rules] = await Promise.all([getSite(), getQuantityRules()])
  const info = priceInfo(product.variants)
  const bulkOffer = rulesForProduct(rules, String(product.id), (product.categories ?? []).map((c) => String(relId(c)))).length > 0
  const href = `/products/${product.slug}`
  const badge = product.badges?.find((b) => b !== 'bestseller') ?? product.badges?.[0]
  const currency = settings.currency || 'INR'

  return (
    <article className={cn('card group flex h-full flex-col overflow-hidden', CARD[theme.cardStyle] ?? '')}>
      <Link href={href} className={cn('relative block overflow-hidden bg-ink/5', RATIO[theme.imageRatio] ?? RATIO.square)}>
        <Img
          image={toImage(product.gallery?.[0], 'card')}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="transition-transform duration-500 group-hover:scale-105"
        />
        {theme.showDiscountBadge && info.discount > 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-fg">
            {t('off', { percent: info.discount })}
          </span>
        )}
        {badge && (
          <span className="absolute right-2 top-2 rounded-full bg-surface/90 px-2 py-0.5 text-[11px] font-medium text-ink">
            {BADGE_LABELS[badge] ?? badge}
          </span>
        )}
        {bulkOffer && (
          <span className="absolute bottom-2 left-2 rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-white">
            {t('bulkOfferBadge')}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 p-3 md:p-4">
        {theme.showRating && (product.rating ?? 0) > 0 && <Stars rating={product.rating ?? 0} count={product.reviewCount} />}
        <h3 className="text-base leading-snug md:text-lg">
          <Link href={href} className="hover:text-primary">
            {product.name}
          </Link>
        </h3>
        <Price
          price={info.price}
          mrp={info.mrp}
          from={info.from}
          discount={info.discount}
          fromLabel={t('fromPrice')}
          currency={currency}
        />
        {(theme.showQuickAdd || theme.showViewDetails) && (
          <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 pt-3">
            {theme.showQuickAdd && <AddToCartButton item={toCartItem(product)} />}
            {theme.showViewDetails && (
              <Link href={href} className="text-sm font-medium text-primary underline-offset-4 hover:underline">
                {t('viewDetails')}
              </Link>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
