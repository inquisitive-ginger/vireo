import { test, expect } from '@playwright/test'

test.describe('home surface', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('widget grid container is present', async ({ page }) => {
    await expect(page.getByTestId('widget-grid')).toBeVisible()
  })

  test('placeholder cards render for uninstalled reserved modules', async ({ page }) => {
    const cards = page.getByRole('status')
    await expect(cards.first()).toBeVisible()
    const count = await cards.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('family feed placeholder is labelled correctly', async ({ page }) => {
    await expect(page.getByRole('status', { name: /family feed/i })).toBeVisible()
  })

  // Settings appearance test moved to profile-management.spec.ts —
  // /settings now requires tier 4 (RequireTier4 guard added in profile-management story)
})
