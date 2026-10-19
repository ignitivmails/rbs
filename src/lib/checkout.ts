import type { Payload } from 'payload'

import { boxKey, normalizeContents, normalizeMessage } from './box'
import { availableDates, estimateDelivery, findZone, formatDeliveryDate, PINCODE_RE } from './delivery'
import { computeQuantityDiscounts, normalizeRules } from './quantity-discounts'
import { razorpayMode } from './razorpay'
import type { Strings } from './strings'
import { interpolate } from './strings'
import type { Coupon, DeliveryZone, GiftBox, ID, Product, SettingsData } from './types'
import { formatPrice, relId, toImage } from './utils'

/**
 * Server-side pricing. The browser only sends product/variant ids and quantities —
 * every price, discount, fee and availability rule is recomputed here.
 */

/** A build-your-own box as chosen in the browser (re-priced and validated here). */
export type BoxSelection = {
  boxId: ID
  sizeId: string
  contents: Array<{ itemId: string; qty: number }>
  packagingId?: string | null
  message?: string | null
}

export type CheckoutItemInput = { productId: ID; variantId: string; qty: number; box?: BoxSelection | null }

export type QuoteLine = {
  key: string
  kind: 'product' | 'box'
  productId: ID
  variantId: string
  slug: string
  href: string
  name: string
  variantLabel: string
  sku: string | null
  image: string | null
  unitPrice: number
  mrp: number | null
  qty: number
  lineTotal: number
  /** Tiered quantity discount on this line (₹) */
  qtyDiscount: number
  qtyDiscountLabel: string
  qtyNext: { count: number; label: string } | null
  boxContents: string | null
  categoryIds: string[]
  issue: string | null
}

export type Quote = {
  lines: QuoteLine[]
  subtotal: number
  mrpTotal: number
  /** Total tiered quantity discount (₹) */
  quantityDiscount: number
  /** Coupon discount (₹) */
  discount: number
  shipping: number
  total: number
  coupon: { code: string; valid: boolean; message: string } | null
  pincode: { status: 'missing' | 'invalid' | 'unserviceable' | 'ok'; message: string }
  zone: { id: ID; name: string; kind: string } | null
  delivery:
    | { mode: 'none' }
    | { mode: 'choose'; dates: Array<{ value: string; label: string }>; slots: string[] }
    | { mode: 'estimate'; date: string; label: string }
  payment: { razorpay: boolean; razorpayMode: string; cod: boolean; codReason: string | null; codRequiresOtp: boolean }
  freeShippingGap: number | null
  errors: string[]
}

type Ctx = { payload: Payload; settings: SettingsData; strings: Strings }

const t = (strings: Strings, key: keyof Strings, vars?: Record<string, string | number>) => interpolate(strings[key], vars)

/** Validates and prices a build-your-own box from its admin configuration. */
export function priceBox(item: CheckoutItemInput, boxes: GiftBox[], zoneIssue: (zones: unknown[] | null | undefined) => string | null): QuoteLine {
  const sel = item.box!
  const box = boxes.find((b) => String(b.id) === String(sel.boxId))
  const size = box?.sizes?.find((s) => s.id === sel.sizeId)
  const packaging = box?.packaging?.find((p) => p.id === sel.packagingId) ?? box?.packaging?.[0] ?? null
  const qty = Math.min(20, Math.max(1, Math.floor(Number(item.qty))))
  const contents = normalizeContents(sel.contents)

  let issue: string | null = null
  let extras = 0
  const parts: string[] = []
  if (!box || box.active === false || !size) issue = 'This box is no longer available — please remove it.'
  else {
    const filled = contents.reduce((n, c) => n + c.qty, 0)
    for (const c of contents) {
      const sweet = box.items?.find((i) => i.id === c.itemId)
      if (!sweet || sweet.available === false) {
        issue = 'A sweet in this box is no longer available — please rebuild it.'
        break
      }
      if (sweet.maxPerBox && c.qty > sweet.maxPerBox) {
        issue = `Max ${sweet.maxPerBox} × ${sweet.name} per box.`
        break
      }
      extras += (sweet.extraPrice ?? 0) * c.qty
      parts.push(`${c.qty}× ${sweet.name}`)
    }
    if (!issue && filled !== size.pieces) issue = `This box needs exactly ${size.pieces} pieces — please rebuild it.`
    if (!issue) issue = zoneIssue(box.deliveryZones)
  }

  const packPrice = packaging?.price ?? 0
  const unitPrice = (size?.price ?? 0) + extras + packPrice
  const mrp = size?.mrp && size.mrp > (size.price ?? 0) ? size.mrp + extras + packPrice : null
  const message = normalizeMessage(sel.message)
  const contentsText = [parts.join(', '), packaging ? `Packaging: ${packaging.label}` : '', message ? `Card: “${message}”` : ''].filter(Boolean).join(' · ')

  return {
    key: boxKey({ ...sel, packagingId: packaging?.id ?? '' }),
    kind: 'box',
    productId: `box:${sel.boxId}`,
    variantId: sel.sizeId,
    slug: box?.slug ?? '',
    href: box?.slug ? `/build-your-box/${box.slug}` : '/build-your-box',
    name: box ? `${box.name} — ${size?.label ?? ''}` : 'Custom box',
    variantLabel: parts.join(', '),
    sku: null,
    image: toImage(box?.image, 'thumbnail')?.src ?? null,
    unitPrice,
    mrp,
    qty,
    lineTotal: unitPrice * qty,
    qtyDiscount: 0,
    qtyDiscountLabel: '',
    qtyNext: null,
    boxContents: contentsText,
    categoryIds: [],
    issue,
  }
}

async function findCoupon(payload: Payload, code: string): Promise<Coupon | null> {
  const res = await payload.find({ collection: 'coupons', where: { code: { equals: code } }, limit: 1, depth: 0 })
  return (res.docs[0] as unknown as Coupon) ?? null
}

function evaluateCoupon(coupon: Coupon | null, subtotal: number): { valid: boolean; message: string; discount: number; freeShipping: boolean } {
  const fail = (message: string) => ({ valid: false, message, discount: 0, freeShipping: false })
  if (!coupon || coupon.active === false) return fail('This coupon code isn’t valid.')
  const now = Date.now()
  if (coupon.startsAt && now < new Date(coupon.startsAt).getTime()) return fail('This coupon isn’t active yet.')
  if (coupon.endsAt && now > new Date(coupon.endsAt).getTime()) return fail('This coupon has expired.')
  if (coupon.usageLimit && (coupon.usageCount ?? 0) >= coupon.usageLimit) return fail('This coupon has been fully used.')
  if (coupon.minSubtotal && subtotal < coupon.minSubtotal) return fail(`Add items worth ${formatPrice(coupon.minSubtotal)} to use this coupon.`)

  let discount = 0
  if (coupon.type === 'percent') {
    discount = Math.round((subtotal * (coupon.value ?? 0)) / 100)
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount)
  } else if (coupon.type === 'flat') {
    discount = Math.min(coupon.value ?? 0, subtotal)
  }
  return {
    valid: true,
    message: coupon.description || (coupon.type === 'freeShipping' ? 'Free delivery applied.' : `You save ${formatPrice(discount)}.`),
    discount,
    freeShipping: coupon.type === 'freeShipping',
  }
}

export async function buildQuote(
  { payload, settings, strings }: Ctx,
  input: { items: CheckoutItemInput[]; pincode?: string; couponCode?: string },
): Promise<Quote> {
  const errors: string[] = []
  const items = (input.items ?? []).filter((i) => i && i.productId != null && i.variantId && Number(i.qty) > 0).slice(0, 30)
  const productItems = items.filter((i) => !i.box)

  // Products (published only)
  const ids = Array.from(new Set(productItems.map((i) => i.productId)))
  const products = ids.length
    ? ((
        await payload.find({
          collection: 'products',
          where: { and: [{ id: { in: ids } }, { _status: { equals: 'published' } }] },
          depth: 1,
          limit: 100,
        })
      ).docs as unknown as Product[])
    : []

  // Delivery zone
  const pin = String(input.pincode ?? '').trim()
  const zonesRes = await payload.find({ collection: 'delivery-zones', limit: 100, depth: 0 })
  const zones = zonesRes.docs as unknown as DeliveryZone[]
  let zone: DeliveryZone | null = null
  let pincode: Quote['pincode'] = { status: 'missing', message: t(strings, 'enterPincodeFirst') }
  if (pin) {
    if (!PINCODE_RE.test(pin)) pincode = { status: 'invalid', message: t(strings, 'pincodeInvalid') }
    else {
      zone = findZone(zones, pin)
      pincode = zone
        ? { status: 'ok', message: zone.name }
        : { status: 'unserviceable', message: t(strings, 'pincodeUnserviceable', { pincode: pin }) }
    }
  }

  // Build-a-box configurations
  const boxIds = Array.from(new Set(items.filter((i) => i.box).map((i) => String(i.box!.boxId))))
  const boxes = boxIds.length
    ? ((await payload.find({ collection: 'gift-boxes', where: { id: { in: boxIds } }, depth: 1, limit: 50 })).docs as unknown as GiftBox[])
    : []

  const zoneIssue = (allowedRefs: unknown[] | null | undefined) => {
    if (!zone) return null
    const allowed = (allowedRefs ?? []).map((z) => String(relId(z)))
    if (!allowed.length || allowed.includes(String(zone.id))) return null
    const names = zones.filter((z) => allowed.includes(String(z.id))).map((z) => z.name).join(', ')
    return `Delivered only in ${names || 'selected cities'} — not to ${pin}.`
  }

  // Lines
  const lines: QuoteLine[] = items.map((item) => {
    if (item.box) return priceBox(item, boxes, zoneIssue)
    const product = products.find((p) => String(p.id) === String(item.productId))
    const variant = product?.variants?.find((v) => v.id === item.variantId)
    const qty = Math.min(50, Math.max(1, Math.floor(Number(item.qty))))
    let issue: string | null = null
    if (!product || !variant) issue = 'This item is no longer available — please remove it.'
    else if ((variant.stock ?? 0) <= 0) issue = 'Out of stock — please remove it.'
    else if ((variant.stock ?? 0) < qty) issue = `Only ${variant.stock} left — please reduce the quantity.`
    else issue = zoneIssue(product.deliveryZones)
    const unitPrice = variant?.price ?? 0
    return {
      key: `${item.productId}:${item.variantId}`,
      kind: 'product',
      productId: item.productId,
      variantId: item.variantId,
      slug: product?.slug ?? '',
      href: product?.slug ? `/products/${product.slug}` : '/shop',
      name: product?.name ?? 'Unavailable item',
      variantLabel: variant?.label ?? '',
      sku: variant?.sku ?? null,
      image: toImage(product?.gallery?.[0], 'thumbnail')?.src ?? null,
      unitPrice,
      mrp: variant?.mrp ?? null,
      qty,
      lineTotal: unitPrice * qty,
      qtyDiscount: 0,
      qtyDiscountLabel: '',
      qtyNext: null,
      boxContents: null,
      categoryIds: (product?.categories ?? []).map((c) => String(relId(c))),
      issue,
    }
  })

  const valid = lines.filter((l) => !l.issue)
  const subtotal = valid.reduce((n, l) => n + l.lineTotal, 0)
  const mrpTotal = valid.reduce((n, l) => n + (l.mrp && l.mrp > l.unitPrice ? l.mrp : l.unitPrice) * l.qty, 0)

  // Tiered quantity discounts (products only; a line gets the best matching rule)
  const ruleDocs = (await payload.find({ collection: 'quantity-discounts', where: { active: { equals: true } }, limit: 100, depth: 0 })).docs
  const bulk = computeQuantityDiscounts(
    normalizeRules(ruleDocs as never),
    valid
      .filter((l) => l.kind === 'product')
      .map((l) => ({ key: l.key, productId: String(l.productId), categoryIds: l.categoryIds, unitPrice: l.unitPrice, qty: l.qty })),
  )
  for (const line of lines) {
    const d = bulk.perLine[line.key]
    if (!d || line.issue) continue
    line.qtyDiscount = d.amount
    line.qtyDiscountLabel = d.label
    line.qtyNext = d.next
  }
  const quantityDiscount = bulk.total
  const netSubtotal = subtotal - quantityDiscount

  // Coupon (applies after quantity discounts)
  let discount = 0
  let freeShipping = false
  let coupon: Quote['coupon'] = null
  const code = String(input.couponCode ?? '').trim().toUpperCase().replace(/\s+/g, '')
  if (code) {
    const result = evaluateCoupon(await findCoupon(payload, code), netSubtotal)
    coupon = { code, valid: result.valid, message: result.message }
    discount = result.discount
    freeShipping = result.freeShipping
  }

  // Shipping
  let shipping = 0
  let freeShippingGap: number | null = null
  if (zone && valid.length) {
    const fee = zone.shippingFee ?? 0
    const threshold = zone.freeShippingAbove ?? null
    const afterDiscount = netSubtotal - discount
    if (freeShipping || (threshold !== null && afterDiscount >= threshold)) shipping = 0
    else {
      shipping = fee
      if (threshold !== null && fee > 0) freeShippingGap = threshold - afterDiscount
    }
  }
  const total = Math.max(0, netSubtotal - discount + shipping)

  // Delivery options
  let delivery: Quote['delivery'] = { mode: 'none' }
  if (zone) {
    if (zone.kind === 'local' && (zone.slots ?? []).length) {
      delivery = {
        mode: 'choose',
        dates: availableDates(zone, 7).map((value) => ({ value, label: formatDeliveryDate(value) })),
        slots: (zone.slots ?? []).map((s) => s.label ?? '').filter(Boolean),
      }
    } else {
      const date = estimateDelivery(zone)
      delivery = { mode: 'estimate', date, label: formatDeliveryDate(date) }
    }
  }

  // Payment availability
  const mode = razorpayMode()
  const razorpay = settings.razorpayEnabled !== false && mode !== 'disabled'
  let codReason: string | null = null
  if (settings.codEnabled === false) codReason = t(strings, 'codUnavailable')
  else if (zone && zone.codAllowed === false) codReason = t(strings, 'codUnavailable')
  else if (zone?.codLimit && total > zone.codLimit) codReason = `Cash on Delivery is available on orders up to ${formatPrice(zone.codLimit)}.`

  // Blocking errors
  if (!lines.length) errors.push(t(strings, 'cartEmpty'))
  if (lines.some((l) => l.issue)) errors.push(t(strings, 'itemsNeedAttention'))
  if (pincode.status !== 'ok') errors.push(pincode.message)
  const minOrder = settings.minOrderValue ?? 0
  if (minOrder > 0 && subtotal < minOrder) errors.push(t(strings, 'minOrderNotMet', { amount: formatPrice(minOrder) }))
  if (coupon && !coupon.valid) errors.push(coupon.message)

  return {
    lines,
    subtotal,
    mrpTotal,
    quantityDiscount,
    discount,
    shipping,
    total,
    coupon,
    pincode,
    zone: zone ? { id: zone.id, name: zone.name, kind: zone.kind ?? 'local' } : null,
    delivery,
    payment: { razorpay, razorpayMode: mode, cod: !codReason, codReason, codRequiresOtp: settings.codRequiresOtp !== false },
    freeShippingGap,
    errors,
  }
}
