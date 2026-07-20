# Dev — Service Worker Cache Strategy (prod)

**Date:** 2026-07-19 · **Type:** development · **Module:** platform
**Story:** `docs/modules/platform/stories/sw-cache-strategy.md` (✅ Done)
**Context:** first story on the deployment critical path (`docs/deployment.md` §A1).

## What was built

Two files. The old `sw.js` was cache-first for everything under a never-bumped
`family-os-v1`, so an installed PWA pinned a stale shell across deploys — CI/CD
would push into a void.

- **`apps/shell/public/sw.js`** — rewritten:
  - Navigations (HTML) and `/api`·`/events`·`/plugins/*` → **network-first**
    (cache fallback offline). Fresh `index.html` every online load ⇒ it always
    points at the latest content-hashed bundles.
  - Content-hashed assets → **cache-first** (immutable; filename changes per build).
  - Cross-origin (Google Fonts) passes through untouched.
  - `activate` deletes every cache but the current one. `push` handler unchanged.
  - Cache name is `family-os-<VERSION>` where `VERSION` is a build-time token.
- **`apps/shell/vite.config.ts`** — a ~15-line `apply:'build'` plugin
  (`stampServiceWorker`) reads the entry chunk's content hash in `generateBundle`
  and replaces `__SW_VERSION__` in the emitted `dist/sw.js` at `closeBundle`. No
  new deps.

## Why the build stamp is the actual fix

`sw.js` was byte-identical every build, so the browser never saw a "new" SW and
`activate` never re-ran — even a correct strategy couldn't deploy. Stamping the
entry hash into the cache name makes the SW bytes change every shell build ⇒
browser reinstalls ⇒ `activate` purges the prior cache. The cache name tracks
the **shell** specifically because only the shell is cache-first.

## Verification (live, PROD preview — dev tears the SW down)

- Build green; `dist/sw.js` stamped (`family-os-CQQH0EPt`), no `__SW_VERSION__`
  left; typecheck/lint/tests (3/3) pass.
- Registration confirmed in-browser (`register('/sw.js')` → scope `/`). The empty
  SW panel on first look was timing — the app registers on `window.load`, which
  the Google Fonts `<link>` delays.
- **AC1/AC2:** editing a shell file + rebuild flipped the cache name to a new
  hash and purged the old `family-os-CQQH0EPt`. ✅
- **AC3:** a chores plugin edit appeared on first reload (plugins are
  network-first, so a plugin-only change is picked up without a cache bump —
  the cache key correctly stayed put). ✅
- **AC4:** shell renders offline. ✅

## Scope held

Push-notification changes stayed **out** per the story spec. Deploying the prod
build also incidentally resolves the push-toggle-stuck-OFF symptom (that was a
dev-tunnel artifact: no persistent SW ⇒ no persistent subscription).

## Known / deferred

- **Offline plugins are best-effort.** Network-first means a plugin offline only
  renders if its lazy chunks were fetched during a prior online visit; a
  never-opened plugin page fails offline. In scope-terms this is "offline-first
  beyond the shell" (explicitly out), and for a LAN appliance offline ⇒ no API
  data anyway. Optional future refinement noted in the queue: serve plugin
  `remoteEntry.js`/`manifest.json` network-first but their hashed chunks
  cache-first (mirrors the shell), for reliable offline plugin render.
- **Push subscription reconciliation** (was folded into this story's backlog
  entry) remains: `reset.ts` deletes `push_subscriptions` while a device keeps
  its browser-local subscription, so the toggle reads ON with no server row.
  Separate follow-up.

## Next

Deployment sequence continues at `docs/deployment.md` — Part A remaining
(prod-serve wiring: Caddy static + `/plugins/<n>/` verify, `db:deploy` scripts),
then containerization + CI/CD.
