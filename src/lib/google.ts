/** Google OAuth 2.0 (authorization-code flow) — enabled when GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET are set. */

export const googleConfigured = () => Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)

export const googleRedirectUri = () => `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/auth/google/callback`

export function googleAuthUrl(state: string) {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID ?? '',
    redirect_uri: googleRedirectUri(),
    response_type: 'code',
    scope: 'openid email profile',
    state,
    prompt: 'select_account',
  })
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`
}

export async function exchangeGoogleCode(code: string) {
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID ?? '',
      client_secret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      redirect_uri: googleRedirectUri(),
      grant_type: 'authorization_code',
    }),
  })
  if (!tokenRes.ok) throw new Error(`Google token exchange failed (${tokenRes.status})`)
  const { id_token } = (await tokenRes.json()) as { id_token?: string }
  if (!id_token) throw new Error('Google did not return an ID token')

  // Google validates the token signature for us.
  const infoRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(id_token)}`)
  if (!infoRes.ok) throw new Error('Invalid Google ID token')
  const info = (await infoRes.json()) as { aud?: string; sub?: string; email?: string; email_verified?: string | boolean; name?: string; iss?: string }
  if (info.aud !== process.env.GOOGLE_CLIENT_ID || !info.sub || !['accounts.google.com', 'https://accounts.google.com'].includes(info.iss ?? '')) {
    throw new Error('Google ID token audience/issuer mismatch')
  }
  return {
    sub: info.sub,
    email: info.email,
    emailVerified: info.email_verified === true || info.email_verified === 'true',
    name: info.name,
  }
}

/** Only allow same-site relative redirects after login. */
export const safeReturnTo = (value?: string | null) => (value && value.startsWith('/') && !value.startsWith('//') ? value : '/account')
