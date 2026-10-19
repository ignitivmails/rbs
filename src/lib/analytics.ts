/**
 * E-commerce events for GA4 + Meta Pixel. No-ops when analytics isn't configured
 * (or when ad blockers remove the scripts).
 */

type Item = { id: string; name: string; price: number; qty: number; variant?: string }

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
  }
}

const gaItems = (items: Item[]) => items.map((i) => ({ item_id: i.id, item_name: i.name, item_variant: i.variant, price: i.price, quantity: i.qty }))

export function trackAddToCart(item: Item) {
  if (typeof window === 'undefined') return
  window.gtag?.('event', 'add_to_cart', { currency: 'INR', value: item.price * item.qty, items: gaItems([item]) })
  window.fbq?.('track', 'AddToCart', { currency: 'INR', value: item.price * item.qty, content_ids: [item.id], content_type: 'product' })
}

export function trackBeginCheckout(items: Item[], value: number) {
  if (typeof window === 'undefined') return
  window.gtag?.('event', 'begin_checkout', { currency: 'INR', value, items: gaItems(items) })
  window.fbq?.('track', 'InitiateCheckout', { currency: 'INR', value, num_items: items.reduce((n, i) => n + i.qty, 0) })
}

export function trackPurchase(orderNumber: string, value: number, items: Item[]) {
  if (typeof window === 'undefined') return
  const key = `rbs-tracked-${orderNumber}`
  try {
    if (sessionStorage.getItem(key)) return // don't double-count reloads
    sessionStorage.setItem(key, '1')
  } catch {
    /* ignore */
  }
  window.gtag?.('event', 'purchase', { transaction_id: orderNumber, currency: 'INR', value, items: gaItems(items) })
  window.fbq?.('track', 'Purchase', { currency: 'INR', value, content_ids: items.map((i) => i.id), content_type: 'product' })
}
