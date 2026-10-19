import crypto from 'crypto'
import { revalidateTag } from 'next/cache'

import { CMS_TAG } from '@/lib/constants'

/**
 * Clears the storefront's CMS cache. Used by scripts that change content outside Next.js
 * (e.g. `npm run seed`). Protected by a header derived from PAYLOAD_SECRET.
 */
export async function POST(request: Request) {
  const expected = crypto.createHash('sha256').update(`revalidate:${process.env.PAYLOAD_SECRET ?? ''}`).digest('hex')
  const given = request.headers.get('x-revalidate-token') ?? ''
  if (given.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(given), Buffer.from(expected))) {
    return new Response('Forbidden', { status: 403 })
  }
  revalidateTag(CMS_TAG)
  return Response.json({ revalidated: true })
}
