import crypto from 'crypto'

/**
 * Minimal Razorpay REST client (no SDK).
 *
 * Mode:
 *  - live     → RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET are set (use rzp_test_… keys locally)
 *  - mock     → no keys and not production: a built-in payment simulator is used
 *  - disabled → no keys in production
 */
export type PaymentMode = 'live' | 'mock' | 'disabled'

const keyId = () => process.env.RAZORPAY_KEY_ID || ''
const keySecret = () => process.env.RAZORPAY_KEY_SECRET || ''

export function razorpayMode(): PaymentMode {
  if (keyId() && keySecret()) return 'live'
  return process.env.NODE_ENV === 'production' ? 'disabled' : 'mock'
}

export const razorpayKeyId = keyId

const authHeader = () => `Basic ${Buffer.from(`${keyId()}:${keySecret()}`).toString('base64')}`

export function safeEqual(a: string, b: string) {
  const ba = Buffer.from(String(a))
  const bb = Buffer.from(String(b))
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb)
}

const hmac = (secret: string, payload: string) => crypto.createHmac('sha256', secret).update(payload).digest('hex')

export async function createRazorpayOrder(input: { amountRupees: number; receipt: string; notes?: Record<string, string> }) {
  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: { Authorization: authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: Math.round(input.amountRupees * 100),
      currency: 'INR',
      receipt: input.receipt.slice(0, 40),
      notes: input.notes,
    }),
  })
  if (!res.ok) throw new Error(`Razorpay order creation failed (${res.status}): ${await res.text()}`)
  return (await res.json()) as { id: string; amount: number; currency: string }
}

/** Signature returned to the browser after checkout: HMAC(order_id|payment_id, key_secret). */
export function verifyPaymentSignature(razorpayOrderId: string, paymentId: string, signature: string) {
  if (!keySecret()) return false
  return safeEqual(hmac(keySecret(), `${razorpayOrderId}|${paymentId}`), signature)
}

/** Webhook signature: HMAC(raw body, webhook secret). */
export function verifyWebhookSignature(rawBody: string, signature: string) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || ''
  if (!secret || !signature) return false
  return safeEqual(hmac(secret, rawBody), signature)
}

export async function refundPayment(paymentId: string, amountRupees?: number): Promise<string> {
  if (razorpayMode() !== 'live') return `mock_refund_${Date.now()}`
  const res = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}/refund`, {
    method: 'POST',
    headers: { Authorization: authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(amountRupees ? { amount: Math.round(amountRupees * 100) } : {}),
  })
  if (!res.ok) throw new Error(`Razorpay refund failed (${res.status}): ${await res.text()}`)
  const data = (await res.json()) as { id: string }
  return data.id
}
