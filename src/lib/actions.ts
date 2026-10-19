'use server'

import { cookies } from 'next/headers'

import { getDeliveryZones, getSite } from './data'
import { estimateDelivery, findZone, formatDeliveryDate, PINCODE_RE } from './delivery'
import { getPayloadClient } from './payload'
import type { ID } from './types'
import { relId } from './utils'

export type PincodeResult = {
  status: 'invalid' | 'unserviceable' | 'restricted' | 'ok'
  message: string
  codMessage?: string
  zoneName?: string
}

/** Checks whether a pincode is serviceable, optionally for a specific product, and estimates delivery. */
export async function checkPincodeAction(pincode: string, productId?: ID): Promise<PincodeResult> {
  const { t } = await getSite()
  const pin = String(pincode ?? '').trim()
  if (!PINCODE_RE.test(pin)) return { status: 'invalid', message: t('pincodeInvalid') }

  const zones = await getDeliveryZones()
  const zone = findZone(zones, pin)
  if (!zone) return { status: 'unserviceable', message: t('pincodeUnserviceable', { pincode: pin }) }

  if (productId !== undefined && productId !== null && productId !== '') {
    try {
      const payload = await getPayloadClient()
      const product = await payload.findByID({ collection: 'products', id: productId, depth: 0 })
      const allowed = ((product as { deliveryZones?: unknown[] }).deliveryZones ?? []).map((z) => String(relId(z)))
      if (allowed.length && !allowed.includes(String(zone.id))) {
        const names = zones
          .filter((z) => allowed.includes(String(z.id)))
          .map((z) => z.name)
          .join(', ')
        return { status: 'restricted', message: t('pincodeRestricted', { zones: names || 'select cities' }), zoneName: zone.name }
      }
    } catch {
      // Unknown product — fall through to a zone-level answer.
    }
  }

  const date = formatDeliveryDate(estimateDelivery(zone))
  return {
    status: 'ok',
    message: t('pincodeOk', { pincode: pin, date, zone: zone.name }),
    codMessage: zone.codAllowed ? t('pincodeCod') : undefined,
    zoneName: zone.name,
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function subscribeAction(email: string, source = 'website'): Promise<{ ok: boolean; message: string }> {
  const { t } = await getSite()
  const value = String(email ?? '').trim().toLowerCase()
  if (!EMAIL_RE.test(value) || value.length > 200) return { ok: false, message: t('newsletterInvalid') }
  const payload = await getPayloadClient()
  const existing = await payload.find({ collection: 'subscribers', where: { email: { equals: value } }, limit: 1, depth: 0 })
  if (!existing.totalDocs) {
    await payload.create({ collection: 'subscribers', data: { email: value, source: String(source).slice(0, 100) } })
  }
  return { ok: true, message: t('newsletterSuccess') }
}

export async function setLocaleAction(locale: 'en' | 'bn') {
  const jar = await cookies()
  jar.set('locale', locale === 'bn' ? 'bn' : 'en', { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' })
}
