# Kickoff — M2 Dev: XP Award + Parent Notification

**Type:** Development
**Proposed branch:** `dev/chores-xp-notification`
**Origin:** Queued in M2 Product Planning (2026-06-15)
**Note:** These two stories are combined into one session — both are event subscribers on `chores.task.completed` with low individual complexity.

## Pre-session checklist

- [ ] Read `CLAUDE.md`
- [ ] Read `docs/modules/chores/stories/xp-award.md` — XP subscriber, schema, display
- [ ] Read `docs/modules/chores/stories/parent-notification.md` — notification subscriber
- [ ] Read `docs/modules/chores/design.md` — **locked XP display** (gold "score plate" = lifetime total; lighter daily-earned momentum stat; gold semantic) + design-system "Reward / XP"
- [ ] Read the `dev-chores-completion` session log — confirms `chores.task.completed` payload shape + the XP-flight target (the score plate this session renders)
- [ ] Read `docs/sessions/logs/2026-06-06-dev-notification-infrastructure.md` — reference: how `platform.notify()` is called server-side
- [ ] Read `docs/sessions/logs/2026-06-07-dev-web-push.md` — confirms Web Push routing for `priority: 'alert'`

> **Design is locked — build to `design.md`.** Ship real components in
> `chore-engine`; final stories under a **`Chores/…`** category. The
> `Chores Playground/…` stories are visual reference only.

## Session scope

Wire two event subscribers on `chores.task.completed`: one credits XP to the assignee's running total; the other notifies the assigning parent.

## Implementation notes

- Both subscribers register in chore-engine plugin startup via `eventBus.on('chores.task.completed', handler)`
- XP subscriber: upsert `xp_balances`; idempotency guard checks task is still `completed` before crediting
- Notification subscriber: must look up the assignee name from the platform schema (event payload has `assigneeId` but not the name)
- `GET /api/chores/xp` returns the active profile's XP total (lifetime running total)
- Display XP per `design.md`: the **lifetime total** is the gold "score plate" (coin + DM Sans `text-metric` numeral + `XP / TOTAL`) in the page header; the **daily-earned** momentum stat (lighter, TrendingUp + gold-ink) sits on the progress line. Gold is **XP-only**; numerals are DM Sans, not Lora. This score plate is also the **target the completion XP-flight animates into**.

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
