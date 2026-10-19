'use client'

import { useState } from 'react'

import { Img } from '@/components/Img'
import type { ImageData } from '@/lib/types'
import { cn } from '@/lib/utils'

export function ProductGallery({ images, name }: { images: ImageData[]; name: string }) {
  const [active, setActive] = useState(0)
  const current = images[active] ?? images[0]

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-theme bg-ink/5">
        <Img image={current} fill priority sizes="(min-width: 768px) 50vw, 100vw" alt={current?.alt || name} />
      </div>
      {images.length > 1 && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img.src + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === active}
              className={cn(
                'relative size-16 shrink-0 overflow-hidden rounded-theme border-2 md:size-20',
                i === active ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100',
              )}
            >
              <Img image={img} fill sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
