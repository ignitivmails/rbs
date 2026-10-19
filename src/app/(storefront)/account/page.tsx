import type { Metadata } from 'next'
import Link from 'next/link'

import { AddressBook, LoginMethods, LoginPanel, LogoutButton, ProfileForm } from '@/components/account/AccountClient'
import { getSite } from '@/lib/data'
import { googleConfigured, safeReturnTo } from '@/lib/google'
import { statusInfo } from '@/lib/order-status'
import { getPayloadClient } from '@/lib/payload'
import { getCustomer } from '@/lib/session'
import type { Order } from '@/lib/types'
import { cn, formatPrice } from '@/lib/utils'

export const metadata: Metadata = { title: 'My account', robots: { index: false } }

type Props = { searchParams: Promise<{ returnTo?: string; error?: string }> }

const dateFmt = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' })

export default async function AccountPage({ searchParams }: Props) {
  const sp = await searchParams
  const [customer, { t }] = await Promise.all([getCustomer(), getSite()])

  if (!customer) {
    return (
      <div className="container-x py-12 md:py-20">
        <LoginPanel googleEnabled={googleConfigured()} returnTo={safeReturnTo(sp.returnTo)} error={sp.error} />
      </div>
    )
  }

  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'orders',
    where: { customer: { equals: customer.id } },
    sort: '-createdAt',
    limit: 50,
    depth: 0,
  })
  const orders = docs as unknown as Order[]

  return (
    <div className="container-x py-10 md:py-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-muted">{t('accountTitle')}</p>
          <h1 className="mt-1 text-4xl">{t('accountGreeting', { name: customer.name?.split(' ')[0] || 'there' })}</h1>
        </div>
        <LogoutButton />
      </div>

      {sp.error && <p className="mb-6 rounded-theme bg-danger/10 px-4 py-3 text-sm text-danger">{sp.error}</p>}

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="card card-border p-5 md:p-6">
          <h2 className="mb-4 text-2xl">{t('myOrders')}</h2>
          {orders.length ? (
            <ul className="divide-y divide-line">
              {orders.map((o) => {
                const s = statusInfo(o.status)
                const closed = ['cancelled', 'refunded', 'rto'].includes(o.status)
                return (
                  <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                    <div>
                      <p className="font-semibold">{o.orderNumber}</p>
                      <p className="text-sm text-muted">
                        {o.createdAt ? dateFmt.format(new Date(o.createdAt)) : ''} · {(o.items ?? []).reduce((n, i) => n + i.qty, 0)} items · {formatPrice(o.total)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          'rounded-full px-3 py-1 text-xs font-medium',
                          closed ? 'bg-danger/10 text-danger' : o.status === 'delivered' ? 'bg-success/15 text-success' : 'bg-secondary text-ink',
                        )}
                      >
                        {s.customer}
                      </span>
                      {o.accessToken && (
                        <Link href={`/order/${o.orderNumber}?t=${o.accessToken}`} className="text-sm font-medium text-primary hover:underline">
                          {t('viewOrder')} →
                        </Link>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted">{t('noOrders')}</p>
              <Link href="/shop" className="btn btn-primary mt-4">
                {t('continueShopping')}
              </Link>
            </div>
          )}
        </section>

        <div className="space-y-6">
          <section className="card card-border p-5 md:p-6">
            <h2 className="mb-4 text-2xl">{t('profile')}</h2>
            <ProfileForm name={customer.name ?? ''} email={customer.email ?? ''} />
            <h3 className="mb-3 mt-6 text-lg">{t('loginMethods')}</h3>
            <LoginMethods
              phone={customer.phone}
              phoneVerified={Boolean(customer.phoneVerified)}
              googleLinked={Boolean(customer.googleId)}
              googleEnabled={googleConfigured()}
            />
          </section>
        </div>

        <section className="card card-border p-5 md:p-6 lg:col-span-2">
          <h2 className="mb-4 text-2xl">{t('savedAddresses')}</h2>
          <AddressBook addresses={customer.addresses ?? []} />
        </section>
      </div>
    </div>
  )
}
