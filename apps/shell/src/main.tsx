import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Rss, CheckSquare, CalendarDays, Gift, Utensils, ShoppingCart } from 'lucide-react'
import { AuthProvider } from '@family-os/platform'
import type { RegistryEntry, PluginManifest } from '@family-os/platform'
import './styles.css'
import { App } from './App'
import type { PluginNavItem } from './components/Sidebar'
import { Home } from './pages/Home'
import { Onboarding } from './pages/Onboarding'
import { Settings } from './pages/Settings'
import { RequireSetup } from './components/RequireSetup'
import { RequireTier2 } from './components/RequireTier2'
import { PluginView } from './components/PluginView'
import { PluginErrorBoundary } from './components/PluginErrorBoundary'
import { PluginNotFound } from './pages/PluginNotFound'
import { installErrorCapture } from './lib/report-context'

// Before anything else renders — an error thrown during boot is exactly the one worth
// having in a report, and a capture installed after the fact would miss it.
installErrorCapture()

if (import.meta.env.PROD) {
  if ('serviceWorker' in navigator) {
    // Registration failures were swallowed here, which is why "push won't turn on"
    // could not be told apart from "the worker never registered". console.error puts
    // the reason in the bug-report ring buffer.
    const register = () => {
      navigator.serviceWorker.register('/sw.js').catch((err: unknown) => {
        console.error('Service worker registration failed:', err)
      })
    }
    // `load` may already have fired by the time this module evaluates, and a listener
    // added afterwards never runs — leaving the app with no worker at all.
    if (document.readyState === 'complete') register()
    else window.addEventListener('load', register)
  }
} else if ('serviceWorker' in navigator) {
  // Dev: never run the cache-first service worker — it pins stale app bundles on
  // installed PWAs across code changes. Proactively tear down any SW + caches a
  // prior build left so the dev PWA always loads fresh. (Prod cache-strategy fix
  // is tracked as its own story.)
  void navigator.serviceWorker.getRegistrations().then((regs) => {
    for (const r of regs) void r.unregister()
  })
  if ('caches' in window) {
    void caches.keys().then((keys) => keys.forEach((k) => void caches.delete(k)))
  }
}

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; 'aria-hidden'?: boolean }>> = {
  rss: Rss,
  'check-square': CheckSquare,
  'calendar-days': CalendarDays,
  gift: Gift,
  utensils: Utensils,
  'shopping-cart': ShoppingCart,
}

type LoadedPlugin = PluginManifest & { remoteName: string }

async function loadPlugins(): Promise<LoadedPlugin[]> {
  try {
    const res = await fetch('/api/plugins')
    const entries: RegistryEntry[] = await res.json()

    const results = await Promise.allSettled(
      entries.map(async (entry) => {
        const manifestRes = await fetch(`/plugins/${entry.name}/manifest.json`)
        const manifest: PluginManifest = await manifestRes.json()
        return { ...manifest, remoteName: entry.name }
      })
    )

    return results
      .filter((r): r is PromiseFulfilledResult<LoadedPlugin> => r.status === 'fulfilled')
      .map((r) => r.value)
  } catch {
    return []
  }
}

const plugins = await loadPlugins()

// Resolve each widget id to the federation remote that exposes it. A widget's id
// namespace isn't guaranteed to match the remote name, so Home maps ownership via
// the manifest rather than splitting the id — the prefix only coincides with the
// remote name for some plugins (ADR 022).
const widgetRemotes: Record<string, string> = {}
for (const plugin of plugins) {
  for (const widget of (plugin.widgets ?? []) as { id: string }[]) {
    widgetRemotes[widget.id] = plugin.remoteName
  }
}

const pluginNavItems: PluginNavItem[] = plugins
  .filter((p) => p.navItem)
  .map((p) => {
    const navItem = p.navItem!
    const Icon = ICON_MAP[navItem.icon] ?? Rss
    return {
      to: navItem.route,
      label: navItem.label,
      icon: <Icon size={18} aria-hidden />,
      minTier: navItem.minTier,
    }
  })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="onboarding" element={<Onboarding />} />

          <Route element={<RequireSetup />}>
            <Route element={<App pluginNavItems={pluginNavItems} />}>
              <Route index element={<Home widgetRemotes={widgetRemotes} />} />
              <Route element={<RequireTier2 />}>
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* Plugin routes — registered dynamically from each plugin's manifest */}
              {plugins.flatMap((plugin) =>
                plugin.routes.map((route) => (
                  <Route
                    key={route}
                    path={route.replace(/^\//, '')}
                    element={
                      <PluginErrorBoundary remoteName={plugin.remoteName}>
                        <PluginView remoteName={plugin.remoteName} />
                      </PluginErrorBoundary>
                    }
                  />
                ))
              )}

              {/* Unregistered plugin-namespace routes */}
              <Route path="plugin/*" element={<PluginNotFound />} />

              {/* Shell catch-all — future shell pages render null until built */}
              <Route path="*" element={null} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
)
