import { expect, test } from '@playwright/test'

import { addProductToCart, gotoReady, readDevOtp, TEST_NAME, testPhone } from './helpers'

test('homepage renders all main sections @mobile', async ({ page }) => {
  await gotoReady(page, '/')
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Shop by category' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Our festive gifting favourites' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'From the Sweets Library' })).toBeVisible()
  await expect(page.getByRole('contentinfo')).toBeVisible()
})

test('mobile menu drawer fills the screen and scrolls @mobile', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) >= 768, 'mobile-only menu')
  await gotoReady(page, '/')
  await page.getByRole('button', { name: 'Open menu' }).click()
  const drawer = page.getByRole('dialog', { name: 'Menu' })
  await expect(drawer).toBeVisible()
  // Regression: the header's backdrop-blur once squashed this fixed drawer to the header's height.
  const height = await drawer.evaluate((el) => (el.querySelector('.overflow-y-auto') as HTMLElement).clientHeight)
  expect(height).toBeGreaterThan((page.viewportSize()?.height ?? 0) * 0.9)
  await drawer.getByRole('button', { name: /Shop All/ }).click()
  await expect(drawer.getByRole('link', { name: 'Classic Sponge Rosogolla' })).toBeVisible()
  await drawer.getByRole('link', { name: 'Our Stores' }).click()
  await expect(page).toHaveURL(/\/our-stores/)
  await expect(drawer).toBeHidden()
})

test('mega menu opens on hover', async ({ page }) => {
  await gotoReady(page, '/')
  await page.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Shop All' }).hover()
  await expect(page.getByText('Fresh in Pune').first()).toBeVisible()
})

test('quantity discount shows on product page and in the cart', async ({ page }) => {
  await gotoReady(page, '/products/saffron-kaju-katli')
  await expect(page.getByText('Buy more, save more')).toBeVisible()
  await page.getByRole('button', { name: 'Increase quantity' }).first().click()
  await expect(page.getByText(/Add 1 more to get 5% off/).first()).toBeVisible()
  await page.getByRole('button', { name: 'Increase quantity' }).first().click()
  await expect(page.getByText(/5% off bulk discount applied/).first()).toBeVisible()
  await page.getByRole('button', { name: /Add to Cart/ }).first().click()
  const drawer = page.getByRole('dialog', { name: 'Your cart' })
  await expect(drawer).toContainText('Saffron Kaju Katli')
  await expect(drawer).toContainText('Quantity discount')
})

test('pincode checker: Pune same-day vs Pune-only restriction', async ({ page }) => {
  await gotoReady(page, '/products/classic-sponge-rosogolla')
  const pin = page.getByPlaceholder('Enter 6-digit pincode')
  await pin.fill('411001')
  await expect(pin).toHaveValue('411001')
  await page.getByRole('button', { name: 'Check', exact: true }).click()
  await expect(page.getByText(/Delivers to 411001 by/)).toBeVisible()
  await pin.fill('110001')
  await expect(pin).toHaveValue('110001')
  await page.getByRole('button', { name: 'Check', exact: true }).click()
  await expect(page.getByText(/delivered only in Pune/)).toBeVisible()
})

test('guest checkout with Cash on Delivery + OTP @mobile', async ({ page }) => {
  await addProductToCart(page, 'classic-sponge-rosogolla')
  await gotoReady(page, '/checkout')
  await page.getByLabel('Full name').fill(TEST_NAME)
  await page.getByLabel('Mobile number').fill(testPhone())
  await page.getByLabel('Flat / house no., building').fill('12 Lotus Court')
  await page.getByLabel('Area, street').fill('Koregaon Park')
  await page.getByLabel('Pincode').fill('411001')
  await page.getByLabel('City').fill('Pune')
  await page.getByLabel('State').selectOption('Maharashtra')
  await expect(page.getByText('Delivery date', { exact: true })).toBeVisible()
  await page.getByText('Cash on Delivery', { exact: true }).click()
  await page.getByRole('button', { name: 'Send OTP' }).click()
  const code = await readDevOtp(page)
  await page.getByPlaceholder('Enter the 6-digit OTP').fill(code)
  await page.getByRole('button', { name: 'Place order' }).click()
  // First server-action call may compile in dev mode — allow extra time.
  await expect(page).toHaveURL(/\/order\//, { timeout: 120_000 })
  await expect(page.getByRole('heading', { name: 'Thank you! Your order is confirmed.' })).toBeVisible()
  // Cart is emptied after a confirmed order
  await gotoReady(page, '/cart')
  await expect(page.getByText('Your cart is empty')).toBeVisible()
})

test('build-your-own box → cart', async ({ page }) => {
  await gotoReady(page, '/build-your-box/mishti-box')
  await page.getByRole('button', { name: /Box of 6/ }).click()
  const add = page.getByRole('button', { name: 'Add one Classic Rosogolla' })
  for (let i = 0; i < 6; i++) await add.click()
  await expect(page.getByText('6 of 6 filled')).toBeVisible()
  await expect(add).toBeDisabled()
  await page.getByRole('button', { name: /Add box to cart/ }).click()
  await expect(page.getByRole('dialog', { name: 'Your cart' })).toContainText('Build-your-own Mishti Box')
})

test('account: phone OTP login', async ({ page }) => {
  await gotoReady(page, '/account')
  await page.getByLabel('Mobile number').fill(testPhone())
  await page.getByRole('button', { name: 'Send OTP' }).click()
  const code = await readDevOtp(page)
  await page.getByPlaceholder('Enter the 6-digit OTP').fill(code)
  await page.getByPlaceholder('Your name (for new accounts)').fill(TEST_NAME)
  await page.getByRole('button', { name: 'Verify & continue' }).click()
  await expect(page.getByRole('heading', { name: /Hi, E2E/ })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'My orders' })).toBeVisible()
})

test('corporate enquiry form', async ({ page }) => {
  await gotoReady(page, '/corporate-gifting')
  const form = page.locator('form').filter({ hasText: 'Send enquiry' })
  await form.getByLabel('Full name').fill(TEST_NAME)
  await form.getByLabel('Mobile number').fill(testPhone())
  await form.getByLabel('Tell us what you have in mind').fill('Diwali boxes for 50 people')
  await form.getByRole('button', { name: 'Send enquiry' }).click()
  await expect(page.getByText(/our gifting team will get back to you/i)).toBeVisible()
})

test('admin login screen loads', async ({ page }) => {
  await page.goto('/rbsadmin') // Payload admin — not the storefront, so no hydration marker
  await expect(page.getByLabel(/email/i)).toBeVisible()
})
