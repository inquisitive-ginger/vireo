# Kickoff — M2 Dev: Task Model + Creation

**Type:** Development
**Proposed branch:** `dev/chores-task-model`
**Origin:** Queued in M2 Product Planning (2026-06-15)

## Pre-session checklist

- [ ] Read `CLAUDE.md`
- [ ] Read `docs/modules/chores/stories/task-model-creation.md` — full story spec and ACs
- [ ] Read `docs/modules/chores/spec.md` — schema, permissions, events, manifest shape
- [ ] Read `docs/sessions/logs/YYYY-MM-DD-design-chores.md` — design outputs (visual direction for the task list view)
- [ ] Read `docs/sessions/logs/2026-06-07-dev-family-feed-read.md` — reference: how the family-feed plugin was scaffolded (same plugin structure)
- [ ] Read ADR 018 (CASL permission model), ADR 019 (Prisma ORM), ADR 032 (nav item registration)

## Session scope

Scaffold the `chore-engine` plugin, build the `tasks` DB table, implement create/assign and list routes, and wire the chores full-page task list view.

## Implementation notes

- `pnpm turbo gen plugin` scaffolds the plugin; update the generated manifest to match the spec
- CASL: `can('view', 'chores.Task')` = tier 1+ (default); `can('create', 'chores.Task')` = tier 4; `can('complete', 'chores.Task')` = tier 1+ with row-level `{ assignee_id: profile.id }` condition
- `accessibleBy()` handles row-level filtering for `GET /api/chores/tasks`
- Emit `chores.task.created` on POST success (even though no subscriber consumes it in M2 — documented in manifest `publishes[]`)
- Add `"check-square"` → `CheckSquare` to `ICON_MAP` in `apps/shell/src/main.tsx`
- Identity hue on task rows: `getIdentityHue(assignee.name)` from `@family-os/ui`

## Required outputs

- [ ] `chore-engine` plugin scaffolded with correct manifest
- [ ] `chore_engine` Prisma schema with `tasks` table; `db push` applied
- [ ] `POST /api/chores/tasks` and `GET /api/chores/tasks` routes
- [ ] Chores full-page view (`/chores`) rendering task list
- [ ] `PERMISSION_REGISTRY` updated in `@family-os/platform/types`
- [ ] Route tests (see ACs 8 in story spec)
- [ ] `docs/modules/chores/progress.md` — Task Model + Creation marked ✅ Done
- [ ] Session log committed
- [ ] `CLAUDE.md` updated
- [ ] This kickoff doc deleted
