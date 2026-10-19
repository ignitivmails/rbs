import type { Metadata } from 'next'
import Link from 'next/link'

import { Listing } from '@/components/product/Listing'
import { getProducts, getSite, isSortKey } from '@/lib/data'

export const metadata: Metadata = { title: 'Search', robots: { index: false } }

type Props = { searchParams: Promise<{ q?: string; sort?: string }> }

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams
  const { t, header } = await getSite()
  const q = (sp.q ?? '').trim().slice(0, 80)
  const sort = isSortKey(sp.sort) ? sp.sort : 'featured'
  const products = q ? await getProducts({ search: q, sort }) : []

  return (
    <div className="container-x py-8 md:py-12">
      <form action="/search" role="search" className="mb-8 flex max-w-xl gap-2">
        <input
          name="q"
          type="search"
          defaultValue={q}
          placeholder={t('searchPlaceholder')}
          aria-label={t('searchPlaceholder')}
          className="min-w-0 flex-1 rounded-full border border-line bg-surface px-5 py-3 outline-none focus:border-primary"
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>

      {q ? (
        <>
          <h1 className="mb-6 text-3xl">{t('searchResults', { query: q })}</h1>
          <Listing products={products} sort={sort} query={{ q }} />
        </>
      ) : (
        <div>
          <h1 className="mb-4 text-3xl">{t('popularSearches')}</h1>
          <div className="flex flex-wrap gap-2">
            {(header.popularSearches ?? []).map((term) => (
              <Link key={term} href={`/search?q=${encodeURIComponent(term)}`} className="rounded-full border border-line bg-surface px-4 py-1.5 text-sm hover:border-primary hover:text-primary">
                {term}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
