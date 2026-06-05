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

  // Settings appearance test lives in settings-permissions.spec.ts —
  // /settings requires tier 2+ (RequireTier2 guard; tier 4 sees full page, tier 2–3 see Display only)
})
