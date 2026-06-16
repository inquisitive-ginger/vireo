# Kickoff — M2 Dev: Task Model + Creation

**Type:** Development
**Proposed branch:** `dev/chores-task-model`
**Origin:** Queued in M2 Product Planning (2026-06-15)

## Pre-session checklist

- [ ] Read `CLAUDE.md`
- [ ] Read `docs/modules/chores/stories/task-model-creation.md` — full story spec and ACs
- [ ] Read `docs/modules/chores/spec.md` — schema, permissions, events, manifest shape
- [ ] Read `docs/modules/chores/design.md` — **locked UX spec** (page layout: taskee Focus/Agency variants + admin grouped-by-assignee lanes; create = right drawer; shared gold/status colour rules)
- [ ] Read `docs/sessions/logs/2026-06-15-design-chores-ux.md` — full design session record (the deeper "why")
- [ ] Read `docs/sessions/logs/2026-06-07-dev-family-feed-read.md` — reference: how the family-feed plugin was scaffolded (same plugin structure)
- [ ] Read ADR 018 (CASL permission model), ADR 019 (Prisma ORM), ADR 032 (nav item registration)

> **Design is locked — build to `design.md`, don't re-decide.** The Storybook
> **`Chores Playground/…`** stories are the _visual reference only_ — do **not**
> ship them. Build real components in the `chore-engine` plugin with final stories
> under a **`Chores/…`** category (mirror `Family Feed/…`). The playground is
> deleted once the real chores stories exist.

## Session scope

Scaffold the `chore-engine` plugin, build the `tasks` DB table, implement create/assign and list routes, and wire the chores full-page task list view.

## Implementation notes

- `pnpm turbo gen plugin` scaffolds the plugin; update the generated manifest to match the spec
- CASL: `can('view', 'chores.Task')` = tier 1+ (default); `can('create', 'chores.Task')` = tier 4; `can('complete', 'chores.Task')` = tier 1+ with row-level `{ assignee_id: profile.id }` condition
- `accessibleBy()` handles row-level filtering for `GET /api/chores/tasks`
- Emit `chores.task.created` on POST success (even though no subscriber consumes it in M2 — documented in manifest `publishes[]`)
- Add `"check-square"` → `CheckSquare` to `ICON_MAP` in `apps/shell/src/main.tsx`
- **Row colour is STATUS-encoded in the taskee view** (neutral / red=overdue / green=done) — the owner's identity hue carries no info there and must NOT flood the rows (see `design.md` + design-system "Status vs identity colour"). Identity hue is used only in the **admin** (multi-person) view, as per-person lanes/dots.
- The `/chores` page has defined variants in `design.md`: **taskee** Focus (hero "Next up" + Mark done) / Agency (full card list), and **admin** grouped-by-assignee. Build to that layout; XP score plate + completion live in later sessions but leave room for them.

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
