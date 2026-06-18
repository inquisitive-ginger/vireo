# Story: Completion Flow

**Module:** chores
**Status:** ✅ Done

> **Scope amended in dev (2026-06-17, live review).** Two decisions widened the
> original scope: (1) **admin completion — Option A:** a tier-4 parent can complete
> _anyone's_ task from the admin board (plain check-off, no XP flight). (2) **parent
> reopen:** a tier-4 parent can un-complete a task, which resurfaces it on the
> assignee's list. The "reversal" originally listed under **Out** is therefore
> partially in (parent-only reopen; no kid self-reversal, no dispute/history).
> The admin-completion call was made via an interactive Storybook exploration.

## User story

As a kid, I can mark a chore task as done with one tap so that I get instant confirmation and my parent knows I completed it.

## Scope

**In:**

- `PATCH /api/chores/tasks/:id/complete` — marks a task as completed
  - Restricted to the task's assigned profile (row-level: `assignee_id === activeProfile.id`)
  - Only `pending` tasks can be completed
  - Sets `status: 'completed'`, `completed_at: now()`
  - Emits `chores.task.completed` with payload `{ taskId, assigneeId, xpReward, completedAt }`
- Completion button rendered in the chores task list; visible only on the active profile's own pending tasks (gated by `can('complete', 'chores.Task')` + row ownership)
- One-tap: single button press triggers the API call with no confirmation dialog
- Optimistic UI: task row updates to completed state immediately on button press; rolls back to pending if the API returns an error
- Completed tasks remain in the list (not deleted or hidden) with a distinct visual state: strikethrough title, `--muted-foreground` text, completion timestamp
- Empty state updates correctly when the last pending task is completed (tier-appropriate copy)
- Route tests + component tests + E2E test

**Added in dev (Option A + reopen):**

- Admin board: a tier-4 parent completes _any_ task via a per-row check-off (no XP
  flight — the board carries no score plate). Backed by `manage all`.
- `PATCH /api/chores/tasks/:id/reopen` — tier-4 only; sets `status: 'pending'`,
  clears `completed_at`, emits `chores.task.reopened { taskId, assigneeId, xpReward }`.
  The reopened task resurfaces on the assignee's own list.

**Out:** XP award (next story — XP subscriber listens to the event); parent notification (parallel story); parent approval step (explicitly deferred — no `awaiting_approval` status in M2); kid self-reversal; dispute; task history view

## Acceptance criteria

1. `PATCH /api/chores/tasks/:id/complete` returns 200 for the task's assigned profile; returns 403 for any other profile
2. After a successful complete, task `status` is `completed` and `completed_at` is set to the current timestamp
3. Attempting to complete an already-`completed` task returns 409
4. `chores.task.completed` is emitted on success with payload `{ taskId, assigneeId, xpReward, completedAt }`
5. The completion button renders only on `pending` tasks that belong to the active profile; it is not shown on others' tasks or on completed tasks
6. Tapping the completion button applies an optimistic completed state immediately; the UI reverts to `pending` if the API call fails
7. Completed tasks remain visible in the list with strikethrough title and muted text; they do not disappear
8. Route tests: complete as assignee (200), complete as non-assignee (403), complete already-completed (409)
9. E2E: a tier-1 profile navigates to `/chores`, sees their assigned `pending` task, taps the completion button, task row transitions to completed state
10. A tier-4 parent can complete any assignee's task (200); the admin board surfaces a check-off on every pending row
11. `PATCH …/reopen` returns 200 for tier 4 (status → `pending`, `completed_at` cleared) and 403 for the assignee; reopening a non-completed task returns 409; emits `chores.task.reopened`

## Dependencies

- task-model-creation

## Notes

- Completion is auto-accepted — no approval queue, no `awaiting_approval` status. The parent notification IS the visibility mechanism (see parent-notification story).
- The `chores.task.completed` payload must include `xpReward` so downstream subscribers (XP award, parent notification) don't need to re-query the task
- `can('complete', 'chores.Task')` uses `accessibleBy()` row-level filtering: CASL condition is `{ assignee_id: activeProfile.id }` so only the assignee passes the check
- The completion button touch target must be ≥ 48px (tablet touch target rule from design-system.md)
