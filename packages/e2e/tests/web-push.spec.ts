import { test, expect, type Page } from '@playwright/test'

test.describe.configure({ mode: 'serial' })

// After the onboarding project runs, the DB has:
//   - "E2E Parent" (tier 4), PIN: "1234"
//   - "E2E Child" (tier 1)
// beforeAll creates "E2E Teen" (tier 3) and "E2E Older Kid" (tier 2).
// afterAll removes both.

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

async function switchTo(page: Page, name: RegExp | string) {
  await page.locator('[aria-haspopup="listbox"]').click()
  await page.getByRole('button', { name }).click()
  await expect(page.locator('[aria-haspopup="listbox"]')).toContainText(
    typeof name === 'string' ? name : '',
    { timeout: 5000 }
  )
}

test.beforeAll(async ({ browser }) => {
  const ctx = await browser.newContext()
  const page = await ctx.newPage()
  await switchToParent(page)
  await page.locator('a[href="/settings"]').click()
  await page.waitForURL(/\/settings/)

  // Create tier 3 (Teen)
  await page.getByRole('button', { name: 'Add' }).click()
  await page.getByLabel('Name').fill('E2E Teen')
  await page.getByRole('button', { name: 'Teen' }).click()
  await page.getByRole('button', { name: 'Add profile' }).click()
  await expect(page.getByText('E2E Teen')).toBeVisible()

  // Create tier 2 (Older kid)
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

  for (const name of ['E2E Teen', 'E2E Older Kid']) {
    await page.getByRole('button', { name: new RegExp(`Remove ${name}`) }).click()
    await page.getByRole('alertdialog').getByRole('button', { name: 'Remove' }).click()
    await expect(page.getByText(name)).not.toBeVisible()
  }

  await ctx.close()
})

// ─── Visibility by tier ───────────────────────────────────────────────────────

test.describe('notifications section visibility', () => {
  test('not visible for tier 2 (E2E Older Kid)', async ({ page }) => {
    await switchToParent(page)
    await page.locator('[aria-haspopup="listbox"]').click()
    await page.getByRole('button', { name: /E2E Older Kid/ }).click()
    await expect(page.locator('[aria-haspopup="listbox"]')).toContainText('E2E Older Kid', {
      timeout: 5000,
    })
    await page.locator('a[href="/settings"]').click()
    await page.waitForURL(/\/settings/)
    await expect(page.getByRole('heading', { name: 'Notifications' })).not.toBeVisible()
  })

  test('visible for tier 3 (E2E Teen)', async ({ page }) => {
    await switchToParent(page)
    await page.locator('[aria-haspopup="listbox"]').click()
    await page.getByRole('button', { name: /E2E Teen/ }).click()
    await expect(page.locator('[aria-haspopup="listbox"]')).toContainText('E2E Teen', {
      timeout: 5000,
    })
    await page.locator('a[href="/settings"]').click()
    await page.waitForURL(/\/settings/)
    await expect(page.getByRole('heading', { name: 'Notifications' })).toBeVisible()
    await expect(page.getByText('Push Notifications')).toBeVisible()
  })

  test('visible for tier 4 (E2E Parent)', async ({ page }) => {
    await switchToParent(page)
    await page.locator('a[href="/settings"]').click()
    await page.waitForURL(/\/settings/)
    await expect(page.getByRole('heading', { name: 'Notifications' })).toBeVisible()
    await expect(page.getByText('Push Notifications')).toBeVisible()
  })
})

// ─── Switch primitive usage ───────────────────────────────────────────────────

test.describe('push notifications toggle', () => {
  test('renders as a switch (Radix) with correct label for tier 4', async ({ page }) => {
    await switchToParent(page)
    await page.locator('a[href="/settings"]').click()
    await page.waitForURL(/\/settings/)
    const toggle = page.getByRole('switch', { name: 'Push Notifications' })
    await expect(toggle).toBeVisible()
    await expect(toggle).toHaveAttribute('aria-checked', 'false')
  })

  test('renders as a switch with correct label for tier 3', async ({ page }) => {
    await switchToParent(page)
    await page.locator('[aria-haspopup="listbox"]').click()
    await page.getByRole('button', { name: /E2E Teen/ }).click()
    await expect(page.locator('[aria-haspopup="listbox"]')).toContainText('E2E Teen', {
      timeout: 5000,
    })
    await page.locator('a[href="/settings"]').click()
    await page.waitForURL(/\/settings/)
    const toggle = page.getByRole('switch', { name: 'Push Notifications' })
    await expect(toggle).toBeVisible()
    await expect(toggle).toHaveAttribute('aria-checked', 'false')
  })
})
