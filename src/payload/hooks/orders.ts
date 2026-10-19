import type { CollectionAfterChangeHook, CollectionBeforeChangeHook } from 'payload'

import { notifyOrder } from '../../lib/notify'
import { CONFIRMED_STATUSES, RELEASE_STOCK_STATUSES, STATUS_EVENT, type OrderStatus } from '../../lib/order-status'
import { adjustStock } from '../../lib/orders'
import { refundPayment } from '../../lib/razorpay'
import { createShipment } from '../../lib/shiprocket'
import type { Order } from '../../lib/types'
import { relId } from '../../lib/utils'

/** Appends every status change to the order's history (who, when, optional note). */
export const recordStatusHistory: CollectionBeforeChangeHook = ({ data, originalDoc, operation, req, context }) => {
  const prev = originalDoc?.status as string | undefined
  const next = (data.status as string | undefined) ?? prev
  if (operation === 'create' || (next && next !== prev)) {
    const history = (data.statusHistory ?? originalDoc?.statusHistory ?? []) as unknown[]
    data.statusHistory = [
      ...history,
      {
        status: next,
        note: (data.statusNote as string) || (context?.statusNote as string) || '',
        by: (req.user as { email?: string } | null)?.email ?? (context?.actor as string) ?? 'system',
        at: new Date().toISOString(),
      },
    ]
  }
  if (next === 'refunded') data.paymentStatus = 'refunded'
  if (next === 'delivered' && (data.paymentMethod ?? originalDoc?.paymentMethod) === 'cod') data.paymentStatus = 'paid'
  data.statusNote = ''
  return data
}

/** Side effects of entering a new status: stock release, coupon usage, refunds, notifications. */
export const handleStatusChange: CollectionAfterChangeHook = async ({ doc, previousDoc, operation, req, context }) => {
  if (context?.internal) return doc
  const order = doc as unknown as Order
  const prev = (operation === 'create' ? null : (previousDoc?.status as OrderStatus | undefined)) ?? null
  const status = order.status as OrderStatus
  if (status === prev) return doc
  const { payload } = req

  if (RELEASE_STOCK_STATUSES.includes(status) && order.stockReserved && !order.stockReleased) {
    await adjustStock(payload, order.items, 1, req)
    await payload.update({ collection: 'orders', id: order.id, data: { stockReleased: true } as never, req, context: { internal: true } })
  }

  if (CONFIRMED_STATUSES.includes(status) && !(prev && CONFIRMED_STATUSES.includes(prev)) && order.couponCode) {
    const res = await payload.find({ collection: 'coupons', where: { code: { equals: order.couponCode } }, limit: 1, depth: 0, req })
    const coupon = res.docs[0] as { id: string | number; usageCount?: number } | undefined
    if (coupon) {
      await payload.update({ collection: 'coupons', id: coupon.id, data: { usageCount: (coupon.usageCount ?? 0) + 1 } as never, req })
    }
  }

  if (status === 'refunded' && order.paymentMethod === 'razorpay' && order.razorpayPaymentId && !order.refundId) {
    try {
      const refundId = await refundPayment(order.razorpayPaymentId)
      await payload.update({ collection: 'orders', id: order.id, data: { refundId } as never, req, context: { internal: true } })
    } catch (err) {
      payload.logger.error({ err }, `Refund failed for order ${order.orderNumber}`)
    }
  }

  // Pan-India orders: create a courier shipment once packed.
  if (status === 'packed' && !order.awb) {
    try {
      const settings = (await payload.findGlobal({ slug: 'site-settings', depth: 0, req })) as unknown as { autoCreateShipment?: boolean }
      const zoneId = relId(order.deliveryZone)
      const zone = zoneId !== null ? ((await payload.findByID({ collection: 'delivery-zones', id: zoneId, depth: 0, req })) as unknown as { kind?: string }) : null
      if (settings?.autoCreateShipment !== false && zone?.kind === 'panIndia') {
        const shipment = await createShipment(payload, order)
        await payload.update({ collection: 'orders', id: order.id, data: shipment as never, req, context: { internal: true } })
        order.awb = shipment.awb
        order.trackingUrl = shipment.trackingUrl
      }
    } catch (err) {
      payload.logger.error({ err }, `Shipment creation failed for ${order.orderNumber}`)
    }
  }

  const event = STATUS_EVENT[status]
  if (event) {
    try {
      await notifyOrder(payload, order, event)
    } catch (err) {
      payload.logger.error({ err }, `Notification failed for order ${order.orderNumber}`)
    }
  }
  return doc
}
