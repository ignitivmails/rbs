import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { loginWithGoogle } from '@/lib/customers'
import { exchangeGoogleCode, googleConfigured, safeReturnTo } from '@/lib/google'
import { getPayloadClient } from '@/lib/payload'
import { getCustomer, setCustomerSession, verifyToken } from '@/lib/session'

const OAUTH_COOKIE = 'rbs_oauth'

export async function GET(request: Request) {
  if (!googleConfigured()) return new Response('Google sign-in is not configured.', { status: 404 })
  const url = new URL(request.url)
  const jar = await cookies()
  const flow = verifyToken<{ state: string; returnTo: string; link: boolean }>(jar.get(OAUTH_COOKIE)?.value)
  jar.set(OAUTH_COOKIE, '', { path: '/', maxAge: 0 })

  const fail = (reason: string) => redirect(`/account?error=${encodeURIComponent(reason)}`)
  if (!flow || flow.state !== url.searchParams.get('state')) fail('Your sign-in session expired. Please try again.')
  const code = url.searchParams.get('code')
  if (!code) fail('Google sign-in was cancelled.')

  let destination = safeReturnTo(flow!.returnTo)
  try {
    const profile = await exchangeGoogleCode(code!)
    const payload = await getPayloadClient()
    const current = flow!.link ? await getCustomer() : null
    const result = await loginWithGoogle(payload, profile, current)
    if (result.error || !result.customer) {
      destination = `/account?error=${encodeURIComponent(result.error ?? 'Google sign-in failed.')}`
    } else {
      await setCustomerSession(result.customer.id)
    }
  } catch {
    destination = `/account?error=${encodeURIComponent('Google sign-in failed. Please try again.')}`
  }
  redirect(destination)
}
