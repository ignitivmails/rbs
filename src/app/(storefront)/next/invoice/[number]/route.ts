import { statusInfo } from '@/lib/order-status'
import { findOrderByNumber } from '@/lib/orders'
import { getPayloadClient } from '@/lib/payload'
import type { SettingsData } from '@/lib/types'
import { formatPrice } from '@/lib/utils'

const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string)

/** Printable invoice / packing slip for staff (requires an admin session). ?type=slip hides prices. */
export async function GET(request: Request, { params }: { params: Promise<{ number: string }> }) {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: request.headers })
  if (!user) return new Response('Please log in to the admin panel.', { status: 403 })

  const { number } = await params
  const order = await findOrderByNumber(payload, decodeURIComponent(number))
  if (!order) return new Response('Order not found', { status: 404 })

  const settings = (await payload.findGlobal({ slug: 'site-settings', depth: 0 })) as unknown as SettingsData
  const slip = new URL(request.url).searchParams.get('type') === 'slip'
  const showPrices = !slip && !order.hidePrices
  const date = new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeZone: 'Asia/Kolkata' }).format(new Date(order.createdAt ?? Date.now()))
  const a = order.address ?? {}

  const rows = (order.items ?? [])
    .map(
      (i) =>
        `<tr><td>${esc(i.productName)}<div class="muted">${esc(i.kind === 'box' && i.boxContents ? i.boxContents : i.variantLabel)}${i.sku ? ` · ${esc(i.sku)}` : ''}</div></td><td class="r">${i.qty}</td>${
          showPrices ? `<td class="r">${formatPrice(i.unitPrice)}</td><td class="r">${formatPrice(i.lineTotal)}</td>` : ''
        }</tr>`,
    )
    .join('')

  const totals = showPrices
    ? `<table class="totals">
        <tr><td>Subtotal</td><td class="r">${formatPrice(order.subtotal)}</td></tr>
        ${order.quantityDiscount ? `<tr><td>Quantity discount</td><td class="r">− ${formatPrice(order.quantityDiscount)}</td></tr>` : ''}
        ${order.discount ? `<tr><td>Discount${order.couponCode ? ` (${esc(order.couponCode)})` : ''}</td><td class="r">− ${formatPrice(order.discount)}</td></tr>` : ''}
        <tr><td>Delivery</td><td class="r">${order.shipping ? formatPrice(order.shipping) : 'Free'}</td></tr>
        <tr class="grand"><td>Total</td><td class="r">${formatPrice(order.total)}</td></tr>
      </table>
      <p class="muted">Prices are inclusive of GST. ${order.paymentMethod === 'cod' ? 'Payment: Cash on Delivery.' : `Paid online${order.razorpayPaymentId ? ` (ref ${esc(order.razorpayPaymentId)})` : ''}.`}</p>`
    : ''

  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${slip ? 'Packing slip' : 'Invoice'} ${esc(order.orderNumber)}</title>
<style>
  body{font-family:Arial,Helvetica,sans-serif;color:#222;max-width:760px;margin:24px auto;padding:0 20px;font-size:14px}
  h1{font-size:22px;margin:0;color:#8b1e1e} h2{font-size:15px;margin:0 0 6px}
  .head{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #8b1e1e;padding-bottom:12px;margin-bottom:16px}
  .muted{color:#777;font-size:12px} .r{text-align:right}
  .cols{display:flex;gap:32px;margin-bottom:18px} .cols>div{flex:1}
  table{width:100%;border-collapse:collapse} th,td{padding:8px 6px;border-bottom:1px solid #eee;vertical-align:top} th{text-align:left;background:#faf5ee;font-size:12px;text-transform:uppercase}
  .totals{width:280px;margin:12px 0 12px auto} .totals td{border:0;padding:4px 6px} .grand td{font-weight:bold;font-size:16px;border-top:2px solid #222}
  .gift{border:1px dashed #c9962b;padding:12px;margin-top:16px;font-style:italic}
  .print{margin:16px 0;padding:8px 16px} @media print{.print{display:none}}
</style></head><body>
<button class="print" onclick="window.print()">Print</button>
<div class="head">
  <div><h1>${esc(settings.siteName || 'Real Bengal Sweets')}</h1><div class="muted">${esc(settings.address).replace(/\n/g, '<br>')}</div><div class="muted">${esc(settings.phone)} · ${esc(settings.email)}</div></div>
  <div class="r"><h2>${slip ? 'PACKING SLIP' : 'TAX INVOICE'}</h2><div>${esc(order.orderNumber)}</div><div class="muted">${date}</div><div class="muted">Status: ${esc(statusInfo(order.status).label)}</div></div>
</div>
<div class="cols">
  <div><h2>Deliver to</h2>${esc(order.customerName)}<br>${esc(a.line1)}${a.line2 ? `, ${esc(a.line2)}` : ''}${a.landmark ? `<br>${esc(a.landmark)}` : ''}<br>${esc(a.city)}, ${esc(a.state)} ${esc(a.pincode)}<br>+91 ${esc(order.phone)}</div>
  <div><h2>Delivery</h2>${esc(order.deliveryLabel || '—')}<br><span class="muted">${esc(order.zoneName)}</span>${order.notes ? `<p><strong>Notes:</strong> ${esc(order.notes)}</p>` : ''}</div>
</div>
<table><thead><tr><th>Item</th><th class="r">Qty</th>${showPrices ? '<th class="r">Price</th><th class="r">Amount</th>' : ''}</tr></thead><tbody>${rows}</tbody></table>
${totals}
${order.isGift && order.giftMessage ? `<div class="gift">🎁 ${esc(order.giftMessage)}</div>` : ''}
</body></html>`

  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } })
}
