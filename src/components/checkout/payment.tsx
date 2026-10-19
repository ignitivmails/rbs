'use client'

import { useState } from 'react'

import { mockPaymentAction, verifyRazorpayAction, type PaymentStart } from '@/lib/checkout-actions'
import { Spinner } from '@/components/Spinner'
import { formatPrice } from '@/lib/utils'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay?: any
  }
}

type Handlers = { onPaid: () => void; onAbandon: (message?: string) => void }

function loadRazorpay(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false)
  if (window.Razorpay) return Promise.resolve(true)
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

/** Opens Razorpay Checkout and verifies the signature on success. */
export async function openRazorpay(
  payment: Extract<PaymentStart, { mode: 'razorpay' }>,
  order: { orderNumber: string; token: string },
  handlers: Handlers,
) {
  if (!(await loadRazorpay())) return handlers.onAbandon('Could not load the payment window. Check your connection and try again.')
  const rz = new window.Razorpay({
    key: payment.keyId,
    amount: payment.amount,
    currency: 'INR',
    name: payment.name,
    description: payment.description,
    order_id: payment.razorpayOrderId,
    prefill: payment.prefill,
    theme: { color: payment.color },
    // Put a "Pay using UPI" block at the top; the account's other enabled methods follow.
    ...(payment.upiFirst
      ? {
          config: {
            display: {
              blocks: { upi: { name: 'Pay using UPI', instruments: [{ method: 'upi' }] } },
              sequence: ['block.upi'],
              preferences: { show_default_blocks: true },
            },
          },
        }
      : {}),
    handler: async (resp: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
      const result = await verifyRazorpayAction({
        orderNumber: order.orderNumber,
        token: order.token,
        razorpayOrderId: resp.razorpay_order_id,
        razorpayPaymentId: resp.razorpay_payment_id,
        razorpaySignature: resp.razorpay_signature,
      })
      if (result.ok) handlers.onPaid()
      else handlers.onAbandon(result.message)
    },
    modal: { ondismiss: () => handlers.onAbandon() },
  })
  rz.open()
}

/** Shown instead of Razorpay when no API keys are configured (local testing). */
export function MockPaymentDialog({
  amount,
  order,
  handlers,
}: {
  amount: number
  order: { orderNumber: string; token: string }
  handlers: Handlers
}) {
  const [busy, setBusy] = useState(false)
  const run = async (success: boolean) => {
    setBusy(true)
    const result = await mockPaymentAction(order.orderNumber, order.token, success)
    if (result.ok) handlers.onPaid()
    else handlers.onAbandon(result.message)
  }
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-label="Test payment">
      <div className="w-full max-w-sm rounded-theme bg-surface p-6 text-center shadow-2xl">
        <p className="eyebrow text-accent">Test mode</p>
        <h2 className="mt-2 text-2xl">Simulated payment</h2>
        <p className="mt-2 text-sm text-muted">
          No Razorpay keys are configured, so no real payment is taken. Add <code>RAZORPAY_KEY_ID</code> and <code>RAZORPAY_KEY_SECRET</code> to <code>.env</code> to use
          Razorpay test mode.
        </p>
        <p className="mt-4 font-heading text-3xl">{formatPrice(amount)}</p>
        <p className="text-xs text-muted">Order {order.orderNumber}</p>
        <div className="mt-6 flex flex-col gap-2">
          <button type="button" disabled={busy} onClick={() => run(true)} className="btn btn-primary w-full">
            {busy ? <Spinner /> : '✓'} Simulate successful payment
          </button>
          <button type="button" disabled={busy} onClick={() => run(false)} className="btn btn-outline w-full">
            ✕ Simulate failed payment
          </button>
        </div>
      </div>
    </div>
  )
}
