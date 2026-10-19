'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

import { startNavigationProgress } from '@/components/NavigationProgress'
import { Spinner } from '@/components/Spinner'
import { useStore } from '@/components/StoreProvider'
import { trackOrderAction } from '@/lib/account-actions'

const input = 'w-full rounded-theme border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:border-primary'

export function TrackOrderForm({ heading, text, buttonLabel }: { heading?: string; text?: string; buttonLabel?: string }) {
  const { t } = useStore()
  const router = useRouter()
  const [orderNumber, setOrderNumber] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, start] = useTransition()

  return (
    <div className="card card-border mx-auto max-w-lg p-6 text-ink md:p-8">
      {heading && <h2 className="text-3xl">{heading}</h2>}
      {text && <p className="mt-2 text-sm text-muted">{text}</p>}
      <form
        className="mt-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          start(async () => {
            const r = await trackOrderAction(orderNumber, phone)
            if (r.ok && r.url) {
              startNavigationProgress()
              router.push(r.url)
            }
            else setError(r.message ?? t('trackNotFound'))
          })
        }}
      >
        <label className="block text-sm">
          <span className="mb-1 block font-medium">{t('trackOrderNumber')}</span>
          <input className={`${input} uppercase`} required placeholder="RBS-261018-ABCD" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value.toUpperCase())} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">{t('trackPhone')}</span>
          <input
            className={input}
            required
            type="tel"
            inputMode="numeric"
            maxLength={10}
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
          />
        </label>
        {error && <p className="text-sm text-danger">{error}</p>}
        <button type="submit" className="btn btn-primary w-full" disabled={pending || !orderNumber || phone.length !== 10}>
          {pending && <Spinner />}
          {buttonLabel || 'Track order'}
        </button>
      </form>
    </div>
  )
}
