/**
 * Order-engine smoke test against the local database: quotes, coupons, zones, stock,
 * lifecycle hooks, payment capture, expiry, refunds, OTP, customer accounts and
 * Shiprocket (test mode). Cleans up after itself.
 *
 *   npm run test:orders
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPayload } from 'payload'

import { boxKey } from '../src/lib/box'
import { buildQuote } from '../src/lib/checkout'
import { loginWithGoogle, loginWithPhone, sanitizeAddress } from '../src/lib/customers'
import { adjustStock, cancelExpiredOrders, markOrderPaid } from '../src/lib/orders'
import { issueOtp, verifyOtp } from '../src/lib/otp'
import { razorpayMode } from '../src/lib/razorpay'
import { DEFAULT_STRINGS } from '../src/lib/strings'
import config from '../src/payload.config'

let failures = 0
const ok = (label: string, cond: boolean, extra = '') => {
  if (!cond) failures++
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${label}${extra ? `  — ${extra}` : ''}`)
}

const payload = await getPayload({ config })
const settings = (await payload.findGlobal({ slug: 'site-settings', depth: 0 })) as any
const ctx = { payload, settings, strings: DEFAULT_STRINGS }
const created: Array<string | number> = []

const coupons = await payload.find({ collection: 'coupons', limit: 10 })
ok('coupons seeded', coupons.totalDocs >= 3, coupons.docs.map((c: any) => c.code).join(', '))

const find = async (slug: string) =>
  (await payload.find({ collection: 'products', where: { slug: { equals: slug } }, limit: 1, depth: 0 })).docs[0] as any
const roso = await find('classic-sponge-rosogolla')
const katli = await find('saffron-kaju-katli')
const items = [
  { productId: roso.id, variantId: roso.variants[0].id, qty: 2 },
  { productId: katli.id, variantId: katli.variants[1].id, qty: 1 },
]

// Quote — Pune
const q = await buildQuote(ctx, { items, pincode: '411001', couponCode: 'welcome10' })
const expectedSub = roso.variants[0].price * 2 + katli.variants[1].price
ok('subtotal recomputed on server', q.subtotal === expectedSub, `₹${q.subtotal}`)
ok('WELCOME10 = 10% capped at ₹200', q.discount === Math.min(200, Math.round(expectedSub * 0.1)), `−₹${q.discount}`)
ok(
  'Pune zone offers date + slot choice',
  q.zone?.name === 'Pune' && q.delivery.mode === 'choose',
  q.delivery.mode === 'choose' ? `${q.delivery.dates.length} dates, ${q.delivery.slots.length} slots` : '',
)
ok('free delivery above ₹799 in Pune', q.shipping === 0 && q.total === q.subtotal - q.discount, `total ₹${q.total}`)
ok('COD + online both available', q.payment.cod && q.payment.razorpay, `payment mode=${q.payment.razorpayMode}`)
ok('no blocking errors', q.errors.length === 0, q.errors.join(' | '))

// Quote — Delhi: rosogolla is Pune-only
const qd = await buildQuote(ctx, { items, pincode: '110001' })
ok('rosogolla blocked outside Pune', Boolean(qd.lines[0].issue) && !qd.lines[1].issue, qd.lines[0].issue ?? '')
ok('Delhi uses pan-India estimate', qd.delivery.mode === 'estimate' && qd.zone?.name === 'Pan-India')
const qd2 = await buildQuote(ctx, { items: [items[1]], pincode: '110001' })
ok('pan-India shipping fee below threshold', qd2.shipping === 99 && (qd2.freeShippingGap ?? 0) > 0, `fee ₹${qd2.shipping}, gap ₹${qd2.freeShippingGap}`)
const qb = await buildQuote(ctx, { items: [items[1]], pincode: '110001', couponCode: 'BIJOYA250' })
ok('BIJOYA250 rejected under ₹1,500', qb.coupon?.valid === false && qb.errors.length > 0, qb.coupon?.message)
const lowStock = katli.variants.map((v: any, i: number) => (i === 1 ? { ...v, stock: 1 } : v))
await payload.update({ collection: 'products', id: katli.id, data: { variants: lowStock } as any })
const qx = await buildQuote(ctx, { items: [{ ...items[1], qty: 2 }], pincode: '411001' })
ok('stock limit enforced', Boolean(qx.lines[0].issue), qx.lines[0].issue ?? '')
await payload.update({ collection: 'products', id: katli.id, data: { variants: katli.variants } as any })

// COD order lifecycle
const stockBefore = katli.variants[1].stock
const orderData = (status: string, method: 'cod' | 'razorpay', extra: Record<string, unknown> = {}) => ({
  orderNumber: `TEST-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
  status,
  customerName: 'Test Customer',
  phone: '9876543210',
  email: 'test@example.com',
  address: { line1: '12 Lane 6', city: 'Pune', state: 'Maharashtra', pincode: '411001' },
  zoneName: 'Pune',
  deliveryLabel: 'tomorrow, 10 AM – 1 PM',
  items: q.lines.map((l) => ({
    product: l.productId,
    productName: l.name,
    variantId: l.variantId,
    variantLabel: l.variantLabel,
    unitPrice: l.unitPrice,
    qty: l.qty,
    lineTotal: l.lineTotal,
  })),
  subtotal: q.subtotal,
  discount: q.discount,
  shipping: q.shipping,
  total: q.total,
  couponCode: 'WELCOME10',
  paymentMethod: method,
  paymentStatus: 'pending',
  accessToken: 'testtoken',
  ...extra,
})

const welcomeBefore = ((await payload.find({ collection: 'coupons', where: { code: { equals: 'WELCOME10' } } })).docs[0] as any)
const cod = (await payload.create({
  collection: 'orders',
  data: orderData('confirmed_cod', 'cod') as any,
  context: { statusNote: 'COD placed', actor: 'customer' },
})) as any
created.push(cod.id)
ok('status history recorded on create', cod.statusHistory?.length === 1 && cod.statusHistory[0].by === 'customer')
const welcome = (await payload.find({ collection: 'coupons', where: { code: { equals: 'WELCOME10' } } })).docs[0] as any
ok('coupon usage counted on confirmation', welcome.usageCount === (welcomeBefore.usageCount ?? 0) + 1, `usageCount=${welcome.usageCount}`)

await adjustStock(payload, cod.items, -1)
await payload.update({ collection: 'orders', id: cod.id, data: { stockReserved: true } as any, context: { internal: true } })
const afterReserve = (await find('saffron-kaju-katli')).variants[1].stock
ok('stock reserved', afterReserve === stockBefore - 1, `${stockBefore} → ${afterReserve}`)

const cancelled = (await payload.update({
  collection: 'orders',
  id: cod.id,
  data: { status: 'cancelled', statusNote: 'Customer changed mind' } as any,
})) as any
const afterCancel = (await find('saffron-kaju-katli')).variants[1].stock
const reloaded = (await payload.findByID({ collection: 'orders', id: cod.id })) as any
ok('cancel releases stock', afterCancel === stockBefore && reloaded.stockReleased === true, `stock ${afterCancel}`)
ok('history keeps the note', cancelled.statusHistory?.at(-1)?.note === 'Customer changed mind')

// Online order: expiry
const expired = (await payload.create({
  collection: 'orders',
  data: orderData('pending_payment', 'razorpay', { couponCode: undefined, expiresAt: new Date(Date.now() - 60000).toISOString() }) as any,
})) as any
created.push(expired.id)
const n = await cancelExpiredOrders(payload)
const expiredNow = (await payload.findByID({ collection: 'orders', id: expired.id })) as any
ok('unpaid order auto-cancels after window', n >= 1 && expiredNow.status === 'cancelled', expiredNow.statusHistory?.at(-1)?.note)

// Online order: paid then refunded
const pending = (await payload.create({
  collection: 'orders',
  data: orderData('pending_payment', 'razorpay', { couponCode: undefined, expiresAt: new Date(Date.now() + 600000).toISOString() }) as any,
})) as any
created.push(pending.id)
const paid = (await markOrderPaid(payload, pending, 'pay_test123', 'test')) as any
ok('markOrderPaid → paid', paid.status === 'paid' && paid.paymentStatus === 'paid' && Boolean(paid.paidAt))
const again = (await markOrderPaid(payload, paid, 'pay_test123', 'webhook')) as any
ok('markOrderPaid is idempotent', again.status === 'paid')
await payload.update({ collection: 'orders', id: pending.id, data: { status: 'refunded' } as any })
const refunded = (await payload.findByID({ collection: 'orders', id: pending.id })) as any
if (razorpayMode() === 'mock') {
  ok('refund issued on “refunded”', String(refunded.refundId ?? '').startsWith('mock_refund_') && refunded.paymentStatus === 'refunded', refunded.refundId)
} else {
  // Real Razorpay keys: a fake payment id can't be refunded — the order is still marked refunded and the error is logged.
  ok('“refunded” status set (real Razorpay refund needs a real payment — skipped)', refunded.paymentStatus === 'refunded')
}

// OTP
const phone = `98${String(Date.now()).slice(-8)}`
const issued = await issueOtp(payload, phone, 'cod')
const code = issued.ok ? issued.devCode : undefined
ok('OTP issued (dev code returned locally)', Boolean(code))
ok('OTP resend throttled', !(await issueOtp(payload, phone, 'cod')).ok)
ok('wrong OTP rejected', !(await verifyOtp(payload, phone, 'cod', '000000')))
ok('correct OTP accepted', Boolean(code) && (await verifyOtp(payload, phone, 'cod', code!)))
ok('OTP is single-use', Boolean(code) && !(await verifyOtp(payload, phone, 'cod', code!)))

// Accounts (Phase 5)
const custPhone = `97${String(Date.now()).slice(-8)}`
const guestOrder = (await payload.create({
  collection: 'orders',
  data: orderData('confirmed_cod', 'cod', { couponCode: undefined, phone: custPhone }) as any,
})) as any
created.push(guestOrder.id)
const login1 = await loginWithPhone(payload, custPhone, { name: 'Rina Sen' })
ok('phone login creates a customer', Boolean(login1.customer?.id) && login1.customer?.phoneVerified === true, login1.customer?.name ?? '')
const claimed = (await payload.findByID({ collection: 'orders', id: guestOrder.id, depth: 0 })) as any
ok('guest orders claimed on phone login', String(claimed.customer) === String(login1.customer?.id))
const login2 = await loginWithPhone(payload, custPhone, {})
ok('same phone logs into the same account', String(login2.customer?.id) === String(login1.customer?.id))

const sub = `test-google-${Date.now()}`
const g1 = await loginWithGoogle(payload, { sub, email: `g${Date.now()}@example.com`, emailVerified: true, name: 'Gita Bose' })
ok('Google login creates a customer', Boolean(g1.customer?.googleId === sub))
const g2 = await loginWithGoogle(payload, { sub, email: 'other@example.com', emailVerified: true })
ok('same Google account → same customer', String(g2.customer?.id) === String(g1.customer?.id))
const conflict = await loginWithPhone(payload, custPhone, { current: g1.customer })
ok('cannot link a phone owned by another account', Boolean(conflict.error))
const gPhone = `96${String(Date.now()).slice(-8)}`
const linked = await loginWithPhone(payload, gPhone, { current: g1.customer })
ok('Google account can add a verified phone', linked.customer?.phone === gPhone && linked.customer?.authProviders?.includes('phone') === true)
const linkGoogle = await loginWithGoogle(payload, { sub, name: 'x' }, login1.customer)
ok('cannot link a Google account owned by another customer', Boolean(linkGoogle.error))
ok('address validation', sanitizeAddress({ line1: 'Flat 1, Lotus', city: 'Pune', state: 'Maharashtra', pincode: '411001' }) !== null && sanitizeAddress({ line1: 'x', city: '', state: '', pincode: '12' }) === null)

// Shiprocket (test mode) on "packed" for pan-India orders only
const zonesAll = (await payload.find({ collection: 'delivery-zones', limit: 10, depth: 0 })).docs as any[]
const panIndia = zonesAll.find((z) => z.kind === 'panIndia')
const pune = zonesAll.find((z) => z.kind === 'local')
const shipOrder = (await payload.create({ collection: 'orders', data: orderData('paid', 'razorpay', { couponCode: undefined, deliveryZone: panIndia.id }) as any })) as any
created.push(shipOrder.id)
await payload.update({ collection: 'orders', id: shipOrder.id, data: { status: 'packed' } as any })
const shipped = (await payload.findByID({ collection: 'orders', id: shipOrder.id, depth: 0 })) as any
ok('pan-India order gets an AWB when packed', String(shipped.awb ?? '').startsWith('TEST') && Boolean(shipped.trackingUrl), `${shipped.carrier} ${shipped.awb}`)
const localOrder = (await payload.create({ collection: 'orders', data: orderData('paid', 'razorpay', { couponCode: undefined, deliveryZone: pune.id }) as any })) as any
created.push(localOrder.id)
await payload.update({ collection: 'orders', id: localOrder.id, data: { status: 'packed' } as any })
const localPacked = (await payload.findByID({ collection: 'orders', id: localOrder.id, depth: 0 })) as any
ok('Pune order (own riders) gets no courier AWB', !localPacked.awb)

// Quantity discounts (Phase 6)
const assorted = await find('assorted-bengali-mithai-box')
const q3 = await buildQuote(ctx, { items: [{ productId: katli.id, variantId: katli.variants[0].id, qty: 3 }], pincode: '411001' })
ok('3 × katli → 5% bulk discount', q3.quantityDiscount === Math.round(katli.variants[0].price * 3 * 0.05), `−₹${q3.quantityDiscount}`)
const q6 = await buildQuote(ctx, { items: [{ productId: katli.id, variantId: katli.variants[0].id, qty: 6 }], pincode: '411001' })
ok('6 × katli → 10% bulk discount', q6.quantityDiscount === Math.round(katli.variants[0].price * 6 * 0.1), `−₹${q6.quantityDiscount}`)
const q2 = await buildQuote(ctx, { items: [{ productId: katli.id, variantId: katli.variants[0].id, qty: 2 }], pincode: '411001' })
ok('2 × katli → no discount, hint for next tier', q2.quantityDiscount === 0 && q2.lines[0].qtyNext?.count === 1, q2.lines[0].qtyNext ? `add ${q2.lines[0].qtyNext.count} for ${q2.lines[0].qtyNext.label}` : '')
const qMixed = await buildQuote(ctx, {
  items: [
    { productId: katli.id, variantId: katli.variants[0].id, qty: 2 },
    { productId: assorted.id, variantId: assorted.variants[0].id, qty: 2 },
  ],
  pincode: '411001',
})
ok('“per product” rule does not combine different products', qMixed.quantityDiscount === 0)
const jhal = await find('jhal-muri-mix')
const nimki = await find('kalonji-nimki')
const qNamkeen = await buildQuote(ctx, {
  items: [
    { productId: jhal.id, variantId: jhal.variants[0].id, qty: 2 },
    { productId: nimki.id, variantId: nimki.variants[0].id, qty: 1 },
  ],
  pincode: '110001',
})
const namkeenSub = jhal.variants[0].price * 2 + nimki.variants[0].price
ok('namkeen mix & match: 3 packs across products → 10%', qNamkeen.quantityDiscount === Math.round(jhal.variants[0].price * 2 * 0.1) + Math.round(nimki.variants[0].price * 0.1), `−₹${qNamkeen.quantityDiscount} on ₹${namkeenSub}`)
const qBoth = await buildQuote(ctx, { items: [{ productId: katli.id, variantId: katli.variants[0].id, qty: 6 }], pincode: '411001', couponCode: 'WELCOME10' })
ok('coupon applies after bulk discount', qBoth.discount === Math.min(200, Math.round((qBoth.subtotal - qBoth.quantityDiscount) * 0.1)) && qBoth.total === qBoth.subtotal - qBoth.quantityDiscount - qBoth.discount + qBoth.shipping, `₹${qBoth.subtotal} − ₹${qBoth.quantityDiscount} − ₹${qBoth.discount} = ₹${qBoth.total}`)

// Build-a-box (Phase 6)
const box = ((await payload.find({ collection: 'gift-boxes', limit: 1, depth: 0 })).docs[0] as any)
ok('build-a-box configured', Boolean(box?.sizes?.length && box.items?.length), box?.name)
const size9 = box.sizes.find((s: any) => s.pieces === 9)
const [i1, i2, , , i5] = box.items
const goodBox = { boxId: box.id, sizeId: size9.id, contents: [{ itemId: i1.id, qty: 5 }, { itemId: i5.id, qty: 4 }], packagingId: box.packaging[1].id, message: 'Shubho Bijoya!' }
const qBox = await buildQuote(ctx, { items: [{ productId: `box:${box.id}`, variantId: size9.id, qty: 1, box: goodBox }], pincode: '411001' })
const expectedBox = size9.price + i1.extraPrice * 5 + i5.extraPrice * 4 + box.packaging[1].price
ok('box priced on server (size + extras + packaging)', qBox.lines[0].unitPrice === expectedBox && !qBox.lines[0].issue, `₹${qBox.lines[0].unitPrice}`)
ok('box key matches the browser key', qBox.lines[0].key === boxKey(goodBox))
const short = await buildQuote(ctx, { items: [{ productId: `box:${box.id}`, variantId: size9.id, qty: 1, box: { ...goodBox, contents: [{ itemId: i1.id, qty: 5 }] } }], pincode: '411001' })
ok('half-filled box rejected', Boolean(short.lines[0].issue), short.lines[0].issue ?? '')
const limited = box.items.find((i: any) => i.maxPerBox)
if (limited) {
  const over = await buildQuote(ctx, {
    items: [{ productId: `box:${box.id}`, variantId: size9.id, qty: 1, box: { ...goodBox, contents: [{ itemId: limited.id, qty: 9 }] } }],
    pincode: '411001',
  })
  ok('per-sweet max enforced', Boolean(over.lines[0].issue), over.lines[0].issue ?? '')
}
const fake = await buildQuote(ctx, { items: [{ productId: `box:${box.id}`, variantId: size9.id, qty: 1, box: { ...goodBox, contents: [{ itemId: 'nope', qty: 9 }] } }], pincode: '411001' })
ok('unknown sweet rejected', Boolean(fake.lines[0].issue))
const boxDelhi = await buildQuote(ctx, { items: [{ productId: `box:${box.id}`, variantId: size9.id, qty: 1, box: goodBox }], pincode: '110001' })
ok('fresh box limited to Pune', Boolean(boxDelhi.lines[0].issue), boxDelhi.lines[0].issue ?? '')
ok('boxes get no bulk discount', qBox.quantityDiscount === 0)
const boxOrder = (await payload.create({
  collection: 'orders',
  data: orderData('confirmed_cod', 'cod', {
    couponCode: undefined,
    items: [{ kind: 'box', productName: qBox.lines[0].name, variantId: size9.id, variantLabel: qBox.lines[0].variantLabel, boxContents: qBox.lines[0].boxContents, unitPrice: expectedBox, qty: 1, lineTotal: expectedBox }],
  }) as any,
})) as any
created.push(boxOrder.id)
await adjustStock(payload, boxOrder.items, -1)
ok('box order stored with contents; stock untouched', boxOrder.items[0].kind === 'box' && String(boxOrder.items[0].boxContents).includes('Card'), boxOrder.items[0].boxContents)
void i2

// Cleanup
for (const id of created) await payload.delete({ collection: 'orders', id })
for (const c of [login1.customer, g1.customer]) if (c?.id) await payload.delete({ collection: 'customers', id: c.id })
await payload.delete({ collection: 'otp-codes', where: { phone: { in: [custPhone, gPhone] } } })
await payload.update({ collection: 'coupons', id: welcome.id, data: { usageCount: welcomeBefore.usageCount ?? 0 } as any })
await payload.delete({ collection: 'otp-codes', where: { phone: { equals: phone } } })
console.log(failures ? `\n${failures} check(s) failed` : '\nAll checks passed ✓')
process.exit(failures ? 1 : 0)
