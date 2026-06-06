import { test, expect, type Page } from '@playwright/test'

test.describe.configure({ mode: 'serial' })

// After the onboarding project runs, the DB has:
//   - "E2E Parent" (tier 4), PIN: "1234"
//   - "E2E Child" (tier 1)
// beforeAll creates "E2E Older Kid" (tier 2) via the Settings UI so tier-2
// scenarios have a real profile to switch into. afterAll removes it.

async function switchToParent(page: Page) {
  await page.goto('/')
  await page.locator('[aria-haspopup="listbox"]').click()
  await page.getByRole('button', { name: /E2E Parent/ }).click()
  await page.getByRole('button', { name: /PIN digit boxes/i }).click()
  await page.keyboard.type('1234')
  await expect(page.locator('[aria-haspopup="listbox"]')).toContainText('E2E Parent', {
    timeout: 5000,
  })
}

async function switchToOlderKid(page: Page) {
  await page.locator('[aria-haspopup="listbox"]').click()
  await page.getByRole('button', { name: /E2E Older Kid/ }).click()
  await expect(page.locator('[aria-haspopup="listbox"]')).toContainText('E2E Older Kid', {
    timeout: 5000,
  })
}

test.beforeAll(async ({ browser }) => {
  const ctx = await browser.newContext()
  const page = await ctx.newPage()
  await switchToParent(page)
  await page.locator('a[href="/settings"]').click()
  await page.waitForURL(/\/settings/)
  await page.getByRole('button', { name: 'Add' }).click()
  await page.getByLabel('Name').fill('E2E Older Kid')
  await page.getByRole('button', { name: 'Older kid' }).click()
  await page.getByRole('button', { name: 'Add profile' }).click()
  await expect(page.getByText('E2E Older Kid')).toBeVisible()
  await ctx.close()
})

test.afterAll(async ({ browser }) => {
  const ctx = await browser.newContext()
  const page = await ctx.newPage()
  await switchToParent(page)
  await page.locator('a[href="/settings"]').click()
  await page.waitForURL(/\/settings/)
  await page.getByRole('button', { name: /Remove E2E Older Kid/ }).click()
  await page.getByRole('alertdialog').getByRole('button', { name: 'Remove' }).click()
  await expect(page.getByText('E2E Older Kid')).not.toBeVisible()
  await ctx.close()
})

// ─── Settings nav item visibility ────────────────────────────────────────────

test.describe('settings nav item', () => {
  test('visible for tier 2 profile', async ({ page }) => {
    await switchToParent(page)
    await switchToOlderKid(page)
    await expect(page.locator('a[href="/settings"]')).toBeVisible()
  })

  test('not visible for tier 1 (family pseudo-profile)', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('a[href="/settings"]')).not.toBeVisible()
  })
})

// ─── Route guard ──────────────────────────────────────────────────────────────

test.describe('route guard', () => {
  test('tier 2 can reach /settings', async ({ page }) => {
    await switchToParent(page)
    await switchToOlderKid(page)
    await page.goto('/settings')
    await expect(page).toHaveURL(/\/settings/)
  })

  test('tier 2 direct URL navigation is synchronous — no flicker to /', async ({ page }) => {
    await switchToParent(page)
    await switchToOlderKid(page)
    // Navigate directly without going through the nav link
    await page.goto('/settings')
    // URL must already be /settings on the first paint — assert immediately
    expect(page.url()).toContain('/settings')
  })
})

// ─── Section visibility for tier 2 ───────────────────────────────────────────

test.describe('settings page sections — tier 2', () => {
  test.beforeEach(async ({ page }) => {
    await switchToParent(page)
    await switchToOlderKid(page)
    // Click the nav link (React Router navigation) so the TQ cache stays warm
    // and RequireTier2 sees tier 2 on first render, not the FAMILY_FALLBACK.
    await page.locator('a[href="/settings"]').click()
    await page.waitForURL(/\/settings/)
  })

  test('Display section is present', async ({ page }) => {
    await expect(page.getByText('Appearance')).toBeVisible()
  })

  test('Family section is absent', async ({ page }) => {
    await expect(page.getByText('Family name')).not.toBeVisible()
  })

  test('Profiles section is absent', async ({ page }) => {
    await expect(page.locator('h2:has-text("Profiles")')).not.toBeVisible()
  })

  test('Security section is absent', async ({ page }) => {
    await expect(page.getByText('Family PIN')).not.toBeVisible()
  })
})

// ─── Section visibility for tier 4 (regression) ──────────────────────────────

test.describe('settings page sections — tier 4', () => {
  test.beforeEach(async ({ page }) => {
    await switchToParent(page)
    await page.locator('a[href="/settings"]').click()
    await page.waitForURL(/\/settings/)
  })

  test('Family section is present', async ({ page }) => {
    await expect(page.getByText('Family name')).toBeVisible()
  })

  test('Profiles section is present', async ({ page }) => {
    await expect(page.locator('h2:has-text("Profiles")')).toBeVisible()
  })

  test('Security section is present', async ({ page }) => {
    await expect(page.getByText('Family PIN')).toBeVisible()
  })

  test('Display section is present', async ({ page }) => {
    await expect(page.getByText('Appearance')).toBeVisible()
  })
})
