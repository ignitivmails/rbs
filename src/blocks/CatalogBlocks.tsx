import Link from 'next/link'

import { CMSLink } from '@/components/CMSLink'
import { Img } from '@/components/Img'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductGrid } from '@/components/product/ProductGrid'
import { Stars } from '@/components/product/Stars'
import { ScrollRow } from '@/components/ui'
import { getProducts, getReviews } from '@/lib/data'
import type { BlockData, Category, ImageData, LinkData, Product, Review } from '@/lib/types'
import { cn, isObject, relId, resolveLink, toImage } from '@/lib/utils'

import { SectionHeading } from './BlockWrapper'

/* ------------------------------------------------------------------ */
/* Category tiles                                                     */
/* ------------------------------------------------------------------ */

const CAT_LG_COLS: Record<number, string> = {
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-6',
  7: 'lg:grid-cols-7',
  8: 'lg:grid-cols-8',
  9: 'lg:grid-cols-9',
}

type Tile = { label: string; href: string | null; image: ImageData | null }

export function CategoryGridBlock({ block }: { block: BlockData }) {
  const tiles: Tile[] =
    block.source === 'categories'
      ? ((block.categories as unknown[]) ?? []).filter(isObject).map((c) => {
          const cat = c as unknown as Category
          return { label: cat.name, href: `/collections/${cat.slug}`, image: toImage(cat.icon ?? cat.image, 'thumbnail') }
        })
      : ((block.tiles as Array<{ label?: string; image?: unknown; link?: LinkData }>) ?? []).map((t) => ({
          label: t.label ?? '',
          href: resolveLink(t.link)?.href ?? null,
          image: toImage(t.image, 'thumbnail'),
        }))
  if (!tiles.length) return null

  const variant = (block.variant as string) ?? 'cards'
  const cols = Number(block.columns) || 6
  const circles = variant === 'circles'

  const tileEl = (t: Tile, i: number) => {
    const inner = (
      <>
        <span
          className={cn(
            'relative block aspect-square overflow-hidden bg-surface transition-transform duration-300 group-hover:-translate-y-1',
            circles ? 'rounded-full' : 'rounded-theme',
          )}
        >
          <Img image={t.image} fill sizes="(min-width: 1024px) 12vw, 30vw" />
        </span>
        <span className="mt-2 block text-center text-sm font-medium leading-tight group-hover:text-primary md:text-base">{t.label}</span>
      </>
    )
    return t.href ? (
      <Link key={t.label + i} href={t.href} className={cn('group block', variant === 'scroll' && 'w-28 shrink-0 snap-start md:w-36')}>
        {inner}
      </Link>
    ) : (
      <div key={t.label + i} className={cn('group block', variant === 'scroll' && 'w-28 shrink-0 snap-start md:w-36')}>
        {inner}
      </div>
    )
  }

  return (
    <>
      <SectionHeading heading={block.heading as string} subheading={block.subheading as string} />
      {variant === 'scroll' ? (
        <ScrollRow>{tiles.map(tileEl)}</ScrollRow>
      ) : (
        <div className={cn('grid grid-cols-3 gap-4 sm:grid-cols-4 md:gap-6', CAT_LG_COLS[cols] ?? CAT_LG_COLS[6])}>{tiles.map(tileEl)}</div>
      )}
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Product collection                                                 */
/* ------------------------------------------------------------------ */

async function productsFor(block: BlockData): Promise<Product[]> {
  const limit = Number(block.limit) || 8
  switch (block.source) {
    case 'manual': {
      const picked = ((block.products as unknown[]) ?? []).map(relId).filter((id): id is NonNullable<typeof id> => id !== null)
      return (await getProducts({ ids: picked })).slice(0, limit)
    }
    case 'category': {
      const id = relId(block.category)
      return id === null ? [] : getProducts({ categoryId: id, limit })
    }
    case 'tag':
      return block.tag ? getProducts({ tag: String(block.tag).trim(), limit }) : []
    case 'newest':
      return getProducts({ sort: 'newest', limit })
    case 'discount':
      return getProducts({ sort: 'discount', limit })
    case 'featured':
    default:
      return getProducts({ featured: true, limit })
  }
}

export async function ProductCollectionBlock({ block }: { block: BlockData }) {
  const products = await productsFor(block)
  if (!products.length) return null
  const viewAll = resolveLink(block.viewAll as LinkData)
  const action = viewAll ? <CMSLink resolved={viewAll} appearance="outline" className="btn-sm" /> : null

  return (
    <>
      <SectionHeading heading={block.heading as string} subheading={block.subheading as string} />
      {block.variant === 'carousel' ? (
        <ScrollRow>
          {products.map((p) => (
            <div key={p.id} className="w-[70%] shrink-0 snap-start sm:w-[45%] md:w-[31%] lg:w-[23.5%]">
              <ProductCard product={p} />
            </div>
          ))}
        </ScrollRow>
      ) : (
        <ProductGrid products={products} columns={Number(block.columns) || 4} />
      )}
      {action && <div className="mt-8 flex justify-center">{action}</div>}
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Testimonials                                                       */
/* ------------------------------------------------------------------ */

function reviewImage(r: Review): ImageData | null {
  const own = toImage(r.image, 'thumbnail')
  if (own) return own
  const product = isObject(r.product) ? (r.product as unknown as Product) : null
  return product ? toImage(product.gallery?.[0], 'thumbnail') : null
}

function ReviewCard({ review, large }: { review: Review; large?: boolean }) {
  const img = reviewImage(review)
  return (
    <figure className={cn('card card-border flex h-full flex-col gap-4 p-6 text-ink', large && 'md:p-10')}>
      <Stars rating={review.rating} />
      <blockquote className={cn('flex-1 leading-relaxed', large ? 'font-heading text-xl md:text-2xl' : 'text-base')}>
        “{review.text}”
      </blockquote>
      <figcaption className="flex items-center gap-3">
        {img && (
          <span className="relative size-12 shrink-0 overflow-hidden rounded-full bg-ink/5">
            <Img image={img} fill sizes="48px" />
          </span>
        )}
        <span>
          <span className="block font-semibold">{review.author}</span>
          {review.designation && <span className="block text-sm text-muted">{review.designation}</span>}
        </span>
      </figcaption>
    </figure>
  )
}

export async function TestimonialsBlock({ block }: { block: BlockData }) {
  const limit = Number(block.limit) || 3
  const reviews =
    block.source === 'manual'
      ? ((block.reviews as unknown[]) ?? []).filter(isObject).map((r) => r as unknown as Review).slice(0, limit)
      : await getReviews({ featured: true, limit })
  if (!reviews.length) return null
  const variant = (block.variant as string) ?? 'cards'

  return (
    <>
      <SectionHeading heading={block.heading as string} subheading={block.subheading as string} />
      {variant === 'quote' ? (
        <div className="mx-auto max-w-3xl">
          <ReviewCard review={reviews[0]} large />
        </div>
      ) : variant === 'carousel' ? (
        <ScrollRow>
          {reviews.map((r) => (
            <div key={r.id} className="w-[85%] shrink-0 snap-start md:w-[45%] lg:w-[32%]">
              <ReviewCard review={r} />
            </div>
          ))}
        </ScrollRow>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      )}
    </>
  )
}
