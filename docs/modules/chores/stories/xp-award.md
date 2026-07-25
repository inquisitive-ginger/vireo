# Story: XP Award

**Module:** chores
**Status:** ✅ Done

## User story

As a kid, I see my XP total go up when I complete a chore so that I feel rewarded and motivated to keep going.

## Scope

**In:**

- `xp_balances` table in the `chore_engine` schema: `{ profile_id uuid PK FK → platform.profiles, total_xp integer default 0, updated_at timestamptz }`
- Event subscriber on `chores.task.completed`:
  - Increments `xp_balances.total_xp` by the event payload's `xpReward`
  - Upserts the `xp_balances` row (creates if not exists; increments if exists)
  - Idempotency guard: before crediting, confirm the referenced task is still `completed` (prevents double-credit if the event is replayed)
- `GET /api/chores/xp` — returns `{ totalXp: number }` for the active profile (tier 1+)
- XP total displayed in the chores full-page view: `text-metric` (32px, DM Sans 700) number + "XP" label in `text-section-label`, positioned above or beside the task list
- Unit tests for the XP subscriber logic; route test for `GET /api/chores/xp`

**Out:** XP levels, level-up animations, badges, leaderboards, streaks; P-Bucks earning from chores (wired in M6); XP decay or expiry; per-task XP history

## Acceptance criteria

1. On `chores.task.completed`, the `xpReward` from the event payload is added to the assignee's `total_xp` in `xp_balances`; a row is created if one doesn't exist yet
2. `GET /api/chores/xp` returns `{ totalXp: 0 }` for a profile with no completed tasks
3. `GET /api/chores/xp` returns the correct cumulative total after multiple completions
4. XP is credited to the `assigneeId` from the event payload, not the currently active session profile
5. The idempotency guard prevents double-crediting: replaying the `chores.task.completed` event for the same task does not increment XP again
6. The XP total renders in the chores full-page view as `text-metric` number + "XP" `text-section-label`; visible to all tiers
7. Route test: `GET /api/chores/xp` returns 0 for new profile; returns correct total after completions
8. Unit test: subscriber receives event → `total_xp` increments by the correct amount

## Dependencies

- completion-flow

## Notes

- The XP subscriber registers in the chore-engine plugin startup using `eventBus.on('chores.task.completed', handler)` — same pattern as other event subscribers in M1
- `xp_balances` is in the `chore_engine` schema, not the platform schema — the chores plugin owns its own XP data
- XP credit goes to the assignee profile even if that profile is no longer the active session (e.g. a parent is viewing the app when XP is credited in the background)
- In M2, XP never converts to P-Bucks — ADR 002. Do not add any P-Bucks wiring.
- The "XP" display in the widget is handled in the today-widget story, not here — this story only handles the chores full-page view display
