# Kickoff — M2 Dev: Completion Flow

**Type:** Development
**Proposed branch:** `dev/chores-completion`
**Origin:** Queued in M2 Product Planning (2026-06-15)

## Pre-session checklist

- [ ] Read `CLAUDE.md`
- [ ] Read `docs/modules/chores/stories/completion-flow.md` — full story spec and ACs
- [ ] Read `docs/modules/chores/design.md` §2 — **locked completion design** ("XP flight" + exact sequence/motion)
- [ ] Read `docs/sessions/logs/2026-06-15-design-chores-ux.md` (Group 2) — full record, motion timings, edge cases
- [ ] Read the `dev-chores-task-model` session log — how the task model and routes are structured

> **Design is locked — build to `design.md`.** `Chores Playground/…` stories are
> visual reference only (the playground's `2 · Completion` story is the working
> spec for the flight). Ship real components in `chore-engine`; final stories
> under a **`Chores/…`** category.

## Session scope

Add the `PATCH /api/chores/tasks/:id/complete` route, emit `chores.task.completed`, and wire the one-tap completion interaction in the chores task list view.

## Implementation notes

- `chores.task.completed` payload must include `xpReward` from the task record so downstream subscribers don't need to re-query
- Row-level CASL: `can('complete', 'chores.Task')` condition `{ assignee_id: profile.id }` — use `accessibleBy()` on the task lookup before updating
- Completion is auto-accepted — no approval state, no `awaiting_approval` column
- Tap targets per design: focus view = big green **"Mark done"** button; agency view = 40px completion circle. Both fire the same flight.
- **The earn moment is the locked "XP flight" — follow the `design.md` §2 sequence, not a plain optimistic toggle:**
  - State machine per task: `pending → inFlight → done+banked`. On tap, launch the flight chip immediately from the badge's measured position and hide the source badge; **the card does NOT morph/reorder during the flight**; on landing the card morphs to done, XP banks, the score plate counts up.
  - The flight chip is rendered in a **portal** (`position: fixed`) so no ancestor `overflow` clips it; start/end via `getBoundingClientRect`.
  - **Edge:** score plate off-screen → quiet bank (no flight). **Reduced-motion → skip the flight**, just morph + bank on tap (this is the simple optimistic path).
  - The local "completed" state is still optimistic vs the API — revert on error.

## Required outputs

- [ ] `PATCH /api/chores/tasks/:id/complete` route with event emission
- [ ] Completion tap target per view (focus button / agency circle), own tasks pending only
- [ ] XP-flight earn moment per `design.md` §2 (`pending → inFlight → done+banked`; portal chip; score-plate count-up) with reduced-motion + off-screen fallbacks
- [ ] Completed task visual state (green spine, strikethrough, muted)
- [ ] Route tests + E2E test (see ACs in story spec)
- [ ] `docs/modules/chores/progress.md` — Completion Flow marked ✅ Done
- [ ] Session log committed
- [ ] `CLAUDE.md` updated
- [ ] This kickoff doc deleted
