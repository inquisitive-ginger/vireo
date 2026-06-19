# Story: Service Worker Cache Strategy

**Module:** platform
**Status:** ⬜ Not Started

## User story

As a family member, I always get the latest app version after a deploy so that fixes and features aren't hidden behind a stale cached bundle.

## Scope

**In:** Replace the cache-first service-worker strategy for the app shell/JS so it
no longer pins stale bundles — e.g. network-first (or stale-while-revalidate) for
the app shell, and/or a build-stamped cache name so `activate` purges old caches
on every deploy. Installed PWAs must pick up new builds without a manual "clear
site data".

**Out:** Offline-first behaviour beyond what exists today; push-notification changes.

## Acceptance criteria

1. After a new shell build is deployed, a returning client (including an installed PWA) loads the new bundle without manually clearing site data.
2. Old caches are purged on service-worker activation (cache name is build-stamped or versioned).
3. `/api`, `/events`, and `/plugins/*` continue to be served network-first.
4. Offline load of the app shell still works where it did before.

## Dependencies

- none

## Notes

Surfaced during the M2 chores live review (2026-06-19): the cache-first `sw.js`
with a never-bumped `family-os-v1` cache pinned a stale bundle on an installed
PWA — the realtime notification bell looked broken because the device was running
old JS (the new `useEventBus` subscription wasn't in the cached bundle). A **dev
mitigation already shipped** (`apps/shell/src/main.tsx` no longer registers the SW
in dev and tears down any existing SW + caches). This story is the production-side
fix. See `apps/shell/public/sw.js`.
