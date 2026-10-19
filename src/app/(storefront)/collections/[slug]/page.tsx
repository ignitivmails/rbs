import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { Img } from '@/components/Img'
import { Listing, withQuery, type Chip } from '@/components/product/Listing'
import { getCategories, getCategoryBySlug, getProducts, getSite, isSortKey } from '@/lib/data'
import { relId, toImage } from '@/lib/utils'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ sort?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) return {}
  return {
    title: category.meta?.title || category.name,
    description: category.meta?.description || category.description || undefined,
    alternates: { canonical: `/collections/${category.slug}` },
  }
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const [{ slug }, sp] = await Promise.all([params, searchParams])
  const category = await getCategoryBySlug(slug)
  if (!category) notFound()

  const { t } = await getSite()
  const sort = isSortKey(sp.sort) ? sp.sort : 'featured'
  const [products, categories] = await Promise.all([getProducts({ categoryId: category.id, sort }), getCategories()])

  const children = categories.filter((c) => String(relId(c.parent)) === String(category.id))
  const siblings = children.length ? children : categories.filter((c) => !c.parent)
  const chips: Chip[] = [
    { label: t('allProducts'), href: withQuery('/shop', { sort: sp.sort }), active: false },
    ...siblings.map((c) => ({ label: c.name, href: withQuery(`/collections/${c.slug}`, { sort: sp.sort }), active: c.id === category.id })),
  ]
  const banner = toImage(category.image, 'hero')

  return (
    <>
      <section className={banner ? 'relative overflow-hidden text-white' : 'bg-secondary'}>
        {banner && (
          <>
            <Img image={banner} fill priority />
            <div className="absolute inset-0 bg-gradient-to-r from-black/65 to-black/10" />
          </>
        )}
        <div className="container-x relative py-12 md:py-20">
          <h1 className="text-4xl md:text-5xl">{category.name}</h1>
          {category.description && <p className="mt-3 max-w-xl text-base opacity-90 md:text-lg">{category.description}</p>}
        </div>
      </section>
      <div className="container-x py-8 md:py-12">
        <Listing products={products} chips={chips} sort={sort} query={sp.sort ? { sort: sp.sort } : {}} />
      </div>
      <RenderBlocks blocks={category.layout} />
    </>
  )
}
