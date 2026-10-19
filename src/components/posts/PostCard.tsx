import Link from 'next/link'

import { Img } from '@/components/Img'
import type { Post } from '@/lib/types'
import { toImage } from '@/lib/utils'

export const SECTION_PATH = { blog: '/blog', library: '/sweets-library' } as const

export const postHref = (post: Pick<Post, 'section' | 'slug'>) => `${SECTION_PATH[post.section] ?? '/blog'}/${post.slug}`

const dateFmt = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' })
export const formatPostDate = (iso?: string | null) => (iso ? dateFmt.format(new Date(iso)) : '')

export function PostCard({ post }: { post: Post }) {
  return (
    <Link href={postHref(post)} className="card card-border group flex h-full flex-col overflow-hidden text-ink">
      <div className="relative aspect-[16/10] bg-ink/5">
        <Img image={toImage(post.cover, 'card')} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="eyebrow text-primary">{post.section === 'library' ? 'Sweets Library' : formatPostDate(post.publishedAt)}</p>
        <h3 className="text-xl leading-snug group-hover:text-primary">{post.title}</h3>
        {post.excerpt && <p className="line-clamp-3 text-sm text-muted">{post.excerpt}</p>}
      </div>
    </Link>
  )
}
