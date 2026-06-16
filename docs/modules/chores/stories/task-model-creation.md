# Story: Task Model + Creation

**Module:** chores
**Status:** ⬜ Not Started

## User story

As a parent (tier 4), I can create a chore task and assign it to a family member so that kids have clear things to complete.

## Scope

**In:**

- `chore-engine` plugin scaffolded via `pnpm turbo gen plugin` (plugin name: `chore-engine`)
- `chore_engine` Prisma schema with `tasks` table (see module spec for schema)
- `POST /api/chores/tasks` — create and assign a task; tier 4 only; emits `chores.task.created`
- `GET /api/chores/tasks` — list tasks visible to the active profile:
  - Tier 1–2: own assigned tasks only (row-level filter via `accessibleBy()`)
  - Tier 3–4: all family tasks
- Task fields: `id`, `title`, `description?`, `assignee_id` (required), `created_by`, `status` (default `pending`), `due_date?` (date, nullable), `xp_reward` (integer, default 10), `created_at`
- One-shot tasks only (no recurrence field in M2)
- One assignee per task (required at creation time; no unassigned tasks)
- Plugin nav item in manifest: `{ label: "Chores", route: "/chores", icon: "check-square", minTier: 1 }`
- `"check-square"` added to `ICON_MAP` in `apps/shell/src/main.tsx`
- Chores full-page view (`/chores` route): task list for the active profile; each row shows title, assignee name, assignee identity hue as 4px left spine, optional due date, and `pending` status badge
- `chores.task.view`, `chores.task.create`, `chores.task.complete` added to `PERMISSION_REGISTRY` in `@family-os/platform/types`
- `can('view', 'chores.Task')` = tier 1+ baseline; `can('create', 'chores.Task')` = tier 4 baseline
- Route and API unit tests

**Out:** Completion flow; XP award; parent notification; today widget; recurring tasks; due-date filtering UI; task edit or delete

## Acceptance criteria

1. `POST /api/chores/tasks` with `{ title, assigneeId }` creates a task and returns 201 for tier 4 profiles; returns 403 for tier 1–3 profiles
2. Omitting `assigneeId` returns 400; assigning to a profile that doesn't exist returns 404
3. Task is created with `status: 'pending'`, `xpReward: 10` (default), `createdBy` = active profile id
4. `GET /api/chores/tasks` returns only the active profile's assigned tasks for tier 1–2; returns all tasks for tier 3–4
5. The chores full-page view renders the task list; each row shows title, assignee name, and a 4px left spine in the assignee's identity hue
6. The Chores nav item appears in the sidebar for all tiers (minTier 1); navigates to `/chores`
7. `PERMISSION_REGISTRY` includes `chores.task.view`, `chores.task.create`, `chores.task.complete`
8. Route tests: create (tier 4 → 201), create (tier 3 → 403), create (missing assigneeId → 400), list (tier 1 returns own tasks), list (tier 4 returns all tasks)

## Dependencies

None — first chores story.

## Notes

- Plugin scaffold is the starting point; `pnpm turbo gen plugin` produces the stub; the chore-engine story then extends it
- `xp_reward` stored per-task to support variable rewards in the future; M2 default is always 10
- `due_date` is a date (no time component) — tasks are due on a day, not at a specific time
- `chores.task.complete` permission is defined here but enforced in the completion-flow story
- Emit `chores.task.created` on `POST` success for completeness, even though no subscriber consumes it in M2
- The `ICON_MAP` entry for `"check-square"` maps to `lucide-react`'s `CheckSquare` component
