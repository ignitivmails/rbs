import { getQuantityRules, getSite } from '@/lib/data'
import { rulesForProduct, tierLabel } from '@/lib/quantity-discounts'

/** "Buy more, save more" tier table on the product page. Renders nothing without a matching rule. */
export async function QuantityOffer({ productId, categoryIds }: { productId: string; categoryIds: string[] }) {
  const [{ t }, rules] = await Promise.all([getSite(), getQuantityRules()])
  const matching = rulesForProduct(rules, productId, categoryIds)
  if (!matching.length) return null

  return (
    <div className="space-y-3">
      {matching.map((rule) => (
        <div key={rule.id} className="rounded-theme border border-dashed border-accent bg-accent/5 p-4">
          <p className="font-semibold">🏷️ {t('qtyOfferTitle')}</p>
          {rule.description && <p className="mt-0.5 text-sm text-muted">{rule.description}</p>}
          <ul className="mt-3 flex flex-wrap gap-2">
            {rule.tiers.map((tier) => (
              <li key={tier.minQty} className="rounded-full bg-surface px-3 py-1 text-sm shadow-sm">
                {t('qtyTierLine', { qty: tier.minQty })}: <strong className="text-success">{tierLabel(tier)}</strong>
              </li>
            ))}
          </ul>
          {rule.applyTo === 'combined' && <p className="mt-2 text-xs text-muted">{t('qtyOfferMix')}</p>}
        </div>
      ))}
    </div>
  )
}
