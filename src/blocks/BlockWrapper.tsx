import type { CSSProperties, ReactNode } from 'react'

import type { BlockData } from '@/lib/types'
import { cn, toImage } from '@/lib/utils'

const BG: Record<string, string> = {
  none: '',
  surface: 'bg-surface',
  secondary: 'bg-secondary',
  primary: 'bg-primary text-primary-fg',
  accent: 'bg-accent text-white',
  custom: '',
}

const PT: Record<string, string> = {
  none: 'pt-0',
  sm: 'pt-6 md:pt-8',
  md: 'pt-10 md:pt-14',
  lg: 'pt-14 md:pt-20',
  xl: 'pt-20 md:pt-28',
}

const PB: Record<string, string> = {
  none: 'pb-0',
  sm: 'pb-6 md:pb-8',
  md: 'pb-10 md:pb-14',
  lg: 'pb-14 md:pb-20',
  xl: 'pb-20 md:pb-28',
}

const VIS: Record<string, string> = {
  all: '',
  desktop: 'hidden md:block',
  mobile: 'md:hidden',
}

/** Applies the shared "Section settings → Style" of every block. */
export function BlockWrapper({ block, children }: { block: BlockData; children: ReactNode }) {
  const s = block.style ?? {}
  const bgImage = toImage(s.bgImage, 'hero')
  const style: CSSProperties = {}
  if (s.background === 'custom' && s.customBg) style.background = s.customBg
  if (bgImage) {
    style.backgroundImage = `url("${bgImage.src}")`
    style.backgroundSize = 'cover'
    style.backgroundPosition = bgImage.objectPosition ?? 'center'
  }
  if (s.textColor) style.color = s.textColor

  const width = s.width ?? 'container'
  return (
    <section
      id={s.anchor || undefined}
      data-block={block.blockType}
      className={cn(
        'relative',
        BG[s.background ?? 'none'],
        PT[s.paddingTop ?? 'md'],
        PB[s.paddingBottom ?? 'md'],
        VIS[s.visibility ?? 'all'],
        s.className,
      )}
      style={style}
    >
      {width === 'full' ? children : <div className={cn('container-x', width === 'narrow' && 'max-w-3xl')}>{children}</div>}
    </section>
  )
}

export function SectionHeading({
  heading,
  subheading,
  align = 'center',
  action,
}: {
  heading?: string | null
  subheading?: string | null
  align?: 'center' | 'left'
  action?: ReactNode
}) {
  if (!heading && !subheading && !action) return null
  return (
    <div className={cn('mb-8 flex flex-col gap-3 md:mb-10', align === 'center' ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between')}>
      <div className={cn(align === 'center' && 'max-w-2xl')}>
        {heading && <h2 className="text-3xl md:text-4xl">{heading}</h2>}
        {subheading && <p className="mt-3 text-base opacity-75 md:text-lg">{subheading}</p>}
      </div>
      {action}
    </div>
  )
}
