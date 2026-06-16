# Story: Completion Flow

**Module:** chores
**Status:** ⬜ Not Started

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

**Out:** XP award (next story — XP subscriber listens to the event); parent notification (parallel story); parent approval step (explicitly deferred — no `awaiting_approval` status in M2); reversal/dispute; task history view

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

## Dependencies

- task-model-creation

## Notes

- Completion is auto-accepted — no approval queue, no `awaiting_approval` status. The parent notification IS the visibility mechanism (see parent-notification story).
- The `chores.task.completed` payload must include `xpReward` so downstream subscribers (XP award, parent notification) don't need to re-query the task
- `can('complete', 'chores.Task')` uses `accessibleBy()` row-level filtering: CASL condition is `{ assignee_id: activeProfile.id }` so only the assignee passes the check
- The completion button touch target must be ≥ 48px (tablet touch target rule from design-system.md)
