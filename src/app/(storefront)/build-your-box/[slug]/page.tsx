import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BoxBuilder, type BoxBuilderData } from '@/components/box/BoxBuilder'
import { getGiftBoxBySlug, getSite } from '@/lib/data'
import { relId, toImage } from '@/lib/utils'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const box = await getGiftBoxBySlug(slug)
  return box ? { title: box.meta?.title || box.name, description: box.meta?.description || box.description || undefined } : {}
}

export default async function BoxPage({ params }: Props) {
  const { slug } = await params
  const [box, { t }] = await Promise.all([getGiftBoxBySlug(slug), getSite()])
  if (!box || !(box.sizes ?? []).length) notFound()

  const data: BoxBuilderData = {
    id: String(box.id),
    slug: box.slug,
    name: box.name,
    image: toImage(box.image, 'thumbnail')?.src ?? null,
    zoneIds: (box.deliveryZones ?? []).map((z) => String(relId(z))),
    allowMessage: box.allowMessage !== false,
    sizes: (box.sizes ?? []).filter((s) => s.id).map((s) => ({ id: s.id!, label: s.label, pieces: s.pieces, price: s.price, mrp: s.mrp ?? null })),
    items: (box.items ?? [])
      .filter((i) => i.id && i.available !== false)
      .map((i) => ({
        id: i.id!,
        name: i.name,
        image: toImage(i.image, 'thumbnail'),
        extraPrice: i.extraPrice ?? 0,
        maxPerBox: i.maxPerBox ?? null,
        description: i.description ?? '',
      })),
    packaging: (box.packaging ?? []).filter((p) => p.id).map((p) => ({ id: p.id!, label: p.label, price: p.price ?? 0, description: p.description ?? '' })),
  }

  return (
    <div className="container-x py-8 md:py-12">
      <nav className="mb-4 text-sm text-muted">
        <Link href="/build-your-box" className="hover:text-primary">
          {t('boxTitle')}
        </Link>{' '}
        / <span className="text-ink">{box.name}</span>
      </nav>
      <header className="mb-8">
        <h1 className="text-4xl">{box.name}</h1>
        {box.description && <p className="mt-2 max-w-2xl text-muted">{box.description}</p>}
      </header>
      <BoxBuilder box={data} />
    </div>
  )
}
