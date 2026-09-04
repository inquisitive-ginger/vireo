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
  it('reads Home · Calendar · Meals · Shopping · More (settled at the M5.5/1 gate)', () => {
    expect(phoneBar(4)).toEqual(['Home', 'Calendar', 'Meals', 'Shopping', 'More'])
  })

  it('keeps Chores reachable — it moved into More, it did not disappear', () => {
    expect(moreSheet(4)).toContain('Chores')
  })

  it('reads the same at tier 1, the tier the shopping list exists for', () => {
    expect(phoneBar(1)).toEqual(['Home', 'Calendar', 'Meals', 'Shopping', 'More'])
  })
})
