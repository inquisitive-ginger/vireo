# Story: Parent Notification

**Module:** chores
**Status:** ⬜ Not Started

## User story

As a parent, I receive a notification when a kid completes a chore so that I can see completions as they happen without watching the screen.

## Scope

**In:**

- Event subscriber on `chores.task.completed`:
  - Looks up the task's `created_by` profile ID (stored at task creation time)
  - Calls `platform.notify()` targeting that profile
  - Notification: `title: "[Assignee name] completed [Task title]"`, `body: "Earned [xpReward] XP"`, `variant: 'info'`, `priority: 'alert'`
  - `priority: 'alert'` routes to Web Push for tier 4 profiles with push opt-in (existing M1 infrastructure handles routing — no new push plumbing)
- The notification appears in the parent's notification tray (tier 2+ tray visibility rule applies)
- Unit test: subscriber receives mock event → `platform.notify()` called with correct args
- Integration test: full event emission → notification persisted in `notifications` table for the parent profile

**Out:** Notification preferences per-chore; batching completions; per-parent notification opt-out for chores; notification for task creation

## Acceptance criteria

1. On `chores.task.completed`, `platform.notify()` is called for the profile identified by the task's `created_by` field
2. Notification `title` is `"[Assignee name] completed [Task title]"`; `body` is `"Earned [xpReward] XP"` (using the xpReward from the event payload)
3. Notification uses `variant: 'info'`, `priority: 'alert'`
4. For tier 4 parents with Web Push opt-in, a push notification is delivered (verified via the existing web-push test infrastructure)
5. The notification appears in the parent's notification tray
6. If the task has no `created_by` (shouldn't happen in M2), the subscriber logs a warning and skips — no crash
7. Unit test: mocked `chores.task.completed` event → `platform.notify()` called with expected profile ID and message
8. Integration test: event emitted → notification row present in `notifications` table for the parent profile

## Dependencies

- completion-flow

## Notes

- This story is a candidate for combination with the xp-award story into a single dev session, since both are small event subscribers on `chores.task.completed`. Decide at session planning time based on available capacity.
- The assignee name needed for the notification title requires fetching the profile from the platform schema — the event payload has `assigneeId` but not the name. The subscriber must look up the profile.
- Do not build new notification infrastructure — use `platform.notify()` from `@family-os/platform/server` exactly as wired in M1.
- This is the "parent sees it happen" half of the M2 done-line.
