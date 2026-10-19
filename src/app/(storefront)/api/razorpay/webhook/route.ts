import { markOrderPaid } from '@/lib/orders'
import { getPayloadClient } from '@/lib/payload'
import { verifyWebhookSignature } from '@/lib/razorpay'
import type { Order } from '@/lib/types'

/**
 * Razorpay webhook — the source of truth for payments (FLOW.md §4).
 * Configure in the Razorpay dashboard: URL https://<your-domain>/api/razorpay/webhook,
 * events "payment.captured" and "order.paid", secret = RAZORPAY_WEBHOOK_SECRET.
 * Locally, expose it with a tunnel (e.g. ngrok) to test.
 */
export async function POST(request: Request) {
  const raw = await request.text()
  if (!verifyWebhookSignature(raw, request.headers.get('x-razorpay-signature') ?? '')) {
    return new Response('Invalid signature', { status: 401 })
  }

  let event: { event?: string; payload?: { payment?: { entity?: { id?: string; order_id?: string } } } }
  try {
    event = JSON.parse(raw)
  } catch {
    return new Response('Bad JSON', { status: 400 })
  }

  if (event.event === 'payment.captured' || event.event === 'order.paid') {
    const payment = event.payload?.payment?.entity
    if (payment?.order_id && payment.id) {
      const payload = await getPayloadClient()
      const res = await payload.find({ collection: 'orders', where: { razorpayOrderId: { equals: payment.order_id } }, limit: 1, depth: 0 })
      const order = res.docs[0] as unknown as Order | undefined
      if (order) await markOrderPaid(payload, order, payment.id, 'webhook')
    }
  }
  return Response.json({ ok: true })
}
