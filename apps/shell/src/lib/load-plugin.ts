import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

/** Props the shell may pass to a widget. `size` is derived from the layout cell
    (w/h) so the widget can pick its density; widgets that self-size via container
    queries (e.g. family-feed) simply ignore it. */
export type WidgetProps = { size?: 'compact' | 'standard' | 'large' }

// Loader functions keyed by federation remote name (matches `name` field in plugins.json).
// Each entry corresponds to a remote declared in vite.config.ts via plugins.json.
// When a plugin is added to plugins.json, add its lazy import here.
const pluginLoaders: Record<string, () => Promise<{ default: ComponentType }>> = {
  'demo-plugin': () => import('demo-plugin/Plugin'),
  'family-feed': () => import('family-feed/Plugin'),
  chores: () => import('chores/Plugin'),
}

const widgetLoaders: Record<string, () => Promise<{ default: ComponentType<WidgetProps> }>> = {
  'family-feed': () => import('family-feed/widgets/FeedWidget'),
  chores: () => import('chores/widgets/TodaySummary'),
}

const pluginCache = new Map<string, LazyExoticComponent<ComponentType>>()
const widgetCache = new Map<string, LazyExoticComponent<ComponentType<WidgetProps>>>()

export function getLazyPlugin(remoteName: string): LazyExoticComponent<ComponentType> | null {
  const loader = pluginLoaders[remoteName]
  if (!loader) return null
  if (!pluginCache.has(remoteName)) {
    pluginCache.set(remoteName, lazy(loader))
  }
  return pluginCache.get(remoteName)!
}

export function getLazyWidget(
  moduleName: string
): LazyExoticComponent<ComponentType<WidgetProps>> | null {
  const loader = widgetLoaders[moduleName]
  if (!loader) return null
  if (!widgetCache.has(moduleName)) {
    widgetCache.set(moduleName, lazy(loader))
  }
  return widgetCache.get(moduleName)!
}
