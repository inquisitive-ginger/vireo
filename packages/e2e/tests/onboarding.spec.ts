import { test, expect } from '@playwright/test'

const API = 'http://localhost:3000'

test.describe.configure({ mode: 'serial' })

test.describe('onboarding', () => {
  test.beforeAll(async ({ request }) => {
    await request.post(`${API}/api/dev/reset`)
  })

  test('redirects to /onboarding from / when setup is not complete', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/onboarding/)
  })

  test('completes the full 3-step flow and lands on the home screen', async ({ page }) => {
    await page.goto('/onboarding')

    // ── Step 1 ──────────────────────────────────────────────────────────────
    await expect(page.getByText('Set up your family')).toBeVisible()

    await page.getByLabel('Family name').fill('The Playwright Family')
    await page.getByLabel('Your name').fill('E2E Parent')
    await page.getByRole('button', { name: 'Continue' }).click()

    // ── Step 2 ──────────────────────────────────────────────────────────────
    await expect(page.getByText('Add family members')).toBeVisible()

    await page.getByLabel('Name').fill('E2E Child')
    // Select 'Little one' tier
    await page.getByRole('button', { name: 'Little one' }).click()
    await page.getByRole('button', { name: 'Add' }).click()

    // Child should appear in the list
    await expect(page.getByText('E2E Child')).toBeVisible()

    await page.getByRole('button', { name: 'Continue' }).click()

    // ── Step 3 ──────────────────────────────────────────────────────────────
    await expect(page.getByText('Protect with a PIN')).toBeVisible()

    // Click the dot boxes to ensure the hidden input has focus
    await page.getByRole('button', { name: /PIN digit boxes/i }).click()
    await page.keyboard.type('1234')

    // Confirm phase
    await expect(page.getByText('Confirm your PIN')).toBeVisible()
    await page.keyboard.type('1234')

    // Finish
    await expect(page.getByText('PIN confirmed')).toBeVisible()
    await page.getByRole('button', { name: 'Finish setup' }).click()

    // ── Done ─────────────────────────────────────────────────────────────────
    await expect(page).toHaveURL('/')
    await expect(page.getByTestId('widget-grid')).toBeVisible()
  })

  test('does not redirect to /onboarding after setup is complete', async ({ page }) => {
    await page.goto('/')
    await expect(page).not.toHaveURL(/onboarding/)
    await expect(page.getByTestId('widget-grid')).toBeVisible()
  })
})
