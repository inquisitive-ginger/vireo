# Session Log — 2026-06-01 — Development: plugin-loader

## What was decided

- **Plugin registry storage:** JSON-backed (`plugins.json` at repo root) exposed via `GET /api/plugins`. Shell never reads the file directly — all access goes through the API route, making a future DB migration a one-file server change with zero frontend impact.
- **Federation library:** `@originjs/vite-plugin-federation` (battle-tested Vite-native; `@module-federation/vite` not yet stable enough).
- **Remote config generation:** `vite.config.ts` reads `plugins.json` at startup and builds federation `remotes` automatically — no separate build step, no manual config sync.
- **Routing:** Client-side at app startup (shell fetches `/api/plugins`, then each plugin's `manifest.json`, then registers routes). Static shell routes stay hardcoded; plugin routes appended as a separate block.
- **Error states:** `PluginErrorBoundary` (React class component) per plugin route for load failures (AC #7); `PluginNotFound` rendered when `getLazyPlugin` returns null for an unregistered remote (AC #6).

## What was built

- `plugins.json` — empty registry at repo root; `RegistryEntry` shape: `{ name, baseUrl }`
- `GET /api/plugins` — reads `plugins.json`, returns registry entries
- `RegistryEntry` type added to `@family-os/platform` and exported
- `vite.config.ts` — federation plugin added; remotes built from `plugins.json` at startup; `build.target: 'esnext'`; `@family-os/platform` and `@family-os/ui` declared as shared singletons
- `apps/shell/src/lib/load-plugin.ts` — cached lazy-component registry (`getLazyPlugin`); empty stub with comment pointing to where demo-plugin adds its import
- `apps/shell/src/components/PluginErrorBoundary.tsx` — class error boundary; isolated per route
- `apps/shell/src/components/PluginView.tsx` — Suspense wrapper; calls `getLazyPlugin`; falls through to `PluginNotFound` if null
- `apps/shell/src/pages/PluginNotFound.tsx` — error state for unregistered plugin routes
- `apps/shell/src/main.tsx` — top-level `await loadPlugins()` before mount; dynamic `<Route>` elements from manifest data; `plugin/*` catch-all for plugin-namespace misses
- Generator updated: prompts for port, writes `public/manifest.json` (Vite serves at `/manifest.json`), registers entry in `plugins.json`, sets `strictPort: true` in plugin vite config

## Open questions raised

None — story is complete and all 7 ACs are satisfied by the infrastructure. End-to-end validation deferred to `demo-plugin`.

## What the next session needs to know

- `load-plugin.ts` is the only file that needs updating when a new plugin is added — add a `case` to the `loaders` record with `() => import('<remote-name>/Plugin')`
- The generator now handles `plugins.json` registration and `public/manifest.json` placement automatically — run `pnpm turbo gen plugin`, specify name + port, then add the loader entry in `load-plugin.ts`
- `demo-plugin` is the last M0 story — it validates the full scaffold → dev → load workflow and directly satisfies the M0 done definition ("a plugin can be installed and rendered on the tablet")
