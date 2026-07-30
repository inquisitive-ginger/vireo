# 2026-07-29 — Dev: calendar new-event notification (ad-hoc, PR #88)

## What was built

`calendar.event.created` subscriber in `apps/api/src/plugins/calendar.ts`:
every tier-4 profile except the creator gets `platform.notify()` — title
"Dad added Dentist", body is the start formatted server-local ("Sat, Aug 1 ·
3:00 PM" / "All day" / "· Repeats weekly"). Chores-notification shape:
registered in the plugin body, errors logged and swallowed so a failed
notification never breaks event creation. Manifest `subscribes` + spec events
table updated.

## Acceptance criteria status

All five pass — 3 subscriber integration tests added (audience/exclusion,
all-day copy, recurring notifies once); suite 371/371, typecheck clean.

## Decisions made (gated with user)

- **Priority `alert`** — Web Push to tier 4 per ADR 029; creations are
  infrequent, timeliness is the point. (Over `info`/calm-by-default.)
- **Creator excluded** — chores `completedBy === createdBy` precedent; tier 4
  are the usual creators.
- Recurring series notifies **once, at creation** — the event fires once per
  series (ADR 038).

## Open questions

- Body time is server-local (the Pi's timezone = household's). Fine until a
  timezone story exists.
- Live-app walk **skipped at user's direction** (test suite accepted as
  verification). Note: dev seed has only one tier-4 profile, so the feature is
  silent in dev until a second parent exists; prod has two.

## What the next session needs to know

Prod verified post-deploy (shell 200; `/api/calendar/events` answers its own
400 validation → plugin + subscriber loaded). `calendar.event.updated` /
`.deleted` have no notification — nobody asked; the subscriber is the template
if wanted.
