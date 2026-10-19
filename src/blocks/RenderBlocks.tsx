import type { ReactNode } from 'react'

import type { BlockData } from '@/lib/types'
import { isScheduledActive } from '@/lib/utils'

import { BlockWrapper } from './BlockWrapper'
import { CategoryGridBlock, ProductCollectionBlock, TestimonialsBlock } from './CatalogBlocks'
import {
  BannerStripBlock,
  FaqBlock,
  FeatureTilesBlock,
  ImageWithTextBlock,
  LogoMarqueeBlock,
  NewsletterBlock,
  RichTextBlockView,
  SpacerBlock,
  StatsBlock,
} from './ContentBlocks'
import { HeroBlock } from './Hero'
import { EnquiryFormBlock, LatestPostsBlock, StoreLocatorBlock } from './Phase6BlockViews'
import { TrackOrderForm } from './TrackOrderForm'

type BlockComponent = (props: { block: BlockData; index: number }) => ReactNode | Promise<ReactNode>

/** blockType (Payload block slug) → React component. Register new blocks here. */
const registry: Record<string, BlockComponent> = {
  hero: HeroBlock,
  categoryGrid: CategoryGridBlock,
  productCollection: ProductCollectionBlock,
  logoMarquee: LogoMarqueeBlock,
  featureTiles: FeatureTilesBlock,
  testimonials: TestimonialsBlock,
  stats: StatsBlock,
  imageWithText: ImageWithTextBlock,
  bannerStrip: BannerStripBlock,
  richText: RichTextBlockView,
  newsletter: NewsletterBlock,
  faq: FaqBlock,
  trackOrder: ({ block }) => (
    <TrackOrderForm heading={block.heading as string} text={block.text as string} buttonLabel={block.buttonLabel as string} />
  ),
  enquiryForm: EnquiryFormBlock,
  storeLocator: StoreLocatorBlock,
  latestPosts: LatestPostsBlock,
  spacer: SpacerBlock,
}

export function RenderBlocks({ blocks }: { blocks?: BlockData[] | null }) {
  if (!blocks?.length) return null
  const now = Date.now()
  return (
    <>
      {blocks
        .filter((b) => b.enabled !== false && isScheduledActive(b, now))
        .map((block, index) => {
          const Component = registry[block.blockType]
          if (!Component) return null
          return (
            <BlockWrapper key={block.id ?? `${block.blockType}-${index}`} block={block}>
              <Component block={block} index={index} />
            </BlockWrapper>
          )
        })}
    </>
  )
}
