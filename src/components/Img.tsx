import Image from 'next/image'

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

/** CMS image → next/image. Works in server and client components. */
export function Img({ image, className, fill, sizes, priority, alt }: Props) {
  if (!image) {
    return <div aria-hidden className={cn('bg-ink/5', fill && 'absolute inset-0', className)} />
  }
  const style = image.objectPosition ? { objectPosition: image.objectPosition } : undefined
  if (fill || !image.width || !image.height) {
    return (
      <Image
        src={image.src}
        alt={alt ?? image.alt}
        fill
        sizes={sizes ?? '100vw'}
        priority={priority}
        unoptimized={image.svg}
        className={cn('object-cover', className)}
        style={style}
      />
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
      className={className}
      style={style}
    />
  )
}
