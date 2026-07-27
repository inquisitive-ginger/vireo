import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

// Loader functions keyed by federation remote name (matches `name` field in plugins.json).
// Each entry corresponds to a remote declared in vite.config.ts via plugins.json.
// When a plugin is added to plugins.json, add its lazy import here.
const pluginLoaders: Record<string, () => Promise<{ default: ComponentType }>> = {
  'family-feed': () => import('family-feed/Plugin'),
  chores: () => import('chores/Plugin'),
  calendar: () => import('calendar/Plugin'),
  rewards: () => import('rewards/Plugin'),
}

const widgetLoaders: Record<string, () => Promise<{ default: ComponentType }>> = {
  'family-feed': () => import('family-feed/widgets/FeedWidget'),
  chores: () => import('chores/widgets/TodaySummary'),
  calendar: () => import('calendar/widgets/UpNext'),
  rewards: () => import('rewards/widgets/Wallet'),
}

const pluginCache = new Map<string, LazyExoticComponent<ComponentType>>()
const widgetCache = new Map<string, LazyExoticComponent<ComponentType>>()

export function getLazyPlugin(remoteName: string): LazyExoticComponent<ComponentType> | null {
  const loader = pluginLoaders[remoteName]
  if (!loader) return null
  if (!pluginCache.has(remoteName)) {
    pluginCache.set(remoteName, lazy(loader))
  }
  return pluginCache.get(remoteName)!
}

export function getLazyWidget(moduleName: string): LazyExoticComponent<ComponentType> | null {
  const loader = widgetLoaders[moduleName]
  if (!loader) return null
  if (!widgetCache.has(moduleName)) {
    widgetCache.set(moduleName, lazy(loader))
  }
  return widgetCache.get(moduleName)!
}

export function hasLazyWidget(moduleName: string): boolean {
  return moduleName in widgetLoaders
}

// React never re-runs a lazy() whose promise rejected — it caches the rejection and
// rethrows on every later render. Retrying a failed remote therefore means discarding
// the cached component so the next getLazy* call builds a fresh one.
export function evictPlugin(remoteName: string): void {
  pluginCache.delete(remoteName)
}

export function evictWidget(moduleName: string): void {
  widgetCache.delete(moduleName)
}
