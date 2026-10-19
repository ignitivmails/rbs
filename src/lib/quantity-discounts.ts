/**
 * Tiered ("buy more, save more") quantity discounts.
 * Pure functions — used by the server quote (source of truth) and by the cart for live hints.
 */

export type QtyTier = { minQty: number; type: 'percent' | 'flatPerUnit'; value: number }

export type QtyRule = {
  id: string
  name: string
  description: string
  /** eachProduct: count each product on its own · combined: count all qualifying items together */
  applyTo: 'eachProduct' | 'combined'
  productIds: string[]
  categoryIds: string[]
  tiers: QtyTier[] // ascending by minQty
}

export type QtyLine = { key: string; productId: string; categoryIds: string[]; unitPrice: number; qty: number }

type RuleDoc = {
  id: string | number
  name?: string | null
  description?: string | null
  active?: boolean | null
  applyTo?: string | null
  products?: unknown[] | null
  categories?: unknown[] | null
  tiers?: Array<{ minQty?: number | null; type?: string | null; value?: number | null }> | null
  startsAt?: string | null
  endsAt?: string | null
}

const idOf = (v: unknown) => String(typeof v === 'object' && v !== null ? (v as { id: unknown }).id : v)

/** Active, in-schedule rules in a compact, client-safe shape. */
export function normalizeRules(docs: RuleDoc[], now = Date.now()): QtyRule[] {
  return docs
    .filter((d) => d.active !== false)
    .filter((d) => (!d.startsAt || now >= new Date(d.startsAt).getTime()) && (!d.endsAt || now <= new Date(d.endsAt).getTime()))
    .map((d) => ({
      id: String(d.id),
      name: d.name ?? '',
      description: d.description ?? '',
      applyTo: d.applyTo === 'combined' ? ('combined' as const) : ('eachProduct' as const),
      productIds: (d.products ?? []).map(idOf),
      categoryIds: (d.categories ?? []).map(idOf),
      tiers: (d.tiers ?? [])
        .filter((t) => (t.minQty ?? 0) >= 2 && (t.value ?? 0) > 0)
        .map((t) => ({ minQty: Number(t.minQty), type: t.type === 'flatPerUnit' ? ('flatPerUnit' as const) : ('percent' as const), value: Number(t.value) }))
        .sort((a, b) => a.minQty - b.minQty),
    }))
    .filter((r) => r.tiers.length > 0 && (r.productIds.length > 0 || r.categoryIds.length > 0))
}

export const ruleMatches = (rule: QtyRule, productId: string, categoryIds: string[] = []) =>
  rule.productIds.includes(String(productId)) || categoryIds.some((c) => rule.categoryIds.includes(String(c)))

export const rulesForProduct = (rules: QtyRule[], productId: string, categoryIds: string[] = []) =>
  rules.filter((r) => ruleMatches(r, productId, categoryIds))

export const tierFor = (rule: QtyRule, qty: number) => [...rule.tiers].reverse().find((t) => qty >= t.minQty) ?? null
export const nextTier = (rule: QtyRule, qty: number) => rule.tiers.find((t) => t.minQty > qty) ?? null

export function tierDiscount(tier: QtyTier | null, unitPrice: number, qty: number) {
  if (!tier) return 0
  if (tier.type === 'percent') return Math.round((unitPrice * qty * Math.min(tier.value, 90)) / 100)
  return Math.min(tier.value, unitPrice) * qty
}

/** "10% off" or "₹20 off each" */
export const tierLabel = (tier: QtyTier) => (tier.type === 'percent' ? `${tier.value}% off` : `₹${tier.value} off each`)

/** Quantity that counts towards a rule for a given line. */
function countedQty(rule: QtyRule, line: QtyLine, lines: QtyLine[]) {
  if (rule.applyTo === 'combined') return lines.filter((l) => ruleMatches(rule, l.productId, l.categoryIds)).reduce((n, l) => n + l.qty, 0)
  return lines.filter((l) => l.productId === line.productId).reduce((n, l) => n + l.qty, 0)
}

export type LineDiscount = { amount: number; label: string; next: { count: number; label: string } | null }

/**
 * Best discount per line (a line never gets two rules), plus a "add N more" hint
 * towards the next tier of the most relevant rule.
 */
export function computeQuantityDiscounts(rules: QtyRule[], lines: QtyLine[]) {
  const perLine: Record<string, LineDiscount> = {}
  let total = 0
  for (const line of lines) {
    let best: LineDiscount = { amount: 0, label: '', next: null }
    for (const rule of rules) {
      if (!ruleMatches(rule, line.productId, line.categoryIds)) continue
      const qty = countedQty(rule, line, lines)
      const tier = tierFor(rule, qty)
      const amount = tierDiscount(tier, line.unitPrice, line.qty)
      const upcoming = nextTier(rule, qty)
      const next = upcoming ? { count: upcoming.minQty - qty, label: tierLabel(upcoming) } : null
      if (amount > best.amount || (best.amount === 0 && !best.next && next)) {
        best = { amount, label: tier ? tierLabel(tier) : '', next }
      }
    }
    perLine[line.key] = best
    total += best.amount
  }
  return { total, perLine }
}
