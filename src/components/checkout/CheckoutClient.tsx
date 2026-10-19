'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState, useTransition, type ReactNode } from 'react'

import { useCart, useHydrated } from '@/components/cart/store'
import { Icon } from '@/components/Icon'
import { startNavigationProgress } from '@/components/NavigationProgress'
import { Spinner } from '@/components/Spinner'
import { useStore } from '@/components/StoreProvider'
import type { Quote } from '@/lib/checkout'
import { trackBeginCheckout } from '@/lib/analytics'
import { placeOrderAction, quoteAction, sendOtpAction, type PaymentStart } from '@/lib/checkout-actions'
import { INDIAN_STATES } from '@/lib/constants'
import type { CustomerAddress } from '@/lib/types'
import { cn, formatPrice } from '@/lib/utils'

export type CheckoutAccount = {
  name: string
  email: string
  phone: string
  phoneVerified: boolean
  addresses: CustomerAddress[]
}

import { MockPaymentDialog, openRazorpay } from './payment'

type Form = {
  name: string
  phone: string
  email: string
  line1: string
  line2: string
  landmark: string
  city: string
  state: string
  pincode: string
  date: string
  slot: string
  isGift: boolean
  giftMessage: string
  hidePrices: boolean
  notes: string
}

const EMPTY: Form = {
  name: '',
  phone: '',
  email: '',
  line1: '',
  line2: '',
  landmark: '',
  city: '',
  state: '',
  pincode: '',
  date: '',
  slot: '',
  isGift: false,
  giftMessage: '',
  hidePrices: false,
  notes: '',
}

const SAVED_KEY = 'rbs-checkout-details'
const SAVED_FIELDS: Array<keyof Form> = ['name', 'phone', 'email', 'line1', 'line2', 'landmark', 'city', 'state', 'pincode']

export function CheckoutClient({ giftOptions, account }: { giftOptions: boolean; account: CheckoutAccount | null }) {
  const { t, currency } = useStore()
  const router = useRouter()
  const hydrated = useHydrated()
  const items = useCart((s) => s.items)
  const removeItem = useCart((s) => s.remove)
  const storedPincode = useCart((s) => s.pincode)
  const savePincode = useCart((s) => s.setPincode)

  const [form, setForm] = useState<Form>(EMPTY)
  const [quote, setQuote] = useState<Quote | null>(null)
  const [quoting, setQuoting] = useState(false)
  const [couponInput, setCouponInput] = useState('')
  const [coupon, setCoupon] = useState('')
  const [method, setMethod] = useState<'razorpay' | 'cod'>('razorpay')
  const [otp, setOtp] = useState('')
  const [otpInfo, setOtpInfo] = useState<{ ok: boolean; message: string; devCode?: string } | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [placing, startPlacing] = useTransition()
  const [mock, setMock] = useState<{ amount: number; orderNumber: string; token: string } | null>(null)
  const [addressId, setAddressId] = useState<string>('new')
  const [saveAddress, setSaveAddress] = useState(true)
  const requestId = useRef(0)

  const applyAddress = (a: CustomerAddress) =>
    setForm((f) => ({
      ...f,
      line1: a.line1,
      line2: a.line2 ?? '',
      landmark: a.landmark ?? '',
      city: a.city,
      state: a.state,
      pincode: a.pincode,
      name: f.name || a.name || '',
    }))

  const fmt = (n: number) => formatPrice(n, currency)
  const set = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => {
      if (!e[key]) return e
      const next = { ...e }
      delete next[key]
      return next
    })
  }

  // Restore saved contact/address details (per device).
  useEffect(() => {
    if (!hydrated) return
    let saved: Partial<Form> = {}
    try {
      saved = JSON.parse(localStorage.getItem(SAVED_KEY) || '{}')
    } catch {
      /* ignore */
    }
    setForm((f) => ({ ...f, ...saved, pincode: saved.pincode || storedPincode || f.pincode }))
    if (account) {
      // Account details win over device-saved ones.
      setForm((f) => ({ ...f, name: account.name || f.name, email: account.email || f.email, phone: account.phone || f.phone }))
      const preferred = account.addresses.find((a) => a.isDefault) ?? account.addresses[0]
      if (preferred?.id) {
        setAddressId(preferred.id)
        applyAddress(preferred)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated])

  const cartItems = useMemo(() => items.map((i) => ({ productId: i.productId, variantId: i.variantId, qty: i.qty, box: i.box ?? null })), [items])

  // Analytics: begin_checkout once per visit to the page.
  const trackedCheckout = useRef(false)
  useEffect(() => {
    if (!hydrated || trackedCheckout.current || !items.length) return
    trackedCheckout.current = true
    trackBeginCheckout(
      items.map((i) => ({ id: String(i.productId), name: i.name, price: i.price, qty: i.qty, variant: i.variantLabel })),
      items.reduce((n, i) => n + i.price * i.qty, 0),
    )
  }, [hydrated, items])
  const itemsKey = JSON.stringify(cartItems)
  const quotePincode = /^\d{6}$/.test(form.pincode) ? form.pincode : ''

  // Server quote — debounced, last request wins.
  useEffect(() => {
    if (!hydrated) return
    const id = ++requestId.current
    setQuoting(true)
    const timer = setTimeout(async () => {
      const q = await quoteAction({ items: cartItems, pincode: quotePincode, couponCode: coupon })
      if (id !== requestId.current) return
      setQuote(q)
      setQuoting(false)
      if (quotePincode && q.pincode.status === 'ok') savePincode(quotePincode)
    }, 300)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, itemsKey, quotePincode, coupon])

  // Keep delivery choice & payment method valid for the latest quote.
  useEffect(() => {
    if (!quote) return
    if (quote.delivery.mode === 'choose') {
      const dates = quote.delivery.dates.map((d) => d.value)
      const slots = quote.delivery.slots
      setForm((f) => ({ ...f, date: dates.includes(f.date) ? f.date : dates[0] ?? '', slot: slots.includes(f.slot) ? f.slot : slots[0] ?? '' }))
    }
    if (method === 'razorpay' && !quote.payment.razorpay && quote.payment.cod) setMethod('cod')
    if (method === 'cod' && !quote.payment.cod && quote.payment.razorpay) setMethod('razorpay')
  }, [quote, method])

  if (!hydrated) return <div className="h-96 animate-pulse rounded-theme bg-ink/5" />

  if (!items.length) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <Icon name="bag" size={48} className="text-muted" />
        <p className="text-lg">{t('cartEmpty')}</p>
        <Link href="/shop" className="btn btn-primary">
          {t('continueShopping')}
        </Link>
      </div>
    )
  }

  const go = (url: string) => {
    startNavigationProgress()
    router.push(url)
  }

  const handlers = (order: { orderNumber: string; token: string }) => ({
    onPaid: () => go(`/order/${order.orderNumber}?t=${order.token}&placed=1`),
    onAbandon: (message?: string) => {
      setMock(null)
      go(`/order/${order.orderNumber}?t=${order.token}${message ? '&failed=1' : ''}`)
    },
  })

  const startPayment = (payment: PaymentStart, order: { orderNumber: string; token: string }) => {
    if (payment.mode === 'cod') return go(`/order/${order.orderNumber}?t=${order.token}&placed=1`)
    if (payment.mode === 'mock') return setMock({ amount: payment.amount, ...order })
    void openRazorpay(payment, order, handlers(order))
  }

  const submit = () =>
    startPlacing(async () => {
      const result = await placeOrderAction({
        items: cartItems,
        contact: { name: form.name, phone: form.phone, email: form.email },
        address: { line1: form.line1, line2: form.line2, landmark: form.landmark, city: form.city, state: form.state, pincode: form.pincode },
        delivery: { date: form.date, slot: form.slot },
        gift: { isGift: form.isGift, message: form.giftMessage, hidePrices: form.hidePrices },
        notes: form.notes,
        couponCode: coupon,
        paymentMethod: method,
        otp,
        saveAddress: Boolean(account) && addressId === 'new' && saveAddress,
      })
      if (!result.ok) {
        setErrors(result.errors)
        if (result.quote) setQuote(result.quote)
        const first = Object.keys(result.errors)[0]
        document.getElementById(`field-${first}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        return
      }
      try {
        localStorage.setItem(SAVED_KEY, JSON.stringify(Object.fromEntries(SAVED_FIELDS.map((k) => [k, form[k]]))))
      } catch {
        /* ignore */
      }
      startPayment(result.payment, { orderNumber: result.orderNumber, token: result.token })
    })

  const canPlace = Boolean(quote) && !quoting && !placing && quote!.errors.length === 0
  const phoneAlreadyVerified = Boolean(account?.phoneVerified && account.phone && account.phone === form.phone)
  const needsOtp = Boolean(quote?.payment.codRequiresOtp) && !phoneAlreadyVerified
  const lineIssues = (quote?.lines ?? []).filter((l) => l.issue)
  const savings = quote ? quote.mrpTotal - quote.subtotal + quote.quantityDiscount + quote.discount : 0
  const summaryLines: Array<{
    key: string
    name: string
    variantLabel: string
    image: string | null
    qty: number
    lineTotal: number
    issue: string | null
    qtyDiscount?: number
    qtyDiscountLabel?: string
    qtyNext?: { count: number; label: string } | null
  }> =
    quote?.lines ??
    items.map((i) => ({ key: i.key, name: i.name, variantLabel: i.variantLabel, image: i.image ?? null, qty: i.qty, lineTotal: i.price * i.qty, issue: null }))

  return (
    <>
      <form
        className="grid gap-8 lg:grid-cols-[1fr_400px]"
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
        noValidate
      >
        <div className="space-y-6">
          {!account && (
            <Link
              href="/account?returnTo=/checkout"
              className="flex items-center gap-2 rounded-theme border border-line bg-surface px-4 py-3 text-sm hover:border-primary"
            >
              <Icon name="user" size={18} className="text-primary" />
              {t('loginForFasterCheckout')} →
            </Link>
          )}
          <Section n={1} title={t('contactDetails')}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="name" label={t('fullName')} error={errors.name} className="sm:col-span-2">
                <input id="field-name" autoComplete="name" required value={form.name} onChange={(e) => set('name', e.target.value)} className={inputCls(errors.name)} />
              </Field>
              <Field id="phone" label={t('phoneLabel')} error={errors.phone}>
                <div className="flex">
                  <span className="flex items-center rounded-l-theme border border-r-0 border-line bg-page px-3 text-sm text-muted">+91</span>
                  <input
                    id="field-phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    required
                    maxLength={10}
                    value={form.phone}
                    onChange={(e) => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className={cn(inputCls(errors.phone), 'rounded-l-none')}
                  />
                </div>
              </Field>
              <Field id="email" label={t('emailLabel')} error={errors.email}>
                <input id="field-email" type="email" autoComplete="email" value={form.email} onChange={(e) => set('email', e.target.value)} className={inputCls(errors.email)} />
              </Field>
            </div>
          </Section>

          <Section n={2} title={t('shippingAddress')}>
            {account && account.addresses.length > 0 && (
              <fieldset className="mb-5">
                <legend className="mb-2 text-sm font-medium">{t('savedAddressesPick')}</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {account.addresses.map((a) => (
                    <label
                      key={a.id}
                      className={cn(
                        'flex cursor-pointer gap-2 rounded-theme border p-3 text-sm',
                        addressId === a.id ? 'border-primary bg-primary/5' : 'border-line bg-surface',
                      )}
                    >
                      <input
                        type="radio"
                        name="saved-address"
                        className="mt-1 accent-[var(--rbs-primary)]"
                        checked={addressId === a.id}
                        onChange={() => {
                          setAddressId(a.id ?? 'new')
                          applyAddress(a)
                        }}
                      />
                      <span>
                        <strong className="block">{a.label || a.name || a.city}</strong>
                        <span className="text-muted">
                          {a.line1}, {a.city} {a.pincode}
                        </span>
                      </span>
                    </label>
                  ))}
                  <label
                    className={cn(
                      'flex cursor-pointer items-center gap-2 rounded-theme border p-3 text-sm',
                      addressId === 'new' ? 'border-primary bg-primary/5' : 'border-line bg-surface',
                    )}
                  >
                    <input
                      type="radio"
                      name="saved-address"
                      className="accent-[var(--rbs-primary)]"
                      checked={addressId === 'new'}
                      onChange={() => {
                        setAddressId('new')
                        setForm((f) => ({ ...f, line1: '', line2: '', landmark: '', city: '', state: '', pincode: '' }))
                      }}
                    />
                    <Icon name="plus" size={16} /> {t('newAddress')}
                  </label>
                </div>
              </fieldset>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="line1" label={t('addressLine1')} error={errors.line1} className="sm:col-span-2">
                <input id="field-line1" autoComplete="address-line1" required value={form.line1} onChange={(e) => set('line1', e.target.value)} className={inputCls(errors.line1)} />
              </Field>
              <Field id="line2" label={t('addressLine2')} className="sm:col-span-2">
                <input id="field-line2" autoComplete="address-line2" value={form.line2} onChange={(e) => set('line2', e.target.value)} className={inputCls()} />
              </Field>
              <Field id="landmark" label={t('landmark')}>
                <input id="field-landmark" value={form.landmark} onChange={(e) => set('landmark', e.target.value)} className={inputCls()} />
              </Field>
              <Field id="pincode" label={t('pincode')} error={errors.pincode || (quote && form.pincode.length === 6 && quote.pincode.status !== 'ok' ? quote.pincode.message : undefined)}>
                <input
                  id="field-pincode"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  required
                  maxLength={6}
                  value={form.pincode}
                  onChange={(e) => set('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className={inputCls(errors.pincode)}
                />
              </Field>
              <Field id="city" label={t('city')} error={errors.city}>
                <input id="field-city" autoComplete="address-level2" required value={form.city} onChange={(e) => set('city', e.target.value)} className={inputCls(errors.city)} />
              </Field>
              <Field id="state" label={t('state')} error={errors.state}>
                <select id="field-state" autoComplete="address-level1" required value={form.state} onChange={(e) => set('state', e.target.value)} className={inputCls(errors.state)}>
                  <option value="">—</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            {account && addressId === 'new' && (
              <label className="mt-4 flex items-center gap-2 text-sm">
                <input type="checkbox" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} className="size-4 accent-[var(--rbs-primary)]" />
                {t('saveAddressToAccount')}
              </label>
            )}
          </Section>

          <Section n={3} title={t('deliverySchedule')}>
            {!quote || quote.delivery.mode === 'none' ? (
              <p className="text-sm text-muted">{t('enterPincodeFirst')}</p>
            ) : quote.delivery.mode === 'estimate' ? (
              <p className="flex items-center gap-2 text-sm">
                <Icon name="truck" size={18} className="text-primary" />
                {t('estimatedDelivery', { date: quote.delivery.label })} · {quote.zone?.name}
              </p>
            ) : (
              <div className="space-y-4">
                <Field id="date" label={t('deliveryDate')} error={errors.date}>
                  <div id="field-date" className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
                    {quote.delivery.dates.map((d) => (
                      <button
                        key={d.value}
                        type="button"
                        aria-pressed={form.date === d.value}
                        onClick={() => set('date', d.value)}
                        className={cn(
                          'shrink-0 rounded-theme border px-4 py-2 text-sm capitalize',
                          form.date === d.value ? 'border-primary bg-primary text-primary-fg' : 'border-line bg-surface hover:border-primary',
                        )}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field id="slot" label={t('deliverySlot')} error={errors.slot}>
                  <div id="field-slot" className="flex flex-wrap gap-2">
                    {quote.delivery.slots.map((s) => (
                      <button
                        key={s}
                        type="button"
                        aria-pressed={form.slot === s}
                        onClick={() => set('slot', s)}
                        className={cn(
                          'rounded-theme border px-4 py-2 text-sm',
                          form.slot === s ? 'border-primary bg-primary/5 font-semibold text-primary' : 'border-line bg-surface hover:border-primary',
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
            )}

            {giftOptions && (
              <div className="mt-6 space-y-3 border-t border-line pt-5">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input type="checkbox" checked={form.isGift} onChange={(e) => set('isGift', e.target.checked)} className="size-4 accent-[var(--rbs-primary)]" />
                  🎁 {t('giftOption')}
                </label>
                {form.isGift && (
                  <>
                    <Field id="giftMessage" label={t('giftMessage')}>
                      <textarea id="field-giftMessage" rows={3} maxLength={300} value={form.giftMessage} onChange={(e) => set('giftMessage', e.target.value)} className={inputCls()} />
                    </Field>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={form.hidePrices} onChange={(e) => set('hidePrices', e.target.checked)} className="size-4 accent-[var(--rbs-primary)]" />
                      {t('hidePrices')}
                    </label>
                  </>
                )}
              </div>
            )}
            <div className="mt-5">
              <Field id="notes" label={t('orderNotes')}>
                <textarea id="field-notes" rows={2} maxLength={500} value={form.notes} onChange={(e) => set('notes', e.target.value)} className={inputCls()} />
              </Field>
            </div>
          </Section>

          <Section n={4} title={t('paymentMethod')}>
            <div id="field-payment" className="space-y-3">
              <PaymentOption
                checked={method === 'razorpay'}
                disabled={!quote?.payment.razorpay}
                onSelect={() => setMethod('razorpay')}
                title={t('payOnline')}
                note={quote?.payment.razorpayMode === 'mock' ? 'Test mode — payments are simulated (no Razorpay keys configured).' : undefined}
              />
              <PaymentOption
                checked={method === 'cod'}
                disabled={!quote?.payment.cod}
                onSelect={() => setMethod('cod')}
                title={t('payCod')}
                note={quote && !quote.payment.cod ? (quote.payment.codReason ?? t('codUnavailable')) : undefined}
              />
              {errors.payment && <p className="text-sm text-danger">{errors.payment}</p>}

              {method === 'cod' && quote?.payment.cod && needsOtp && (
                <div className="rounded-theme border border-line bg-page p-4">
                  <p className="mb-3 text-sm">{t('otpRequired')}</p>
                  <div className="flex flex-wrap items-start gap-2">
                    <input
                      id="field-otp"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      placeholder={t('otpLabel')}
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
                        setErrors(({ otp: _o, ...rest }) => rest)
                      }}
                      className={cn(inputCls(errors.otp), 'w-44 tracking-[0.3em]')}
                    />
                    <OtpButton phone={form.phone} label={otpInfo?.ok ? t('otpResend') : t('otpSend')} onResult={setOtpInfo} />
                  </div>
                  {otpInfo && <p className={cn('mt-2 text-sm', otpInfo.ok ? 'text-success' : 'text-danger')}>{otpInfo.message}</p>}
                  {otpInfo?.devCode && (
                    <p className="mt-1 text-xs text-muted">
                      Local test mode — your code is <strong className="tracking-widest text-ink">{otpInfo.devCode}</strong> (also printed in the terminal).
                    </p>
                  )}
                  {errors.otp && <p className="mt-2 text-sm text-danger">{errors.otp}</p>}
                </div>
              )}
            </div>
          </Section>
        </div>

        {/* Summary */}
        <aside className="h-fit space-y-4 lg:sticky lg:top-28">
          <div className="card card-border p-5">
            <h2 className="mb-4 flex items-center justify-between gap-2 text-xl">
              {t('orderSummary')}
              {quoting && <Spinner size={18} className="text-primary" label="Updating totals" />}
            </h2>
            <ul className="divide-y divide-line">
              {summaryLines.map((l) => (
                <li key={l.key} className="flex gap-3 py-3">
                  <span className="relative size-14 shrink-0 overflow-hidden rounded-theme bg-ink/5">
                    {l.image && <Image src={l.image} alt="" fill sizes="56px" className="object-cover" />}
                    <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-ink text-[11px] text-page">{l.qty}</span>
                  </span>
                  <div className="min-w-0 flex-1 text-sm">
                    <p className="font-medium leading-snug">{l.name}</p>
                    <p className="text-xs text-muted">{l.variantLabel}</p>
                    {l.qtyDiscount ? <p className="text-xs font-medium text-success">{t('qtyApplied', { off: l.qtyDiscountLabel ?? '' })}</p> : null}
                    {l.qtyNext ? <p className="text-xs text-accent">{t('qtyNextHint', { count: l.qtyNext.count, off: l.qtyNext.label })}</p> : null}
                    {l.issue && (
                      <p className="mt-1 text-xs text-danger">
                        {l.issue}{' '}
                        <button type="button" className="underline" onClick={() => removeItem(l.key)}>
                          {t('remove')}
                        </button>
                      </p>
                    )}
                  </div>
                  <span className={cn('text-sm font-medium', l.issue && 'text-muted line-through')}>{fmt(l.lineTotal)}</span>
                </li>
              ))}
            </ul>

            {/* Coupon */}
            <div className="mt-4 border-t border-line pt-4">
              {coupon && quote?.coupon?.valid ? (
                <div className="flex items-center justify-between rounded-theme bg-success/10 px-3 py-2 text-sm">
                  <span>
                    <strong>{coupon}</strong> — {quote.coupon.message}
                  </span>
                  <button
                    type="button"
                    className="text-xs underline"
                    onClick={() => {
                      setCoupon('')
                      setCouponInput('')
                    }}
                  >
                    {t('couponRemove')}
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <input
                      aria-label={t('couponLabel')}
                      placeholder={t('couponLabel')}
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className={cn(inputCls(), 'uppercase')}
                    />
                    <button type="button" className="btn btn-outline btn-sm" disabled={!couponInput.trim()} onClick={() => setCoupon(couponInput.trim())}>
                      {t('couponApply')}
                    </button>
                  </div>
                  {coupon && quote?.coupon && !quote.coupon.valid && (
                    <p className="mt-2 text-xs text-danger">
                      {quote.coupon.message}{' '}
                      <button type="button" className="underline" onClick={() => setCoupon('')}>
                        {t('couponRemove')}
                      </button>
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Totals */}
            <dl className={cn('mt-4 space-y-2 border-t border-line pt-4 text-sm', quoting && 'opacity-60')}>
              <Row label={t('subtotal')} value={fmt(quote?.subtotal ?? 0)} />
              {(quote?.quantityDiscount ?? 0) > 0 && <Row label={t('quantityDiscount')} value={`− ${fmt(quote!.quantityDiscount)}`} className="text-success" />}
              {(quote?.discount ?? 0) > 0 && <Row label={t('discount')} value={`− ${fmt(quote!.discount)}`} className="text-success" />}
              <Row
                label={t('shippingFee')}
                value={!quote?.zone ? '—' : quote.shipping === 0 ? t('free') : fmt(quote.shipping)}
              />
              {quote?.freeShippingGap && quote.freeShippingGap > 0 ? (
                <p className="text-xs text-muted">{t('freeShippingHint', { amount: fmt(quote.freeShippingGap) })}</p>
              ) : null}
              <div className="flex justify-between border-t border-line pt-3 text-base font-semibold">
                <dt>{t('total')}</dt>
                <dd>{fmt(quote?.total ?? 0)}</dd>
              </div>
              {savings > 0 && (
                <p className="text-xs text-success">
                  {t('youSave')} {fmt(savings)}
                </p>
              )}
              <p className="text-xs text-muted">{t('taxNote')}</p>
            </dl>

            {(errors.form || lineIssues.length > 0) && (
              <p className="mt-4 rounded-theme bg-danger/10 px-3 py-2 text-sm text-danger">{errors.form || t('itemsNeedAttention')}</p>
            )}

            <button type="submit" disabled={!canPlace} className="btn btn-primary mt-5 w-full py-3.5 text-base">
              {placing && <Spinner size={18} />}
              {placing ? t('placingOrder') : method === 'razorpay' ? t('payNow', { amount: fmt(quote?.total ?? 0) }) : t('placeOrder')}
            </button>
            {quote && quote.errors.length > 0 && !errors.form && lineIssues.length === 0 && (
              <p className="mt-2 text-center text-xs text-muted">{quote.errors[0]}</p>
            )}
          </div>
          <p className="flex items-center justify-center gap-2 text-xs text-muted">
            <Icon name="check" size={14} /> Secure checkout · Prices recalculated on our server
          </p>
        </aside>
      </form>

      {mock && (
        <MockPaymentDialog amount={mock.amount} order={{ orderNumber: mock.orderNumber, token: mock.token }} handlers={handlers(mock)} />
      )}
    </>
  )
}

/* ------------------------------------------------------------------ */

const inputCls = (error?: string) =>
  cn(
    'w-full rounded-theme border bg-surface px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary',
    error ? 'border-danger' : 'border-line',
  )

function Section({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section className="card card-border p-5 md:p-6">
      <h2 className="mb-5 flex items-center gap-3 text-xl">
        <span className="flex size-7 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-fg" style={{ fontFamily: 'var(--rbs-font-body)' }}>
          {n}
        </span>
        {title}
      </h2>
      {children}
    </section>
  )
}

function Field({ id, label, error, className, children }: { id: string; label: string; error?: string; className?: string; children: ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={`field-${id}`} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  )
}

function Row({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={cn('flex justify-between', className)}>
      <dt className="text-muted">{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

function PaymentOption({ checked, disabled, onSelect, title, note }: { checked: boolean; disabled?: boolean; onSelect: () => void; title: string; note?: string }) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-start gap-3 rounded-theme border p-4 transition-colors',
        checked ? 'border-primary bg-primary/5' : 'border-line bg-surface',
        disabled && 'cursor-not-allowed opacity-60',
      )}
    >
      <input type="radio" name="payment" checked={checked} disabled={disabled} onChange={onSelect} className="mt-0.5 size-4 accent-[var(--rbs-primary)]" />
      <span>
        <span className="block text-sm font-medium">{title}</span>
        {note && <span className="mt-0.5 block text-xs text-muted">{note}</span>}
      </span>
    </label>
  )
}

function OtpButton({ phone, label, onResult }: { phone: string; label: string; onResult: (r: { ok: boolean; message: string; devCode?: string }) => void }) {
  const [pending, start] = useTransition()
  return (
    <button
      type="button"
      className="btn btn-outline btn-sm py-2.5"
      disabled={pending || phone.length !== 10}
      onClick={() => start(async () => onResult(await sendOtpAction(phone)))}
    >
      {pending && <Spinner size={14} />}
      {label}
    </button>
  )
}
