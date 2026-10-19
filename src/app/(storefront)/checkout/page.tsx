import type { Metadata } from 'next'

import { CheckoutClient } from '@/components/checkout/CheckoutClient'
import { getSite } from '@/lib/data'
import { getCustomer } from '@/lib/session'

export const metadata: Metadata = { title: 'Checkout', robots: { index: false } }

export default async function CheckoutPage() {
  const [{ t, settings }, customer] = await Promise.all([getSite(), getCustomer()])
  const account = customer
    ? {
        name: customer.name ?? '',
        email: customer.email ?? '',
        phone: customer.phone ?? '',
        phoneVerified: Boolean(customer.phoneVerified),
        addresses: customer.addresses ?? [],
      }
    : null
  return (
    <div className="container-x py-8 md:py-12">
      <h1 className="mb-8 text-4xl">{t('checkoutTitle')}</h1>
      <CheckoutClient giftOptions={settings.giftOptions !== false} account={account} />
    </div>
  )
}
