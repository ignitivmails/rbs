import { CMSLink } from '@/components/CMSLink'
import { PostCard } from '@/components/posts/PostCard'
import { getPosts, getStores } from '@/lib/data'
import type { BlockData, LinkData } from '@/lib/types'
import { relId, resolveLink, toImage } from '@/lib/utils'

import { SectionHeading } from './BlockWrapper'
import { EnquiryFormView } from './EnquiryFormView'
import { StoreLocatorView, type StoreCard } from './StoreLocatorView'

export function EnquiryFormBlock({ block }: { block: BlockData }) {
  return (
    <EnquiryFormView
      heading={block.heading as string}
      text={block.text as string}
      enquiryType={(block.enquiryType as string) ?? 'any'}
      showCompany={block.showCompany !== false}
      showQuantity={block.showQuantity !== false}
      showBudget={block.showBudget !== false}
      showDate={block.showDate !== false}
      successMessage={(block.successMessage as string) || undefined}
    />
  )
}

export async function StoreLocatorBlock({ block }: { block: BlockData }) {
  const ids = block.source === 'manual' ? ((block.stores as unknown[]) ?? []).map((s) => relId(s)).filter((id): id is NonNullable<typeof id> => id !== null) : undefined
  const stores = await getStores(ids)
  if (!stores.length) return null
  const cards: StoreCard[] = stores.map((s) => ({
    id: String(s.id),
    name: s.name,
    address: s.address,
    mapQuery: s.mapQuery || `${s.address}, ${s.city ?? ''} ${s.pincode ?? ''}`.replace(/\s+/g, ' ').trim(),
    phone: s.phone ?? null,
    whatsapp: s.whatsapp ?? null,
    hours: (s.hours ?? []).map((h) => ({ days: h.days, time: h.time })),
    services: s.services ?? [],
    image: toImage(s.image, 'thumbnail'),
  }))
  return (
    <>
      <SectionHeading heading={block.heading as string} subheading={block.subheading as string} />
      <StoreLocatorView stores={cards} showMap={block.showMap !== false} />
    </>
  )
}

export async function LatestPostsBlock({ block }: { block: BlockData }) {
  const section = block.section === 'library' || block.section === 'blog' ? block.section : undefined
  const posts = await getPosts({ section, limit: Number(block.limit) || 3 })
  if (!posts.length) return null
  const viewAll = resolveLink(block.viewAll as LinkData)
  return (
    <>
      <SectionHeading heading={block.heading as string} subheading={block.subheading as string} />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
      {viewAll && (
        <div className="mt-8 flex justify-center">
          <CMSLink resolved={viewAll} appearance="outline" className="btn-sm" />
        </div>
      )}
    </>
  )
}
