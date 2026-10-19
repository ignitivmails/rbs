import { expect, type Page } from '@playwright/test'

export const TEST_NAME = 'E2E Tester'

let counter = 0
/** A fresh, valid Indian mobile number per call (avoids OTP resend throttling). */
export const testPhone = () => `9${String(Date.now()).slice(-7)}${String(counter++ % 100).padStart(2, '0')}`

/** Reads the locally displayed OTP ("Local test mode — your code is 123456"). */
export async function readDevOtp(page: Page) {
  const hint = page.getByText(/Local test mode — your code is/)
  await expect(hint).toBeVisible()
  const code = (await hint.locator('strong').textContent())?.trim() ?? ''
  expect(code).toMatch(/^\d{6}$/)
  return code
}

/** Navigate and wait until React has hydrated (so clicks and typing are handled). */
export async function gotoReady(page: Page, path: string) {
  await page.goto(path)
  await page.waitForSelector('html[data-hydrated="true"]', { state: 'attached', timeout: 120_000 })
}

export async function addProductToCart(page: Page, slug: string, qty = 1) {
  await gotoReady(page, `/products/${slug}`)
  for (let i = 1; i < qty; i++) await page.getByRole('button', { name: 'Increase quantity' }).first().click()
  await page.getByRole('button', { name: /Add to Cart/ }).first().click()
  await expect(page.getByRole('dialog', { name: 'Your cart' })).toBeVisible()
}
