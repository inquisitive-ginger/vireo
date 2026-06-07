# Session Log: M1 Dev — PWA Installable

**Date:** 2026-06-06
**Branch:** `dev/platform-pwa-installable`

## What was built

- `apps/shell/public/manifest.webmanifest` — name, short_name, display: standalone, start_url: /, theme_color: #b4533a, background_color: #fef9f4, 192px + 512px PNG icons
- `apps/shell/public/sw.js` — manual service worker; cache-first for shell assets; network-first for `/api/`, `/events`, `/plugins/`; `skipWaiting` + `clients.claim()` for immediate activation; old-cache pruning on activate
- `apps/shell/public/icons/icon-192x192.png` + `icon-512x512.png` — solid terracotta (#b4533a) placeholder icons (final design deferred to Mobile Surface Design session)
- `apps/shell/index.html` — `<link rel="manifest">`, `theme-color` meta, Apple PWA metas
- `apps/shell/src/main.tsx` — SW registration on window load
- `packages/e2e/tests/pwa.spec.ts` — 3 Playwright tests: manifest fields, icon serving, SW registration

## Acceptance criteria status

| AC                                                      | Status      | Notes                                                                                     |
| ------------------------------------------------------- | ----------- | ----------------------------------------------------------------------------------------- |
| 1. Lighthouse installability checks pass                | Pass        | Manifest valid; SW with fetch handler registered; icons present                           |
| 2. SW registered; shell assets cached after first visit | Pass        | Verified via Playwright + browser DevTools                                                |
| 3. Android Chrome "Add to Home Screen" prompt           | Manual only | Browser-controlled; app is technically eligible                                           |
| 4. Standalone mode (no browser chrome)                  | Manual only | `display: standalone` set; requires device verification                                   |
| 5. Offline reload serves cached shell                   | Pass        | Cache-first strategy caches shell assets on first visit; tested via DevTools offline mode |

## Decisions made

**Manual service worker over `vite-plugin-pwa`:** `@originjs/vite-plugin-federation` v1.4.1 generates `__vite__mapDeps` and `__vite_preload__` shims in the build output that can interfere with workbox's static asset manifest generation. A manual SW avoids this entirely. Story Notes explicitly endorsed this fallback. The manual SW satisfies all ACs without additional dependencies.

**Placeholder icons:** Solid terracotta (#b4533a) squares for 192px and 512px. The Mobile Surface Design session (in queue) will specify the final icon design. Lighthouse only checks that correctly-sized icons exist — a solid color is valid.

**Theme color:** `#b4533a` — hex approximation of the design system's primary: `oklch(0.57 0.14 35)`.

## Scope additions

None.

## New stories created

None.

## Open questions raised

None — the vite-plugin-pwa compatibility question from Notes is resolved (manual SW chosen).

## What the next session needs to know

- The service worker cache name is `family-os-v1`. When SW logic changes, bump the version in `sw.js` to force cache invalidation.
- Icons are placeholders — the Mobile Surface Design session should produce proper branded icons for `public/icons/`.
- web-push story (next) will need to extend the SW to handle push events; modify `sw.js` in that session.
