// Render the icon SVGs to the PNG ladder.
//
// The repo already carries a Chromium for Playwright, so it is the rasterizer —
// no ImageMagick, rsvg or Inkscape to install, and it renders the SVGs with the
// same engine that will serve them. Playwright is resolved out of packages/e2e
// because that is the only workspace that depends on it.
//
//   node scripts/brand-icon/rasterize.mjs <out-dir>

import { createRequire } from 'node:module'
import fs from 'node:fs/promises'
import path from 'node:path'

const require = createRequire(new URL('../../packages/e2e/package.json', import.meta.url))
const { chromium } = require('@playwright/test')

const here = path.dirname(new URL(import.meta.url).pathname)
const svgDir = path.join(here, 'svg')
const outDir = process.argv[2] ?? path.join(here, 'out')

// Which master draws which size. Below 48 px the four birds are an unreadable
// mass, so the small end is a separate, purpose-drawn reduction rather than a
// downsample of the full mark (see svg/favicon.svg).
const LADDER = [
  ['favicon.svg', [16, 32]],
  ['icon.svg', [48, 64, 72, 96, 128, 144, 152, 180, 192, 256, 384, 512]],
  ['maskable.svg', [192, 512], 'maskable-'],
  ['badge.svg', [72, 96], 'badge-'],
]

const shot = async (page, svg, size, file) => {
  await page.setViewportSize({ width: size, height: size })
  await page.setContent(
    `<style>html,body{margin:0;padding:0;background:transparent}` +
      `svg{display:block;width:${size}px;height:${size}px}</style>${svg}`
  )
  await page.screenshot({ path: file, omitBackground: true })
}

await fs.mkdir(outDir, { recursive: true })
const browser = await chromium.launch()
const page = await browser.newPage()
const written = []

for (const [name, sizes, prefix = 'icon-'] of LADDER) {
  const svg = await fs.readFile(path.join(svgDir, name), 'utf8')
  for (const size of sizes) {
    const file = path.join(outDir, `${prefix}${size}.png`)
    await shot(page, svg, size, file)
    written.push(`${prefix}${size}.png`)
  }
}

// apple-touch-icon is the 180 already rendered; iOS masks it itself and does not
// read the maskable purpose, so it takes the full-bleed mark.
await fs.copyFile(path.join(outDir, 'icon-180.png'), path.join(outDir, 'apple-touch-icon.png'))
written.push('apple-touch-icon.png')

await browser.close()
console.log(written.join('\n'))
console.log(`\n${written.length} files -> ${outDir}`)
