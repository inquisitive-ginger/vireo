# Session Log — M2 Dev: XP Award + Parent Notification + Today Widget (agent team) + rename

**Date:** 2026-06-19
**Type:** Development (two stories run in parallel via an agent team) + a follow-on rename
**PRs:** #23 (xp + notification), #22 (today widget), #24 (chore-engine → chores rename)

## What was built

### XP Award (#23)

- `chores.xp_balances` table + migration; idempotent `chores.task.completed` subscriber (`handleXpAward`) — re-fetches the task and bails if it's no longer `completed` (guards the reopen-before-handler window).
- `GET /api/chores/xp` — active profile's lifetime total (0 for new profiles).
- Lifetime gold **score plate** wired into the chores page header: `ChoresPage` `useQuery(['chores/xp'])` → `ChoresPageView` → `TaskeeView` `initialXp` (seeds the optimistic plate once; refetches don't re-seed).

### Parent Notification (#23)

- `handleParentNotification` subscriber notifies the task's creator (the assigning parent), skipping tier-1 creators / missing `createdBy`.
- **Shared server `notify()` helper** (`apps/api/src/lib/notify.ts`): persist → prune to 50 → Web Push gate (`priority: 'alert'`, tier 4 always / tier 3 with push). Both `POST /notifications` and the chores subscriber route through it. (The subscriber originally raw-inserted, which skipped push **and** pruning — surfaced in live review.)
- **Realtime bell:** `notify()` emits `platform.notification.created { profileId }`; `NotificationBell` subscribes via `useEventBus`, filters by active profile, invalidates the unread badge + tray. Replaced a **dead** `window 'platform:notification'` listener that nothing dispatched.

### Today Widget (#22)

- `chores.today-summary` widget — `TodaySummaryView` (taskee + family framings; compact/standard/large; empty states) + `TodaySummary` container (local/optimistic `ScorePlate`, **no** dependency on `GET /api/chores/xp` per the locked Option A) + Storybook stories under `Chores/`.
- Registered in manifest `widgets[]` + federation `exposes` + shell `load-plugin` widget loader + `federation.d.ts`.
- **Home render fix:** `Home.tsx` resolved the widget's plugin by splitting the widget id (`chores.today-summary` → `chores`), which didn't match the federation remote name — so the widget fell back to a `PlaceholderCard`. Fixed by building a `widgetId → remoteName` map from the loaded manifests in `main.tsx` and passing it to `Home`.

### Rename (#24): `chore-engine → chores`

- Remote/package name: `plugins/chore-engine → plugins/chores`, `@family-os/plugin-chores`, vite federation name, manifest, `plugins.json`, shell federation wiring, api imports, e2e config, db reset script.
- Postgres schema `chore_engine → chores`: migrations rewritten to create `chores` directly (no prod DB; dev/test re-migrated after clearing stale `public._prisma_migrations` rows so both re-applied). `@@schema`, config, client regenerated.

## Acceptance criteria status

All ACs for XP Award, Parent Notification, and Today Widget met and verified live (page header score plate counts up on completion; parent gets in-app tray + Web Push + live bell; widget renders both framings across tiers). 161 API tests pass; typecheck/lint/builds green.

## Decisions made

- **`notify()` boundary:** a server-side subscriber can't go through the self-scoped `POST /notifications` route (it notifies the authenticated caller, has no `targetProfileId`, and a subscriber has no request context). The shared service helper is the correct boundary; the route is a thin auth adapter over it.
- **Rename schema via rewrite, not ALTER:** no production DB and a single dev, so the two (already-merged) migrations were rewritten to target `chores` directly and the dev/test DBs re-migrated. Cleaner than an `ALTER SCHEMA` given Prisma's migration-table bootstrapping.
- **Dev service worker:** the cache-first `sw.js` (static `family-os-v1`) pinned stale bundles on installed PWAs. Dev mitigation shipped (register SW only in prod; dev unregisters + clears caches). Production cache-strategy fix queued as its own story.

## Scope additions (folded in during live review)

- Shared `notify()` helper + realtime bell (the notification story implicitly required push, which the raw insert dropped).
- Proxy `changeOrigin` so federated plugins load when the shell is reached via a Cloudflare tunnel (plugin Vite servers 403'd the tunnel `Host`).
- Dev SW guard.
- The `chore-engine → chores` rename (decided during review; remote/package name vs domain namespace were diverging).

## New stories created

- `docs/modules/platform/stories/sw-cache-strategy.md` — production service-worker cache strategy (queued).

## Open questions raised

- `turbo gen plugin` bug (carried from prior sessions) — still open.
- Prod SW cache strategy (network-first vs build-stamped cache) — to decide when the queued story is picked up.

## What the next session needs to know

- M2 done-line is met. **Next: M2 Dev: Focus Mode** (taskee Focus view + per-profile setting; needs the setting's storage ADR).
- The plugin is now `chores` everywhere (`@family-os/plugin-chores`, schema `chores`). Anyone pulling should run `pnpm install` + `prisma migrate deploy` to land on the `chores` schema.
- New plugin notifications should call the server `notify()` helper, not raw-insert — that's what dispatches push + prunes + fires the realtime bell event.
- **Process note:** the agent-team run hit an environment fault — `isolation: "worktree"` silently fell back to a single shared checkout, so the two teammates' `git checkout`s clobbered each other mid-flight. Recovered (each branch committed cleanly). For future parallel runs, set up `git worktree add` manually rather than trusting that flag.
