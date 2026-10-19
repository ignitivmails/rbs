import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ClearCartOnConfirm, PaymentRetry } from '@/components/checkout/OrderClient'
import { Icon } from '@/components/Icon'
import { getSite } from '@/lib/data'
import { CLOSED_STATUSES, PROGRESS_STEPS, statusInfo, type OrderStatus } from '@/lib/order-status'
import { cancelExpiredOrders, findOrderForCustomer } from '@/lib/orders'
import { getPayloadClient } from '@/lib/payload'
import type { Product } from '@/lib/types'
import { cn, formatPrice, isObject, relId, toImage } from '@/lib/utils'

export const metadata: Metadata = { title: 'Your order', robots: { index: false, follow: false } }

type Props = {
  params: Promise<{ number: string }>
  searchParams: Promise<{ t?: string; placed?: string; failed?: string }>
}

const timeFmt = new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit', day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' })

export default async function OrderPage({ params, searchParams }: Props) {
  const [{ number }, sp] = await Promise.all([params, searchParams])
  const payload = await getPayloadClient()
  await cancelExpiredOrders(payload)
  const order = await findOrderForCustomer(payload, decodeURIComponent(number), sp.t)
  if (!order) notFound()

  const { t, settings } = await getSite()
  const status = order.status as OrderStatus
  const info = statusInfo(status)
  const confirmed = !['pending_payment', ...CLOSED_STATUSES].includes(status)
  const closed = CLOSED_STATUSES.includes(status)
  const pending = status === 'pending_payment'
  const stepIndex = PROGRESS_STEPS.findIndex((s) => s.statuses.includes(status))

  return (
    <div className="container-x max-w-4xl py-10 md:py-14">
      {confirmed && (
        <ClearCartOnConfirm
          purchase={
            sp.placed
              ? {
                  orderNumber: order.orderNumber,
                  value: order.total,
                  items: (order.items ?? []).map((i) => ({ id: String(relId(i.product) ?? i.productName), name: i.productName, price: i.unitPrice, qty: i.qty })),
                }
              : undefined
          }
        />
      )}

      <header className="text-center">
        <span
          className={cn(
            'mx-auto mb-4 flex size-14 items-center justify-center rounded-full',
            confirmed ? 'bg-success/15 text-success' : closed ? 'bg-danger/10 text-danger' : 'bg-accent/15 text-accent',
          )}
        >
          <Icon name={confirmed ? 'check' : closed ? 'x' : 'clock'} size={28} />
        </span>
        <p className="eyebrow text-muted">{t('orderNumberLabel', { number: order.orderNumber })}</p>
        <h1 className="mt-2 text-3xl md:text-4xl">
          {confirmed ? t('orderConfirmedTitle') : pending ? t('orderPendingTitle') : t('orderClosedTitle', { status: info.customer.toLowerCase() })}
        </h1>
        {pending && (
          <div className="mt-4 space-y-4">
            {sp.failed && <p className="text-sm text-danger">{t('paymentFailed')}</p>}
            {order.expiresAt && <p className="text-muted">{t('orderPendingText', { time: timeFmt.format(new Date(order.expiresAt)) })}</p>}
            <PaymentRetry orderNumber={order.orderNumber} token={sp.t!} />
          </div>
        )}
        {confirmed && order.email && <p className="mt-3 text-muted">We’ve sent the details to {order.email}.</p>}
      </header>

      {confirmed && stepIndex >= 0 && (
        <ol className="mx-auto mt-10 grid max-w-2xl grid-cols-5 gap-2 text-center text-xs">
          {PROGRESS_STEPS.map((step, i) => (
            <li key={step.key} className="flex flex-col items-center gap-2">
              <span className={cn('h-1.5 w-full rounded-full', i <= stepIndex ? 'bg-primary' : 'bg-line')} />
              <span className={cn(i <= stepIndex ? 'font-semibold text-ink' : 'text-muted')}>{step.label}</span>
            </li>
          ))}
        </ol>
      )}

      <div className="mt-10 grid gap-6 md:grid-cols-[1.4fr_1fr]">
        <section className="card card-border p-5">
          <h2 className="mb-3 text-xl">{t('orderSummary')}</h2>
          <ul className="divide-y divide-line">
            {(order.items ?? []).map((item, i) => {
              const product = isObject(item.product) ? (item.product as unknown as Product) : null
              const img = toImage(product?.gallery?.[0], 'thumbnail')
              return (
                <li key={item.id ?? i} className="flex gap-3 py-3">
                  <span className="relative size-14 shrink-0 overflow-hidden rounded-theme bg-ink/5">
                    {img && <Image src={img.src} alt="" fill sizes="56px" className="object-cover" />}
                  </span>
                  <div className="flex-1 text-sm">
                    {product?.slug ? (
                      <Link href={`/products/${product.slug}`} className="font-medium hover:text-primary">
                        {item.productName}
                      </Link>
                    ) : (
                      <p className="font-medium">{item.productName}</p>
                    )}
                    <p className="text-xs text-muted">
                      {item.kind === 'box' && item.boxContents ? item.boxContents : item.variantLabel} × {item.qty}
                    </p>
                    {item.lineDiscount ? <p className="text-xs text-success">− {formatPrice(item.lineDiscount)} {t('quantityDiscount').toLowerCase()}</p> : null}
                  </div>
                  <span className="text-sm font-medium">{formatPrice(item.lineTotal)}</span>
                </li>
              )
            })}
          </ul>
          <dl className="mt-3 space-y-1.5 border-t border-line pt-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">{t('subtotal')}</dt>
              <dd>{formatPrice(order.subtotal)}</dd>
            </div>
            {(order.quantityDiscount ?? 0) > 0 && (
              <div className="flex justify-between text-success">
                <dt>{t('quantityDiscount')}</dt>
                <dd>− {formatPrice(order.quantityDiscount ?? 0)}</dd>
              </div>
            )}
            {(order.discount ?? 0) > 0 && (
              <div className="flex justify-between text-success">
                <dt>
                  {t('discount')}
                  {order.couponCode ? ` (${order.couponCode})` : ''}
                </dt>
                <dd>− {formatPrice(order.discount ?? 0)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted">{t('shippingFee')}</dt>
              <dd>{order.shipping ? formatPrice(order.shipping) : t('free')}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-2 text-base font-semibold">
              <dt>{t('total')}</dt>
              <dd>{formatPrice(order.total)}</dd>
            </div>
          </dl>
        </section>

        <section className="card card-border space-y-4 p-5 text-sm">
          <div>
            <h3 className="mb-1 font-semibold" style={{ fontFamily: 'var(--rbs-font-body)' }}>
              Delivery
            </h3>
            <p className="capitalize">{order.deliveryLabel || '—'}</p>
            {order.zoneName && <p className="text-muted">{order.zoneName}</p>}
          </div>
          <div>
            <h3 className="mb-1 font-semibold" style={{ fontFamily: 'var(--rbs-font-body)' }}>
              {t('shippingAddress')}
            </h3>
            <p>{order.customerName}</p>
            <p className="text-muted">
              {[order.address?.line1, order.address?.line2, order.address?.landmark].filter(Boolean).join(', ')}
              <br />
              {order.address?.city}, {order.address?.state} {order.address?.pincode}
            </p>
            <p className="text-muted">+91 {order.phone}</p>
          </div>
          <div>
            <h3 className="mb-1 font-semibold" style={{ fontFamily: 'var(--rbs-font-body)' }}>
              {t('paymentMethod')}
            </h3>
            <p>
              {order.paymentMethod === 'cod' ? t('payCod') : 'Online payment'} ·{' '}
              <span className="text-muted">{order.paymentStatus === 'paid' ? 'Paid' : order.paymentStatus === 'refunded' ? 'Refunded' : order.paymentMethod === 'cod' ? 'Pay on delivery' : 'Pending'}</span>
            </p>
          </div>
          {order.isGift && order.giftMessage && (
            <div>
              <h3 className="mb-1 font-semibold" style={{ fontFamily: 'var(--rbs-font-body)' }}>
                🎁 {t('giftMessage')}
              </h3>
              <p className="whitespace-pre-line italic text-muted">“{order.giftMessage}”</p>
            </div>
          )}
          {order.trackingUrl && (
            <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
              <Icon name="truck" size={16} /> Track shipment
            </a>
          )}
          <p className="border-t border-line pt-3 text-xs text-muted">
            Status: <strong className="text-ink">{info.customer}</strong>
            {settings.whatsapp ? ' · Questions? WhatsApp us with your order number.' : ''}
          </p>
        </section>
      </div>

      <div className="mt-10 text-center">
        <Link href="/shop" className="btn btn-outline">
          {t('continueShopping')}
        </Link>
      </div>
    </div>
  )
}
