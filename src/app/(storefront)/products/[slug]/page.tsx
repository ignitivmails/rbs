import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Icon } from '@/components/Icon'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductGallery } from '@/components/product/ProductGallery'
import { ProductPurchase } from '@/components/product/ProductPurchase'
import { QuantityOffer } from '@/components/product/QuantityOffer'
import { Stars } from '@/components/product/Stars'
import { RichText } from '@/components/RichText'
import { BADGE_LABELS } from '@/lib/constants'
import { getProductBySlug, getProducts, getReviews, getSite } from '@/lib/data'
import type { Category, ImageData, Product } from '@/lib/types'
import { isObject, relId, toImage } from '@/lib/utils'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return {}
  const image = toImage(product.meta?.image ?? product.gallery?.[0], 'card')
  return {
    title: product.meta?.title || product.name,
    description: product.meta?.description || product.shortDescription || undefined,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: image ? { images: [image.src] } : undefined,
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const { t, draft } = await getSite()
  const images = (product.gallery ?? []).map((g) => toImage(g, 'hero')).filter((i): i is ImageData => Boolean(i))
  const category = (product.categories ?? []).find(isObject) as Category | undefined
  const reviews = await getReviews({ productId: product.id, limit: 20 })

  let related = (product.relatedProducts ?? [])
    .filter((p): p is Product => isObject(p))
    .filter((p) => draft || p._status !== 'draft')
  if (!related.length && category) {
    related = await getProducts({ categoryId: category.id, excludeId: product.id, limit: 4 })
  }

  const variants = (product.variants ?? []).filter((v) => typeof v.price === 'number')
  const details: Array<[string, string | null | undefined]> = [
    ['Ingredients', product.ingredients],
    ['Shelf life', product.shelfLife],
    ['Storage', product.storage],
    ['Allergens', product.allergens],
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription ?? undefined,
    image: images.map((i) => i.src),
    sku: variants[0]?.sku ?? undefined,
    aggregateRating: product.reviewCount ? { '@type': 'AggregateRating', ratingValue: product.rating, reviewCount: product.reviewCount } : undefined,
    offers: variants.map((v) => ({
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: v.price,
      availability: (v.stock ?? 1) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    })),
  }

  return (
    <div className="container-x py-6 md:py-10">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          {category ? (
            <>
              <li>
                <Link href={`/collections/${category.slug}`} className="hover:text-primary">
                  {category.name}
                </Link>
              </li>
              <li aria-hidden>/</li>
            </>
          ) : null}
          <li className="text-ink" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <ProductGallery images={images} name={product.name} />

        <div className="flex flex-col gap-5">
          {(product.badges ?? []).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {(product.badges ?? []).map((b) => (
                <span key={b} className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-ink">
                  {BADGE_LABELS[b] ?? b}
                </span>
              ))}
            </div>
          )}
          <h1 className="text-3xl md:text-4xl">{product.name}</h1>
          {(product.rating ?? 0) > 0 && (
            <a href="#reviews" className="w-fit">
              <Stars rating={product.rating ?? 0} count={product.reviewCount} size={16} />
            </a>
          )}
          {product.shortDescription && <p className="text-base leading-relaxed text-muted">{product.shortDescription}</p>}

          <ProductPurchase
            product={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              image: toImage(product.gallery?.[0], 'thumbnail')?.src ?? null,
              zoneIds: (product.deliveryZones ?? []).map((z) => String(relId(z))),
              categoryIds: (product.categories ?? []).map((c) => String(relId(c))),
            }}
            variants={variants}
          />

          <QuantityOffer productId={String(product.id)} categoryIds={(product.categories ?? []).map((c) => String(relId(c)))} />

          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
            {product.isVeg !== false && (
              <li className="flex items-center gap-1.5">
                <span className="flex size-4 items-center justify-center border border-success">
                  <span className="size-2 rounded-full bg-success" />
                </span>
                {t('vegLabel')}
              </li>
            )}
            {product.shelfLife && (
              <li className="flex items-center gap-1.5">
                <Icon name="clock" size={16} /> {product.shelfLife}
              </li>
            )}
            {product.shipsPanIndia === false && (
              <li className="flex items-center gap-1.5">
                <Icon name="pin" size={16} /> {BADGE_LABELS['pune-exclusive']}
              </li>
            )}
          </ul>

          <div className="divide-y divide-line border-y border-line">
            {Boolean(product.description) && (
              <details open className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
                  Description <span className="text-primary transition-transform group-open:rotate-45">+</span>
                </summary>
                <RichText data={product.description} className="mt-3 text-sm text-muted" />
              </details>
            )}
            {details
              .filter(([, v]) => v)
              .map(([label, value]) => (
                <details key={label} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
                    {label} <span className="text-primary transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 whitespace-pre-line text-sm text-muted">{value}</p>
                </details>
              ))}
          </div>
        </div>
      </div>

      <section id="reviews" className="mt-16 scroll-mt-28">
        <h2 className="mb-6 text-2xl md:text-3xl">
          {t('reviews')} {product.reviewCount ? <span className="text-muted">({product.reviewCount})</span> : null}
        </h2>
        {reviews.length ? (
          <div className="grid gap-5 md:grid-cols-2">
            {reviews.map((r) => (
              <figure key={r.id} className="card card-border p-5">
                <Stars rating={r.rating} />
                <blockquote className="mt-3 leading-relaxed">“{r.text}”</blockquote>
                <figcaption className="mt-3 text-sm">
                  <span className="font-semibold">{r.author}</span>
                  {r.designation && <span className="text-muted"> · {r.designation}</span>}
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <p className="text-muted">{t('noReviews')}</p>
        )}
      </section>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl md:text-3xl">{t('relatedProducts')}</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:gap-6">
            {related.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
    </div>
  )
}
