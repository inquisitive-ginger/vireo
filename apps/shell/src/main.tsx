import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@family-os/platform'
import type { RegistryEntry, PluginManifest } from '@family-os/platform'
import './styles.css'
import { App } from './App'
import { Home } from './pages/Home'
import { Onboarding } from './pages/Onboarding'
import { Settings } from './pages/Settings'
import { RequireSetup } from './components/RequireSetup'
import { RequireTier2 } from './components/RequireTier2'
import { PluginView } from './components/PluginView'
import { PluginErrorBoundary } from './components/PluginErrorBoundary'
import { PluginNotFound } from './pages/PluginNotFound'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="onboarding" element={<Onboarding />} />

          <Route element={<RequireSetup />}>
            <Route element={<App />}>
              <Route index element={<Home />} />
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
                      <PluginErrorBoundary>
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
