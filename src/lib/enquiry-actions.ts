'use server'

import { headers } from 'next/headers'

import { getSite } from './data'
import { sendSms } from './notify'
import { normalizePhone } from './otp'
import { getPayloadClient } from './payload'

export type EnquiryInput = {
  type: string
  name: string
  phone?: string
  email?: string
  company?: string
  quantity?: string | number
  budget?: string | number
  eventDate?: string
  message?: string
  source?: string
  /** Honeypot — real visitors never fill this. */
  website?: string
}

const TYPES = ['corporate', 'wedding', 'celebration', 'baby', 'custom']
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const clean = (v: unknown, max: number) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, max)
const attempts = new Map<string, { count: number; reset: number }>()

export async function submitEnquiryAction(input: EnquiryInput): Promise<{ ok: boolean; message: string; errors?: Record<string, string> }> {
  const { t, settings } = await getSite()
  if (input.website) return { ok: true, message: t('enquirySuccess') } // silently drop bots

  // Light rate limit: 5 enquiries per 10 minutes per IP.
  const h = await headers()
  const ip = (h.get('x-forwarded-for') ?? h.get('x-real-ip') ?? 'local').split(',')[0].trim()
  const now = Date.now()
  const entry = attempts.get(ip)
  if (entry && entry.reset > now && entry.count >= 5) return { ok: false, message: 'Too many enquiries — please try again in a few minutes.' }
  attempts.set(ip, entry && entry.reset > now ? { ...entry, count: entry.count + 1 } : { count: 1, reset: now + 10 * 60 * 1000 })

  const errors: Record<string, string> = {}
  const name = clean(input.name, 80)
  const phone = input.phone ? normalizePhone(input.phone) : null
  const email = clean(input.email, 120).toLowerCase()
  if (name.length < 2) errors.name = 'Please enter your name.'
  if (input.phone && !phone) errors.phone = 'Enter a valid 10-digit mobile number.'
  if (email && !EMAIL_RE.test(email)) errors.email = 'Enter a valid email address.'
  if (!phone && !email) errors.phone = t('enquiryContactRequired')
  const quantity = Number(input.quantity) || undefined
  const budget = Number(input.budget) || undefined
  const eventDate = input.eventDate && !Number.isNaN(Date.parse(input.eventDate)) ? new Date(input.eventDate).toISOString() : undefined
  if (Object.keys(errors).length) return { ok: false, message: Object.values(errors)[0], errors }

  const payload = await getPayloadClient()
  const type = TYPES.includes(input.type) ? input.type : 'corporate'
  const doc = await payload.create({
    collection: 'enquiries',
    data: {
      type,
      status: 'new',
      name,
      phone: phone ?? undefined,
      email: email || undefined,
      company: clean(input.company, 120) || undefined,
      quantity,
      budget,
      eventDate,
      message: String(input.message ?? '').trim().slice(0, 2000) || undefined,
      source: clean(input.source, 200) || undefined,
    } as never,
  })

  // Alert the team + acknowledge the customer (console locally; Resend/MSG91 when configured).
  const siteName = settings.siteName || 'Real Bengal Sweets'
  const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  try {
    const notifications = (await payload.findGlobal({ slug: 'notifications', depth: 0 })) as { adminEmail?: string }
    if (notifications?.adminEmail) {
      await payload.sendEmail({
        to: notifications.adminEmail,
        subject: `New ${type} enquiry from ${name}${quantity ? ` (${quantity} boxes)` : ''}`,
        html: `<p><strong>${name}</strong> ${clean(input.company, 120)}<br>${phone ? `+91 ${phone}` : ''} ${email}</p><p>${String(input.message ?? '').slice(0, 2000).replace(/</g, '&lt;')}</p><p><a href="${serverURL}/admin/collections/enquiries/${(doc as { id: string | number }).id}">Open in admin</a></p>`,
      })
    } else {
      payload.logger.info(`[Enquiry] New ${type} enquiry from ${name} — set an alert email in Settings → Notifications`)
    }
    if (email) {
      await payload.sendEmail({
        to: email,
        subject: `We’ve received your enquiry — ${siteName}`,
        html: `<p>Hi ${name.split(' ')[0]},</p><p>${t('enquirySuccess')}</p><p>— ${siteName}</p>`,
      })
    }
    if (phone) await sendSms(payload, phone, `${siteName}: Thanks for your ${type} gifting enquiry! Our team will call you within 24 hours.`)
  } catch (err) {
    payload.logger.error({ err }, 'Enquiry notifications failed')
  }

  return { ok: true, message: t('enquirySuccess') }
}
