import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Img } from '@/components/Img'
import { ProductCard } from '@/components/product/ProductCard'
import { RichText } from '@/components/RichText'
import { getPostBySlug, getPosts, getSite } from '@/lib/data'
import type { Product } from '@/lib/types'
import { isObject, toImage } from '@/lib/utils'

import { formatPostDate, PostCard, SECTION_PATH } from './PostCard'

type Section = 'blog' | 'library'

/** Rough reading time from the rich-text JSON. */
function readingMinutes(content: unknown) {
  const words = JSON.stringify(content ?? '')
    .replace(/"[a-zA-Z]+":/g, ' ')
    .split(/\s+/).length
  return Math.max(1, Math.round(words / 220))
}

export async function PostIndex({ section }: { section: Section }) {
  const [{ t }, posts] = await Promise.all([getSite(), getPosts({ section, limit: 48 })])
  return (
    <div className="container-x py-10 md:py-14">
      <header className="mx-auto mb-10 max-w-2xl text-center">
        <h1 className="text-4xl md:text-5xl">{section === 'blog' ? t('blogTitle') : t('libraryTitle')}</h1>
        <p className="mt-3 text-muted">{section === 'blog' ? t('blogIntro') : t('libraryIntro')}</p>
      </header>
      {posts.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted">{t('noPosts')}</p>
      )}
    </div>
  )
}

export async function PostDetail({ section, slug }: { section: Section; slug: string }) {
  const [{ t }, post] = await Promise.all([getSite(), getPostBySlug(section, slug)])
  if (!post) notFound()
  const related = (post.relatedProducts ?? []).filter((p): p is Product => isObject(p))
  const cover = toImage(post.cover, 'hero')

  return (
    <article className="pb-16">
      <header className="container-x max-w-3xl pt-10 text-center md:pt-14">
        <Link href={SECTION_PATH[section]} className="eyebrow text-primary hover:underline">
          {section === 'blog' ? t('blogTitle') : t('libraryTitle')}
        </Link>
        <h1 className="mt-3 text-4xl md:text-5xl">{post.title}</h1>
        <p className="mt-3 text-sm text-muted">
          {[post.author, formatPostDate(post.publishedAt), t('readingTime', { minutes: readingMinutes(post.content) })].filter(Boolean).join(' · ')}
        </p>
      </header>
      {cover && (
        <div className="container-x mt-8 max-w-5xl">
          <div className="relative aspect-[16/8] overflow-hidden rounded-theme">
            <Img image={cover} fill priority sizes="(min-width: 1024px) 1024px, 100vw" />
          </div>
        </div>
      )}
      <div className="container-x mt-10 max-w-3xl">
        {post.excerpt && <p className="mb-6 text-lg leading-relaxed text-muted">{post.excerpt}</p>}
        <RichText data={post.content} className="text-base" />
        {(post.tags ?? []).length > 0 && (
          <p className="mt-8 flex flex-wrap gap-2">
            {(post.tags ?? []).map((tag) => (
              <span key={tag} className="rounded-full bg-secondary px-3 py-1 text-xs">
                #{tag}
              </span>
            ))}
          </p>
        )}
      </div>
      {related.length > 0 && (
        <section className="container-x mt-14">
          <h2 className="mb-6 text-2xl md:text-3xl">{t('relatedReading')}</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:gap-6">
            {related.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  )
}

export async function postMetadata(section: Section, slug: string) {
  const post = await getPostBySlug(section, slug)
  if (!post) return {}
  const image = toImage(post.meta?.image ?? post.cover, 'card')
  return {
    title: post.meta?.title || post.title,
    description: post.meta?.description || post.excerpt || undefined,
    alternates: { canonical: `${SECTION_PATH[section]}/${post.slug}` },
    openGraph: { type: 'article' as const, images: image ? [image.src] : undefined },
  }
}
