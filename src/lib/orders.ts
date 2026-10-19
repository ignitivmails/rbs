import type { Payload, PayloadRequest } from 'payload'

import { safeEqual } from './razorpay'
import type { ID, Order, OrderItem, Variant } from './types'
import { relId } from './utils'

/**
 * Order helpers shared by Payload hooks, server actions and the Razorpay webhook.
 * They take the Payload instance as an argument (never import the config) so the
 * collection hooks can use them without a circular import.
 */

/** direction -1 reserves stock, +1 returns it. */
export async function adjustStock(payload: Payload, items: OrderItem[] | null | undefined, direction: 1 | -1, req?: PayloadRequest) {
  const byProduct = new Map<string, OrderItem[]>()
  for (const item of items ?? []) {
    const id = relId(item.product)
    if (id === null || !item.variantId) continue
    const key = String(id)
    byProduct.set(key, [...(byProduct.get(key) ?? []), item])
  }

  for (const [productId, lines] of byProduct) {
    try {
      const product = (await payload.findByID({ collection: 'products', id: productId, depth: 0, req })) as unknown as {
        variants?: Variant[]
      }
      const variants = (product.variants ?? []).map((v) => {
        const qty = lines.filter((l) => l.variantId === v.id).reduce((n, l) => n + l.qty, 0)
        return qty ? { ...v, stock: Math.max(0, (v.stock ?? 0) + direction * qty) } : v
      })
      await payload.update({ collection: 'products', id: productId, data: { variants } as never, depth: 0, req })
    } catch (err) {
      payload.logger.error({ err }, `Stock adjustment failed for product ${productId}`)
    }
  }
}

export async function findOrderByNumber(payload: Payload, orderNumber: string): Promise<Order | null> {
  const res = await payload.find({ collection: 'orders', where: { orderNumber: { equals: orderNumber } }, limit: 1, depth: 1 })
  return (res.docs[0] as unknown as Order) ?? null
}

/** Customer access: order number + secret token from the confirmation link. */
export async function findOrderForCustomer(payload: Payload, orderNumber: string, token?: string | null): Promise<Order | null> {
  if (!orderNumber || !token) return null
  const order = await findOrderByNumber(payload, orderNumber)
  if (!order?.accessToken || !safeEqual(order.accessToken, token)) return null
  return order
}

/** Idempotently marks an online-payment order as paid. */
export async function markOrderPaid(payload: Payload, order: Order, paymentId: string, source: string) {
  if (order.status === 'paid' || order.paymentStatus === 'paid') return order
  if (order.status !== 'pending_payment') {
    // Payment arrived after the order was cancelled (e.g. expired) — record it for a manual refund.
    await payload.update({
      collection: 'orders',
      id: order.id,
      data: {
        paymentStatus: 'paid',
        razorpayPaymentId: paymentId,
        internalNotes: `${order.internalNotes ?? ''}\nPayment ${paymentId} captured after order was ${order.status} — refund or reinstate manually.`.trim(),
      } as never,
      context: { internal: true },
    })
    return order
  }
  const updated = await payload.update({
    collection: 'orders',
    id: order.id,
    data: { status: 'paid', paymentStatus: 'paid', razorpayPaymentId: paymentId, paidAt: new Date().toISOString() } as never,
    context: { statusNote: `Payment received (${source})`, actor: 'system' },
  })
  return updated as unknown as Order
}

/** Cancels online-payment orders that were never paid within the payment window. */
export async function cancelExpiredOrders(payload: Payload) {
  const res = await payload.find({
    collection: 'orders',
    where: { and: [{ status: { equals: 'pending_payment' } }, { expiresAt: { less_than: new Date().toISOString() } }] },
    limit: 25,
    depth: 0,
  })
  for (const doc of res.docs) {
    await payload.update({
      collection: 'orders',
      id: (doc as { id: ID }).id,
      data: { status: 'cancelled', paymentStatus: 'failed' } as never,
      context: { statusNote: 'Payment not completed in time', actor: 'system' },
    })
  }
  return res.docs.length
}
