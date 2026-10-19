import type { Payload } from 'payload'

import type { Order, SettingsData, Variant } from './types'
import { relId } from './utils'

/**
 * Shiprocket integration for pan-India orders.
 * Needs SHIPROCKET_EMAIL + SHIPROCKET_PASSWORD (an API user) and SHIPROCKET_PICKUP (pickup location name).
 * Without credentials, a clearly-marked test AWB is generated so the flow can be tried locally.
 */

const API = 'https://apiv2.shiprocket.in/v1/external'
let cachedToken: { value: string; expires: number } | null = null

export const shiprocketConfigured = () => Boolean(process.env.SHIPROCKET_EMAIL && process.env.SHIPROCKET_PASSWORD)

async function token() {
  if (cachedToken && cachedToken.expires > Date.now()) return cachedToken.value
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: process.env.SHIPROCKET_EMAIL, password: process.env.SHIPROCKET_PASSWORD }),
  })
  if (!res.ok) throw new Error(`Shiprocket login failed (${res.status})`)
  const data = (await res.json()) as { token: string }
  cachedToken = { value: data.token, expires: Date.now() + 8 * 24 * 60 * 60 * 1000 } // tokens last ~10 days
  return data.token
}

async function api<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await token()}` },
    body: JSON.stringify(body),
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`Shiprocket ${path} failed (${res.status}): ${text.slice(0, 300)}`)
  return JSON.parse(text) as T
}

async function orderWeightKg(payload: Payload, order: Order, settings: SettingsData & Record<string, unknown>) {
  let grams = Number(settings.packagingWeight ?? 150)
  for (const item of order.items ?? []) {
    try {
      const product = (await payload.findByID({ collection: 'products', id: relId(item.product)!, depth: 0 })) as unknown as { variants?: Variant[] }
      const v = product.variants?.find((x) => x.id === item.variantId)
      grams += (v?.weight ?? 250) * item.qty
    } catch {
      grams += 250 * item.qty
    }
  }
  return Math.max(0.1, Math.round(grams) / 1000)
}

export type Shipment = { carrier: string; awb: string; trackingUrl: string }

export async function createShipment(payload: Payload, order: Order): Promise<Shipment> {
  if (!shiprocketConfigured()) {
    const awb = `TEST${Date.now().toString().slice(-9)}`
    payload.logger.info(`[Shiprocket test mode] Created test shipment ${awb} for ${order.orderNumber}`)
    return { carrier: 'Shiprocket (test mode)', awb, trackingUrl: `https://shiprocket.co/tracking/${awb}` }
  }

  const settings = (await payload.findGlobal({ slug: 'site-settings', depth: 0 })) as unknown as SettingsData & Record<string, unknown>
  const [first, ...rest] = (order.customerName || 'Customer').split(' ')
  const a = order.address ?? {}
  const created = await api<{ shipment_id: number; order_id: number }>('/orders/create/adhoc', {
    order_id: order.orderNumber,
    order_date: new Date(order.createdAt ?? Date.now()).toISOString().slice(0, 16).replace('T', ' '),
    pickup_location: process.env.SHIPROCKET_PICKUP || 'Primary',
    billing_customer_name: first,
    billing_last_name: rest.join(' ') || '.',
    billing_address: [a.line1, a.line2].filter(Boolean).join(', '),
    billing_address_2: a.landmark || '',
    billing_city: a.city,
    billing_pincode: a.pincode,
    billing_state: a.state,
    billing_country: 'India',
    billing_email: order.email || 'orders@example.com',
    billing_phone: order.phone,
    shipping_is_billing: true,
    order_items: (order.items ?? []).map((i) => ({
      name: `${i.productName} (${i.variantLabel ?? ''})`.slice(0, 100),
      sku: i.sku || `${relId(i.product)}-${i.variantId}`,
      units: i.qty,
      selling_price: i.unitPrice,
    })),
    payment_method: order.paymentMethod === 'cod' ? 'COD' : 'Prepaid',
    shipping_charges: order.shipping ?? 0,
    total_discount: order.discount ?? 0,
    sub_total: order.subtotal,
    length: Number(settings.packageLength ?? 20),
    breadth: Number(settings.packageBreadth ?? 15),
    height: Number(settings.packageHeight ?? 10),
    weight: await orderWeightKg(payload, order, settings),
  })

  const assigned = await api<{ response?: { data?: { awb_code?: string; courier_name?: string } } }>('/courier/assign/awb', {
    shipment_id: created.shipment_id,
  })
  const awb = assigned.response?.data?.awb_code
  if (!awb) throw new Error('Shiprocket did not return an AWB — assign a courier in the Shiprocket dashboard.')
  return {
    carrier: assigned.response?.data?.courier_name || 'Shiprocket',
    awb,
    trackingUrl: `https://shiprocket.co/tracking/${awb}`,
  }
}
