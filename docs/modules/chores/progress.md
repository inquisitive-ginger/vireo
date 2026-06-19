# Chores — Progress

---

## M2 — Chores · ✅ Done

> **Milestone done when:** A kid completes a chore and a parent sees it happen.

| Story                                                   | Status  | Notes                                                                                                                                     |
| ------------------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| [Task Model + Creation](stories/task-model-creation.md) | ✅ Done | `chores` plugin; `tasks` table; create/list API; `/chores` view (admin board + taskee list); create drawer                                |
| [Completion Flow](stories/completion-flow.md)           | ✅ Done | One-tap complete + XP flight (taskee); admin check-off (Option A) + tier-4 reopen; `complete`/`reopen` routes + events; optimistic UI     |
| [XP Award](stories/xp-award.md)                         | ✅ Done | `xp_balances` table; idempotent XP subscriber; `GET /api/chores/xp`; lifetime score plate wired into the page header                      |
| [Parent Notification](stories/parent-notification.md)   | ✅ Done | Subscriber → shared server `notify()` (persist + prune + Web Push); realtime bell via `platform.notification.created`                     |
| [Today Widget](stories/today-widget.md)                 | ✅ Done | `chores.today-summary` widget (taskee + family framings, sizes, empty states); fills the reserved home slot; Home resolves by remote name |

> **Done-when met** (completion + parent notification). The plugin was renamed
> **`chore-engine → chores`** (#24) — remote/package name + Postgres schema now
> match the `chores.*` domain namespace. **Queued enhancement:** Focus Mode
> (taskee Focus view + per-profile setting) — see `docs/sessions/queue.md`.
