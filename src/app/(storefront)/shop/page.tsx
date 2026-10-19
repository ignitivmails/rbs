import type { Metadata } from 'next'

import { Listing, withQuery, type Chip } from '@/components/product/Listing'
import { getCategories, getProducts, getSite, isSortKey } from '@/lib/data'

export const metadata: Metadata = { title: 'Shop all sweets' }

type Props = { searchParams: Promise<{ sort?: string; zone?: string; category?: string }> }

const ZONES: Record<string, { label: string; shipsPanIndia: boolean; title: string }> = {
  local: { label: 'Pune exclusives', shipsPanIndia: false, title: 'Fresh in Pune' },
  'pan-india': { label: 'Ships pan-India', shipsPanIndia: true, title: 'Ships across India' },
}

export default async function ShopPage({ searchParams }: Props) {
  const sp = await searchParams
  const { t } = await getSite()
  const sort = isSortKey(sp.sort) ? sp.sort : 'featured'
  const zone = sp.zone && ZONES[sp.zone] ? sp.zone : undefined
  const categories = await getCategories()
  const category = categories.find((c) => c.slug === sp.category)

  const products = await getProducts({
    sort,
    categoryId: category?.id,
    shipsPanIndia: zone ? ZONES[zone].shipsPanIndia : undefined,
  })

  const chips: Chip[] = [
    { label: t('allProducts'), href: withQuery('/shop', { sort: sp.sort }), active: !zone && !category },
    ...Object.entries(ZONES).map(([key, z]) => ({ label: z.label, href: withQuery('/shop', { zone: key, sort: sp.sort }), active: zone === key })),
    ...categories.filter((c) => !c.parent).map((c) => ({ label: c.name, href: withQuery('/shop', { category: c.slug, sort: sp.sort }), active: category?.id === c.id })),
  ]

  const query: Record<string, string> = {}
  if (zone) query.zone = zone
  if (category) query.category = category.slug

  return (
    <div className="container-x py-8 md:py-12">
      <h1 className="mb-6 text-4xl md:text-5xl">{category?.name ?? (zone ? ZONES[zone].title : t('allProducts'))}</h1>
      <Listing products={products} chips={chips} sort={sort} query={query} />
    </div>
  )
}
