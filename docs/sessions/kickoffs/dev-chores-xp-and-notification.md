# Kickoff — M2 Dev: XP Award + Parent Notification

**Type:** Development
**Proposed branch:** `dev/chores-xp-notification`
**Origin:** Queued in M2 Product Planning (2026-06-15)
**Note:** These two stories are combined into one session — both are event subscribers on `chores.task.completed` with low individual complexity.

## Pre-session checklist

- [ ] Read `CLAUDE.md`
- [ ] Read `docs/modules/chores/stories/xp-award.md` — XP subscriber, schema, display
- [ ] Read `docs/modules/chores/stories/parent-notification.md` — notification subscriber
- [ ] Read `docs/sessions/logs/YYYY-MM-DD-dev-chores-completion.md` — confirms `chores.task.completed` payload shape
- [ ] Read `docs/sessions/logs/2026-06-06-dev-notification-infrastructure.md` — reference: how `platform.notify()` is called server-side
- [ ] Read `docs/sessions/logs/2026-06-07-dev-web-push.md` — confirms Web Push routing for `priority: 'alert'`

## Session scope

Wire two event subscribers on `chores.task.completed`: one credits XP to the assignee's running total; the other notifies the assigning parent.

## Implementation notes

- Both subscribers register in chore-engine plugin startup via `eventBus.on('chores.task.completed', handler)`
- XP subscriber: upsert `xp_balances`; idempotency guard checks task is still `completed` before crediting
- Notification subscriber: must look up the assignee name from the platform schema (event payload has `assigneeId` but not the name)
- `GET /api/chores/xp` returns the active profile's XP total
- Display XP total in the chores full-page view per the design session output (`text-metric` treatment)

## Required outputs

- [ ] `xp_balances` table in `chore_engine` schema; migration applied
- [ ] XP event subscriber (with idempotency guard)
- [ ] `GET /api/chores/xp` route
- [ ] XP total displayed in the chores full-page view
- [ ] Parent notification event subscriber
- [ ] Route and unit tests for both stories (see ACs in story specs)
- [ ] `docs/modules/chores/progress.md` — XP Award + Parent Notification both marked ✅ Done
- [ ] Session log committed
- [ ] `CLAUDE.md` updated
- [ ] This kickoff doc deleted
