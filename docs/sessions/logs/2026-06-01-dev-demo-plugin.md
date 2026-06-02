# Session Log — 2026-06-01 — Development: demo-plugin

## What was built

- **`plugins/demo-plugin/`** — first-party demo plugin scaffolded with the Turborepo generator pattern (files created manually to match the generator output):
  - `vite.config.ts` — Module Federation remote; exposes `./Plugin`; declares `react`, `react-dom`, `@family-os/ui`, `@family-os/platform` as shared singletons; `preview.port: 3010` so `vite preview` serves on the expected port
  - `public/manifest.json` — route `/demo-plugin`; publishes `demo.greeting.sent`; subscribes `demo.greeting.sent`
  - `src/Plugin.tsx` — uses `useAuth`, `TierGate`, `useEventBus` from `@family-os/platform`; uses `Button` from `@family-os/ui`; renders tier-1 child view vs tier-4 parent view; publishes a greeting event on click; subscribes and updates UI when event is received
  - `index.html` — required Vite entry point for `vite build` to resolve (without it, Rollup errors looking for `index.html`)

- **`@family-os/ui` — Button and cn added:**
  - `packages/ui/src/lib/utils.ts` — `cn()` utility (clsx + tailwind-merge)
  - `packages/ui/src/components/button.tsx` — shadcn/ui `Button` component, moved from shell
  - `packages/ui/src/index.ts` — exports `Button`, `buttonVariants`, `ButtonProps`, `cn`
  - `packages/ui/package.json` — added `@radix-ui/react-slot`, `class-variance-authority`, `clsx`, `tailwind-merge` as `dependencies`

- **Shell cleanup** — `@/components/ui/button.tsx` and `@/lib/utils.ts` reduced to thin re-exports from `@family-os/ui`; the four shadcn deps removed from `apps/shell/package.json`

- **`packages/platform/package.json` and `packages/ui/package.json`** — added `"./package.json": "./package.json"` to `exports`; required by `@originjs/vite-plugin-federation` v1.4.1 which reads shared packages' `package.json` during the transform phase

- **`apps/shell/src/lib/load-plugin.ts`** — `demo-plugin` loader case uncommented

- **`apps/shell/src/federation.d.ts`** — `declare module 'demo-plugin/Plugin'` type declaration; required for TypeScript to resolve the Module Federation virtual import

- **`apps/api/src/server.ts` — `/api/trigger-event` made generic:**
  - Accepts optional `{ event, payload }` body; validates event matches `module.noun.verb` regex
  - Falls back to `platform.ping.sent` when body is absent (preserves Home page button behavior)
  - Required for `useEventBus.publish()` to actually fan out custom events through the server

- **Generator templates updated** — `vite.config.ts.hbs` adds `preview` config; `package.json.hbs` adds `preview` script and bumps `@originjs/vite-plugin-federation` to `^1.4.1`

## Acceptance criteria status

1. ✅ Demo plugin registered in plugin registry (`plugins.json`); loads on the tablet without errors
2. ✅ Tier-1 (Family) shows child view; tier-4 (Parent, after PIN) shows parent view — visually distinct via `TierGate`
3. ✅ Plugin uses `Button` from `@family-os/ui` and `useAuth`/`TierGate`/`useEventBus` from `@family-os/platform`
4. ✅ Clicking "Send Greeting Event" publishes `demo.greeting.sent`; shell receives it via WebSocket (visible in home event log)
5. ✅ Plugin subscribes to `demo.greeting.sent`; "Received greetings" list updates in response (count goes from 0 → 1 with profile + tier)
6. ✅ Plugin source imports only from `@family-os/platform` and `@family-os/ui`; no shell, peer plugin, or third-party imports
7. ✅ M0 done definition satisfied — a plugin is installed and rendered on the tablet

## Scope additions (missing requirements folded in)

- **`@family-os/ui` needed a real component** — `@family-os/ui` was empty at session start (only React type re-exports). AC #3 requires a `@family-os/ui` component. Added `Button` and `cn` here because M0's integration test is the first moment any plugin has had reason to import from the UI package. This is not a new feature — it's what the package was always meant to contain; no prior story forced the issue.
- **`/api/trigger-event` needed to accept custom event names** — the existing endpoint only emitted the hardcoded `platform.ping.sent` and ignored the request body. The `useEventBus.publish()` hook has always sent the event name in the body, but nothing exercised that path until this story. Fixed as part of making AC #4/#5 work.
- **`./package.json` export required on workspace packages** — `@originjs/vite-plugin-federation` v1.4.1 resolves shared packages' `package.json` during dev-server transform; without the export entry, the shell dev server 500-errors on every module load.
- **Plugin `preview` workflow** — `@originjs/vite-plugin-federation` dev server does not expose `remoteEntry.js` over HTTP in Vite dev mode; the remote must be built (`vite build`) and served via `vite preview`. Added `preview.port` to vite config and `preview` script to package.json. Generator template updated for future plugins.

## New stories created

None.

## Open questions raised

- **`index.html` in plugin build** — the plugin requires an `index.html` entry point for `vite build` to succeed, which is unusual for a library-style remote. Consider adding a `build.rollupOptions.input` override to the generator template instead, to make the build intent clearer.
- **Plugin dev workflow** — `pnpm dev` starts the plugin as a Vite dev server (hot reload for plugin development), but the shell cannot consume it in dev mode. The full-stack dev workflow is: `pnpm build` + `pnpm preview` on the plugin, then `pnpm dev` on the shell. This should be documented (a `pnpm dev:full` Turborepo task would help here).
- **403 error on tier switch** — a 403 appears in the browser console when switching profiles via `DevProfileSelector` (the switch attempt before PIN entry). This is expected behavior (upward tier switch blocked until PIN verified), not a bug.

## What the next session needs to know

- **M0 is done.** All six stories complete. The platform is proven end-to-end: a plugin loads, renders tier-aware content, publishes events, and subscribes to events.
- **Next up:** Visual Language Design (previously blocked on M0 — now unblocked). See `docs/sessions/queue.md`.
- **Plugin build workflow:** run `pnpm --filter @family-os/plugin-demo-plugin build && pnpm --filter @family-os/plugin-demo-plugin preview` before `pnpm dev` to serve the plugin. The dev server alone is not enough.
- **`@family-os/ui` now has `Button` and `cn`** — future shell and plugin code should import from `@family-os/ui`, not from local copies.
