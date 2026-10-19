import type { NotificationEvent } from './order-status'

/**
 * Default customer messages. The "Notifications" global in the admin is generated from
 * this list — every subject, email body and SMS/WhatsApp text is editable there.
 *
 * Placeholders: {name} {orderNumber} {total} {deliveryDate} {orderUrl} {trackingUrl} {siteName}
 */
export const NOTIFICATION_EVENTS: Array<{
  key: NotificationEvent
  label: string
  subject: string
  body: string
  sms: string
}> = [
  {
    key: 'orderConfirmed',
    label: 'Order confirmed',
    subject: 'Your {siteName} order {orderNumber} is confirmed',
    body: 'Hi {name},\n\nThank you for your order! We’ve received order {orderNumber} for {total} and our kitchen is getting it ready.\n\nExpected delivery: {deliveryDate}.\n\nView your order: {orderUrl}',
    sms: '{siteName}: Order {orderNumber} confirmed ({total}). Delivery {deliveryDate}. Details: {orderUrl}',
  },
  {
    key: 'shipped',
    label: 'Shipped',
    subject: 'Order {orderNumber} is on its way',
    body: 'Hi {name},\n\nGood news — order {orderNumber} has been shipped.\n\nTrack it here: {trackingUrl}',
    sms: '{siteName}: Order {orderNumber} has shipped. Track: {trackingUrl}',
  },
  {
    key: 'outForDelivery',
    label: 'Out for delivery',
    subject: 'Order {orderNumber} is out for delivery',
    body: 'Hi {name},\n\nYour sweets are out for delivery and will reach you soon!',
    sms: '{siteName}: Order {orderNumber} is out for delivery today.',
  },
  {
    key: 'delivered',
    label: 'Delivered',
    subject: 'Order {orderNumber} delivered — enjoy!',
    body: 'Hi {name},\n\nYour order {orderNumber} has been delivered. We hope you love it — reply to this email to tell us how it was.',
    sms: '{siteName}: Order {orderNumber} delivered. Enjoy your mishti!',
  },
  {
    key: 'cancelled',
    label: 'Cancelled',
    subject: 'Order {orderNumber} has been cancelled',
    body: 'Hi {name},\n\nOrder {orderNumber} has been cancelled. If you paid online, any amount charged will be refunded to the original payment method.',
    sms: '{siteName}: Order {orderNumber} was cancelled.',
  },
  {
    key: 'refunded',
    label: 'Refunded',
    subject: 'Refund issued for order {orderNumber}',
    body: 'Hi {name},\n\nWe’ve issued a refund of {total} for order {orderNumber}. It usually reaches your account in 5–7 working days.',
    sms: '{siteName}: Refund of {total} issued for order {orderNumber}.',
  },
]

export function fillTemplate(template: string, vars: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in vars ? vars[key] : match))
}
