import type { Payload } from 'payload'

import { normalizePhone } from './otp'
import type { Customer, CustomerAddress, ID } from './types'

/** Customer helpers (take the Payload instance; no Next.js imports). */

const clean = (v: unknown, max: number) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, max)

/** Validates and trims an address; returns null if incomplete. */
export function sanitizeAddress(a: Partial<CustomerAddress>): CustomerAddress | null {
  const address: CustomerAddress = {
    label: clean(a.label, 30) || null,
    name: clean(a.name, 80) || null,
    phone: normalizePhone(a.phone ?? '') ?? null,
    line1: clean(a.line1, 160),
    line2: clean(a.line2, 160) || null,
    landmark: clean(a.landmark, 120) || null,
    city: clean(a.city, 60),
    state: clean(a.state, 60),
    pincode: clean(a.pincode, 6),
    isDefault: Boolean(a.isDefault),
  }
  if (address.line1.length < 3 || address.city.length < 2 || address.state.length < 2 || !/^[1-9]\d{5}$/.test(address.pincode)) return null
  return address
}

const providers = (c: Customer | null | undefined, add: string) => Array.from(new Set([...(c?.authProviders ?? []), add]))

export async function findCustomerBy(payload: Payload, field: 'phone' | 'googleId' | 'email', value: string): Promise<Customer | null> {
  if (!value) return null
  const res = await payload.find({ collection: 'customers', where: { [field]: { equals: value } }, limit: 1, depth: 0 })
  return (res.docs[0] as unknown as Customer) ?? null
}

/** Attaches past guest orders placed with this (now verified) phone number to the account. */
export async function claimGuestOrders(payload: Payload, customerId: ID, phone: string) {
  const res = await payload.find({
    collection: 'orders',
    where: { and: [{ phone: { equals: phone } }, { customer: { exists: false } }] },
    limit: 200,
    depth: 0,
  })
  for (const order of res.docs) {
    await payload.update({ collection: 'orders', id: (order as { id: ID }).id, data: { customer: customerId } as never, context: { internal: true } })
  }
  return res.docs.length
}

/**
 * Phone OTP login. If `current` is logged in (e.g. via Google) the verified phone is linked to it;
 * otherwise we log into (or create) the account that owns the phone.
 */
export async function loginWithPhone(payload: Payload, phone: string, opts: { name?: string; current?: Customer | null }) {
  const owner = await findCustomerBy(payload, 'phone', phone)
  const now = new Date().toISOString()

  if (opts.current && (!owner || String(owner.id) === String(opts.current.id))) {
    const updated = (await payload.update({
      collection: 'customers',
      id: opts.current.id,
      data: { phone, phoneVerified: true, authProviders: providers(opts.current, 'phone'), lastLoginAt: now } as never,
    })) as unknown as Customer
    await claimGuestOrders(payload, updated.id, phone)
    return { customer: updated, linked: true }
  }
  if (opts.current && owner) {
    return { error: 'This mobile number is already linked to another account. Log out and sign in with it instead.' as const }
  }

  const customer = owner
    ? ((await payload.update({
        collection: 'customers',
        id: owner.id,
        data: { phoneVerified: true, authProviders: providers(owner, 'phone'), lastLoginAt: now, ...(opts.name && !owner.name ? { name: opts.name } : {}) } as never,
      })) as unknown as Customer)
    : ((await payload.create({
        collection: 'customers',
        data: { phone, phoneVerified: true, name: opts.name || undefined, authProviders: ['phone'], lastLoginAt: now } as never,
      })) as unknown as Customer)
  await claimGuestOrders(payload, customer.id, phone)
  return { customer, linked: false }
}

export type GoogleProfile = { sub: string; email?: string; emailVerified?: boolean; name?: string }

/** Google login / linking. Matches by Google id, then by verified email. */
export async function loginWithGoogle(payload: Payload, profile: GoogleProfile, current?: Customer | null) {
  const byGoogle = await findCustomerBy(payload, 'googleId', profile.sub)
  const now = new Date().toISOString()

  if (current) {
    if (byGoogle && String(byGoogle.id) !== String(current.id)) {
      return { error: 'This Google account is already linked to another account.' as const }
    }
    const updated = (await payload.update({
      collection: 'customers',
      id: current.id,
      data: {
        googleId: profile.sub,
        authProviders: providers(current, 'google'),
        ...(current.email ? {} : { email: profile.email }),
        ...(current.name ? {} : { name: profile.name }),
      } as never,
    })) as unknown as Customer
    return { customer: updated }
  }

  const existing = byGoogle ?? (profile.email && profile.emailVerified ? await findCustomerBy(payload, 'email', profile.email.toLowerCase()) : null)
  const customer = existing
    ? ((await payload.update({
        collection: 'customers',
        id: existing.id,
        data: {
          googleId: profile.sub,
          authProviders: providers(existing, 'google'),
          lastLoginAt: now,
          ...(existing.name ? {} : { name: profile.name }),
        } as never,
      })) as unknown as Customer)
    : ((await payload.create({
        collection: 'customers',
        data: {
          googleId: profile.sub,
          email: profile.email?.toLowerCase(),
          name: profile.name,
          authProviders: ['google'],
          lastLoginAt: now,
        } as never,
      })) as unknown as Customer)
  return { customer }
}
