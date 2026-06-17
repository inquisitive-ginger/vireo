# Chores — Progress

---

## M2 — Chores · 🔄 In Progress

> **Milestone done when:** A kid completes a chore and a parent sees it happen.

| Story                                                   | Status         | Notes                                                                                                            |
| ------------------------------------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------- |
| [Task Model + Creation](stories/task-model-creation.md) | ✅ Done        | `chore-engine` plugin; `tasks` table; create/list API; `/chores` view (admin board + taskee list); create drawer |
| [Completion Flow](stories/completion-flow.md)           | ⬜ Not Started | One-tap mark-done; emits `chores.task.completed`; optimistic UI                                                  |
| [XP Award](stories/xp-award.md)                         | ⬜ Not Started | Event subscriber; `xp_balances` table; XP display in view + widget                                               |
| [Parent Notification](stories/parent-notification.md)   | ⬜ Not Started | Event subscriber → `platform.notify()`; Web Push for tier 4                                                      |
| [Today Widget](stories/today-widget.md)                 | ⬜ Not Started | `chores.today-summary` widget; fills reserved home screen slot                                                   |
