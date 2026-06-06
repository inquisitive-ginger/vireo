import { test, expect, type Page } from '@playwright/test'

test.describe.configure({ mode: 'serial' })

// After the onboarding project runs, the DB has:
//   - "E2E Parent" (tier 4), PIN: "1234"
//   - "E2E Child" (tier 1)
// Tests use E2E Child as the target profile for override operations.
// afterAll restores E2E Child to tier 1 in case role-change tests modified it.

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

async function openChildDrawer(page: Page) {
  await switchToParent(page)
  await page.locator('a[href="/settings"]').click()
  await page.waitForURL(/\/settings/)
  await page.getByRole('button', { name: 'Edit E2E Child' }).click()
  // Wait for capabilities panel to load
  await expect(page.getByRole('switch', { name: 'Use plugins' })).toBeVisible({ timeout: 5000 })
}

test.afterAll(async ({ browser }) => {
  // Restore E2E Child to tier 1 in case role-change tests changed it
  const ctx = await browser.newContext()
  const page = await ctx.newPage()
  await switchToParent(page)
  await page.locator('a[href="/settings"]').click()
  await page.waitForURL(/\/settings/)
  await page.getByRole('button', { name: 'Edit E2E Child' }).click()
  await expect(page.getByRole('button', { name: 'Little one' })).toBeVisible({ timeout: 5000 })
  await page.getByRole('button', { name: 'Little one' }).click()
  await page.getByRole('button', { name: 'Close' }).click()
  await ctx.close()
})

// ─── Capabilities panel visibility ───────────────────────────────────────────

test.describe('capabilities panel', () => {
  test('shows Role & Capabilities section with switches for a non-own profile', async ({
    page,
  }) => {
    await openChildDrawer(page)

    await expect(page.getByText('Role & Capabilities')).toBeVisible()
    await expect(page.getByRole('switch', { name: 'Use plugins' })).toBeVisible()
    await expect(page.getByRole('switch', { name: 'View profiles' })).toBeVisible()
    await expect(page.getByRole('switch', { name: 'Switch active profile' })).toBeVisible()
  })

  test('own profile shows role buttons but no capability switches', async ({ page }) => {
    await switchToParent(page)
    await page.locator('a[href="/settings"]').click()
    await page.waitForURL(/\/settings/)
    await page.getByRole('button', { name: 'Edit E2E Parent' }).click()

    await expect(page.getByText('Role & Capabilities')).toBeVisible()
    // Role buttons present
    await expect(page.getByRole('button', { name: 'Parent' })).toBeVisible()
    // No capability switches — cannot edit own overrides
    await expect(page.getByRole('switch')).not.toBeVisible()
  })
})

// ─── Permission toggles ───────────────────────────────────────────────────────

test.describe('permission toggles', () => {
  test('revoking a baseline permission unchecks the switch and shows Revoked badge', async ({
    page,
  }) => {
    await openChildDrawer(page)

    // "Use plugins" is in tier-1 baseline — switch is on
    const usePlugins = page.getByRole('switch', { name: 'Use plugins' })
    await expect(usePlugins).toHaveAttribute('aria-checked', 'true')
    await expect(page.getByText('Revoked')).not.toBeVisible()

    await usePlugins.click()

    await expect(usePlugins).toHaveAttribute('aria-checked', 'false', { timeout: 5000 })
    await expect(page.getByText('Revoked')).toBeVisible()
  })

  test('removing a revocation checks the switch and clears the badge', async ({ page }) => {
    // Continues from previous test — revocation is in place
    await openChildDrawer(page)

    const usePlugins = page.getByRole('switch', { name: 'Use plugins' })
    await expect(usePlugins).toHaveAttribute('aria-checked', 'false')

    await usePlugins.click()

    await expect(usePlugins).toHaveAttribute('aria-checked', 'true', { timeout: 5000 })
    await expect(page.getByText('Revoked')).not.toBeVisible()
  })

  test('granting an above-baseline permission checks the switch and shows Granted badge', async ({
    page,
  }) => {
    await openChildDrawer(page)

    // "Switch active profile" is NOT in tier-1 baseline — switch is off
    const switchProfile = page.getByRole('switch', { name: 'Switch active profile' })
    await expect(switchProfile).toHaveAttribute('aria-checked', 'false')
    await expect(page.getByText('Granted')).not.toBeVisible()

    await switchProfile.click()

    await expect(switchProfile).toHaveAttribute('aria-checked', 'true', { timeout: 5000 })
    await expect(page.getByText('Granted')).toBeVisible()
  })

  test('removing a grant unchecks the switch and clears the badge', async ({ page }) => {
    // Continues from previous test — grant is in place
    await openChildDrawer(page)

    const switchProfile = page.getByRole('switch', { name: 'Switch active profile' })
    await expect(switchProfile).toHaveAttribute('aria-checked', 'true')

    await switchProfile.click()

    await expect(switchProfile).toHaveAttribute('aria-checked', 'false', { timeout: 5000 })
    await expect(page.getByText('Granted')).not.toBeVisible()
  })
})

// ─── Role change ──────────────────────────────────────────────────────────────

test.describe('role change', () => {
  test('changing role clears existing overrides', async ({ page }) => {
    await openChildDrawer(page)

    // Revoke "Use plugins" for E2E Child (tier-1 baseline permission)
    const usePlugins = page.getByRole('switch', { name: 'Use plugins' })
    await usePlugins.click()
    await expect(usePlugins).toHaveAttribute('aria-checked', 'false', { timeout: 5000 })
    await expect(page.getByText('Revoked')).toBeVisible()

    // Change role to Teen (tier 3) — overrides should clear
    await page.getByRole('button', { name: 'Teen' }).click()

    // After the tier change + override clear, "Use plugins" should reflect the
    // tier-3 baseline (still in baseline for tier 3) with no override badge
    await expect(page.getByText('Revoked')).not.toBeVisible({ timeout: 5000 })
    await expect(usePlugins).toHaveAttribute('aria-checked', 'true', { timeout: 5000 })
  })

  test('prevents demoting the last tier-4 profile and shows an error', async ({ page }) => {
    await switchToParent(page)
    await page.locator('a[href="/settings"]').click()
    await page.waitForURL(/\/settings/)
    await page.getByRole('button', { name: 'Edit E2E Parent' }).click()

    await expect(page.getByRole('button', { name: 'Parent' })).toBeVisible()

    // Try to demote the only admin
    await page.getByRole('button', { name: 'Teen' }).click()

    // Role buttons revert and error message appears
    await expect(page.getByText('At least one administrator (tier 4) must remain')).toBeVisible({
      timeout: 5000,
    })
  })
})
