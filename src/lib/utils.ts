import type { ID, ImageData, LinkData, MediaDoc, ResolvedLink, Variant } from './types'

export const cn = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ')

export const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null

export const relId = (v: unknown): ID | null => (isObject(v) ? ((v.id as ID) ?? null) : ((v as ID) ?? null))

export function asMedia(v: unknown): MediaDoc | null {
  return isObject(v) && ('url' in v || 'filename' in v) ? (v as unknown as MediaDoc) : null
}

export function toImage(v: unknown, size?: 'thumbnail' | 'card' | 'hero'): ImageData | null {
  const m = asMedia(v)
  if (!m) return null
  const s = size ? m.sizes?.[size] : undefined
  const useSize = Boolean(s?.url)
  const src = useSize ? s!.url! : m.url
  if (!src) return null
  return {
    src,
    width: (useSize ? s!.width : m.width) ?? undefined,
    height: (useSize ? s!.height : m.height) ?? undefined,
    alt: m.alt ?? '',
    objectPosition: m.focalX != null && m.focalY != null ? `${m.focalX}% ${m.focalY}%` : undefined,
    svg: m.mimeType === 'image/svg+xml',
  }
}

export function formatPrice(n: number, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n)
}

export const formatNumber = (n: number) => new Intl.NumberFormat('en-IN').format(n)

export const discountPercent = (price: number, mrp?: number | null) =>
  mrp && mrp > price ? Math.round((1 - price / mrp) * 100) : 0

/** Price summary for cards: cheapest variant, whether to show "From", best discount. */
export function priceInfo(variants: Variant[] | null | undefined) {
  const list = (variants ?? []).filter((v) => typeof v.price === 'number')
  if (!list.length) return { price: 0, mrp: null as number | null, from: false, discount: 0 }
  const cheapest = list.reduce((a, b) => (b.price < a.price ? b : a))
  const from = new Set(list.map((v) => v.price)).size > 1
  return {
    price: cheapest.price,
    mrp: cheapest.mrp ?? null,
    from,
    discount: discountPercent(cheapest.price, cheapest.mrp),
  }
}

export const pagePath = (slug?: string | null) => (!slug || slug === 'home' ? '/' : `/${slug}`)

export function resolveLink(link?: LinkData | null): ResolvedLink | null {
  if (!link) return null
  let href: string | null = null
  if (link.type === 'reference' && link.reference) {
    const { relationTo, value } = link.reference
    const slug = isObject(value) ? (value.slug as string | undefined) : undefined
    if (slug) {
      href = relationTo === 'products' ? `/products/${slug}` : relationTo === 'categories' ? `/collections/${slug}` : pagePath(slug)
    }
  } else if (link.url) {
    href = link.url
  }
  if (!href) return null
  return { href, label: link.label ?? '', newTab: Boolean(link.newTab) }
}

export const isExternal = (href: string) => /^(https?:)?\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:')

export function isScheduledActive(item: { showFrom?: string | null; showUntil?: string | null }, now = Date.now()) {
  if (item.showFrom && now < new Date(item.showFrom).getTime()) return false
  if (item.showUntil && now > new Date(item.showUntil).getTime()) return false
  return true
}

export const whatsappHref = (number: string, message?: string | null) =>
  `https://wa.me/${number.replace(/\D/g, '')}${message ? `?text=${encodeURIComponent(message)}` : ''}`
