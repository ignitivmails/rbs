import crypto from 'crypto'
import type { Payload } from 'payload'

import { sendSms } from './notify'

const OTP_TTL_MIN = 10
const MAX_PER_HOUR = 5
const RESEND_SECONDS = 30
const MAX_ATTEMPTS = 5

/** Normalises Indian mobile numbers to 10 digits; returns null if invalid. */
export function normalizePhone(raw: string): string | null {
  const digits = String(raw ?? '').replace(/\D/g, '')
  const ten = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits.length === 11 && digits.startsWith('0') ? digits.slice(1) : digits
  return /^[6-9]\d{9}$/.test(ten) ? ten : null
}

const hashCode = (phone: string, code: string) =>
  crypto.createHash('sha256').update(`${code}:${phone}:${process.env.PAYLOAD_SECRET ?? ''}`).digest('hex')

export type IssueResult = { ok: true; devCode?: string } | { ok: false; error: string }

export async function issueOtp(payload: Payload, phone: string, purpose: string): Promise<IssueResult> {
  const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const recent = await payload.find({
    collection: 'otp-codes',
    where: { and: [{ phone: { equals: phone } }, { createdAt: { greater_than: hourAgo } }] },
    sort: '-createdAt',
    limit: MAX_PER_HOUR,
    depth: 0,
  })
  if (recent.totalDocs >= MAX_PER_HOUR) return { ok: false, error: 'Too many OTP requests. Please try again in an hour.' }
  // Resend gap applies per purpose (a COD code shouldn't block a login code).
  const last = (recent.docs as Array<{ createdAt?: string; purpose?: string }>).find((d) => d.purpose === purpose)
  if (last?.createdAt && Date.now() - new Date(last.createdAt).getTime() < RESEND_SECONDS * 1000) {
    return { ok: false, error: `Please wait ${RESEND_SECONDS} seconds before requesting another OTP.` }
  }

  const code = String(crypto.randomInt(100000, 1000000))
  await payload.create({
    collection: 'otp-codes',
    data: {
      phone,
      purpose,
      codeHash: hashCode(phone, code),
      expiresAt: new Date(Date.now() + OTP_TTL_MIN * 60 * 1000).toISOString(),
      attempts: 0,
      used: false,
    } as never,
  })
  await sendSms(payload, phone, `${code} is your Real Bengal Sweets verification code. It expires in ${OTP_TTL_MIN} minutes.`)
  // Local testing convenience: surface the code in the UI when no SMS gateway exists.
  return process.env.NODE_ENV === 'production' ? { ok: true } : { ok: true, devCode: code }
}

export async function verifyOtp(payload: Payload, phone: string, purpose: string, code: string): Promise<boolean> {
  const res = await payload.find({
    collection: 'otp-codes',
    where: {
      and: [
        { phone: { equals: phone } },
        { purpose: { equals: purpose } },
        { used: { not_equals: true } },
        { expiresAt: { greater_than: new Date().toISOString() } },
      ],
    },
    sort: '-createdAt',
    limit: 1,
    depth: 0,
  })
  const otp = res.docs[0] as { id: string | number; codeHash: string; attempts?: number } | undefined
  if (!otp || (otp.attempts ?? 0) >= MAX_ATTEMPTS) return false
  const ok = otp.codeHash === hashCode(phone, String(code ?? '').trim())
  await payload.update({
    collection: 'otp-codes',
    id: otp.id,
    data: (ok ? { used: true } : { attempts: (otp.attempts ?? 0) + 1 }) as never,
  })
  return ok
}
