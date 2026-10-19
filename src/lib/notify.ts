import type { Payload } from 'payload'

import { fillTemplate, NOTIFICATION_EVENTS } from './notification-templates'
import type { NotificationEvent } from './order-status'
import type { Order } from './types'
import { formatPrice } from './utils'

/**
 * Sends customer email + SMS/WhatsApp for an order event, using the templates in the
 * Notifications global. Locally there is no email adapter or SMS gateway, so both are
 * written to the server console. Plug in Resend / MSG91 here for production.
 */

const serverURL = () => process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string)

export const orderUrl = (order: Pick<Order, 'orderNumber' | 'accessToken'>) =>
  `${serverURL()}/order/${order.orderNumber}?t=${order.accessToken ?? ''}`

/**
 * SMS via MSG91 Flow API when MSG91_AUTH_KEY + MSG91_TEMPLATE_ID are set. The DLT-approved template
 * must contain a single variable ##text## (or set MSG91_TEMPLATE_VAR). Otherwise it is logged.
 */
export async function sendSms(payload: Payload, phone: string, text: string) {
  const authKey = process.env.MSG91_AUTH_KEY
  const templateId = process.env.MSG91_TEMPLATE_ID
  if (!authKey || !templateId) {
    payload.logger.info(`[SMS/WhatsApp → +91 ${phone}] ${text}`)
    return
  }
  try {
    const res = await fetch('https://control.msg91.com/api/v5/flow/', {
      method: 'POST',
      headers: { authkey: authKey, 'Content-Type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        template_id: templateId,
        short_url: '0',
        recipients: [{ mobiles: `91${phone}`, [process.env.MSG91_TEMPLATE_VAR || 'text']: text }],
      }),
    })
    if (!res.ok) payload.logger.error(`MSG91 SMS failed (${res.status}): ${await res.text()}`)
  } catch (err) {
    payload.logger.error({ err }, 'MSG91 SMS failed')
  }
}

function emailHtml(body: string, order: Order, siteName: string, withSummary: boolean) {
  const paragraphs = escapeHtml(body)
    .split(/\n{2,}/)
    .map((p) => `<p style="margin:0 0 14px">${p.replace(/\n/g, '<br>').replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1">$1</a>')}</p>`)
    .join('')
  const summary = withSummary
    ? `<table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px">${(order.items ?? [])
        .map(
          (i) =>
            `<tr><td style="padding:6px 0;border-bottom:1px solid #eee">${escapeHtml(i.productName)} — ${escapeHtml(i.variantLabel ?? '')} × ${i.qty}</td><td style="padding:6px 0;border-bottom:1px solid #eee;text-align:right">${formatPrice(i.lineTotal)}</td></tr>`,
        )
        .join('')}<tr><td style="padding:8px 0;font-weight:bold">Total</td><td style="padding:8px 0;text-align:right;font-weight:bold">${formatPrice(order.total)}</td></tr></table>`
    : ''
  return `<div style="font-family:Arial,sans-serif;color:#2b1b12;max-width:560px;margin:auto;padding:24px"><h2 style="color:#8b1e1e;margin:0 0 16px">${escapeHtml(siteName)}</h2>${paragraphs}${summary}</div>`
}

export async function notifyOrder(payload: Payload, order: Order, event: NotificationEvent) {
  const defaults = NOTIFICATION_EVENTS.find((e) => e.key === event)
  if (!defaults) return
  const [config, settings] = await Promise.all([
    payload.findGlobal({ slug: 'notifications', depth: 0 }) as Promise<unknown>,
    payload.findGlobal({ slug: 'site-settings', depth: 0 }) as Promise<unknown>,
  ])
  const cfg = (config ?? {}) as Record<string, unknown>
  const eventCfg = (cfg[event] ?? {}) as { enabled?: boolean; emailSubject?: string; emailBody?: string; sms?: string }
  if (eventCfg.enabled === false) return

  const siteName = ((settings as { siteName?: string })?.siteName as string) || 'Real Bengal Sweets'
  const vars = {
    name: order.customerName?.split(' ')[0] || 'there',
    orderNumber: order.orderNumber,
    total: formatPrice(order.total),
    deliveryDate: order.deliveryLabel || 'soon',
    orderUrl: orderUrl(order),
    trackingUrl: order.trackingUrl || orderUrl(order),
    siteName,
  }

  const subject = fillTemplate(eventCfg.emailSubject || defaults.subject, vars)
  const body = fillTemplate(eventCfg.emailBody || defaults.body, vars)
  if (order.email) {
    try {
      await payload.sendEmail({ to: order.email, subject, html: emailHtml(body, order, siteName, event === 'orderConfirmed') })
    } catch (err) {
      payload.logger.error({ err }, `Failed to email order ${order.orderNumber}`)
    }
  }
  if (order.phone) await sendSms(payload, order.phone, fillTemplate(eventCfg.sms || defaults.sms, vars))

  // New-order alert for the shop team
  const adminEmail = cfg.adminEmail as string | undefined
  if (event === 'orderConfirmed' && adminEmail && cfg.sendAdminAlerts !== false) {
    try {
      await payload.sendEmail({
        to: adminEmail,
        subject: `New order ${order.orderNumber} — ${formatPrice(order.total)} (${order.paymentMethod === 'cod' ? 'COD' : 'Paid online'})`,
        html: emailHtml(
          `${order.customerName} (${order.phone}) placed order ${order.orderNumber}.\n\nDeliver to: ${order.address?.city ?? ''} ${order.address?.pincode ?? ''} — ${vars.deliveryDate}${order.deliverySlot ? `, ${order.deliverySlot}` : ''}.\n\nOpen in admin: ${serverURL()}/admin/collections/orders/${order.id}`,
          order,
          siteName,
          true,
        ),
      })
    } catch (err) {
      payload.logger.error({ err }, 'Failed to send admin order alert')
    }
  }
}
