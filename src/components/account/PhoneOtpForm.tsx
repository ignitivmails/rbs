'use client'

import { useState, useTransition } from 'react'

import { Spinner } from '@/components/Spinner'
import { useStore } from '@/components/StoreProvider'
import { sendLoginOtpAction, verifyLoginOtpAction } from '@/lib/account-actions'
import { cn } from '@/lib/utils'

const input = 'w-full rounded-theme border border-line bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary'

/** Two-step phone OTP form — used for login and for adding a phone to a Google account. */
export function PhoneOtpForm({ askName = true, submitLabel, onSuccess }: { askName?: boolean; submitLabel?: string; onSuccess: () => void }) {
  const { t } = useStore()
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'phone' | 'code'>('phone')
  const [info, setInfo] = useState<{ ok: boolean; message?: string; devCode?: string } | null>(null)
  const [pending, start] = useTransition()

  const send = () =>
    start(async () => {
      const r = await sendLoginOtpAction(phone)
      setInfo(r)
      if (r.ok) setStep('code')
    })

  const verify = () =>
    start(async () => {
      const r = await verifyLoginOtpAction(phone, code, name)
      if (r.ok) onSuccess()
      else setInfo(r)
    })

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault()
        if (step === 'phone') send()
        else verify()
      }}
    >
      <label className="block text-sm font-medium" htmlFor="otp-phone">
        {t('phoneLabel')}
      </label>
      <div className="flex">
        <span className="flex items-center rounded-l-theme border border-r-0 border-line bg-page px-3 text-sm text-muted">+91</span>
        <input
          id="otp-phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          maxLength={10}
          required
          disabled={step === 'code'}
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
          className={cn(input, 'rounded-l-none disabled:opacity-60')}
        />
      </div>

      {step === 'code' && (
        <>
          <input
            aria-label={t('otpLabel')}
            placeholder={t('otpLabel')}
            inputMode="numeric"
            autoComplete="one-time-code"
            autoFocus
            maxLength={6}
            required
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className={cn(input, 'tracking-[0.3em]')}
          />
          {askName && (
            <input aria-label={t('yourNameOptional')} placeholder={t('yourNameOptional')} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={input} />
          )}
        </>
      )}

      {info?.message && <p className={cn('text-sm', info.ok ? 'text-success' : 'text-danger')}>{info.message}</p>}
      {info?.devCode && step === 'code' && (
        <p className="text-xs text-muted">
          Local test mode — your code is <strong className="tracking-widest text-ink">{info.devCode}</strong>
        </p>
      )}

      <button type="submit" className="btn btn-primary w-full" disabled={pending || phone.length !== 10 || (step === 'code' && code.length !== 6)}>
        {pending && <Spinner />}
        {step === 'phone' ? t('otpSend') : (submitLabel ?? t('verifyAndContinue'))}
      </button>
      {step === 'code' && (
        <div className="flex justify-between text-xs">
          <button
            type="button"
            className="text-muted underline"
            onClick={() => {
              setStep('phone')
              setCode('')
              setInfo(null)
            }}
          >
            Change number
          </button>
          <button type="button" className="text-primary underline" disabled={pending} onClick={send}>
            {t('otpResend')}
          </button>
        </div>
      )}
    </form>
  )
}
