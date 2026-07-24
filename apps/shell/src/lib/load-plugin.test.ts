import { describe, it, expect } from 'vitest'
import {
  getLazyPlugin,
  getLazyWidget,
  hasLazyWidget,
  evictPlugin,
  evictWidget,
} from './load-plugin'

describe('load-plugin', () => {
  it('caches a lazy component per remote', () => {
    expect(getLazyPlugin('chores')).toBe(getLazyPlugin('chores'))
    expect(getLazyWidget('chores')).toBe(getLazyWidget('chores'))
  })

  it('returns null for an unregistered remote', () => {
    expect(getLazyPlugin('nope')).toBeNull()
    expect(getLazyWidget('nope')).toBeNull()
    expect(hasLazyWidget('nope')).toBe(false)
    expect(hasLazyWidget('chores')).toBe(true)
  })

  // A rejected lazy() is permanently rejected, so eviction is the only way a retry
  // can re-run the loader.
  it('builds a fresh lazy component after eviction', () => {
    const plugin = getLazyPlugin('chores')
    evictPlugin('chores')
    expect(getLazyPlugin('chores')).not.toBe(plugin)

    const widget = getLazyWidget('chores')
    evictWidget('chores')
    expect(getLazyWidget('chores')).not.toBe(widget)
  })
})
