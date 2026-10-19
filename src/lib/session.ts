import crypto from 'crypto'
import { cookies } from 'next/headers'
import { cache } from 'react'

import { getPayloadClient } from './payload'
import { safeEqual } from './razorpay'
import type { Customer } from './types'

/**
 * Shopper sessions: a signed, HTTP-only cookie holding the customer id.
 * (Admin staff use Payload's own auth — completely separate.)
 */

export const SESSION_COOKIE = 'rbs_session'
const SESSION_DAYS = 30

const secret = () => process.env.PAYLOAD_SECRET || 'local-dev-secret'
const sign = (body: string) => crypto.createHmac('sha256', secret()).update(body).digest('base64url')

export function signToken(data: Record<string, unknown>, ttlSeconds: number) {
  const body = Buffer.from(JSON.stringify({ ...data, exp: Math.floor(Date.now() / 1000) + ttlSeconds })).toString('base64url')
  return `${body}.${sign(body)}`
}

export function verifyToken<T extends Record<string, unknown>>(token?: string | null): T | null {
  if (!token || !token.includes('.')) return null
  const [body, sig] = token.split('.')
  if (!body || !sig || !safeEqual(sign(body), sig)) return null
  try {
    const data = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as T & { exp?: number }
    if (!data.exp || data.exp < Math.floor(Date.now() / 1000)) return null
    return data
  } catch {
    return null
  }
}

const cookieOptions = (maxAge: number) => ({
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge,
})

export async function setCustomerSession(customerId: string | number) {
  const jar = await cookies()
  const ttl = SESSION_DAYS * 24 * 60 * 60
  jar.set(SESSION_COOKIE, signToken({ cid: String(customerId), kind: 'session' }, ttl), cookieOptions(ttl))
}

export async function clearCustomerSession() {
  const jar = await cookies()
  jar.set(SESSION_COOKIE, '', cookieOptions(0))
}

/** The logged-in shopper, or null. Deduped per request. */
export const getCustomer = cache(async (): Promise<Customer | null> => {
  const jar = await cookies()
  const session = verifyToken<{ cid: string; kind: string }>(jar.get(SESSION_COOKIE)?.value)
  if (!session || session.kind !== 'session') return null
  try {
    const payload = await getPayloadClient()
    return (await payload.findByID({ collection: 'customers', id: session.cid, depth: 0 })) as unknown as Customer
  } catch {
    return null
  }
})
