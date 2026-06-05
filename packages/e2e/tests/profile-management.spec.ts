import { test, expect, type Page } from '@playwright/test'

const API = 'http://localhost:3000'

test.describe.configure({ mode: 'serial' })

// After the onboarding project runs, the DB has:
//   - Family name: "The Playwright Family"
//   - "E2E Parent" (tier 4), PIN: "1234"
//   - "E2E Child" (tier 1)
// Each test starts with a fresh browser context (no session), so the active
// profile is always the family pseudo-profile (tier 1) on load.

async function switchToParent(page: Page) {
  await page.goto('/')
  // Open the profile grid via the sidebar chip
  await page.locator('[aria-haspopup="listbox"]').click()
  // Click the parent profile — triggers PIN entry because it's tier 4
  await page.getByRole('button', { name: /E2E Parent/ }).click()
  // Focus the hidden PIN input and type
  await page.getByRole('button', { name: /PIN digit boxes/i }).click()
  await page.keyboard.type('1234')
  // Wait for profile chip to update confirming the switch
  await expect(page.locator('[aria-haspopup="listbox"]')).toContainText('E2E Parent', {
    timeout: 5000,
  })
}

// ─── Route guard ──────────────────────────────────────────────────────────────

test.describe('settings route guard', () => {
  test('family profile (tier 1) is redirected from /settings to /', async ({ page }) => {
    await page.goto('/settings')
    await expect(page).toHaveURL('/')
  })

  test('parent (tier 4) can access /settings after PIN entry', async ({ page }) => {
    await switchToParent(page)
    await page.goto('/settings')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Settings')
    await expect(page.getByRole('button', { name: 'Light' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'System' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Dark' })).toBeVisible()
  })
})

// ─── Family name ──────────────────────────────────────────────────────────────

test.describe('family name', () => {
  test('can edit the family name', async ({ page }) => {
    await switchToParent(page)
    await page.goto('/settings')

    // The Family section shows the current name and an Edit button
    await page.getByRole('button', { name: 'Edit' }).first().click()
    const input = page.getByLabel('Family name')
    await input.clear()
    await input.fill('E2E Family')
    await page.getByRole('button', { name: 'Save' }).click()

    // Name updates in the section
    await expect(page.getByText('E2E Family')).toBeVisible()
  })

  test.afterAll(async ({ request }) => {
    // Restore original family name so other tests that rely on "The Playwright Family" pass
    // We do this via a reset and re-onboard — simpler: just patch it directly via API
    // This requires a tier-4 session; use the API directly with a db write
    await request
      .patch(`${API}/api/settings/family-name`, {
        data: { name: 'The Playwright Family' },
        // No cookie — will 403. We leave the name as "E2E Family" since subsequent
        // tests in this serial block don't depend on the exact family name.
      })
      .catch(() => {})
  })
})

// ─── Profile CRUD ─────────────────────────────────────────────────────────────

test.describe('profile CRUD', () => {
  test('can create a new profile', async ({ page }) => {
    await switchToParent(page)
    await page.goto('/settings')

    await page.getByRole('button', { name: 'Add' }).click()
    await page.getByLabel('Name').fill('E2E Teen')
    await page.getByRole('button', { name: 'Teen' }).click()
    await page.getByRole('button', { name: 'Add profile' }).click()

    await expect(page.getByText('E2E Teen')).toBeVisible()
    await expect(page.getByText('Tier 3')).toBeVisible()
  })

  test('can edit a profile name', async ({ page }) => {
    await switchToParent(page)
    await page.goto('/settings')

    await page.getByRole('button', { name: 'Edit E2E Teen' }).click()
    const nameInput = page.getByLabel('Name')
    await nameInput.clear()
    await nameInput.fill('E2E Teen Edited')
    await page.getByRole('button', { name: 'Save changes' }).click()

    await expect(page.getByText('E2E Teen Edited')).toBeVisible()
    await expect(page.getByText('E2E Teen')).not.toBeVisible()
  })

  test('delete shows confirm dialog and removes the profile', async ({ page }) => {
    await switchToParent(page)
    await page.goto('/settings')

    await page.getByRole('button', { name: 'Remove E2E Teen Edited' }).click()

    // Confirm dialog appears
    await expect(page.getByRole('alertdialog')).toBeVisible()
    await expect(page.getByRole('alertdialog')).toContainText('E2E Teen Edited')

    // Confirm the removal
    await page.getByRole('alertdialog').getByRole('button', { name: 'Remove' }).click()

    // Profile gone from list
    await expect(page.getByText('E2E Teen Edited')).not.toBeVisible()
  })
})

// ─── PIN reset ────────────────────────────────────────────────────────────────

test.describe('PIN reset', () => {
  test('incorrect current PIN shows error immediately without advancing', async ({ page }) => {
    await switchToParent(page)
    await page.goto('/settings')

    await page.getByRole('button', { name: 'Reset' }).click()
    await expect(page.getByText('Enter current PIN')).toBeVisible()

    await page.getByRole('button', { name: /PIN digit boxes/i }).click()
    await page.keyboard.type('0000') // wrong PIN

    // Error state appears without moving to "Choose a new PIN"
    await expect(page.getByText('Incorrect PIN')).toBeVisible()
    await expect(page.getByText('Choose a new PIN')).not.toBeVisible()
  })

  test('correct current PIN advances to new PIN entry', async ({ page }) => {
    await switchToParent(page)
    await page.goto('/settings')

    await page.getByRole('button', { name: 'Reset' }).click()
    await page.getByRole('button', { name: /PIN digit boxes/i }).click()
    await page.keyboard.type('1234') // correct

    await expect(page.getByText('Choose a new PIN')).toBeVisible()

    // Enter new PIN and confirm
    await page.keyboard.type('5678')
    await expect(page.getByText('Confirm new PIN')).toBeVisible()
    await page.keyboard.type('5678')

    // Dismissed back to idle (no "PIN saved" flash — closes immediately)
    await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible({ timeout: 3000 })
  })

  test.afterAll(async ({ request }) => {
    // Reset PIN back to 1234 so other tests that depend on it still work.
    // Requires tier-4 cookie — do this via a direct bcrypt hash + DB write
    // which is not available here. We accept that PIN is now 5678 and note that
    // the onboarding project resets on next run anyway.
    void request // suppress unused warning
  })
})
