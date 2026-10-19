import type { Metadata } from 'next'

import { CartView } from '@/components/cart/CartView'
import { getSite } from '@/lib/data'

export const metadata: Metadata = { title: 'Cart', robots: { index: false } }

export default async function CartPage() {
  const { t } = await getSite()
  return (
    <div className="container-x py-8 md:py-12">
      <h1 className="mb-8 text-4xl">{t('cartTitle')}</h1>
      <CartView />
    </div>
  )
}
