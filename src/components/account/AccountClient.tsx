'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, useTransition } from 'react'

import { useCart, type CartItem } from '@/components/cart/store'
import { Icon } from '@/components/Icon'
import { useStore } from '@/components/StoreProvider'
import {
  deleteAddressAction,
  getSavedCartAction,
  logoutAction,
  saveAddressAction,
  saveCartAction,
  setDefaultAddressAction,
  updateProfileAction,
} from '@/lib/account-actions'
import { INDIAN_STATES } from '@/lib/constants'
import type { CustomerAddress } from '@/lib/types'
import { cn } from '@/lib/utils'

import { PhoneOtpForm } from './PhoneOtpForm'

const input = 'w-full rounded-theme border border-line bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary'

/* ---------------- Login ---------------- */

export function LoginPanel({ googleEnabled, returnTo, error }: { googleEnabled: boolean; returnTo: string; error?: string }) {
  const { t } = useStore()
  const router = useRouter()
  return (
    <div className="card card-border mx-auto max-w-md p-6 md:p-8">
      <h1 className="text-3xl">{t('loginTitle')}</h1>
      <p className="mt-2 text-sm text-muted">{t('loginSubtitle')}</p>
      {error && <p className="mt-4 rounded-theme bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>}
      <div className="mt-6">
        <PhoneOtpForm
          onSuccess={() => {
            router.replace(returnTo)
            router.refresh()
          }}
        />
      </div>
      {googleEnabled && (
        <>
          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-muted">
            <span className="h-px flex-1 bg-line" />
            {t('orDivider')}
            <span className="h-px flex-1 bg-line" />
          </div>
          <a href={`/api/auth/google?returnTo=${encodeURIComponent(returnTo)}`} className="btn btn-outline w-full">
            <GoogleMark /> {t('continueWithGoogle')}
          </a>
        </>
      )}
    </div>
  )
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.8 6C12.4 13.7 17.7 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
      <path fill="#FBBC05" d="M10.5 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.2.8-4.7l-7.8-6C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.8-6z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.2-13.5-9.9l-7.8 6C6.6 42.6 14.6 48 24 48z" />
    </svg>
  )
}

/* ---------------- Profile ---------------- */

export function ProfileForm({ name, email }: { name: string; email: string }) {
  const { t } = useStore()
  const [form, setForm] = useState({ name, email })
  const [msg, setMsg] = useState<{ ok: boolean; message?: string } | null>(null)
  const [pending, start] = useTransition()
  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault()
        start(async () => setMsg(await updateProfileAction(form)))
      }}
    >
      <label className="block text-sm">
        <span className="mb-1 block font-medium">{t('fullName')}</span>
        <input className={input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium">{t('emailLabel')}</span>
        <input type="email" className={input} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" />
      </label>
      <div className="flex items-center gap-3">
        <button type="submit" className="btn btn-primary btn-sm" disabled={pending}>
          {pending ? '…' : t('saveChanges')}
        </button>
        {msg && <span className={cn('text-sm', msg.ok ? 'text-success' : 'text-danger')}>{msg.ok ? t('saved') : msg.message}</span>}
      </div>
    </form>
  )
}

/* ---------------- Address book ---------------- */

const EMPTY: CustomerAddress = { label: '', name: '', phone: '', line1: '', line2: '', landmark: '', city: '', state: '', pincode: '', isDefault: false }

export function AddressBook({ addresses }: { addresses: CustomerAddress[] }) {
  const { t } = useStore()
  const router = useRouter()
  const [editing, setEditing] = useState<{ id: string | null; value: CustomerAddress } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, start] = useTransition()

  const run = (fn: () => Promise<{ ok: boolean; message?: string }>, after?: () => void) =>
    start(async () => {
      const r = await fn()
      if (!r.ok) return setError(r.message ?? 'Something went wrong.')
      setError(null)
      after?.()
      router.refresh()
    })

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {addresses.map((a) => (
          <div key={a.id} className={cn('rounded-theme border p-4 text-sm', a.isDefault ? 'border-primary' : 'border-line')}>
            <div className="mb-1 flex items-center gap-2">
              <strong>{a.label || a.name || 'Address'}</strong>
              {a.isDefault && <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] text-primary-fg">{t('defaultLabel')}</span>}
            </div>
            <p className="text-muted">
              {[a.name, a.line1, a.line2, a.landmark].filter(Boolean).join(', ')}
              <br />
              {a.city}, {a.state} {a.pincode}
              {a.phone ? <><br />+91 {a.phone}</> : null}
            </p>
            <div className="mt-3 flex flex-wrap gap-3 text-xs font-medium">
              <button type="button" className="text-primary underline" onClick={() => setEditing({ id: a.id ?? null, value: { ...EMPTY, ...a } })}>
                {t('editAddress')}
              </button>
              {!a.isDefault && (
                <button type="button" className="underline" disabled={pending} onClick={() => run(() => setDefaultAddressAction(a.id!))}>
                  {t('makeDefault')}
                </button>
              )}
              <button type="button" className="text-danger underline" disabled={pending} onClick={() => run(() => deleteAddressAction(a.id!))}>
                {t('deleteAddress')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing ? (
        <form
          className="grid gap-3 rounded-theme border border-line bg-page p-4 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault()
            run(() => saveAddressAction(editing.value, editing.id), () => setEditing(null))
          }}
        >
          {(
            [
              ['label', t('addressLabel'), false],
              ['name', t('fullName'), false],
              ['line1', t('addressLine1'), true],
              ['line2', t('addressLine2'), false],
              ['landmark', t('landmark'), false],
              ['city', t('city'), true],
              ['pincode', t('pincode'), true],
              ['phone', t('phoneLabel'), false],
            ] as Array<[keyof CustomerAddress, string, boolean]>
          ).map(([key, label, required]) => (
            <label key={key} className={cn('block text-sm', (key === 'line1' || key === 'line2') && 'sm:col-span-2')}>
              <span className="mb-1 block font-medium">{label}</span>
              <input
                className={input}
                required={required}
                value={String(editing.value[key] ?? '')}
                inputMode={key === 'pincode' || key === 'phone' ? 'numeric' : undefined}
                onChange={(e) => setEditing({ ...editing, value: { ...editing.value, [key]: e.target.value } })}
              />
            </label>
          ))}
          <label className="block text-sm">
            <span className="mb-1 block font-medium">{t('state')}</span>
            <select className={input} required value={editing.value.state} onChange={(e) => setEditing({ ...editing, value: { ...editing.value, state: e.target.value } })}>
              <option value="">—</option>
              {INDIAN_STATES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 self-end pb-3 text-sm">
            <input type="checkbox" checked={Boolean(editing.value.isDefault)} onChange={(e) => setEditing({ ...editing, value: { ...editing.value, isDefault: e.target.checked } })} />
            {t('makeDefault')}
          </label>
          <div className="flex gap-2 sm:col-span-2">
            <button type="submit" className="btn btn-primary btn-sm" disabled={pending}>
              {t('saveAddress')}
            </button>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setEditing(null)}>
              {t('cancel')}
            </button>
          </div>
        </form>
      ) : (
        <button type="button" className="btn btn-outline btn-sm" onClick={() => setEditing({ id: null, value: { ...EMPTY, isDefault: addresses.length === 0 } })}>
          <Icon name="plus" size={16} /> {t('addAddress')}
        </button>
      )}
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  )
}

/* ---------------- Login methods ---------------- */

export function LoginMethods({ phone, phoneVerified, googleLinked, googleEnabled }: { phone?: string | null; phoneVerified: boolean; googleLinked: boolean; googleEnabled: boolean }) {
  const { t } = useStore()
  const router = useRouter()
  const [addingPhone, setAddingPhone] = useState(false)
  return (
    <ul className="space-y-3 text-sm">
      <li className="flex items-start gap-2">
        <Icon name="phone" size={18} className="mt-0.5 shrink-0 text-muted" />
        {phoneVerified && phone ? (
          <span>
            +91 {phone} · <span className="text-success">{t('phoneVerifiedLabel')}</span>
          </span>
        ) : addingPhone ? (
          <div className="w-full max-w-sm">
            <PhoneOtpForm
              askName={false}
              submitLabel={t('verifyAndContinue')}
              onSuccess={() => {
                setAddingPhone(false)
                router.refresh()
              }}
            />
          </div>
        ) : (
          <button type="button" className="text-primary underline" onClick={() => setAddingPhone(true)}>
            {t('addPhone')}
          </button>
        )}
      </li>
      {googleEnabled && (
        <li className="flex items-center gap-2">
          <Icon name="mail" size={18} className="text-muted" />
          {googleLinked ? (
            <span className="text-success">{t('googleLinked')}</span>
          ) : (
            <a href="/api/auth/google?link=1&returnTo=/account" className="text-primary underline">
              {t('linkGoogle')}
            </a>
          )}
        </li>
      )}
    </ul>
  )
}

export function LogoutButton() {
  const { t } = useStore()
  const router = useRouter()
  const clearCart = useCart((s) => s.clear)
  const [pending, start] = useTransition()
  return (
    <button
      type="button"
      className="btn btn-outline btn-sm"
      disabled={pending}
      onClick={() =>
        start(async () => {
          await logoutAction()
          clearCart()
          router.replace('/')
          router.refresh()
        })
      }
    >
      {t('logout')}
    </button>
  )
}

/* ---------------- Cart sync for logged-in shoppers ---------------- */

/** Merges the device cart with the account cart on login, then keeps the account cart updated. */
export function CartSync() {
  const ready = useRef(false)

  useEffect(() => {
    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | undefined

    const init = async () => {
      // Wait for the persisted (device) cart to load first.
      if (!useCart.persist.hasHydrated()) await new Promise<void>((r) => useCart.persist.onFinishHydration(() => r()))
      const saved = (await getSavedCartAction()) as CartItem[] | null
      if (cancelled || !saved) return
      const local = useCart.getState().items
      const merged = local.map((i) => ({ ...i }))
      for (const item of saved) {
        if (!item?.key || typeof item.qty !== 'number') continue
        const existing = merged.find((i) => i.key === item.key)
        if (existing) existing.qty = Math.max(existing.qty, item.qty)
        else merged.push(item)
      }
      useCart.setState({ items: merged })
      ready.current = true
      if (JSON.stringify(merged) !== JSON.stringify(saved)) void saveCartAction(merged)
    }
    void init()

    const unsubscribe = useCart.subscribe((state, prev) => {
      if (!ready.current || state.items === prev.items) return
      clearTimeout(timer)
      timer = setTimeout(() => void saveCartAction(state.items), 800)
    })
    return () => {
      cancelled = true
      clearTimeout(timer)
      unsubscribe()
    }
  }, [])

  return null
}
