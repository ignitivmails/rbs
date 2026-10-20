import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { ADMIN_ROUTE } from '@/lib/admin-route'
import { getPage } from '@/lib/data'
import { toImage } from '@/lib/utils'

/** Renders a CMS page (built from blocks) by slug. */
export async function RenderPage({ slug }: { slug: string }) {
  const page = await getPage(slug)
  if (!page) {
    if (slug === 'home') return <EmptyHome />
    notFound()
  }
  if (!page.layout?.length) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="text-4xl">{page.title}</h1>
        <p className="mt-4 text-muted">This page has no sections yet — add some in the admin.</p>
      </div>
    )
  }
  return <RenderBlocks blocks={page.layout} />
}

export async function pageMetadata(slug: string): Promise<Metadata> {
  const page = await getPage(slug)
  if (!page) return {}
  const image = toImage(page.meta?.image, 'card')
  const title = page.meta?.title || page.title
  return {
    title: slug === 'home' ? { absolute: title } : title,
    description: page.meta?.description || undefined,
    alternates: { canonical: slug === 'home' ? '/' : `/${slug}` },
    openGraph: image ? { images: [image.src] } : undefined,
  }
}

function EmptyHome() {
  return (
    <div className="container-x py-24 text-center">
      <h1 className="text-4xl">Welcome! 🍬</h1>
      <p className="mx-auto mt-4 max-w-lg text-muted">
        No homepage yet. Run <code className="rounded bg-ink/5 px-1.5 py-0.5">npm run seed</code> to load demo content, or create a page with the
        slug <code className="rounded bg-ink/5 px-1.5 py-0.5">home</code> in the{' '}
        <a href={ADMIN_ROUTE} className="text-primary underline">
          admin panel
        </a>
        .
      </p>
    </div>
  )
}
