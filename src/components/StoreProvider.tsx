'use client'

import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'

import type { QtyRule } from '@/lib/quantity-discounts'
import { DEFAULT_STRINGS, interpolate, type StringKey, type Strings } from '@/lib/strings'

type StoreContextValue = {
  strings: Strings
  currency: string
  /** Active quantity-discount rules, for live cart hints (the server re-checks at checkout). */
  qtyRules: QtyRule[]
  t: (key: StringKey, vars?: Record<string, string | number>) => string
}

const fallback: StoreContextValue = {
  strings: DEFAULT_STRINGS,
  currency: 'INR',
  qtyRules: [],
  t: (key, vars) => interpolate(DEFAULT_STRINGS[key], vars),
}

const StoreContext = createContext<StoreContextValue>(fallback)

/** Makes CMS-managed UI text and store settings available to client components. */
export function StoreProvider({
  strings,
  currency,
  qtyRules = [],
  children,
}: {
  strings: Strings
  currency: string
  qtyRules?: QtyRule[]
  children: ReactNode
}) {
  const value = useMemo<StoreContextValue>(
    () => ({ strings, currency, qtyRules, t: (key, vars) => interpolate(strings[key] || DEFAULT_STRINGS[key], vars) }),
    [strings, currency, qtyRules],
  )
  // Marks the page as interactive (used by the browser tests to avoid typing before hydration).
  useEffect(() => {
    document.documentElement.dataset.hydrated = 'true'
  }, [])
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export const useStore = () => useContext(StoreContext)
