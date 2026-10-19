import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

import { getPayloadClient } from '@/lib/payload'

/** Enables draft mode for logged-in admins, then redirects to the page being previewed. */
export async function GET(request: Request) {
  const url = new URL(request.url)
  const path = url.searchParams.get('path') || '/'
  if (!path.startsWith('/') || path.startsWith('//')) {
    return new Response('Invalid path', { status: 400 })
  }

  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: request.headers })
  if (!user) {
    return new Response('Please log in to the admin panel to preview drafts.', { status: 403 })
  }

  const draft = await draftMode()
  draft.enable()
  redirect(path)
}
