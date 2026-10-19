import { unstable_cache } from 'next/cache'
import { cookies, draftMode } from 'next/headers'
import type { Where } from 'payload'
import { cache } from 'react'

import { CMS_TAG } from './constants'
import { normalizeRules, type QtyRule } from './quantity-discounts'
import { getPayloadClient } from './payload'
import { interpolate, mergeStrings, STRING_GLOBALS, type StringKey } from './strings'
import { mergeTheme } from './theme'
import type {
  AnnouncementData,
  Category,
  DeliveryZone,
  FooterData,
  GiftBox,
  HeaderData,
  ID,
  Page,
  Post,
  Product,
  Review,
  SettingsData,
  Store,
} from './types'

export type Locale = 'en' | 'bn'

/**
 * Published content is cached under one tag (revalidated by Payload hooks on every change).
 * Draft mode (live preview) always reads fresh data.
 */
function cached<T>(key: Array<string | number | boolean | null | undefined>, fn: () => Promise<T>, bypass: boolean): Promise<T> {
  if (bypass) return fn()
  return unstable_cache(fn, key.map(String), { tags: [CMS_TAG], revalidate: 300 })()
}

/** Everything the layout needs: globals, theme, UI text, locale, draft flag. Deduped per request. */
export const getSite = cache(async () => {
  const { isEnabled: draft } = await draftMode()
  const jar = await cookies()
  const requested: Locale = jar.get('locale')?.value === 'bn' ? 'bn' : 'en'
  const payload = await getPayloadClient()

  const settings = (await cached(
    ['site-settings', requested],
    () => payload.findGlobal({ slug: 'site-settings', locale: requested, depth: 1 }),
    draft,
  )) as unknown as SettingsData
  const locale: Locale = settings?.enableBengali && requested === 'bn' ? 'bn' : 'en'

  const load = (slug: 'theme' | 'header' | 'announcement-bar' | 'footer', depth: number) =>
    cached([slug, locale], () => payload.findGlobal({ slug, locale, depth, draft }), draft)

  const [theme, header, announcement, footer, ...stringDocs] = await Promise.all([
    load('theme', 0),
    load('header', 2),
    load('announcement-bar', 1),
    load('footer', 1),
    ...STRING_GLOBALS.map(({ slug }) => cached([slug, locale], () => payload.findGlobal({ slug, locale, depth: 0 }), draft)),
  ])

  const mergedStrings = mergeStrings(Object.assign({}, ...(stringDocs as unknown as Record<string, unknown>[])))
  const t = (key: StringKey, vars?: Record<string, string | number>) => interpolate(mergedStrings[key], vars)

  return {
    draft,
    locale,
    settings: settings ?? {},
    theme: mergeTheme(theme as unknown as Record<string, unknown>),
    header: (header ?? {}) as unknown as HeaderData,
    announcement: (announcement ?? {}) as unknown as AnnouncementData,
    footer: (footer ?? {}) as unknown as FooterData,
    strings: mergedStrings,
    t,
  }
})

const publishedOnly = (draft: boolean): Where[] => (draft ? [] : [{ _status: { equals: 'published' } }])

/* ---------------- Pages ---------------- */

export async function getPage(slug: string): Promise<Page | null> {
  const { draft, locale } = await getSite()
  const payload = await getPayloadClient()
  return cached(
    ['page', slug, locale],
    async () => {
      const res = await payload.find({
        collection: 'pages',
        where: { and: [{ slug: { equals: slug } }, ...publishedOnly(draft)] },
        draft,
        depth: 2,
        limit: 1,
        locale,
      })
      return (res.docs[0] as unknown as Page) ?? null
    },
    draft,
  )
}

/* ---------------- Products ---------------- */

export type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'discount' | 'rating'

export const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'newest', label: 'Newest' },
  { value: 'discount', label: 'Biggest discount' },
  { value: 'rating', label: 'Top rated' },
]

const SORT_FIELDS: Record<SortKey, string> = {
  featured: 'sortOrder',
  'price-asc': 'priceFrom',
  'price-desc': '-priceFrom',
  newest: '-createdAt',
  discount: '-maxDiscount',
  rating: '-rating',
}

export const isSortKey = (v: unknown): v is SortKey => typeof v === 'string' && v in SORT_FIELDS

export type ProductQuery = {
  ids?: ID[]
  categoryId?: ID
  tag?: string
  badge?: string
  featured?: boolean
  search?: string
  shipsPanIndia?: boolean
  excludeId?: ID
  sort?: SortKey
  limit?: number
}

export async function getProducts(q: ProductQuery = {}): Promise<Product[]> {
  if (q.ids && q.ids.length === 0) return []
  const { draft, locale } = await getSite()
  const payload = await getPayloadClient()

  const and: Where[] = [...publishedOnly(draft)]
  if (q.ids) and.push({ id: { in: q.ids } })
  if (q.categoryId != null) and.push({ categories: { in: [q.categoryId] } })
  if (q.tag) and.push({ tags: { in: [q.tag] } })
  if (q.badge) and.push({ badges: { in: [q.badge] } })
  if (q.featured) and.push({ featured: { equals: true } })
  if (typeof q.shipsPanIndia === 'boolean') and.push({ shipsPanIndia: { equals: q.shipsPanIndia } })
  if (q.excludeId != null) and.push({ id: { not_equals: q.excludeId } })
  if (q.search) and.push({ or: [{ name: { like: q.search } }, { shortDescription: { like: q.search } }] })

  return cached(
    ['products', JSON.stringify(q), locale],
    async () => {
      const res = await payload.find({
        collection: 'products',
        where: and.length ? { and } : {},
        sort: SORT_FIELDS[q.sort ?? 'featured'],
        limit: q.limit ?? 48,
        depth: 1,
        draft,
        locale,
      })
      const docs = res.docs as unknown as Product[]
      if (q.ids) {
        const order = new Map(q.ids.map((id, i) => [String(id), i]))
        docs.sort((a, b) => (order.get(String(a.id)) ?? 0) - (order.get(String(b.id)) ?? 0))
      }
      return docs
    },
    draft,
  )
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { draft, locale } = await getSite()
  const payload = await getPayloadClient()
  return cached(
    ['product', slug, locale],
    async () => {
      const res = await payload.find({
        collection: 'products',
        where: { and: [{ slug: { equals: slug } }, ...publishedOnly(draft)] },
        depth: 2,
        limit: 1,
        draft,
        locale,
      })
      return (res.docs[0] as unknown as Product) ?? null
    },
    draft,
  )
}

/* ---------------- Categories ---------------- */

export async function getCategories(): Promise<Category[]> {
  const { draft, locale } = await getSite()
  const payload = await getPayloadClient()
  return cached(
    ['categories', locale],
    async () => {
      const res = await payload.find({ collection: 'categories', sort: 'sortOrder', limit: 100, depth: 1, locale })
      return res.docs as unknown as Category[]
    },
    draft,
  )
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { draft, locale } = await getSite()
  const payload = await getPayloadClient()
  return cached(
    ['category', slug, locale],
    async () => {
      const res = await payload.find({ collection: 'categories', where: { slug: { equals: slug } }, depth: 2, limit: 1, locale })
      return (res.docs[0] as unknown as Category) ?? null
    },
    draft,
  )
}

/* ---------------- Reviews ---------------- */

export async function getReviews(q: { productId?: ID; featured?: boolean; ids?: ID[]; limit?: number } = {}): Promise<Review[]> {
  const { draft, locale } = await getSite()
  const payload = await getPayloadClient()
  const and: Where[] = [{ approved: { equals: true } }]
  if (q.productId != null) and.push({ product: { equals: q.productId } })
  if (q.featured) and.push({ featured: { equals: true } })
  if (q.ids) and.push({ id: { in: q.ids } })
  return cached(
    ['reviews', JSON.stringify(q), locale],
    async () => {
      const res = await payload.find({ collection: 'reviews', where: { and }, sort: '-createdAt', limit: q.limit ?? 12, depth: 2, locale })
      return res.docs as unknown as Review[]
    },
    draft,
  )
}

/* ---------------- Quantity discounts ---------------- */

/** Active quantity-discount rules in compact form (safe to send to the browser). */
export const getQuantityRules = cache(async (): Promise<QtyRule[]> => {
  const payload = await getPayloadClient()
  const docs = await cached(
    ['quantity-discounts'],
    async () => (await payload.find({ collection: 'quantity-discounts', where: { active: { equals: true } }, limit: 100, depth: 0 })).docs,
    false,
  )
  // Schedule is evaluated per request so start/end times apply without a cache flush.
  return normalizeRules(docs as never)
})

/* ---------------- Build-a-box ---------------- */

export async function getGiftBoxes(): Promise<GiftBox[]> {
  const { draft, locale } = await getSite()
  const payload = await getPayloadClient()
  return cached(
    ['gift-boxes', locale],
    async () =>
      (await payload.find({ collection: 'gift-boxes', where: draft ? {} : { active: { equals: true } }, sort: 'sortOrder', limit: 50, depth: 1, locale }))
        .docs as unknown as GiftBox[],
    draft,
  )
}

export async function getGiftBoxBySlug(slug: string): Promise<GiftBox | null> {
  const boxes = await getGiftBoxes()
  return boxes.find((b) => b.slug === slug) ?? null
}

/* ---------------- Stores ---------------- */

export async function getStores(ids?: ID[]): Promise<Store[]> {
  const { locale } = await getSite()
  const payload = await getPayloadClient()
  const and: Where[] = [{ active: { equals: true } }]
  if (ids) and.push({ id: { in: ids } })
  return cached(
    ['stores', JSON.stringify(ids ?? null), locale],
    async () => (await payload.find({ collection: 'stores', where: { and }, sort: 'sortOrder', limit: 50, depth: 1, locale })).docs as unknown as Store[],
    false,
  )
}

/* ---------------- Posts ---------------- */

export async function getPosts(q: { section?: 'blog' | 'library'; limit?: number } = {}): Promise<Post[]> {
  const { draft, locale } = await getSite()
  const payload = await getPayloadClient()
  const and: Where[] = [...publishedOnly(draft)]
  if (q.section) and.push({ section: { equals: q.section } })
  return cached(
    ['posts', JSON.stringify(q), locale],
    async () =>
      (await payload.find({ collection: 'posts', where: and.length ? { and } : {}, sort: '-publishedAt', limit: q.limit ?? 24, depth: 1, draft, locale }))
        .docs as unknown as Post[],
    draft,
  )
}

export async function getPostBySlug(section: 'blog' | 'library', slug: string): Promise<Post | null> {
  const { draft, locale } = await getSite()
  const payload = await getPayloadClient()
  return cached(
    ['post', section, slug, locale],
    async () => {
      const res = await payload.find({
        collection: 'posts',
        where: { and: [{ slug: { equals: slug } }, { section: { equals: section } }, ...publishedOnly(draft)] },
        depth: 2,
        limit: 1,
        draft,
        locale,
      })
      return (res.docs[0] as unknown as Post) ?? null
    },
    draft,
  )
}

/* ---------------- Delivery zones ---------------- */

export async function getDeliveryZones(): Promise<DeliveryZone[]> {
  const payload = await getPayloadClient()
  return cached(
    ['delivery-zones'],
    async () => {
      const res = await payload.find({ collection: 'delivery-zones', limit: 100, depth: 0 })
      return res.docs as unknown as DeliveryZone[]
    },
    false,
  )
}
