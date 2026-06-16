# Kickoff — M2 Dev: Completion Flow

**Type:** Development
**Proposed branch:** `dev/chores-completion`
**Origin:** Queued in M2 Product Planning (2026-06-15)

## Pre-session checklist

- [ ] Read `CLAUDE.md`
- [ ] Read `docs/modules/chores/stories/completion-flow.md` — full story spec and ACs
- [ ] Read `docs/sessions/logs/YYYY-MM-DD-design-chores.md` — completion interaction design (what the kid sees on tap)
- [ ] Read `docs/sessions/logs/YYYY-MM-DD-dev-chores-task-model.md` — how the task model and routes are structured

## Session scope

Add the `PATCH /api/chores/tasks/:id/complete` route, emit `chores.task.completed`, and wire the one-tap completion interaction in the chores task list view.

## Implementation notes

- `chores.task.completed` payload must include `xpReward` from the task record so downstream subscribers don't need to re-query
- Row-level CASL: `can('complete', 'chores.Task')` condition `{ assignee_id: profile.id }` — use `accessibleBy()` on the task lookup before updating
- Optimistic UI: update local state to `completed` on button press; revert if API errors
- Completion is auto-accepted — no approval state, no `awaiting_approval` column
- Touch target for completion button: ≥ 48px

## Required outputs

- [ ] `PATCH /api/chores/tasks/:id/complete` route with event emission
- [ ] Completion button in the chores task list view (own tasks, pending only)
- [ ] Optimistic UI in the task list
- [ ] Completed task visual state (strikethrough, muted)
- [ ] Route tests + E2E test (see ACs in story spec)
- [ ] `docs/modules/chores/progress.md` — Completion Flow marked ✅ Done
- [ ] Session log committed
- [ ] `CLAUDE.md` updated
- [ ] This kickoff doc deleted
