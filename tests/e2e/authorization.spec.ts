import { test, expect } from '@playwright/test'

const SELECTORS = Object.freeze({
  btnLogin: '[data-testid="btn-login"]'
})

test('users can authorize', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator(SELECTORS.btnLogin)).toBeVisible()
})
