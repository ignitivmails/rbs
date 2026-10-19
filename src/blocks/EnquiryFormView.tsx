'use client'

import { usePathname } from 'next/navigation'
import { useState, useTransition, type ReactNode } from 'react'

import { Icon } from '@/components/Icon'
import { useStore } from '@/components/StoreProvider'
import { submitEnquiryAction } from '@/lib/enquiry-actions'
import { cn } from '@/lib/utils'

const OCCASIONS: Array<[string, string]> = [
  ['corporate', 'Corporate gifting'],
  ['wedding', 'Wedding'],
  ['celebration', 'Celebration'],
  ['baby', 'Baby announcement'],
  ['custom', 'Custom box'],
]

const input = 'w-full rounded-theme border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:border-primary'

type Props = {
  heading?: string
  text?: string
  enquiryType: string
  showCompany: boolean
  showQuantity: boolean
  showBudget: boolean
  showDate: boolean
  successMessage?: string
}

export function EnquiryFormView(props: Props) {
  const { t } = useStore()
  const pathname = usePathname()
  const [form, setForm] = useState({
    type: props.enquiryType === 'any' ? 'corporate' : props.enquiryType,
    name: '',
    phone: '',
    email: '',
    company: '',
    quantity: '',
    budget: '',
    eventDate: '',
    message: '',
    website: '',
  })
  const [result, setResult] = useState<{ ok: boolean; message: string; errors?: Record<string, string> } | null>(null)
  const [pending, start] = useTransition()
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }))
  const err = (k: string) => result?.errors?.[k]

  if (result?.ok) {
    return (
      <div className="card card-border mx-auto max-w-2xl p-8 text-center text-ink">
        <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-success/15 text-success">
          <Icon name="check" size={24} />
        </span>
        <p className="text-lg">{props.successMessage || result.message}</p>
      </div>
    )
  }

  return (
    <div className="card card-border mx-auto max-w-2xl p-6 text-ink md:p-8">
      {props.heading && <h2 className="text-3xl">{props.heading}</h2>}
      {props.text && <p className="mt-2 text-sm text-muted">{props.text}</p>}
      <form
        className="mt-6 grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault()
          start(async () => setResult(await submitEnquiryAction({ ...form, source: pathname })))
        }}
      >
        {/* Honeypot: hidden from people, tempting for bots */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set('website', e.target.value)} className="hidden" aria-hidden />

        {props.enquiryType === 'any' && (
          <label className="block text-sm sm:col-span-2">
            <span className="mb-1 block font-medium">{t('enquiryOccasion')}</span>
            <select className={input} value={form.type} onChange={(e) => set('type', e.target.value)}>
              {OCCASIONS.map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </label>
        )}
        <Field label={t('fullName')} error={err('name')}>
          <input className={cn(input, err('name') && 'border-danger')} required autoComplete="name" value={form.name} onChange={(e) => set('name', e.target.value)} />
        </Field>
        {props.showCompany && (
          <Field label={t('enquiryCompany')}>
            <input className={input} autoComplete="organization" value={form.company} onChange={(e) => set('company', e.target.value)} />
          </Field>
        )}
        <Field label={t('phoneLabel')} error={err('phone')}>
          <input
            className={cn(input, err('phone') && 'border-danger')}
            type="tel"
            inputMode="numeric"
            maxLength={10}
            autoComplete="tel-national"
            value={form.phone}
            onChange={(e) => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
          />
        </Field>
        <Field label={t('emailLabel')} error={err('email')}>
          <input className={cn(input, err('email') && 'border-danger')} type="email" autoComplete="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
        </Field>
        {props.showQuantity && (
          <Field label={t('enquiryQuantity')}>
            <input className={input} type="number" min={1} value={form.quantity} onChange={(e) => set('quantity', e.target.value)} />
          </Field>
        )}
        {props.showBudget && (
          <Field label={t('enquiryBudget')}>
            <input className={input} type="number" min={0} value={form.budget} onChange={(e) => set('budget', e.target.value)} />
          </Field>
        )}
        {props.showDate && (
          <Field label={t('enquiryDate')}>
            <input className={input} type="date" value={form.eventDate} onChange={(e) => set('eventDate', e.target.value)} />
          </Field>
        )}
        <label className="block text-sm sm:col-span-2">
          <span className="mb-1 block font-medium">{t('enquiryMessage')}</span>
          <textarea className={input} rows={4} maxLength={2000} value={form.message} onChange={(e) => set('message', e.target.value)} />
        </label>
        {result && !result.ok && <p className="text-sm text-danger sm:col-span-2">{result.message}</p>}
        <div className="sm:col-span-2">
          <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={pending}>
            {pending ? '…' : t('enquirySubmit')}
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
    </label>
  )
}
