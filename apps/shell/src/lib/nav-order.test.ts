import path from 'path'
import { readFileSync } from 'fs'
import { describe, it, expect } from 'vitest'
import type { RegistryEntry, PluginManifest } from '@family-os/platform/types'

/* The phone's bottom bar shows Home + the first three tier-visible plugins by
   `plugins.json` order + More (ADR 033's 5-tab cap). That makes the FILE the
   nav design — a reorder for any other reason silently moves a destination into
   the More sheet. The M5.5/1 gate settled the reading, so it gets a test rather
   than a comment nobody reads before editing a registry. */

const root = path.resolve(__dirname, '../../../..')
const registry: RegistryEntry[] = JSON.parse(readFileSync(path.join(root, 'plugins.json'), 'utf-8'))

const manifests = registry.map((entry) => ({
  name: entry.name,
  manifest: JSON.parse(
    readFileSync(path.join(root, 'plugins', entry.name, 'public/manifest.json'), 'utf-8')
  ) as PluginManifest,
}))

const MAX_TABS = 5

function phoneBar(tier: number): string[] {
  const visible = manifests
    .filter((p) => p.manifest.navItem)
    .filter((p) => (p.manifest.navItem!.minTier ?? 1) <= tier)
  const overflows = visible.length + 1 > MAX_TABS
  const bar = overflows ? visible.slice(0, MAX_TABS - 2) : visible
  return ['Home', ...bar.map((p) => p.manifest.navItem!.label), 'More']
}

function moreSheet(tier: number): string[] {
  const visible = manifests
    .filter((p) => p.manifest.navItem)
    .filter((p) => (p.manifest.navItem!.minTier ?? 1) <= tier)
  return visible.length + 1 > MAX_TABS
    ? visible.slice(MAX_TABS - 2).map((p) => p.manifest.navItem!.label)
    : []
}

describe('phone tab order', () => {
  /* Shopping is BUILT and reachable at `/shopping`, and deliberately announced
     nowhere until the polish session turns it on (Zach, 2026-09-04). It has no
     `navItem`, so it does not consume one of the three plugin tabs — which is
     why Chores is back on the bar rather than in More. Reverting the disable
     restores both halves at once, and these expectations flip back with it. */
  it('reads Home · Calendar · Meals · Chores · More while Shopping is hidden', () => {
    expect(phoneBar(4)).toEqual(['Home', 'Calendar', 'Meals', 'Chores', 'More'])
  })

  it('shows Shopping nowhere — not on the bar, and not tucked into More', () => {
    expect(phoneBar(4)).not.toContain('Shopping')
    expect(moreSheet(4)).not.toContain('Shopping')
    expect(phoneBar(1)).not.toContain('Shopping')
    expect(moreSheet(1)).not.toContain('Shopping')
  })

  it('still routes /shopping — hidden is not unbuilt', () => {
    const shopping = manifests.find((p) => p.name === 'shopping')!
    expect(shopping.manifest.navItem).toBeUndefined()
    expect(shopping.manifest.routes).toContain('/shopping')
  })

  it('reads the same at tier 1, the tier the shopping list exists for', () => {
    expect(phoneBar(1)).toEqual(['Home', 'Calendar', 'Meals', 'Chores', 'More'])
  })
})
