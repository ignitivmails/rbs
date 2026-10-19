'use client'

import Image from 'next/image'
import { useState } from 'react'

import type { ImageData } from '@/lib/types'
import { cn } from '@/lib/utils'

type Props = {
  image: ImageData | null | undefined
  className?: string
  /** Fill the (relatively positioned) parent. */
  fill?: boolean
  sizes?: string
  priority?: boolean
  alt?: string
}

/**
 * CMS image → next/image, with a shimmer placeholder until the image has loaded.
 * The image itself is never hidden (good for LCP); the shimmer sits behind it.
 */
export function Img({ image, className, fill, sizes, priority, alt }: Props) {
  const [loaded, setLoaded] = useState(false)

  if (!image) {
    return <div aria-hidden className={cn('bg-ink/5', fill && 'absolute inset-0', className)} />
  }
  const style = image.objectPosition ? { objectPosition: image.objectPosition } : undefined
  if (fill || !image.width || !image.height) {
    return (
      <>
        {/* Same classes as the image, so responsive visibility (e.g. md:hidden) applies to the shimmer too. */}
        {!loaded && <span aria-hidden className={cn('skeleton absolute inset-0', className)} />}
        <Image
          src={image.src}
          alt={alt ?? image.alt}
          fill
          sizes={sizes ?? '100vw'}
          priority={priority}
          unoptimized={image.svg}
          className={cn('object-cover', className)}
          style={style}
          onLoad={() => setLoaded(true)}
        />
      </>
    )
  }
  return (
    <Image
      src={image.src}
      alt={alt ?? image.alt}
      width={image.width}
      height={image.height}
      sizes={sizes}
      priority={priority}
      unoptimized={image.svg}
      className={cn(!loaded && 'skeleton', className)}
      style={style}
      onLoad={() => setLoaded(true)}
    />
  )
}
