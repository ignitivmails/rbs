export const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export const pagePath = (slug?: string | null) => (!slug || slug === 'home' ? '/' : `/${slug}`)

/** URL the admin opens for live preview / preview: enables Next.js draft mode, then redirects. */
export const previewUrl = (path: string) => `${serverURL}/next/preview?path=${encodeURIComponent(path)}`
