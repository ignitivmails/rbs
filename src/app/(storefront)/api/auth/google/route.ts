import crypto from 'crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { googleAuthUrl, googleConfigured, safeReturnTo } from '@/lib/google'
import { signToken } from '@/lib/session'

const OAUTH_COOKIE = 'rbs_oauth'

/** Starts Google sign-in (or account linking with ?link=1). */
export async function GET(request: Request) {
  if (!googleConfigured()) return new Response('Google sign-in is not configured.', { status: 404 })
  const url = new URL(request.url)
  const state = crypto.randomBytes(16).toString('hex')
  const jar = await cookies()
  jar.set(
    OAUTH_COOKIE,
    signToken({ state, returnTo: safeReturnTo(url.searchParams.get('returnTo')), link: url.searchParams.get('link') === '1' }, 600),
    { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 600 },
  )
  redirect(googleAuthUrl(state))
}
