'use client'

import { useState } from 'react'

import { Icon } from '@/components/Icon'
import { Img } from '@/components/Img'
import { useStore } from '@/components/StoreProvider'
import type { ImageData } from '@/lib/types'
import { cn, whatsappHref } from '@/lib/utils'

export type StoreCard = {
  id: string
  name: string
  address: string
  mapQuery: string
  phone: string | null
  whatsapp: string | null
  hours: Array<{ days: string; time: string }>
  services: string[]
  image: ImageData | null
}

const SERVICE_LABELS: Record<string, string> = {
  fresh: 'Fresh sweets',
  cafe: 'Café & chaat',
  pickup: 'Order pickup',
  parking: 'Parking',
  seating: 'Seating',
}

/** Store cards + an embedded map (no API key needed) for the selected store. */
export function StoreLocatorView({ stores, showMap }: { stores: StoreCard[]; showMap: boolean }) {
  const { t } = useStore()
  const [selected, setSelected] = useState(stores[0]?.id)
  const current = stores.find((s) => s.id === selected) ?? stores[0]
  if (!current) return null

  return (
    <div className={cn('grid gap-6', showMap && 'lg:grid-cols-[1fr_1.2fr]')}>
      <ul className="space-y-4">
        {stores.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => setSelected(s.id)}
              aria-pressed={s.id === current.id}
              className={cn(
                'card w-full overflow-hidden text-left text-ink transition-colors',
                s.id === current.id ? 'border-2 border-primary' : 'card-border hover:border-primary',
              )}
            >
              <div className="flex gap-4 p-4">
                {s.image && (
                  <span className="relative hidden size-24 shrink-0 overflow-hidden rounded-theme sm:block">
                    <Img image={s.image} fill sizes="96px" />
                  </span>
                )}
                <div className="min-w-0 flex-1 space-y-1.5 text-sm">
                  <p className="font-heading text-xl">{s.name}</p>
                  <p className="flex items-start gap-1.5 whitespace-pre-line text-muted">
                    <Icon name="pin" size={16} className="mt-0.5 shrink-0" /> {s.address}
                  </p>
                  {s.hours.length > 0 && (
                    <p className="flex items-start gap-1.5">
                      <Icon name="clock" size={16} className="mt-0.5 shrink-0 text-muted" />
                      <span>{s.hours.map((h) => `${h.days}: ${h.time}`).join(' · ')}</span>
                    </p>
                  )}
                  {s.services.length > 0 && (
                    <p className="flex flex-wrap gap-1.5 pt-1">
                      {s.services.map((sv) => (
                        <span key={sv} className="rounded-full bg-secondary px-2 py-0.5 text-[11px]">
                          {SERVICE_LABELS[sv] ?? sv}
                        </span>
                      ))}
                    </p>
                  )}
                </div>
              </div>
            </button>
            <div className="mt-2 flex flex-wrap gap-3 px-1 text-sm font-medium">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(s.mapQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {t('storeDirections')} →
              </a>
              {s.phone && (
                <a href={`tel:${s.phone.replace(/\s/g, '')}`} className="hover:underline">
                  {t('storeCall')} {s.phone}
                </a>
              )}
              {s.whatsapp && (
                <a href={whatsappHref(s.whatsapp)} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  WhatsApp
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
      {showMap && (
        <div className="card card-border min-h-[360px] overflow-hidden lg:sticky lg:top-28 lg:h-[520px]">
          <iframe
            key={current.id}
            title={`Map — ${current.name}`}
            src={`https://maps.google.com/maps?q=${encodeURIComponent(current.mapQuery)}&z=15&output=embed`}
            className="h-full min-h-[360px] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}
    </div>
  )
}
