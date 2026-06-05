import { test, expect } from '@playwright/test'

const FAMILY_PIN = process.env.FAMILY_PIN ?? '5678'

test.describe('demo plugin', () => {
  test('loads and renders without console errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
    page.on('pageerror', err => errors.push(err.message))

    await page.goto('/demo-plugin')
    await expect(page.getByRole('heading', { name: 'Demo Plugin' })).toBeVisible()
    expect(errors).toHaveLength(0)
  })

  test('renders child view for tier-1 (Family) profile', async ({ page }) => {
    await page.goto('/demo-plugin')
    await expect(page.getByText('Active: Family · Tier 1')).toBeVisible()
    await expect(page.getByText('Child view — limited access')).toBeVisible()
    // Parent-only content must not appear
    await expect(page.getByText('Parent view — full access enabled')).not.toBeVisible()
  })

  test('renders parent view for tier-4 profile after PIN', async ({ page }) => {
    page.on('dialog', async dialog => {
      if (dialog.type() === 'prompt') await dialog.accept(FAMILY_PIN)
      else await dialog.dismiss()
    })

    await page.goto('/demo-plugin')
    // Switch to Parent profile via dev selector
    await page.locator('select').selectOption({ label: 'Parent (T4)' })
    // Wait for profile switch to complete and re-render
    await expect(page.getByText('Active: Parent · Tier 4')).toBeVisible()
    await expect(page.getByText('Parent view — full access enabled')).toBeVisible()
    // Child fallback must not appear
    await expect(page.getByText('Child view — limited access')).not.toBeVisible()
  })

  test('greeting event publishes and is received by the plugin subscriber', async ({ page }) => {
    await page.goto('/demo-plugin')
    await expect(page.getByText('Received greetings (0)')).toBeVisible()

    await page.getByRole('button', { name: 'Send Greeting Event' }).click()

    // Subscriber updates the list via the WebSocket round-trip
    await expect(page.getByText('Received greetings (1)')).toBeVisible({ timeout: 5000 })
    await expect(page.getByText('Family (tier 1)')).toBeVisible()
  })

  test.skip('shows error boundary when plugin remote is unreachable', async ({ page }) => {
    // Abort the federation remoteEntry.js before the plugin is loaded
    await page.route('**/assets/remoteEntry.js', route => route.abort())

    await page.goto('/demo-plugin')

    await expect(page.getByText('Plugin failed to load')).toBeVisible({ timeout: 8000 })
    await expect(page.getByText('Other plugins are unaffected')).toBeVisible()
    // Shell layout must still be intact
    await expect(page.locator('aside')).toBeVisible()
  })
})
