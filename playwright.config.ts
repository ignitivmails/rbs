import { defineConfig, devices } from '@playwright/test'

/**
 * Browser tests against the local app.  `npm run test:e2e`
 * Starts `npm run dev` if nothing is running on :3000 (reuses a running server otherwise).
 * Test data (orders, customers, enquiries named "E2E Tester") is removed afterwards.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 180_000,
  expect: { timeout: 30_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    navigationTimeout: 120_000,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] }, grep: /@mobile/ },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 300_000,
  },
  globalSetup: './e2e/setup.ts',
  globalTeardown: './e2e/teardown.ts',
})
