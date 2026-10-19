'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

import { Icon } from '@/components/Icon'
import { Img } from '@/components/Img'
import type { ImageData } from '@/lib/types'
import { cn, isExternal } from '@/lib/utils'

export type HeroSlide = {
  image: ImageData | null
  mobileImage: ImageData | null
  eyebrow: string
  heading: string
  text: string
  align: 'left' | 'center' | 'right'
  tone: 'light' | 'dark'
  overlay: number
  ctas: Array<{ href: string; label: string; newTab: boolean; appearance: string }>
}

const HEIGHT: Record<string, string> = {
  sm: 'h-[340px] md:h-[400px]',
  md: 'h-[440px] md:h-[520px]',
  lg: 'h-[520px] md:h-[640px]',
  screen: 'h-[calc(100svh-140px)] min-h-[480px]',
}

const BTN: Record<string, string> = {
  primary: 'btn btn-primary',
  secondary: 'btn btn-secondary',
  light: 'btn btn-light',
  outline: 'btn btn-outline',
}

const ALIGN: Record<string, string> = {
  left: 'items-start text-left',
  center: 'items-center text-center mx-auto',
  right: 'items-end text-right ml-auto',
}

type Props = {
  slides: HeroSlide[]
  variant: 'carousel' | 'fullBleed' | 'split'
  height: string
  autoplay: number
  priority: boolean
  full: boolean
}

export function HeroSlider({ slides, variant, height, autoplay, priority, full }: Props) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = slides.length
  const go = useCallback((i: number) => setIndex((i + count) % count), [count])

  useEffect(() => {
    if (count < 2 || autoplay <= 0 || paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setTimeout(() => go(index + 1), autoplay * 1000)
    return () => clearTimeout(id)
  }, [index, count, autoplay, paused, go])

  if (variant === 'split') {
    const s = slides[0]
    return (
      <div className={cn('grid overflow-hidden md:grid-cols-2', !full && 'rounded-theme')}>
        <div className={cn('flex flex-col justify-center gap-4 bg-secondary p-8 md:p-14', ALIGN[s.align])}>
          <SlideText slide={s} as="h1" />
        </div>
        <div className={cn('relative min-h-[300px]', HEIGHT[height])}>
          <Img image={s.image} fill priority={priority} sizes="(min-width: 768px) 50vw, 100vw" />
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn('relative overflow-hidden', HEIGHT[height] ?? HEIGHT.lg, !full && 'rounded-theme')}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription={count > 1 ? 'carousel' : undefined}
    >
      {slides.map((s, i) => {
        const active = i === index
        const o = Math.min(90, Math.max(0, s.overlay)) / 100
        const shade = s.tone === 'dark' ? '255,255,255' : '0,0,0'
        const gradient =
          s.align === 'center'
            ? `rgba(${shade},${o})`
            : `linear-gradient(${s.align === 'right' ? '270deg' : '90deg'}, rgba(${shade},${o}) 0%, rgba(${shade},${o * 0.5}) 55%, rgba(${shade},0) 100%)`
        return (
          <div
            key={i}
            aria-hidden={!active}
            className={cn('absolute inset-0 transition-opacity duration-700', active ? 'z-10 opacity-100' : 'pointer-events-none z-0 opacity-0')}
          >
            {s.mobileImage && <Img image={s.mobileImage} fill priority={priority && i === 0} className="md:hidden" />}
            <Img image={s.image} fill priority={priority && i === 0} className={s.mobileImage ? 'hidden md:block' : undefined} />
            <div className="absolute inset-0" style={{ background: gradient }} />
            <div className={cn('relative flex h-full items-center', full ? 'container-x' : 'px-6 md:px-14')}>
              <div className={cn('flex max-w-xl flex-col gap-4', ALIGN[s.align], s.tone === 'dark' ? 'text-ink' : 'text-white')}>
                <SlideText slide={s} as={i === 0 ? 'h1' : 'h2'} />
              </div>
            </div>
          </div>
        )
      })}

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-white/80 p-2 text-ink shadow hover:bg-white md:flex"
          >
            <Icon name="chevronLeft" />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-white/80 p-2 text-ink shadow hover:bg-white md:flex"
          >
            <Icon name="chevronRight" />
          </button>
          <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                className={cn('h-2 rounded-full bg-white transition-all', i === index ? 'w-6' : 'w-2 opacity-60')}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function SlideText({ slide, as: Heading }: { slide: HeroSlide; as: 'h1' | 'h2' }) {
  return (
    <>
      {slide.eyebrow && <p className="eyebrow opacity-90">{slide.eyebrow}</p>}
      {slide.heading && <Heading className="text-4xl leading-[1.05] md:text-6xl">{slide.heading}</Heading>}
      {slide.text && <p className="max-w-md text-base opacity-90 md:text-lg">{slide.text}</p>}
      {slide.ctas.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-3">
          {slide.ctas.map((c) =>
            isExternal(c.href) || c.newTab ? (
              <a key={c.href + c.label} href={c.href} target={c.newTab ? '_blank' : undefined} rel={c.newTab ? 'noopener noreferrer' : undefined} className={BTN[c.appearance] ?? BTN.primary}>
                {c.label}
              </a>
            ) : (
              <Link key={c.href + c.label} href={c.href} className={BTN[c.appearance] ?? BTN.primary}>
                {c.label}
              </Link>
            ),
          )}
        </div>
      )}
    </>
  )
}
