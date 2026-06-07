import { test, expect } from '@playwright/test'

test('manifest.webmanifest is served with required installability fields', async ({ page }) => {
  const response = await page.request.get('/manifest.webmanifest')
  expect(response.ok()).toBe(true)
  expect(response.headers()['content-type']).toMatch(/json|manifest/)

  const manifest = (await response.json()) as Record<string, unknown>
  expect(manifest.name).toBe('Family OS')
  expect(manifest.short_name).toBe('Family OS')
  expect(manifest.display).toBe('standalone')
  expect(manifest.start_url).toBe('/')
  expect(Array.isArray(manifest.icons)).toBe(true)

  const icons = manifest.icons as Array<{ sizes: string; type: string }>
  expect(icons.some((i) => i.sizes === '192x192' && i.type === 'image/png')).toBe(true)
  expect(icons.some((i) => i.sizes === '512x512' && i.type === 'image/png')).toBe(true)
})

test('app icons are served', async ({ page }) => {
  const res192 = await page.request.get('/icons/icon-192x192.png')
  expect(res192.ok()).toBe(true)
  expect(res192.headers()['content-type']).toMatch(/png/)

  const res512 = await page.request.get('/icons/icon-512x512.png')
  expect(res512.ok()).toBe(true)
})

test('service worker is registered after first visit', async ({ page }) => {
  await page.goto('/')
  await page.waitForFunction(async () => !!(await navigator.serviceWorker.getRegistration('/')), {
    timeout: 5000,
  })
})
