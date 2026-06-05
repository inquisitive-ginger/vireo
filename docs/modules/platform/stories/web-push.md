# Story: Web Push

**Module:** platform
**Status:** ⬜ Not Started

## User story
As a parent, I receive push notifications on my phone for important platform events so I'm informed even when away from the tablet.

## Scope
**In:**
- VAPID key pair generated once on first server boot if absent; stored in `system_config` (`vapid_public_key`, `vapid_private_key`)
- `GET /api/push/vapid-public-key` exposes the public key to the client
- `POST /api/push/subscribe` stores `{ endpoint, keys }` per profile in a `push_subscriptions` table
- `POST /api/push/unsubscribe` removes the subscription
- `platform.notify()` routes to Web Push when `priority: 'alert'` AND (tier 4, or tier 3 with `push_enabled: true`)
- `push_enabled boolean default false` added to `profiles` table
- Tier 3+ profiles see a Push Notifications toggle in profile settings
- 410 Gone response from a push endpoint removes the subscription from the DB

**Out:** Rich push payloads (images, actions); iOS/Safari Web Push; rate limiting on push sends; push delivery receipts or retry

## Acceptance criteria
1. A tier 4 profile can grant notification permission in the browser; a push subscription is stored in the platform DB
2. Calling `platform.notify({ ..., priority: 'alert' })` delivers a push notification to all subscribed tier 4 devices
3. `priority: 'info'` notifications never trigger Web Push regardless of subscription status
4. A tier 3 profile sees a Push Notifications toggle in profile settings; enabling it stores `push_enabled: true` and opts them into `priority: 'alert'` push delivery
5. Disabling the toggle or calling unsubscribe stops push delivery for that profile
6. Tier 1–2 profiles see no push subscription controls and receive no push notifications
7. If a stored push endpoint returns a 410 Gone response it is removed from the DB and no further pushes are attempted

## Dependencies
- notification-infrastructure
- pwa-installable

## Notes
VAPID keys must never be committed to the repo. `push_enabled` lives on the `profiles` table — it is a profile attribute, not a system config key, since it is per-profile and coupled to tier.
