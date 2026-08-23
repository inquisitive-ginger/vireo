import { test, expect } from '@playwright/test'

test('manifest.webmanifest is served with required installability fields', async ({ page }) => {
  const response = await page.request.get('/manifest.webmanifest')
  expect(response.ok()).toBe(true)
  expect(response.headers()['content-type']).toMatch(/json|manifest/)

  const manifest = (await response.json()) as Record<string, unknown>
  expect(manifest.name).toBe('Vireo')
  expect(manifest.short_name).toBe('Vireo')
  expect(manifest.display).toBe('standalone')
  expect(manifest.start_url).toBe('/')
  expect(Array.isArray(manifest.icons)).toBe(true)

  const icons = manifest.icons as Array<{ sizes: string; type: string }>
  expect(icons.some((i) => i.sizes === '192x192' && i.type === 'image/png')).toBe(true)
  expect(icons.some((i) => i.sizes === '512x512' && i.type === 'image/png')).toBe(true)
})

test('app icons are served', async ({ page }) => {
  const res192 = await page.request.get('/icons/icon-192.png')
  expect(res192.ok()).toBe(true)
  expect(res192.headers()['content-type']).toMatch(/png/)

  const res512 = await page.request.get('/icons/icon-512.png')
  expect(res512.ok()).toBe(true)

  const maskable = await page.request.get('/icons/maskable-512.png')
  expect(maskable.ok()).toBe(true)
})

test('notification badge is an alpha stencil, not an opaque square', async ({ page }) => {
  const badge = await page.request.get('/icons/badge-72.png')
  expect(badge.ok()).toBe(true)

  // Android masks the badge by its alpha channel and tints the result, so a
  // fully opaque file renders as a plain coloured square. Decode it and require
  // real transparency — the regression this guards is invisible in the markup.
  const png = await badge.body()
  await page.goto('/')
  const transparent = await page.evaluate(async (bytes) => {
    const blob = new Blob([new Uint8Array(bytes)], { type: 'image/png' })
    const bitmap = await createImageBitmap(blob)
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(bitmap, 0, 0)
    const { data } = ctx.getImageData(0, 0, bitmap.width, bitmap.height)
    let clear = 0
    for (let i = 3; i < data.length; i += 4) if (data[i] === 0) clear++
    return clear / (data.length / 4)
  }, Array.from(png))

  expect(transparent).toBeGreaterThan(0.25)
})

test('service worker is registered after first visit', async ({ page }) => {
  await page.goto('/')
  await page.waitForFunction(async () => !!(await navigator.serviceWorker.getRegistration('/')), {
    timeout: 5000,
  })
})
