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

- Recurring / scheduled tasks
- Parent approval step before XP lands
- Multiple assignees per task
- Teen self-assignment (tier 3 propose flow)
- XP levels, badges, leaderboards, streaks
- F$ earning from chores (wired in M6 — ADR 002)
- Due-date filtering UI
- Reversal / dispute flow

---

## Events namespace

`chores.task.*`

| Event                   | Published by                   | Payload                                         |
| ----------------------- | ------------------------------ | ----------------------------------------------- |
| `chores.task.created`   | chore-engine on POST success   | `{ taskId, assigneeId, createdBy, title }`      |
| `chores.task.completed` | chore-engine on PATCH complete | `{ taskId, assigneeId, xpReward, completedAt }` |

---

## Permissions namespace

| Permission key         | CASL                             | Default baseline                    |
| ---------------------- | -------------------------------- | ----------------------------------- |
| `chores.task.view`     | `can('view', 'chores.Task')`     | Tier 1+                             |
| `chores.task.create`   | `can('create', 'chores.Task')`   | Tier 4                              |
| `chores.task.complete` | `can('complete', 'chores.Task')` | Tier 1+ (row-level: own tasks only) |

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
  "name": "chore-engine",
  "schema": "chore_engine",
  "events": {
    "publishes": ["chores.task.created", "chores.task.completed"],
    "subscribes": []
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

## Database schema (`chore_engine`)

```
tasks
  id            uuid  PK
  title         text
  description   text  nullable
  assignee_id   uuid  FK → platform.profiles.id
  created_by    uuid  FK → platform.profiles.id
  status        text  ('pending' | 'completed')
  due_date      date  nullable
  xp_reward     integer  default 10
  created_at    timestamptz
  completed_at  timestamptz  nullable

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
