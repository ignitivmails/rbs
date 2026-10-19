'use server'

import { revalidatePath } from 'next/cache'

import { loginWithPhone, sanitizeAddress } from './customers'
import { getSite } from './data'
import { findOrderByNumber } from './orders'
import { issueOtp, normalizePhone, verifyOtp } from './otp'
import { getPayloadClient } from './payload'
import { clearCustomerSession, getCustomer, setCustomerSession } from './session'
import type { CustomerAddress } from './types'

type Result = { ok: boolean; message?: string; devCode?: string }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const clean = (v: unknown, max: number) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, max)

/* ---------------- Phone OTP login / linking ---------------- */

export async function sendLoginOtpAction(phoneRaw: string): Promise<Result> {
  const [{ t }, payload] = await Promise.all([getSite(), getPayloadClient()])
  const phone = normalizePhone(phoneRaw)
  if (!phone) return { ok: false, message: 'Enter a valid 10-digit mobile number.' }
  const r = await issueOtp(payload, phone, 'login')
  return r.ok ? { ok: true, message: t('otpSent', { phone: `+91 ${phone}` }), devCode: r.devCode } : { ok: false, message: r.error }
}

export async function verifyLoginOtpAction(phoneRaw: string, code: string, name?: string): Promise<Result> {
  const payload = await getPayloadClient()
  const phone = normalizePhone(phoneRaw)
  if (!phone) return { ok: false, message: 'Enter a valid 10-digit mobile number.' }
  if (!(await verifyOtp(payload, phone, 'login', code))) return { ok: false, message: 'That OTP is incorrect or has expired.' }
  const current = await getCustomer()
  const result = await loginWithPhone(payload, phone, { name: clean(name, 80) || undefined, current })
  if (result.error || !result.customer) return { ok: false, message: result.error ?? 'Could not log in.' }
  await setCustomerSession(result.customer.id)
  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function logoutAction(): Promise<Result> {
  await clearCustomerSession()
  revalidatePath('/', 'layout')
  return { ok: true }
}

/* ---------------- Profile & addresses ---------------- */

async function requireCustomer() {
  const customer = await getCustomer()
  if (!customer) throw new Error('Not logged in')
  return { customer, payload: await getPayloadClient() }
}

export async function updateProfileAction(input: { name: string; email: string }): Promise<Result> {
  const { customer, payload } = await requireCustomer()
  const name = clean(input.name, 80)
  const email = clean(input.email, 120).toLowerCase()
  if (email && !EMAIL_RE.test(email)) return { ok: false, message: 'Enter a valid email address.' }
  try {
    await payload.update({ collection: 'customers', id: customer.id, data: { name, email: email || null } as never })
  } catch {
    return { ok: false, message: 'That email is already used by another account.' }
  }
  revalidatePath('/account')
  return { ok: true }
}

function normaliseDefaults(addresses: CustomerAddress[], preferredId?: string | null) {
  const defaultId = preferredId ?? addresses.find((a) => a.isDefault)?.id ?? addresses[0]?.id
  return addresses.map((a, i) => ({ ...a, isDefault: defaultId ? a.id === defaultId : i === 0 }))
}

export async function saveAddressAction(input: Partial<CustomerAddress>, id?: string | null): Promise<Result> {
  const { customer, payload } = await requireCustomer()
  const address = sanitizeAddress(input)
  if (!address) return { ok: false, message: 'Please complete the address (flat/building, city, state and a valid pincode).' }
  const list = [...(customer.addresses ?? [])]
  const index = id ? list.findIndex((a) => a.id === id) : -1
  if (index >= 0) list[index] = { ...address, id }
  else list.push(address)
  if (list.length > 10) return { ok: false, message: 'You can save up to 10 addresses.' }
  const updated = normaliseDefaults(list, address.isDefault ? (index >= 0 ? id : undefined) : undefined)
  // New default without an id yet: mark the last one.
  if (address.isDefault && index < 0) updated.forEach((a, i) => (a.isDefault = i === updated.length - 1))
  await payload.update({ collection: 'customers', id: customer.id, data: { addresses: updated } as never })
  revalidatePath('/account')
  return { ok: true }
}

export async function deleteAddressAction(id: string): Promise<Result> {
  const { customer, payload } = await requireCustomer()
  const list = (customer.addresses ?? []).filter((a) => a.id !== id)
  await payload.update({ collection: 'customers', id: customer.id, data: { addresses: normaliseDefaults(list) } as never })
  revalidatePath('/account')
  return { ok: true }
}

export async function setDefaultAddressAction(id: string): Promise<Result> {
  const { customer, payload } = await requireCustomer()
  await payload.update({ collection: 'customers', id: customer.id, data: { addresses: normaliseDefaults(customer.addresses ?? [], id) } as never })
  revalidatePath('/account')
  return { ok: true }
}

/* ---------------- Cart sync ---------------- */

export async function getSavedCartAction(): Promise<unknown[] | null> {
  const customer = await getCustomer()
  if (!customer) return null
  return Array.isArray(customer.cart) ? customer.cart : []
}

export async function saveCartAction(items: unknown[]): Promise<Result> {
  const customer = await getCustomer()
  if (!customer) return { ok: false }
  const safe = (Array.isArray(items) ? items : []).slice(0, 40).filter((i) => i && typeof i === 'object')
  if (JSON.stringify(safe).length > 40_000) return { ok: false }
  const payload = await getPayloadClient()
  await payload.update({ collection: 'customers', id: customer.id, data: { cart: safe } as never })
  return { ok: true }
}

/* ---------------- Order tracking (guests) ---------------- */

const trackAttempts = new Map<string, { count: number; reset: number }>()

export async function trackOrderAction(orderNumberRaw: string, phoneRaw: string): Promise<{ ok: boolean; url?: string; message?: string }> {
  const { t } = await getSite()
  const orderNumber = clean(orderNumberRaw, 40).toUpperCase()
  const phone = normalizePhone(phoneRaw)
  if (!orderNumber || !phone) return { ok: false, message: t('trackNotFound') }

  // Light brute-force protection (per order number, in-memory).
  const now = Date.now()
  const entry = trackAttempts.get(orderNumber)
  if (entry && entry.reset > now && entry.count >= 8) return { ok: false, message: 'Too many attempts. Please try again later.' }
  trackAttempts.set(orderNumber, entry && entry.reset > now ? { ...entry, count: entry.count + 1 } : { count: 1, reset: now + 15 * 60 * 1000 })

  const payload = await getPayloadClient()
  const order = await findOrderByNumber(payload, orderNumber)
  if (!order || order.phone !== phone || !order.accessToken) return { ok: false, message: t('trackNotFound') }
  return { ok: true, url: `/order/${order.orderNumber}?t=${order.accessToken}` }
}
