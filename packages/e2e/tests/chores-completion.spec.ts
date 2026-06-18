import { test, expect } from '@playwright/test'

test.describe.configure({ mode: 'serial' })

// After the onboarding project runs, the DB has:
//   - "E2E Parent" (tier 4), PIN: "1234"
//   - "E2E Child" (tier 1)
// Setup (assign a chore, become the child) is driven through the API — the
// family-dashboard profile dropdown is animation-heavy and flaky on a cold load.
// The test then exercises the real one-tap completion in the UI.

const TASK_TITLE = `E2E sweep the porch ${Date.now()}`

test('a tier-1 child completes their assigned chore with one tap', async ({ page }) => {
  // Establish the browser context (shared cookie jar for page.request + navigation).
  await page.goto('/')

  const profiles = (await (await page.request.get('/api/profiles')).json()) as Array<{
    id: string
    name: string
  }>
  const parent = profiles.find((p) => p.name === 'E2E Parent')
  const child = profiles.find((p) => p.name === 'E2E Child')
  expect(parent && child, 'E2E Parent + E2E Child should exist after onboarding').toBeTruthy()

  // Drive the session via in-page fetch so the session cookie lives on the page's
  // own origin (the app proxies /api → :3000): become the parent (PIN), assign a
  // pending task to the child, then switch to the child (tier 1 → no PIN).
  const createStatus = await page.evaluate(
    async ({ parentId, childId, title }) => {
      const json = { 'Content-Type': 'application/json' }
      await fetch('/api/auth/verify-pin', {
        method: 'POST',
        headers: json,
        body: JSON.stringify({ pin: '1234', targetProfileId: parentId }),
      })
      const created = await fetch('/api/chores/tasks', {
        method: 'POST',
        headers: json,
        body: JSON.stringify({ title, assigneeId: childId, xpReward: 10 }),
      })
      await fetch('/api/auth/switch', {
        method: 'POST',
        headers: json,
        body: JSON.stringify({ targetProfileId: childId }),
      })
      return created.status
    },
    { parentId: parent!.id, childId: child!.id, title: TASK_TITLE }
  )
  expect(createStatus).toBe(201)

  await page.goto('/chores')

  // The assignee sees their pending task with a one-tap completion control.
  const completeButton = page.getByRole('button', { name: new RegExp(`Mark .*${TASK_TITLE}`) })
  await expect(completeButton).toBeVisible({ timeout: 15_000 })
  await completeButton.click()

  // The XP flight runs (~1s) then the card morphs to its completed state — the
  // earned XP pill — and the pending tap target is gone.
  await expect(page.getByText('✓ +10 XP')).toBeVisible({ timeout: 5000 })
  await expect(completeButton).toHaveCount(0)
})
