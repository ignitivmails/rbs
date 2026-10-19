'use server'

import crypto from 'crypto'
import type { Payload } from 'payload'

import { buildQuote, type CheckoutItemInput, type Quote } from './checkout'
import { sanitizeAddress } from './customers'
import { getCustomer } from './session'
import { getSite } from './data'
import { formatDeliveryDate } from './delivery'
import { adjustStock, cancelExpiredOrders, findOrderForCustomer, markOrderPaid } from './orders'
import { issueOtp, normalizePhone, verifyOtp } from './otp'
import { getPayloadClient } from './payload'
import { createRazorpayOrder, razorpayKeyId, razorpayMode, verifyPaymentSignature } from './razorpay'
import type { Customer, Order, SettingsData } from './types'

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

export type PlaceOrderInput = {
  items: CheckoutItemInput[]
  contact: { name: string; phone: string; email?: string }
  address: { line1: string; line2?: string; landmark?: string; city: string; state: string; pincode: string }
  delivery: { date?: string; slot?: string }
  gift: { isGift: boolean; message?: string; hidePrices?: boolean }
  notes?: string
  couponCode?: string
  paymentMethod: 'razorpay' | 'cod'
  otp?: string
  /** Logged-in shoppers: add this address to their address book. */
  saveAddress?: boolean
}

export type PaymentStart =
  | { mode: 'cod' }
  | { mode: 'mock'; amount: number }
  | {
      mode: 'razorpay'
      keyId: string
      razorpayOrderId: string
      amount: number
      name: string
      description: string
      color: string
      prefill: { name: string; email?: string; contact: string }
      /** Show a "Pay using UPI" block first in Razorpay Checkout. */
      upiFirst: boolean
    }

export type PlaceOrderResult =
  | { ok: false; errors: Record<string, string>; quote?: Quote }
  | { ok: true; orderNumber: string; token: string; payment: PaymentStart }

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const clean = (v: unknown, max: number) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, max)

async function context() {
  const [site, payload] = await Promise.all([getSite(), getPayloadClient()])
  return { site, payload, settings: site.settings, strings: site.strings }
}

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
async function newOrderNumber(payload: Payload, prefix: string) {
  const ymd = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: '2-digit', month: '2-digit', day: '2-digit' })
    .format(new Date())
    .replace(/-/g, '')
  for (let i = 0; i < 6; i++) {
    const suffix = Array.from(crypto.randomBytes(4), (b) => ALPHABET[b % ALPHABET.length]).join('')
    const candidate = `${prefix}-${ymd}-${suffix}`
    const exists = await payload.count({ collection: 'orders', where: { orderNumber: { equals: candidate } } })
    if (!exists.totalDocs) return candidate
  }
  return `${prefix}-${ymd}-${Date.now().toString(36).toUpperCase()}`
}

/** Fills in missing profile details and (optionally) saves the delivery address. */
async function updateAccountAfterOrder(
  payload: Payload,
  customer: Customer,
  info: { name: string; email: string; phone: string; phoneVerified: boolean; address: Record<string, string>; saveAddress: boolean },
) {
  const data: Record<string, unknown> = {}
  if (!customer.name) data.name = info.name
  if (!customer.email && info.email) {
    const taken = await payload.count({ collection: 'customers', where: { email: { equals: info.email } } })
    if (!taken.totalDocs) data.email = info.email
  }
  if (!customer.phone) {
    const taken = await payload.count({ collection: 'customers', where: { phone: { equals: info.phone } } })
    if (!taken.totalDocs) Object.assign(data, { phone: info.phone, phoneVerified: info.phoneVerified })
  }
  if (info.saveAddress) {
    const address = sanitizeAddress({ ...info.address, name: info.name, phone: info.phone })
    const list = customer.addresses ?? []
    const duplicate = list.some((a) => a.line1 === address?.line1 && a.pincode === address?.pincode)
    if (address && !duplicate && list.length < 10) data.addresses = [...list, { ...address, isDefault: list.length === 0 }]
  }
  if (Object.keys(data).length) await payload.update({ collection: 'customers', id: customer.id, data: data as never })
}

async function paymentStartFor(payload: Payload, order: Order, settings: SettingsData, color: string): Promise<PaymentStart> {
  if (order.paymentMethod === 'cod') return { mode: 'cod' }
  if (razorpayMode() === 'mock') return { mode: 'mock', amount: order.total }
  const rz = await createRazorpayOrder({ amountRupees: order.total, receipt: order.orderNumber, notes: { orderNumber: order.orderNumber } })
  await payload.update({ collection: 'orders', id: order.id, data: { razorpayOrderId: rz.id } as never, context: { internal: true } })
  return {
    mode: 'razorpay',
    keyId: razorpayKeyId(),
    razorpayOrderId: rz.id,
    amount: rz.amount,
    name: settings.siteName || 'Real Bengal Sweets',
    description: `Order ${order.orderNumber}`,
    color,
    prefill: { name: order.customerName, email: order.email ?? undefined, contact: order.phone },
    upiFirst: settings.upiFirst !== false,
  }
}

/* ------------------------------------------------------------------ */
/* Actions                                                            */
/* ------------------------------------------------------------------ */

export async function quoteAction(input: { items: CheckoutItemInput[]; pincode?: string; couponCode?: string }): Promise<Quote> {
  const { payload, settings, strings } = await context()
  return buildQuote({ payload, settings, strings }, input)
}

export async function sendOtpAction(phoneRaw: string): Promise<{ ok: boolean; message: string; devCode?: string }> {
  const { payload, site } = await context()
  const phone = normalizePhone(phoneRaw)
  if (!phone) return { ok: false, message: 'Enter a valid 10-digit mobile number first.' }
  const result = await issueOtp(payload, phone, 'cod')
  if (!result.ok) return { ok: false, message: result.error }
  return { ok: true, message: site.t('otpSent', { phone: `+91 ${phone}` }), devCode: result.devCode }
}

export async function placeOrderAction(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  const { payload, settings, strings, site } = await context()
  await cancelExpiredOrders(payload)
  const customer = await getCustomer()

  const errors: Record<string, string> = {}
  const name = clean(input.contact?.name, 80)
  const phone = normalizePhone(input.contact?.phone ?? '')
  const email = clean(input.contact?.email, 120).toLowerCase()
  const address = {
    line1: clean(input.address?.line1, 160),
    line2: clean(input.address?.line2, 160),
    landmark: clean(input.address?.landmark, 120),
    city: clean(input.address?.city, 60),
    state: clean(input.address?.state, 60),
    pincode: clean(input.address?.pincode, 6),
  }
  if (name.length < 2) errors.name = 'Please enter your full name.'
  if (!phone) errors.phone = 'Enter a valid 10-digit mobile number.'
  if (email && !EMAIL_RE.test(email)) errors.email = 'Enter a valid email address.'
  if (address.line1.length < 3) errors.line1 = 'Please enter your flat / house and building.'
  if (address.city.length < 2) errors.city = 'Please enter your city.'
  if (address.state.length < 2) errors.state = 'Please choose your state.'

  const quote = await buildQuote({ payload, settings, strings }, { items: input.items, pincode: address.pincode, couponCode: input.couponCode })
  if (quote.pincode.status !== 'ok') errors.pincode = quote.pincode.message
  const blocking = quote.errors.filter((e) => e !== quote.pincode.message)
  if (blocking.length) errors.form = blocking[0]

  let deliveryDate: string | undefined
  let deliveryLabel = ''
  let deliverySlot: string | undefined
  if (quote.delivery.mode === 'choose') {
    const choice = quote.delivery.dates.find((d) => d.value === input.delivery?.date)
    if (!choice) errors.date = 'Please choose a delivery date.'
    if (!input.delivery?.slot || !quote.delivery.slots.includes(input.delivery.slot)) errors.slot = 'Please choose a time slot.'
    deliveryDate = choice?.value
    deliverySlot = input.delivery?.slot
    deliveryLabel = choice ? `${formatDeliveryDate(choice.value)}${deliverySlot ? `, ${deliverySlot}` : ''}` : ''
  } else if (quote.delivery.mode === 'estimate') {
    deliveryDate = quote.delivery.date
    deliveryLabel = `by ${quote.delivery.label}`
  }

  const method = input.paymentMethod === 'cod' ? 'cod' : 'razorpay'
  // A phone already verified at login doesn't need another OTP.
  const phoneTrusted = Boolean(customer?.phoneVerified && customer.phone && customer.phone === phone)
  const needsOtp = method === 'cod' && quote.payment.codRequiresOtp && !phoneTrusted
  if (method === 'razorpay' && !quote.payment.razorpay) errors.payment = 'Online payment is not available right now.'
  if (method === 'cod' && !quote.payment.cod) errors.payment = quote.payment.codReason ?? site.t('codUnavailable')
  if (needsOtp && !/^\d{6}$/.test(String(input.otp ?? '').trim())) errors.otp = site.t('otpRequired')

  if (Object.keys(errors).length) return { ok: false, errors, quote }

  if (needsOtp && !(await verifyOtp(payload, phone!, 'cod', String(input.otp)))) {
    return { ok: false, errors: { otp: 'That OTP is incorrect or has expired. Request a new one.' }, quote }
  }
  const phoneVerifiedNow = needsOtp || phoneTrusted

  const giftOn = settings.giftOptions !== false && Boolean(input.gift?.isGift)
  const orderNumber = await newOrderNumber(payload, clean(settings.orderPrefix || 'RBS', 8).toUpperCase())
  const accessToken = crypto.randomBytes(16).toString('hex')
  const windowMinutes = Math.max(5, settings.paymentWindowMinutes ?? 30)

  const created = (await payload.create({
    collection: 'orders',
    data: {
      orderNumber,
      status: method === 'cod' ? 'confirmed_cod' : 'pending_payment',
      customer: customer?.id,
      customerName: name,
      phone: phone!,
      email: email || undefined,
      address,
      deliveryZone: quote.zone?.id,
      zoneName: quote.zone?.name,
      deliveryDate,
      deliveryLabel,
      deliverySlot,
      isGift: giftOn,
      giftMessage: giftOn ? clean(input.gift?.message, 300) : undefined,
      hidePrices: giftOn && Boolean(input.gift?.hidePrices),
      notes: clean(input.notes, 500) || undefined,
      items: quote.lines.map((l) => ({
        kind: l.kind,
        product: l.kind === 'product' ? l.productId : undefined,
        productName: l.name,
        variantId: l.variantId,
        variantLabel: l.variantLabel,
        sku: l.sku ?? undefined,
        unitPrice: l.unitPrice,
        mrp: l.mrp ?? undefined,
        qty: l.qty,
        lineTotal: l.lineTotal,
        lineDiscount: l.qtyDiscount || undefined,
        boxContents: l.boxContents ?? undefined,
      })),
      subtotal: quote.subtotal,
      mrpTotal: quote.mrpTotal,
      quantityDiscount: quote.quantityDiscount,
      discount: quote.discount,
      shipping: quote.shipping,
      total: quote.total,
      couponCode: quote.coupon?.valid ? quote.coupon.code : undefined,
      paymentMethod: method,
      paymentStatus: 'pending',
      expiresAt: method === 'razorpay' ? new Date(Date.now() + windowMinutes * 60 * 1000).toISOString() : undefined,
      accessToken,
    } as never,
    context: { statusNote: method === 'cod' ? 'Cash on Delivery order placed (phone verified)' : 'Order placed — awaiting online payment', actor: 'customer' },
  })) as unknown as Order

  await adjustStock(payload, created.items, -1)
  await payload.update({ collection: 'orders', id: created.id, data: { stockReserved: true } as never, context: { internal: true } })

  if (customer) {
    try {
      await updateAccountAfterOrder(payload, customer, { name, email, phone: phone!, phoneVerified: phoneVerifiedNow, address, saveAddress: Boolean(input.saveAddress) })
    } catch (err) {
      payload.logger.error({ err }, `Could not update account after order ${orderNumber}`)
    }
  }

  try {
    const payment = await paymentStartFor(payload, created, settings, site.theme.primary)
    return { ok: true, orderNumber, token: accessToken, payment }
  } catch (err) {
    payload.logger.error({ err }, `Could not start payment for ${orderNumber}`)
    await payload.update({
      collection: 'orders',
      id: created.id,
      data: { status: 'cancelled', paymentStatus: 'failed' } as never,
      context: { statusNote: 'Payment gateway error', actor: 'system' },
    })
    return { ok: false, errors: { payment: 'We couldn’t reach the payment gateway. Please try again in a moment.' } }
  }
}

export async function verifyRazorpayAction(input: {
  orderNumber: string
  token: string
  razorpayOrderId: string
  razorpayPaymentId: string
  razorpaySignature: string
}): Promise<{ ok: boolean; message?: string }> {
  const payload = await getPayloadClient()
  const order = await findOrderForCustomer(payload, input.orderNumber, input.token)
  if (!order || order.razorpayOrderId !== input.razorpayOrderId) return { ok: false, message: 'Order not found.' }
  if (!verifyPaymentSignature(input.razorpayOrderId, input.razorpayPaymentId, input.razorpaySignature)) {
    return { ok: false, message: 'Payment could not be verified.' }
  }
  await markOrderPaid(payload, order, input.razorpayPaymentId, 'checkout')
  return { ok: true }
}

/** Local-only payment simulator, used when no Razorpay keys are configured. */
export async function mockPaymentAction(orderNumber: string, token: string, success: boolean): Promise<{ ok: boolean; message?: string }> {
  if (razorpayMode() !== 'mock') return { ok: false, message: 'Test payments are disabled.' }
  const payload = await getPayloadClient()
  const order = await findOrderForCustomer(payload, orderNumber, token)
  if (!order || order.status !== 'pending_payment') return { ok: false, message: 'This order is not awaiting payment.' }
  if (!success) return { ok: false, message: 'Simulated payment failure.' }
  await markOrderPaid(payload, order, `mock_pay_${Date.now()}`, 'test payment simulator')
  return { ok: true }
}

export async function resumePaymentAction(orderNumber: string, token: string): Promise<{ ok: boolean; payment?: PaymentStart; message?: string }> {
  const { payload, settings, site } = await context()
  await cancelExpiredOrders(payload)
  const order = await findOrderForCustomer(payload, orderNumber, token)
  if (!order || order.status !== 'pending_payment') return { ok: false, message: 'This order is no longer awaiting payment.' }
  try {
    return { ok: true, payment: await paymentStartFor(payload, order, settings, site.theme.primary) }
  } catch {
    return { ok: false, message: 'We couldn’t reach the payment gateway. Please try again.' }
  }
}
