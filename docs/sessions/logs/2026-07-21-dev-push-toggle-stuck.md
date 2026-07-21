# 2026-07-21 — Dev: Push toggle stuck off (auto-bug #53)

Ad-hoc bugfix session, opened from **the first bug ever reported through ADR 046's
in-app bridge**. Five PRs: #54, #55, #56, #57, #58.

---

## The report

> Something is up with enabling push notifications from devices. I just tried
> from settings on my android phone and nothing took. Toggle stays off and disabled.

Capture: `/settings` · build `D_Malhs_` · 426×860 · Android 10, Chrome 150 mobile.

**ADR 046 paid for itself on its first real use.** The build hash in the capture
matched what prod was serving, which ruled out a stale-bundle explanation in one
`curl` — and incidentally closed a queued loose thread: `sw.js` **does** carry its
cache-name stamp (`VERSION` is line 1; the earlier session's grep was simply wrong).

---

## Four bugs, one symptom

Push had **almost certainly never worked in production**. Each bug was hidden behind
the next, so each fix revealed the following one.

**1 — A dismissed prompt was treated as a refusal (#54).**
`Notification.requestPermission()` resolves `'default'` when the prompt is dismissed
rather than answered — the normal outcome under Chrome's quiet notification UI, where
the request is a bell chip in the omnibox that is easy to miss. The hook treated
everything that was not `'granted'` as a denial, so a dismissal set state to `denied`:
toggle off, toggle disabled, subtitle reading _"Notifications blocked — check browser
settings"_ when nothing was blocked. Only a reload got the prompt back.

**2 — The service worker was never registered (#56).** The real blocker. With the
permission gate fixed, the Pixel reported `Error: no service worker registered` — the
guard #54 had added, firing in a freshly reinstalled PWA. `subscribe()` had assumed
boot's registration succeeded. It now registers the worker itself, so a missing
registration self-heals rather than dead-ends.

**3 — A `load` listener added after `load` has fired never runs (#56).** Found while
reading the boot path. `window.addEventListener('load', register)` silently no-ops if
the event already fired, leaving the app with **no worker at all** — the most likely
explanation for bug 2. Now guarded on `document.readyState`.

**4 — Alerts were batched by Android Doze (#57).** With delivery finally working, the
reminder push arrived **~4 minutes late** while the in-app notification was on time.
The 60s scheduler poll cannot account for that; Doze can. `web-push` defaults to
`Urgency: normal`, which a dozing phone may hold until its next maintenance window.
Alerts are time-sensitive by definition, so they now send `urgency: 'high'`.

---

## The lesson: a blind `catch {}` cost three round trips

**This is the finding worth keeping**, above any individual bug.

Every one of the four hid behind a bare `catch {}` on a path a family member can reach.
The diagnosis was not hard — it took ~15 minutes once the failure could speak. What made
it expensive was that **it could not speak**, so each round was a hypothesis shipped to
production and tested by a human with a phone in their hand.

The turning point was **#55, which fixed nothing**. It only made the failure visible:
the hook exposes its error, renders it in place of the row's subtitle, and — the part
that mattered — `console.error`s it. `installErrorCapture` wraps `console.error`, so the
rejection lands in the bug-report ring buffer and **the next report carries it**. The
very next attempt returned an exact error string, and the remaining bugs fell out in one
pass each.

So: **ADR 046's ring buffer is only worth what reaches `console.error`.** A swallowed
exception is a hole in the feature's whole premise — a report that arrives with what
makes it reproducible. Added to the standing conventions in `CLAUDE.md`.

Fixed in the same spirit: `sendPushToProfile` discarded every send failure except a 410
(#57), which is the last leg of the delivery path and would have failed just as silently.
404 now joins 410 as a prune signal, since FCM returns it for an endpoint just as dead.

---

## A bad test, owned

Asked to prove delivery, I proposed moving the report to `deployed` — the arrival ping —
claiming it would exercise Web Push. It could not: `deployedNotification` is
`priority: 'info'` and `notify()` only dispatches push for `priority === 'alert'`
(`notify.ts:60`). The in-app bell arrived and no push did, which was **correct behaviour**,
not the failure it looked like. The valid test was a calendar reminder, which routes at
`alert` (ADR 045).

---

## Also fixed: the reminder announced the wrong time (#58)

Found by the user while confirming push timing. A reminder fires when the occurrence
starts within `(now, now + reminderMinutes]`, but the body was built from
`reminderMinutes` itself — so an event created 5 minutes out with a 10-minute reminder
fired immediately (correct) and said _"Starts in 10 min"_ (false). Now computed from the
real remaining time, `ceil`'d so the common case still reads a round number and capped at
the lead so it can never overstate. `now` is threaded through `fireReminder` rather than
read off the clock, keeping the mocked-clock tests deterministic.

---

## Verified in production

- `POST /api/push/subscribe` → **200**, and `platform.push_subscriptions` holds its
  **first row ever** — an `fcm.googleapis.com` endpoint for Zach. This retires the
  standing note that the table had zero rows, previously blamed on the dev tunnel; the
  registration bug would have kept it empty in prod too.
- Reminder push **delivered to the handset**, end to end: registration → subscription →
  FCM → notification.
- Ruled out along the way: prod serves `/sw.js` 200 `text/javascript` with clean headers;
  the script parses and has a `push` handler; the registration call survives into the prod
  bundle correctly gated; the VAPID key is a well-formed 65-byte uncompressed point;
  `initVapidKeys()` runs at boot; the Pi reaches FCM in 164ms.

**Green:** 43 platform (hook's first tests, 10) · 12 push · 13 reminder scheduler.
Typecheck and lint clean. Five deploys, all `deploy.yml` green.

---

## What the next session needs to know

- **The urgency fix is only observable on a real dozing handset.** Confirmed working, but
  if reminders ever drift late again, that is the first thing to check.
- **Push delivery still cannot be tested in dev** — the shell tears the SW down on every
  load, so a subscription cannot persist. Prod is the only real test. This is now a known
  permanent cost, not a bug.
- **Blocked:** `docker compose cp` / `exec … npx tsx` into the api container is refused by
  the permission classifier (`exec … psql` is allowed). A one-off diagnostic script is
  staged at `/tmp/testpush.ts` on the Pi if it is ever needed; it must be run by hand.
- **Still open from the queue:** rotate the bridge PAT (pasted into a chat transcript),
  reconcile the Prisma generate churn, then Deployment Part F — offsite backups.
