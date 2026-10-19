import type { Block } from 'payload'

import { CategoryGrid } from './CategoryGrid'
import { BannerStrip, Faq, ImageWithText, Newsletter, RichTextBlock, Spacer } from './ContentBlocks'
import { FeatureTiles } from './FeatureTiles'
import { Hero } from './Hero'
import { LogoMarquee } from './LogoMarquee'
import { ProductCollection } from './ProductCollection'
import { Stats } from './Stats'
import { EnquiryForm, LatestPosts, StoreLocator } from './Phase6Blocks'
import { Testimonials } from './Testimonials'
import { TrackOrder } from './TrackOrder'

/** Every block available in the page builder. Add a block here + in src/blocks/RenderBlocks.tsx. */
export const pageBlocks: Block[] = [
  Hero,
  CategoryGrid,
  ProductCollection,
  LogoMarquee,
  FeatureTiles,
  Testimonials,
  Stats,
  ImageWithText,
  BannerStrip,
  RichTextBlock,
  Newsletter,
  Faq,
  TrackOrder,
  EnquiryForm,
  StoreLocator,
  LatestPosts,
  Spacer,
]

/** Smaller set offered below the product grid on category pages. */
export const categoryBlocks: Block[] = [BannerStrip, ImageWithText, RichTextBlock, FeatureTiles, Faq]
