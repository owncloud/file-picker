import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL || 'https://host.docker.internal:3000',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        contextOptions: { ignoreHTTPSErrors: true }
      }
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        contextOptions: { ignoreHTTPSErrors: true }
      }
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        contextOptions: { ignoreHTTPSErrors: true }
      }
    },
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
        contextOptions: { ignoreHTTPSErrors: true }
      }
    },
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 12'],
        contextOptions: { ignoreHTTPSErrors: true }
      }
    }
  ],
  webServer: {
    command: 'pnpm run preview:ocis',
    url: process.env.BASE_URL || 'https://host.docker.internal:3000',
    reuseExistingServer: !process.env.CI,
    ignoreHTTPSErrors: true
  }
})
