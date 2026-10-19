import type { MetadataRoute } from 'next'

import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

const BASE = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
const PRIVATE_PAGES = new Set(['track-order'])

type Doc = { slug?: string | null; updatedAt?: string; section?: string | null }

/** /sitemap.xml — every published page, product, category, post and build-a-box. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()
  const published = { _status: { equals: 'published' } } as const
  const [pages, products, categories, posts, boxes] = await Promise.all([
    payload.find({ collection: 'pages', where: published, limit: 1000, depth: 0 }),
    payload.find({ collection: 'products', where: published, limit: 5000, depth: 0 }),
    payload.find({ collection: 'categories', limit: 500, depth: 0 }),
    payload.find({ collection: 'posts', where: published, limit: 2000, depth: 0 }),
    payload.find({ collection: 'gift-boxes', where: { active: { equals: true } }, limit: 100, depth: 0 }),
  ])
  const entry = (path: string, doc?: Doc, priority = 0.6): MetadataRoute.Sitemap[number] => ({
    url: `${BASE}${path}`,
    lastModified: doc?.updatedAt ? new Date(doc.updatedAt) : undefined,
    priority,
  })

  return [
    ...(pages.docs as Doc[]).filter((p) => p.slug && !PRIVATE_PAGES.has(p.slug)).map((p) => entry(p.slug === 'home' ? '/' : `/${p.slug}`, p, p.slug === 'home' ? 1 : 0.5)),
    entry('/shop', undefined, 0.8),
    entry('/build-your-box', undefined, 0.7),
    entry('/blog', undefined, 0.5),
    entry('/sweets-library', undefined, 0.5),
    ...(categories.docs as Doc[]).map((c) => entry(`/collections/${c.slug}`, c, 0.8)),
    ...(products.docs as Doc[]).map((p) => entry(`/products/${p.slug}`, p, 0.9)),
    ...(boxes.docs as Doc[]).map((b) => entry(`/build-your-box/${b.slug}`, b, 0.7)),
    ...(posts.docs as Doc[]).map((p) => entry(`${p.section === 'library' ? '/sweets-library' : '/blog'}/${p.slug}`, p, 0.4)),
  ]
}
