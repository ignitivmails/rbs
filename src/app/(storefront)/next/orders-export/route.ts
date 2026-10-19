import type { Where } from 'payload'

import { statusInfo } from '@/lib/order-status'
import { getPayloadClient } from '@/lib/payload'
import type { Order } from '@/lib/types'

const cell = (v: unknown) => {
  const s = String(v ?? '')
  // Quote everything; neutralise spreadsheet formulas (CSV injection).
  return `"${(/^[=+\-@]/.test(s) ? `'${s}` : s).replace(/"/g, '""')}"`
}

/**
 * Orders as CSV for staff (owner / order manager).
 *   /next/orders-export?from=2026-10-01&to=2026-10-31&status=paid
 */
export async function GET(request: Request) {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: request.headers })
  const role = (user as { role?: string } | null)?.role
  if (!user || (role !== 'owner' && role !== 'orderManager')) return new Response('Not allowed', { status: 403 })

  const params = new URL(request.url).searchParams
  const and: Where[] = []
  if (params.get('status')) and.push({ status: { equals: params.get('status') } })
  if (params.get('from')) and.push({ createdAt: { greater_than_equal: new Date(params.get('from')!).toISOString() } })
  if (params.get('to')) and.push({ createdAt: { less_than: new Date(new Date(params.get('to')!).getTime() + 86_400_000).toISOString() } })

  const { docs } = await payload.find({ collection: 'orders', where: and.length ? { and } : {}, sort: '-createdAt', limit: 10_000, depth: 0 })
  const header = [
    'Order', 'Date', 'Status', 'Customer', 'Phone', 'Email', 'City', 'Pincode', 'Zone', 'Delivery', 'Items',
    'Subtotal', 'Qty discount', 'Coupon', 'Coupon discount', 'Shipping', 'Total', 'Payment', 'Payment status', 'Razorpay payment', 'AWB',
  ]
  const rows = (docs as unknown as Order[]).map((o) => [
    o.orderNumber,
    o.createdAt ? new Date(o.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : '',
    statusInfo(o.status).label,
    o.customerName,
    o.phone,
    o.email,
    o.address?.city,
    o.address?.pincode,
    o.zoneName,
    o.deliveryLabel,
    (o.items ?? []).map((i) => `${i.qty}× ${i.productName}${i.variantLabel ? ` (${i.variantLabel})` : ''}`).join('; '),
    o.subtotal,
    o.quantityDiscount ?? 0,
    o.couponCode,
    o.discount ?? 0,
    o.shipping ?? 0,
    o.total,
    o.paymentMethod === 'cod' ? 'COD' : 'Online',
    o.paymentStatus,
    o.razorpayPaymentId,
    o.awb,
  ])
  const csv = '﻿' + [header, ...rows].map((r) => r.map(cell).join(',')).join('\r\n')
  const date = new Date().toISOString().slice(0, 10)
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="orders-${date}.csv"`,
      'Cache-Control': 'no-store',
    },
  })
}
