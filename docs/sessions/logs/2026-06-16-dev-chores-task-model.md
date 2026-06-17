# Session Log — M2 Dev: Task Model + Creation

**Date:** 2026-06-16
**Type:** Development
**Branch:** `dev/chores-task-model`
**Story:** [`docs/modules/chores/stories/task-model-creation.md`](../../modules/chores/stories/task-model-creation.md)

---

## What was built

The first chores story — the `chore-engine` plugin, the task model, create/list
routes, and the full-page `/chores` view.

### Plugin scaffold

- Scaffolded `chore-engine` via `pnpm turbo gen plugin` (base files), then
  extended it to match the family-feed structure (db export, prisma config,
  federation singletons, manifest).
- Manifest: route `/chores`, schema `chore_engine`, nav item
  `{ label: "Chores", route: "/chores", icon: "check-square", minTier: 1 }`,
  `publishes: ["chores.task.created", "chores.task.completed"]`. **No widget in
  the manifest yet** — the `chores.today-summary` widget ships in the Today
  Widget story; listing it now would point the shell at a component that doesn't
  exist.
- `"check-square" → CheckSquare` added to `ICON_MAP` in `apps/shell/src/main.tsx`.
- Registered in `plugins.json` (port 3012).

### Data + API

- `chore_engine.tasks` table (Prisma `Task` model). `db push` applied to **both**
  `familyos` and `familyos_test`. Only `tasks` this story — `xp_balances` lands
  with XP Award.
- `POST /api/chores/tasks` — tier-4 only (`can('create','chores.Task')` → 403
  otherwise); validates title (400), assigneeId (400), assignee existence (404);
  defaults `status='pending'`, `xpReward=10`, `createdBy=active profile`; emits
  `chores.task.created`.
- `GET /api/chores/tasks` — **tiers 1–3 see own assigned tasks; tier 4 and the
  family pseudo-profile see all** (joins assignee name from `platform.profiles`).
  See the list-scope decision below.
- `chores.task.{view,create,complete}` added to `PERMISSION_REGISTRY`; ability
  grants `view` to tiers 1–3 (tier 4 via `manage all`), `create` to tier 4.

### Live-app review fixes (during the review gate)

Caught by running it in the real shell (not just tests):

- **Family-dashboard 500** — `GET /chores/tasks` for the family pseudo-profile
  (id `"family"`, non-UUID) hit Prisma `P2007` on the uuid `assignee_id` filter.
  The default unattended state would crash. Fixed by the list-scope rule (family
  → sees all → no own-id filter) + regression test.
- **"Plugin not found" at `/chores`** — the shell's hand-maintained
  `pluginLoaders` map (`load-plugin.ts`) and `federation.d.ts` had no
  `chore-engine` entry, so `getLazyPlugin` returned null. Added both. (The vite
  federation `remotes` + dev proxy are built from `plugins.json` at startup, so a
  shell dev-server restart was also needed.)
- **Empty state** off-spec → extracted a shared `EmptyState` into `packages/ui`
  (design-system anatomy + compact widget variant) and applied it in chores,
  Family Feed (`FeedEmptyState`), and the **notifications tray**; repointed the
  `Primitives/EmptyState` story to the real component.
- **"Family" shown as an assignee** — the seeded family pseudo-profile came back
  from `/api/profiles`; filtered it out of the create-drawer chips.
- **Stale list on profile switch** — the page fetched once on mount. Now it
  re-fetches when the active profile `id` changes (switch invalidates
  `['api/auth/me']`).
- **`db:reset`** — added a `chore-engine` reset path (`DELETE FROM
chore_engine.tasks`) mirroring `family-feed`; reset via `--module chore-engine`
  or `--all`.

### Frontend (`/chores`)

- `ChoresPage` (container) → `ChoresPageView` branches on tier:
  - **Tier 4 — admin board:** grouped-by-assignee lanes (identity hue), per-lane
    workload meter (count + summed XP load), per-lane "+ add", "New Task" button.
  - **Tiers 1–3 — taskee list:** full status-encoded card list (Agency variant).
- **Create drawer** (design §3, create-only): right drawer, title +
  identity-hue assignee chips + gold reward presets (5/10/15/20/25, default 10) +
  optional due date; global and per-person-prefill entry points.
- Status-vs-identity rule honoured: taskee rows are **status-encoded** (neutral /
  red=overdue / green=done); identity hue is used **only** in the admin board.
- Real Storybook stories under **`Chores/…`** (page + drawer). The
  `Chores Playground/…` reference stories (`packages/ui/src/chores-playground/`)
  were **deleted** per the design lock.

### Tests

- `apps/api/src/plugins/chores.test.ts` — 14 route tests (create 201/403/400/404,
  custom xpReward; list own-only for tiers 1/2/3, all for tier 4 + the family
  pseudo-profile, joined name). Covers story AC 8.
- Updated `profiles.test.ts` permission-count assertion (registry 4 → 7) + chores
  baseline checks.
- **Full suite green: 203 passed.** typecheck + lint clean. Federation bundle
  builds.

---

## Decisions

- **List scope (resolved in the live review).** The written AC4 put tier 3 with
  the admins (sees all); the locked `design.md` makes tiers 1–3 taskees. The user
  resolved it: **tiers 1–3 see their own tasks; tier 4 (admin) and the family
  pseudo-profile see all** (family framing for the unattended dashboard). The
  family dashboard renders the by-assignee board **read-only** (no create / no
  per-lane "+ add"). Story AC4 + spec updated to match.
- **`accessibleBy()` not used for row filtering.** Our CASL subjects are
  namespaced strings (`'chores.Task'`), and `@casl/prisma`'s `accessibleBy` keys
  the where-clause by **Prisma model name** (`Task`) — the two don't map without
  extra subject-detection plumbing. Used an explicit filter (`tier >= 4 || family
→ all; else own`), which is easy to test. Worth revisiting if/when a shared
  CASL→Prisma subject mapping is added.
- **Taskee = Agency (full list) only this story.** The design's Focus variant is
  gated on a per-profile "Focus mode" setting that defaults from tier — that
  setting has no schema yet. Built the Agency list now; left `ChoresPageView`
  easy to branch when Focus mode ships. (Owes a small product/ADR call on where
  the Focus-mode flag lives.)
- **Admin filters deferred.** Scope (Today/Week/All), hide-completed, and the
  pulse **filter** chips are in the locked design but only do meaningful work
  once tasks can complete and recur — deferred. Kept the lightweight pulse
  **summary** (counts only, no family XP) by the title. Drag-to-reassign and
  kebab edit/remove are explicitly out (task edit/delete is out of scope).
- **Gold/XP colours are local to the plugin** (`src/lib/gold.ts`) for M2. The XP
  Award story should promote them to shared `--gold-*` tokens in `styles.css`.
- **XP score plate omitted** (header leaves room) — lifetime XP comes from
  `xp_balances`, built in XP Award.

---

## Sent back / flags

- **Admin completion (for the Completion Flow story).** A tier-4 parent currently
  can't complete a chore — completion is the next story. Open product question to
  resolve there: should an admin be able to complete _anyone's_ chore, or only
  their own? Captured on the Completion Flow kickoff.
- **Generator bug (`pnpm turbo gen plugin`).** Under `@turbo/gen` 2.9.16 the
  final `registerPlugin` custom action threw (`paths[0] must be a string`) — the
  3rd callback arg is no longer `rootPath`, so the `plugins.json` write failed.
  Also the `tsconfig.json.hbs` template extends `../../../tsconfig.json` (one
  level too deep — plugins sit two levels under root). Both worked around by
  hand; worth fixing the generator so the next plugin scaffolds cleanly.

---

## What the next session needs to know

- **Completion Flow** builds on this: `PATCH /api/chores/tasks/:id/complete`
  (enforce `can('complete','chores.Task')` with the row-level `{ assigneeId }`
  condition — the `complete` action/registry entry exist but **no ability rule is
  wired yet**, deliberately left for that story), the `chores.task.completed`
  event, and the completion tap + XP-flight. The taskee card already renders the
  40px completion circle (inert) and the admin/taskee done-states, so there's a
  target to wire.
- **XP Award** adds `xp_balances`, the score plate (header leaves room), and
  should promote the local gold constants to shared tokens.
- **Today Widget** adds the `chores.today-summary` widget + its manifest entry,
  and can reuse the shared `EmptyState` (compact variant) for its empty slot.
- List-scope is settled (tiers 1–3 own; tier 4 + family all). Completion Flow
  still owes the admin-completion product call (see flags).
- ADR still owed (from design): **member capacity** (gates the capacity-aware
  load meter; the current meter is relative-to-max only).
- **Process:** the development session template now has a **Live-app review gate**
  before close-out — run it in the shell and get sign-off before docs/commit/PR.
