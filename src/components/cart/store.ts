'use client'

import { useEffect, useState } from 'react'
import { create } from 'zustand'
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware'

import { trackAddToCart } from '@/lib/analytics'
import type { ID } from '@/lib/types'

export type CartItem = {
  key: string
  productId: ID
  slug: string
  name: string
  variantId: string
  variantLabel: string
  price: number
  mrp?: number | null
  image?: string | null
  qty: number
  zoneIds: string[]
  /** Used for "mix & match" quantity discounts across a category. */
  categoryIds?: string[]
  /** Link for the line (defaults to the product page). */
  href?: string
  /** Build-your-own box selection (re-priced on the server). */
  box?: { boxId: ID; sizeId: string; contents: Array<{ itemId: string; qty: number }>; packagingId?: string | null; message?: string | null }
}

export type CartItemInput = Omit<CartItem, 'key' | 'qty'> & { key?: string }

type CartState = {
  items: CartItem[]
  isOpen: boolean
  pincode: string
  add: (item: CartItemInput, qty?: number) => void
  setQty: (key: string, qty: number) => void
  remove: (key: string) => void
  clear: () => void
  open: () => void
  close: () => void
  setPincode: (pincode: string) => void
}

const MAX_QTY = 50

/** localStorage that never throws (private mode, blocked storage, SSR). */
const safeStorage: StateStorage = {
  getItem: (name) => {
    try {
      return localStorage.getItem(name)
    } catch {
      return null
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, value)
    } catch {
      /* ignore */
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name)
    } catch {
      /* ignore */
    }
  },
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      pincode: '',
      add: (item, qty = 1) => {
        trackAddToCart({ id: String(item.productId), name: item.name, price: item.price, qty, variant: item.variantLabel })
        set((state) => {
          const key = item.key ?? `${item.productId}:${item.variantId}`
          const existing = state.items.find((i) => i.key === key)
          const items = existing
            ? state.items.map((i) => (i.key === key ? { ...i, ...item, qty: Math.min(MAX_QTY, i.qty + qty) } : i))
            : [...state.items, { ...item, key, qty: Math.min(MAX_QTY, qty) }]
          return { items }
        })
      },
      setQty: (key, qty) =>
        set((state) => ({
          items: qty <= 0 ? state.items.filter((i) => i.key !== key) : state.items.map((i) => (i.key === key ? { ...i, qty: Math.min(MAX_QTY, qty) } : i)),
        })),
      remove: (key) => set((state) => ({ items: state.items.filter((i) => i.key !== key) })),
      clear: () => set({ items: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      setPincode: (pincode) => set({ pincode }),
    }),
    {
      name: 'rbs-cart',
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({ items: state.items, pincode: state.pincode }),
    },
  ),
)

export const cartCount = (items: CartItem[]) => items.reduce((n, i) => n + i.qty, 0)
export const cartSubtotal = (items: CartItem[]) => items.reduce((n, i) => n + i.price * i.qty, 0)
export const cartSavings = (items: CartItem[]) =>
  items.reduce((n, i) => n + (i.mrp && i.mrp > i.price ? (i.mrp - i.price) * i.qty : 0), 0)

/** True after the first client render — avoids hydration mismatches with persisted state. */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])
  return hydrated
}
