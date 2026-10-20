/**
 * The dev server compiles each route on first request. Warm them up once so the browser
 * tests don't hit compile timeouts (ChunkLoadError) mid-test.
 */
const PAGES = [
  '/',
  '/shop',
  '/products/saffron-kaju-katli',
  '/products/classic-sponge-rosogolla',
  '/cart',
  '/checkout',
  '/build-your-box/mishti-box',
  '/account',
  '/corporate-gifting',
  '/order/none?t=x',
  '/rbsadmin',
]

export default async function setup() {
  const base = 'http://localhost:3000'
  for (const path of PAGES) {
    const started = Date.now()
    try {
      await fetch(`${base}${path}`, { signal: AbortSignal.timeout(300_000) })
      console.log(`  warmed ${path} (${Math.round((Date.now() - started) / 1000)}s)`)
    } catch (err) {
      console.warn(`  warm-up failed for ${path}:`, (err as Error).message)
    }
  }
}
