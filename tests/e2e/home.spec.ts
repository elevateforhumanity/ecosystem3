import { test, expect } from '@playwright/test'
test('app renders root', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await expect(page.locator('#root')).toBeVisible()
})
