# Session Log: 2026-06-07 — dev/web-push

## What was built

**VAPID key lifecycle**

- `initVapidKeys()` generates and stores `vapid_public_key` / `vapid_private_key` in `system_config` on first server boot if absent; subsequent boots reuse the stored pair.
- `GET /api/push/vapid-public-key` exposes the public key to the client.

**DB schema**

- `push_enabled boolean default false` added to `profiles` table.
- New `push_subscriptions` table (`id`, `profile_id`, `endpoint` unique, `p256dh_key`, `auth_key`, `created_at`).
- Migration: `20260607172900_add_push_subscriptions`.

**Server-side push routes** (`apps/api/src/plugins/push.ts`)

- `POST /api/push/subscribe` — tier 3+ only; upserts subscription by endpoint; sets `push_enabled = true` for tier 3 profiles.
- `POST /api/push/unsubscribe` — removes endpoint; clears `push_enabled` for tier 3 when no subscriptions remain.
- `GET /api/push/vapid-public-key` — returns stored public VAPID key.
- 410 Gone handling: `sendPushToProfile()` collects failed endpoints and bulk-deletes them after the send round.

**Web push delivery in notifications route**

- After persisting a notification, `POST /notifications` now calls `sendPushToProfile()` when `priority === 'alert'` AND the profile qualifies (tier 4 always; tier 3 only if `push_enabled === true`). `priority: 'info'` never triggers push.

**Service worker** (`apps/shell/public/sw.js`)

- Added `push` event listener that calls `registration.showNotification()` with parsed JSON payload (title, body) and the app icon.

**Client hook** (`packages/platform/src/hooks/usePushSubscription.ts`)

- `usePushSubscription()` exported from `@family-os/platform`. Detects browser support and current permission state on mount. Exposes `{ state, isLoading, subscribe, unsubscribe }`. `subscribe()` requests Notification permission, fetches the VAPID key, calls `pushManager.subscribe()`, then POSTs to `/api/push/subscribe`. `unsubscribe()` calls the browser API and then POSTs to `/api/push/unsubscribe`.
- `PushSubscriptionState` type exported alongside.

**Settings UI** (`apps/shell/src/pages/Settings.tsx`)

- New `PushNotificationsRow` component using the Radix-backed `Switch` primitive from `@family-os/ui`, paired with `Label htmlFor` for accessible name.
- Wrapped in `TierGate min={3}` inside a "Notifications" `SettingsSection` — visible to tier 3 and 4 only.
- Subtitle adapts to `unsupported`, `denied`, or default state.

**Types**

- `pushEnabled?: boolean` added to `Profile` type and `AuthUser`.
- `pushEnabled` threaded through `auth.ts` middleware, `/auth/me` response, and `AuthProvider.tsx`.

## Acceptance criteria status

| AC                                                                  | Status  | Notes                                                                          |
| ------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------ |
| 1. Tier 4 can grant browser permission; subscription stored in DB   | ✅ Pass | subscribe route stores to push_subscriptions; upsert by endpoint               |
| 2. priority: 'alert' delivers push to all subscribed tier 4 devices | ✅ Pass | sendPushToProfile called in notifications route for tier 4                     |
| 3. priority: 'info' never triggers push                             | ✅ Pass | explicit priority check before calling sendPushToProfile                       |
| 4. Tier 3 sees toggle; enabling stores push_enabled and opts in     | ✅ Pass | TierGate min={3}; subscribe route sets push_enabled for tier 3                 |
| 5. Disabling toggle / unsubscribe stops push delivery               | ✅ Pass | unsubscribe route removes subscription and clears push_enabled                 |
| 6. Tier 1–2 see no controls, receive no push                        | ✅ Pass | API 403 for tier < 3; TierGate hides UI for tier < 3; tier 2 confirmed via E2E |
| 7. 410 Gone removes subscription                                    | ✅ Pass | sendPushToProfile collects 410 endpoints and bulk-deletes                      |

## Decisions made

- `usePushSubscription` placed in `@family-os/platform` (not shell) so plugins can subscribe/unsubscribe as needed.
- `Switch` labeled via `Label htmlFor` / `Switch id` pattern (established pattern in `PermissionToggleItem`) rather than `aria-label` (which `Switch` component doesn't forward).
- `initVapidKeys()` called in `buildServer()` before Fastify is created — runs before any requests land; simplest single-call lifecycle.
- Tier 4 doesn't need `push_enabled` in the routing check — they always qualify if subscribed. `push_enabled` is only meaningful for tier 3 (opt-in).
- Design gate skipped: `PushNotificationsRow` follows the exact same visual pattern as `PinResetRow` (icon + label + control), no new layout or surface invented.

## Scope additions

None — all 7 ACs implemented within original scope.

## New stories created

None.

## Open questions raised

None.

## What the next session needs to know

- VAPID keys are now stored in `system_config`. They are generated once and never rotated automatically — a future ops story would need to handle key rotation if required.
- The `sendPushToProfile` function fires async (fire-and-forget `void`) from the POST /notifications handler. If push delivery fails for reasons other than 410, those errors are silently swallowed. Rate limiting and retry logic are explicitly out of scope (noted in story spec as `Out`).
- E2E tests for web-push require onboarding to have run first (they depend on the onboarding Playwright project). They create and clean up "E2E Teen" (tier 3) and "E2E Older Kid" (tier 2) profiles.
