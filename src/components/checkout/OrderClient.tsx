'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'

import { useCart } from '@/components/cart/store'
import { useStore } from '@/components/StoreProvider'
import { trackPurchase } from '@/lib/analytics'
import { resumePaymentAction } from '@/lib/checkout-actions'

import { MockPaymentDialog, openRazorpay } from './payment'

/** Empties the cart once an order is confirmed, and reports the purchase to analytics. */
export function ClearCartOnConfirm({ purchase }: { purchase?: { orderNumber: string; value: number; items: Array<{ id: string; name: string; price: number; qty: number }> } }) {
  const clear = useCart((s) => s.clear)
  useEffect(() => {
    clear()
    if (purchase) trackPurchase(purchase.orderNumber, purchase.value, purchase.items)
  }, [clear, purchase])
  return null
}

/** "Complete payment" for an order still awaiting online payment. */
export function PaymentRetry({ orderNumber, token }: { orderNumber: string; token: string }) {
  const { t } = useStore()
  const router = useRouter()
  const [pending, start] = useTransition()
  const [message, setMessage] = useState<string | null>(null)
  const [mockAmount, setMockAmount] = useState<number | null>(null)
  const order = { orderNumber, token }
  const handlers = {
    onPaid: () => router.replace(`/order/${orderNumber}?t=${token}&placed=1`),
    onAbandon: (msg?: string) => {
      setMockAmount(null)
      if (msg) setMessage(msg)
      router.refresh()
    },
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        disabled={pending}
        className="btn btn-primary px-8 py-3.5"
        onClick={() =>
          start(async () => {
            setMessage(null)
            const result = await resumePaymentAction(orderNumber, token)
            if (!result.ok || !result.payment) {
              setMessage(result.message ?? t('paymentFailed'))
              router.refresh()
              return
            }
            if (result.payment.mode === 'mock') setMockAmount(result.payment.amount)
            else if (result.payment.mode === 'razorpay') void openRazorpay(result.payment, order, handlers)
          })
        }
      >
        {pending ? '…' : t('retryPayment')}
      </button>
      {message && <p className="text-sm text-danger">{message}</p>}
      {mockAmount !== null && <MockPaymentDialog amount={mockAmount} order={order} handlers={handlers} />}
    </div>
  )
}
