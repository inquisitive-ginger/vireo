# Chores — Module Spec

> Spec written in M2 Product Planning session (2026-06-15).

---

## What it is

The chores module lets parents assign tasks to family members, tracks kid completions, and awards XP as immediate positive feedback. It is the first feature module after the platform shell — the entry point for turning Family OS from infrastructure into a daily-use tool for kids.

## M2 scope (MVP)

- Task creation and assignment (tier 4 creates, assigns to any profile)
- One-shot tasks (no recurrence in M2)
- One assignee per task
- Kid marks task done (tier 1+, own tasks only)
- Completion is auto-accepted — no parent approval step
- XP awarded on completion (stored as a running total; no levels or badges in M2)
- Parent notified on completion via `platform.notify()` + Web Push if opted in
- `chores.today-summary` widget fills the reserved home screen slot
- Chores full-page view (task list + XP total)

## Explicitly deferred

- ~~Recurring / scheduled tasks~~ — **shipped 2026-07-30** (see Recurring chores below)
- Parent approval step before XP lands
- Multiple assignees per task
- Teen self-assignment (tier 3 propose flow)
- XP levels, badges, leaderboards, streaks
- ~~P-Bucks earning from chores (wired in **M4 Rewards** — ADR 002; `coinReward` lands on `Task` and rides `chores.task.completed` per ADR 048)~~ — **shipped 2026-07-23** (M4/3, PR #64; live in prod since PR #75)
- Due-date filtering UI
- Reversal / dispute flow
- Per-occurrence routine skip ("no trash this week"), routine end dates, monthly
  patterns, every-N-days cadences (ADR 058's revisit triggers)

## Recurring chores + up for grabs (2026-07-30 · ADR 058, ADR 059)

A **routine** (`kind 'days'` with a weekday set, or `'ongoing'` — done for
today, back tomorrow) stamps out ordinary `Task` rows lazily on read
(`GET /chores/tasks?today=` carries the client's local date; at most one open row
per routine; a missed day stays overdue then rolls at the next occurrence).
Routine CRUD is tier 4 at `/chores/routines`; edits/deletes act on the series.

A task or routine may be assigned to **Anyone** (`assigneeId` null): it wears
the Hearth identity and any member claims it via `PATCH /chores/tasks/:id/claim`
("I'll do it") before completing — the economy always credits an assignee.

---

## Events namespace

`chores.task.*`

| Event                   | Published by             | Payload                                                                        |
| ----------------------- | ------------------------ | ------------------------------------------------------------------------------ |
| `chores.task.created`   | chores on POST success   | `{ taskId, assigneeId, createdBy, title }` (`assigneeId` null = up for grabs)  |
| `chores.task.completed` | chores on PATCH complete | `{ taskId, assigneeId, xpReward, completedAt, title, createdBy, completedBy }` |
| `chores.task.reopened`  | chores on PATCH reopen   | `{ taskId, assigneeId, xpReward }`                                             |
| `chores.task.deleted`   | chores on DELETE success | `{ taskId, assigneeId, coinReward, completedAt }` (voids a held payout, M4/3b) |

Routine materialization emits no `created` events — spawning is read-time
reconciliation, not an authored act. Claims emit nothing (the refetch carries the
new assignee).

---

## Permissions namespace

| Permission key         | CASL                             | Default baseline                    |
| ---------------------- | -------------------------------- | ----------------------------------- |
| `chores.task.view`     | `can('view', 'chores.Task')`     | Tier 1+                             |
| `chores.task.create`   | `can('create', 'chores.Task')`   | Tier 4                              |
| `chores.task.complete` | `can('complete', 'chores.Task')` | Tier 1+ (row-level: own tasks only) |

Only `view` / `create` / `complete` are registered in `PERMISSION_REGISTRY` (the
grant-/revoke-able set). The tier-4 management actions below are CASL baseline rules
on `chores.Task` (`manage`/`all`) — enforced in the routes but **not** individually
toggleable, so they have no registry key:

| CASL action                    | Route                            | Default baseline              |
| ------------------------------ | -------------------------------- | ----------------------------- |
| `can('reopen', 'chores.Task')` | `PATCH /chores/tasks/:id/reopen` | Tier 4 (un-complete any task) |
| `can('update', 'chores.Task')` | `PATCH /chores/tasks/:id`        | Tier 4 (edit any task)        |
| `can('delete', 'chores.Task')` | `DELETE /chores/tasks/:id`       | Tier 4 (remove any task)      |

Routine routes (`POST`/`PATCH`/`DELETE /chores/routines[/:id]`) reuse the task
`create`/`update`/`delete` actions. `PATCH /chores/tasks/:id/claim` reuses
`complete` (claiming is the first half of doing); the row condition is
`assigneeId === null`, and the family pseudo-profile is refused.

---

## Widget

### `chores.today-summary`

| Field                | Value                                     |
| -------------------- | ----------------------------------------- |
| `id`                 | `chores.today-summary`                    |
| `displayName`        | Today's Chores                            |
| `defaultSize`        | `standard`                                |
| `supportedSizes`     | `compact`, `standard`, `large`            |
| `minTier`            | 1                                         |
| `requiredPermission` | `chores.task.view`                        |
| `description`        | Shows the current user's tasks due today. |

---

## Plugin manifest shape

```json
{
  "name": "chores",
  "schema": "chores",
  "events": {
    "publishes": [
      "chores.task.created",
      "chores.task.completed",
      "chores.task.reopened",
      "chores.task.deleted"
    ],
    "subscribes": ["chores.task.completed"]
  },
  "routes": ["/chores"],
  "navItem": {
    "label": "Chores",
    "route": "/chores",
    "icon": "check-square",
    "minTier": 1
  },
  "widgets": [
    {
      "id": "chores.today-summary",
      "displayName": "Today's Chores",
      "component": "./widgets/TodaySummary",
      "defaultSize": "standard",
      "supportedSizes": ["compact", "standard", "large"],
      "minTier": 1,
      "requiredPermission": "chores.task.view",
      "description": "Shows the current user's tasks due today."
    }
  ]
}
```

---

## Database schema (`chores`)

```
tasks
  id            uuid  PK
  title         text
  description   text  nullable
  assignee_id   uuid  nullable  (null = up for grabs; validated against platform.profiles)
  created_by    uuid  (validated against platform.profiles)
  status        text  ('pending' | 'completed')
  due_date      date  nullable
  routine_id    uuid  nullable  → routines.id  (unique (routine_id, due_date))
  xp_reward     integer  default 10
  coin_reward   integer  default 0
  requires_approval  boolean  default false
  xp_awarded    boolean  default false
  created_at    timestamptz
  completed_at  timestamptz  nullable

routines
  id            uuid  PK
  title         text
  description   text  nullable
  assignee_id   uuid  nullable  (null = each occurrence spawns up for grabs)
  created_by    uuid
  kind          text  ('days' | 'ongoing')
  repeat_days   integer[]  (local weekdays, Sunday 0; non-empty for 'days')
  coin_reward   integer  default 0
  requires_approval  boolean  default false
  created_at    timestamptz
  ended_at      timestamptz  nullable  (ended routines stop spawning; history kept)

xp_balances
  profile_id    uuid  PK  FK → platform.profiles.id
  total_xp      integer  default 0
  updated_at    timestamptz
```

---

## Home surface placement

Reserved in all three default layouts (ADR 028):

| Tier bucket           | Size       | Position              |
| --------------------- | ---------- | --------------------- |
| Family pseudo-profile | `standard` | Bottom-left (2 wide)  |
| Tiers 1–2             | `large`    | Left (2 wide, 2 tall) |
| Tiers 3–4             | `standard` | Bottom-right (2 wide) |
