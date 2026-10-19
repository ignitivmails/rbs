'use client'

import React from 'react'
import { useFormFields } from '@payloadcms/ui'

const linkStyle: React.CSSProperties = {
  display: 'block',
  padding: '8px 12px',
  border: '1px solid var(--theme-elevation-150)',
  borderRadius: 4,
  textDecoration: 'none',
  color: 'var(--theme-elevation-800)',
  fontSize: 13,
}

/** Sidebar shortcuts on an order: printable invoice, packing slip and the customer's order page. */
export const OrderLinks: React.FC = () => {
  const number = useFormFields(([fields]) => fields?.orderNumber?.value as string | undefined)
  const token = useFormFields(([fields]) => fields?.accessToken?.value as string | undefined)
  if (!number) return null
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
      <a href={`/next/invoice/${number}`} target="_blank" rel="noreferrer" style={linkStyle}>
        🧾 Print invoice
      </a>
      <a href={`/next/invoice/${number}?type=slip`} target="_blank" rel="noreferrer" style={linkStyle}>
        📦 Packing slip
      </a>
      {token && (
        <a href={`/order/${number}?t=${token}`} target="_blank" rel="noreferrer" style={linkStyle}>
          👁 Customer’s order page
        </a>
      )}
    </div>
  )
}

/** "Export CSV" above the orders list (optional date range + status). */
export const OrdersExport: React.FC = () => {
  const [from, setFrom] = React.useState('')
  const [to, setTo] = React.useState('')
  const [status, setStatus] = React.useState('')
  const qs = new URLSearchParams(Object.entries({ from, to, status }).filter(([, v]) => v)).toString()
  const input: React.CSSProperties = { padding: '6px 8px', border: '1px solid var(--theme-elevation-150)', borderRadius: 4, background: 'var(--theme-input-bg)', color: 'inherit' }
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', margin: '0 0 16px', fontSize: 13 }}>
      <span style={{ opacity: 0.7 }}>Export orders:</span>
      <input type="date" aria-label="From" value={from} onChange={(e) => setFrom(e.target.value)} style={input} />
      <span>to</span>
      <input type="date" aria-label="To" value={to} onChange={(e) => setTo(e.target.value)} style={input} />
      <select aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value)} style={input}>
        <option value="">All statuses</option>
        {['pending_payment', 'paid', 'confirmed_cod', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded', 'rto'].map((s) => (
          <option key={s} value={s}>
            {s.replace(/_/g, ' ')}
          </option>
        ))}
      </select>
      <a href={`/next/orders-export${qs ? `?${qs}` : ''}`} style={{ ...linkStyle, display: 'inline-block' }}>
        ⬇ Download CSV
      </a>
    </div>
  )
}

/** Compact total + payment line in the sidebar. */
export const OrderSummary: React.FC = () => {
  const total = useFormFields(([fields]) => fields?.total?.value as number | undefined)
  const method = useFormFields(([fields]) => fields?.paymentMethod?.value as string | undefined)
  const paymentStatus = useFormFields(([fields]) => fields?.paymentStatus?.value as string | undefined)
  if (typeof total !== 'number') return null
  return (
    <div style={{ marginBottom: 24, padding: 12, borderRadius: 4, background: 'var(--theme-elevation-50)' }}>
      <div style={{ fontSize: 22, fontWeight: 700 }}>₹{total.toLocaleString('en-IN')}</div>
      <div style={{ fontSize: 12, opacity: 0.75 }}>
        {method === 'cod' ? 'Cash on Delivery' : 'Online payment'} · {paymentStatus ?? 'pending'}
      </div>
    </div>
  )
}
