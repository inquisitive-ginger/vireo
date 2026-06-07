# Story: PWA Installable

**Module:** platform
**Status:** ✅ Done

## User story

As a parent, I can install Family OS to my phone's home screen so I can access the family dashboard without a browser URL bar.

## Scope

**In:**

- `manifest.webmanifest`: name, short_name, icons (192px + 512px), `display: standalone`, `start_url: /`, theme_color, background_color; linked in `index.html`
- Service worker registered on load: shell assets (HTML, JS, CSS) cached cache-first; API calls network-first
- Icons added to `public/icons/`
- Native browser install prompt fires when engagement criteria are met

**Out:** Offline data sync or offline post creation; push notification permission (web-push story); mobile-specific nav or layout (deferred design session)

## Acceptance criteria

1. The shell serves a valid `manifest.webmanifest` and Lighthouse PWA audit passes installability checks
2. A service worker is registered on load; shell assets are cached after first visit
3. On Android Chrome, the "Add to Home Screen" prompt appears after engagement criteria are met
4. Launching from the home screen icon opens the app in standalone mode with no browser chrome
5. Reloading while offline serves the cached shell; API-dependent content shows a network error or stale state rather than a blank screen

## Dependencies

- none

## Notes

Verify Vite Module Federation compatibility with `vite-plugin-pwa` before committing to it — module federation and service worker asset precaching can conflict. A thin manual service worker is an acceptable fallback if the plugin approach doesn't compose cleanly. This should be the first thing checked at the start of the implementation session.
