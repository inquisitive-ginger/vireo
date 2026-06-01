import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

// Loader functions keyed by federation remote name (matches `name` field in plugins.json).
// Each entry corresponds to a remote declared in vite.config.ts via plugins.json.
// When a plugin is added to plugins.json, add its lazy import here.
const loaders: Record<string, () => Promise<{ default: ComponentType }>> = {
  // demo-plugin story adds:
  // 'demo-plugin': () => import('demo-plugin/Plugin'),
}

const cache = new Map<string, LazyExoticComponent<ComponentType>>()

export function getLazyPlugin(remoteName: string): LazyExoticComponent<ComponentType> | null {
  const loader = loaders[remoteName]
  if (!loader) return null
  if (!cache.has(remoteName)) {
    cache.set(remoteName, lazy(loader))
  }
  return cache.get(remoteName)!
}
