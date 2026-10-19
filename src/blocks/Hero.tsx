import type { BlockData, LinkData } from '@/lib/types'
import { resolveLink, toImage } from '@/lib/utils'

import { HeroSlider, type HeroSlide } from './HeroSlider'

type SlideData = {
  image?: unknown
  mobileImage?: unknown
  eyebrow?: string | null
  heading?: string | null
  text?: string | null
  align?: HeroSlide['align'] | null
  tone?: HeroSlide['tone'] | null
  overlay?: number | null
  ctas?: Array<{ link?: LinkData | null; appearance?: string | null }> | null
}

export function HeroBlock({ block, index }: { block: BlockData; index: number }) {
  const variant = (block.variant as 'carousel' | 'fullBleed' | 'split') ?? 'carousel'
  const slides: HeroSlide[] = ((block.slides as SlideData[] | undefined) ?? []).map((s) => ({
    image: toImage(s.image, 'hero'),
    mobileImage: toImage(s.mobileImage, 'card'),
    eyebrow: s.eyebrow ?? '',
    heading: s.heading ?? '',
    text: s.text ?? '',
    align: s.align ?? 'left',
    tone: s.tone ?? 'light',
    overlay: s.overlay ?? 35,
    ctas: (s.ctas ?? []).flatMap((c) => {
      const r = resolveLink(c.link)
      return r ? [{ ...r, appearance: c.appearance ?? 'primary' }] : []
    }),
  }))
  if (!slides.length) return null

  return (
    <HeroSlider
      slides={variant === 'carousel' ? slides : slides.slice(0, 1)}
      variant={variant}
      height={(block.height as string) ?? 'lg'}
      autoplay={(block.autoplaySeconds as number) ?? 6}
      priority={index === 0}
      full={block.style?.width === 'full'}
    />
  )
}
