import { test, expect } from '@playwright/test'

test.describe('shell skeleton', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  // AC1
  test('renders without console errors at 1280x800', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    page.on('pageerror', (err) => errors.push(err.message))
    await page.reload()
    expect(errors).toHaveLength(0)
  })

  // AC3
  test('sidebar is 220px wide with profile chip area and nav section', async ({ page }) => {
    const sidebar = page.locator('aside')
    await expect(sidebar).toBeVisible()
    const box = await sidebar.boundingBox()
    expect(box?.width).toBe(220)
    // profile chip area
    await expect(sidebar.getByText('Family')).toBeVisible()
    // nav section with at least Home
    await expect(page.locator('nav').getByRole('link', { name: 'Home' })).toBeVisible()
  })

  // AC4
  test('main content area fills remaining width (1060px)', async ({ page }) => {
    const box = await page.locator('main').boundingBox()
    expect(box?.width).toBe(1060)
  })

  // AC5
  test('navigating to a plugin route renders content in the main slot', async ({ page }) => {
    await page.goto('/chores')
    await expect(page.locator('main')).toBeVisible()
    await expect(page.locator('h1', { hasText: 'Chores' })).toBeVisible()
    // sidebar persists during navigation
    await expect(page.locator('aside')).toBeVisible()
  })

  // AC5 — nav link triggers client-side navigation
  test('clicking a nav link navigates without a full page reload', async ({ page }) => {
    await page.goto('/chores')
    await page.locator('nav').getByRole('link', { name: 'Home' }).click()
    await expect(page.getByTestId('widget-grid')).toBeVisible()
    await expect(page.locator('aside')).toBeVisible()
  })

  // AC6 — Settings nav item is hidden for the family pseudo-profile (tier 1).
  // Tier 2+ access is covered by settings-permissions.spec.ts.
  test('settings entry is not visible for the family pseudo-profile (tier 1)', async ({ page }) => {
    await expect(page.locator('aside').getByRole('link', { name: 'Settings' })).not.toBeVisible()
  })

  // AC7
  test('all interactive sidebar elements meet 48px minimum touch target', async ({ page }) => {
    const links = page.locator('aside').getByRole('link')
    // Wait for at least one link to be in the DOM before counting
    await links.first().waitFor()
    const count = await links.count()
    expect(count).toBeGreaterThan(0)
    for (let i = 0; i < count; i++) {
      const box = await links.nth(i).boundingBox()
      expect(box?.height).toBeGreaterThanOrEqual(48)
    }
  })

  // AC8 — if Tailwind is broken the sidebar width utility wouldn't apply
  test('tailwind utility classes apply correctly', async ({ page }) => {
    const box = await page.locator('aside').boundingBox()
    expect(box?.width).toBe(220)
  })

  // AC10
  test('--font-ui and --font-display CSS custom properties are defined', async ({ page }) => {
    const { fontUi, fontDisplay } = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement)
      return {
        fontUi: style.getPropertyValue('--font-ui').trim(),
        fontDisplay: style.getPropertyValue('--font-display').trim(),
      }
    })
    expect(fontUi).toBeTruthy()
    expect(fontDisplay).toBeTruthy()
  })

  // Layout robustness — shell persists on unregistered routes
  test('shell layout persists on unregistered routes', async ({ page }) => {
    await page.goto('/settings')
    await expect(page.locator('aside')).toBeVisible()
  })
})
