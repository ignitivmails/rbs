import type { Metadata } from 'next'
import Link from 'next/link'

import { Img } from '@/components/Img'
import { getGiftBoxes, getSite } from '@/lib/data'
import { formatPrice, toImage } from '@/lib/utils'

export const metadata: Metadata = { title: 'Build your own box' }

export default async function BuildYourBoxIndex() {
  const [{ t }, boxes] = await Promise.all([getSite(), getGiftBoxes()])
  return (
    <div className="container-x py-10 md:py-14">
      <header className="mx-auto mb-10 max-w-2xl text-center">
        <h1 className="text-4xl md:text-5xl">{t('boxTitle')}</h1>
        <p className="mt-3 text-muted">{t('boxIntro')}</p>
      </header>
      {boxes.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {boxes.map((box) => {
            const from = Math.min(...(box.sizes ?? []).map((s) => s.price))
            return (
              <Link key={box.id} href={`/build-your-box/${box.slug}`} className="card card-border group overflow-hidden">
                <div className="relative aspect-[4/3] bg-ink/5">
                  <Img image={toImage(box.image, 'card')} fill sizes="(min-width: 1024px) 33vw, 50vw" className="transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="space-y-2 p-5">
                  <h2 className="text-2xl group-hover:text-primary">{box.name}</h2>
                  {box.description && <p className="text-sm text-muted">{box.description}</p>}
                  <p className="text-sm">
                    {(box.sizes ?? []).map((s) => s.label).join(' · ')} {Number.isFinite(from) && <span className="font-semibold">· {t('fromPrice')} {formatPrice(from)}</span>}
                  </p>
                  <span className="btn btn-primary btn-sm mt-2">{t('boxStart')} →</span>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <p className="text-center text-muted">{t('noPosts')}</p>
      )}
    </div>
  )
}
