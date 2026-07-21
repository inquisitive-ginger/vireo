# Dev: Push toggle stuck off + disabled (auto-bug #53)

Ad-hoc bugfix session, opened from the first in-app report to arrive through
ADR 046's bridge.

## The report

> Something is up with enabling push notifications from devices. I just tried
> from settings on my android phone and nothing took. Toggle stays off and disabled.

Capture: `/settings` · build `D_Malhs_` · 426×860 · Android 10, Chrome 150 mobile.

## Pre-session reads

- `packages/platform/src/hooks/usePushSubscription.ts`
- `apps/shell/src/pages/Settings.tsx` — `PushNotificationsRow`
- `docs/sessions/logs/2026-06-07-dev-web-push.md`

## What the evidence rules out

- Prod serves `/sw.js` 200 and it carries `VERSION = 'D_Malhs_'` — the same build
  hash the report captured. The service worker stamp is working; this is not the
  deferred SW thread.
- `GET /api/push/vapid-public-key` appears **once** in 12h of prod API logs, and
  that request is a curl from this session. The phone never reached it, so
  `subscribe()` returned before the VAPID fetch — i.e. at the permission check.

## Scope

The permission branch of `usePushSubscription`, and the two hang paths in the
same file that produce the identical symptom. No UI redesign, no push-delivery
work, no subscription reconciliation (still deferred).

## ACs

1. Dismissing the browser's permission prompt leaves the toggle **interactable**
   so it can be tried again — only a real `denied` disables it.
2. `subscribe()` / `unsubscribe()` cannot hang forever with the toggle disabled
   when no service worker is registered.
3. A browser without `Notification` reports `unsupported`, not a permanently
   disabled `unknown`.
4. Tests cover all three; the hook had none.

## Outputs

- PR against `main`, live-reviewed on the reporter's Android phone.
- Session log; report moved to `deployed` (which notifies the reporter in-app)
  and issue #53 closed.
