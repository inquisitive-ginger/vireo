# Session Log — M2 Dev: Completion Flow

**Date:** 2026-06-17
**Type:** Development
**Story:** [chores/completion-flow](../../modules/chores/stories/completion-flow.md)
**Branch:** `dev/chores-completion`

---

## What was decided

- **Admin completion = Option A** (settled via an interactive Storybook exploration
  the user reviewed live). A tier-4 parent may complete **anyone's** task from the
  admin board with a **plain per-row check-off** — no XP flight (the board carries
  no score plate; family surfaces have no XP). Backed by the already-shipped
  `manage all`.
- **Parent reopen (added in live review).** A completed row's check doubles as an
  **un-complete** control for tier 4. Reopening sets the task back to `pending` and
  it **resurfaces on the assignee's own list**. Kids cannot reverse their own
  completion. This widens the story's original "reversal — Out" to "parent-only
  reopen — In" (no kid self-reversal, no dispute/history).
- **Score plate is local/optimistic this story.** The kickoff requires the flight's
  score-plate landing + count-up, but the task-model handoff had parked the plate
  in the _XP Award_ story. Resolved per the kickoff (authoritative scope): built a
  local plate here (seeded from completed tasks, banks on completion). **XP Award
  owes** swapping the seed for the persisted balance via `GET /api/chores/xp`.
  Flagged, not re-litigated.
- **Row-level ownership enforced explicitly**, not via `accessibleBy()`/`subject()`
  — the typed `@casl/prisma` ability keys subjects by Prisma model name and can't
  carry our namespaced `'chores.Task'` string (same limitation task-model hit). The
  CASL `complete` capability still gates (respecting overrides); assignee/tier-4 is
  the row condition.

## What was built

**Backend** (`apps/api/src/plugins/chores.ts`, `packages/platform/src/ability.ts`)

- `PATCH /api/chores/tasks/:id/complete` — assignee completes own (row-level
  `complete` rule, all tiers) or tier-4 completes any (`manage all`). 404 unknown /
  403 not-allowed / 409 already-completed. Emits `chores.task.completed
{ taskId, assigneeId, xpReward, completedAt }`.
- `PATCH /api/chores/tasks/:id/reopen` — tier-4 only (new `reopen` action; covered
  by `manage all`). 403 non-admin / 409 not-completed. Emits `chores.task.reopened
{ taskId, assigneeId, xpReward }`.
- `ability.ts`: added `reopen` action; added `can('complete', 'chores.Task',
{ assigneeId: profile.id })` for every tier (complete-own is now baseline — a kid
  can complete their own chore).

**Frontend** (`plugins/chore-engine`)

- **XP flight** (design §2): `ScorePlate` (gold lifetime plate, grow-to-1.09 +
  easeInOutCubic count-up via WAAPI/rAF, forwarded ref = flight target),
  `FlightChip` (portal, `position: fixed`, ~980ms arc with ~36px lift, scale 1→0.5
  - fade, mount-only), `TaskeeView` orchestrator (`pending → inFlight → done+banked`,
    locked card order so the card doesn't reorder mid-flight, optimistic + revert,
    reduced-motion + off-screen → quiet bank), `usePrefersReducedMotion` hook.
- `TaskCard`: 40px completion circle is now an interactive button on own pending
  tasks; reports the XP badge's live rect (flight launch point); hides the badge
  in flight; morphs to done on landing.
- `AdminBoard`/`AdminRow`: per-row check-off (Option A) + tier-4 reopen control;
  per-row optimistic status with revert; read-only viewers (family dashboard) get a
  static check, no controls.
- `ChoresPage`: `completeTask`/`reopenTask` mutations (invalidate `['chores/tasks']`
  on success so the board + the assignee's list reconcile); `ChoresPageView`
  delegates the non-empty taskee branch to `TaskeeView` and passes the handlers to
  `AdminBoard` (gated by `canManage`).

**Tests**

- Route tests (`chores.test.ts`): complete 200 (own) / 200 (tier-4 any) / 403
  (non-assignee) / 409 (already) / 404; emits `completed` payload. Reopen 200 (tier
  4, clears `completed_at`) / 403 (assignee) / 409 (not completed); emits `reopened`.
  **All 149 API tests green.**
- Updated `profiles.test.ts`: `chores.task.complete` is now in the tier-1 baseline
  (complete-own) — assertion flipped to `true`.
- `chores.test.ts` `clearTasks()` now clears the **whole** table (it's the
  dedicated test DB) so the "sees all" count assertions stay deterministic — the
  chores E2E writes tasks to the same `familyos_test` DB and was leaking rows in.
- **E2E** (`packages/e2e/tests/chores-completion.spec.ts`): a tier-1 child opens
  `/chores`, taps the completion circle, the card transitions to done. **Passes.**
  Added a `chore-engine` preview (port 3012) to the Playwright `webServer` so the
  real federated `/chores` page renders (was an uninstalled placeholder before).
  Setup (PIN → assign → switch) is driven via in-page `fetch` (the app proxies
  `/api`; the session cookie must live on the page origin — the profile dropdown is
  too animation-flaky for a cold load).

## Live-app review

Verified via the passing E2E and a live walk-through on port 5173. Issues found +
fixed in review:

- **Completion circles were broken** (taskee + admin): they used Tailwind
  `grid`/`place-items-center`, which the shell's Tailwind doesn't emit for plugins
  (it only scans `packages/ui` + shell, and neither utility appears there) → no
  CSS in the federated plugin. Inlined the layout (`display: grid; placeItems:
center`) — the plugin convention.
- **Admin board resorted on completion** (completed → bottom on refetch, a jarring
  jump). Added a lane + row **order-lock** (first-seen) so completion/reopen morphs
  in place; the initial sort still applies on a fresh load.
- **Flight tuned snappier**: ~980→760ms; plate grow ~860→660ms; count-up ~640→500ms
  (design §2 updated).
- **Create form** (Task Model component): field rhythm 18→24px + full-width date
  input; the date field now opens the native picker on a click anywhere (not just
  the icon) via `showPicker()`. A properly themed date picker (shadcn Calendar +
  react-day-picker) is **deferred to the calendar module** — not queued (it's
  shared platform infra that module will own). Small out-of-scope polish, flagged.
- **Page alignment + `PageHeader`**: the chores admin board was full-bleed while
  the heading was inset 24px (misaligned). Extracted a reusable **`PageHeader`**
  (title + optional eyebrow / subtitle / action) into `packages/ui` and adopted it
  in **both** Family Feed and Chores. Aligned the chores page column to the feed's
  (`max-width: 680`, `padding: 28px 24px 48px`) for taskee + admin/family, so the
  header and the board/list share the same 24px inset. Cross-cutting (touches
  `packages/ui` + family-feed) — flagged as beyond the Completion Flow story.

User signed off on the live walk-through (2026-06-17) after the fixes above.

## Queue

At the user's request, queued **M2 Dev: Focus Mode** (the deferred taskee Focus
variant + the per-profile Focus-mode setting) with a kickoff stub. Completion Flow
moved Up Next → Recently Completed.

## Open questions / what the next session needs to know

- **XP Award owes the score plate's real data.** Swap the local seed for the
  persisted balance; subscribe to `chores.task.completed` to bank and
  `chores.task.reopened` to **claw back** XP. The plate component + flight target
  are already in place — XP Award just feeds it real numbers + the widget mini-plate.
- **Parent Notification** subscribes to `chores.task.completed` (payload already
  carries `xpReward`, no re-query). Consider whether `reopened` warrants a notice.
- No plugin **component** tests: the flight leans on WAAPI + `getBoundingClientRect`,
  which jsdom doesn't implement — route tests + the E2E cover the behavior.
- `turbo gen plugin` generator bug (from task-model) still open.

## Outputs

- `PATCH …/complete` + `…/reopen` routes + events ✅
- XP flight (ScorePlate / FlightChip / TaskeeView) + admin check-off + reopen ✅
- Route tests + E2E ✅ (149 API + chores E2E green)
- `progress.md` Completion Flow → ✅ Done; story spec amended; `design.md` §2 +
  Option A note ✅
- Storybook exploration story deleted (decision made; playground pattern) ✅
- `CLAUDE.md` updated; kickoff deleted ✅
