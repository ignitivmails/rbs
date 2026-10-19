'use client'

import { useEffect, useRef, useState, useTransition } from 'react'

import { useCart, useHydrated } from '@/components/cart/store'
import { Icon } from '@/components/Icon'
import { useStore } from '@/components/StoreProvider'
import { checkPincodeAction, type PincodeResult } from '@/lib/actions'
import type { ID } from '@/lib/types'
import { cn } from '@/lib/utils'

export function PincodeChecker({ productId }: { productId?: ID }) {
  const { t } = useStore()
  const stored = useCart((s) => s.pincode)
  const savePincode = useCart((s) => s.setPincode)
  const hydrated = useHydrated()
  const [pin, setPin] = useState('')
  const [result, setResult] = useState<PincodeResult | null>(null)
  const [pending, startTransition] = useTransition()
  const autoChecked = useRef(false)

  const run = (value: string) =>
    startTransition(async () => {
      const r = await checkPincodeAction(value, productId)
      setResult(r)
      if (r.status !== 'invalid') savePincode(value)
    })

  // Re-check the pincode the shopper used last time.
  useEffect(() => {
    if (hydrated && stored && !autoChecked.current) {
      autoChecked.current = true
      setPin(stored)
      run(stored)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, stored])

  const ok = result?.status === 'ok'

  return (
    <div className="rounded-theme border border-line bg-surface p-4">
      <label htmlFor="pincode" className="mb-2 flex items-center gap-2 text-sm font-semibold">
        <Icon name="truck" size={18} /> {t('pincodeLabel')}
      </label>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          run(pin)
        }}
      >
        <input
          id="pincode"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={6}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
          placeholder={t('pincodePlaceholder')}
          className="min-w-0 flex-1 rounded-theme border border-line bg-page px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <button type="submit" className="btn btn-outline btn-sm" disabled={pending || pin.length !== 6}>
          {pending ? '…' : t('pincodeCheck')}
        </button>
      </form>
      {result && (
        <div aria-live="polite" className={cn('mt-3 text-sm', ok ? 'text-success' : 'text-danger')}>
          <p className="flex items-start gap-2">
            <Icon name={ok ? 'check' : 'x'} size={16} className="mt-0.5 shrink-0" />
            <span>{result.message}</span>
          </p>
          {ok && result.codMessage && <p className="mt-1 pl-6 text-muted">{result.codMessage}</p>}
        </div>
      )}
    </div>
  )
}
