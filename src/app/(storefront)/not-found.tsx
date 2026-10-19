import Link from 'next/link'

import { getSite } from '@/lib/data'

export default async function NotFound() {
  const { t } = await getSite()
  return (
    <div className="container-x flex flex-col items-center py-24 text-center">
      <p className="font-heading text-7xl text-primary">404</p>
      <h1 className="mt-4 text-3xl">{t('notFoundTitle')}</h1>
      <p className="mt-3 max-w-md text-muted">{t('notFoundText')}</p>
      <Link href="/" className="btn btn-primary mt-8">
        {t('backHome')}
      </Link>
    </div>
  )
}
