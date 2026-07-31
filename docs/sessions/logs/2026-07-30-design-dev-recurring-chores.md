# 2026-07-30 — Design+Dev: Recurring Chores + Up for Grabs (ad-hoc)

**PR #90 · ADR 058, ADR 059 · UX exploration artifact (5 gated decisions, all
approved as recommended)**

## What was decided

- **A routine stamps out real tasks (ADR 058).** `chores.routines` holds the rule
  (`'days'` + weekday set, or `'ongoing'`); occurrences are ordinary `Task` rows
  materialized **lazily on read** — `GET /chores/tasks?today=YYYY-MM-DD` carries
  the client's local date, so there is no scheduler and no server-side timezone
  guess. At most one open row per routine; `(routine_id, due_date)` unique makes
  spawning idempotent. Calendar's compute-on-read (ADR 038/057) was deliberately
  not reused: a chore occurrence carries mutable state (`status`, `completedAt`,
  `xpAwarded`) — and the reset-the-row alternative silently stops paying XP after
  the first completion because `xpAwarded` is once-per-task, never reset.
- **Ongoing = done for today, back tomorrow.** One payout/XP per routine per day;
  the same-day second run is the existing tier-4 reopen. The completion stays
  visibly done (in-session morph; collapsed Done on reload, per #82's rule).
- **A missed day stays overdue until the next occurrence, then rolls** — the open
  row re-dates; this week's trash, not last week's debt. Overdue never stacks.
- **Drawer control: a three-way Repeats** (Once / On days / Ongoing) on the shared
  `SegmentedControl`; On days swaps the due date for weekday chips; a summary line
  states the rule and the weekly price ("Every Mon & Thu · pays 2 P$ each time ≈
  4 P$ a week").
- **Up for grabs is claim-then-do (ADR 059).** Null assignee = household-owned
  (Hearth, ADR 041); "I'll do it" claims, then everything downstream is ordinary.
  Completion of an unclaimed task is refused — the economy never learns a second
  earner. Chosen over first-to-finish (reroutes rewards/XP/queue through
  `completedBy`) and over deferring.
- **Focus mode** (user-raised mid-session, gated separately): grabs chores sit in
  a third collapsed section with per-row claim; the hero and meter stay
  own-work-only, preserving the one-action hero.

## What was built

- Migration `20260730120000_add_routines`: `routines` table, `tasks.routine_id`,
  `assignee_id` nullable, the spawn-idempotence unique. Applied to dev,
  `familyos_test` (hand-applied SQL per the P3009 rule), and prod via the deploy
  entrypoint.
- API: `reconcileRoutines` (spawn + roll, pure day-key helpers in
  `apps/api/src/lib/chore-routines.ts`), routine CRUD
  (`POST/PATCH/DELETE /chores/routines`, series-level; PATCH deletes + respawns
  the open row; DELETE sets `ended_at`, keeps history), `PATCH /tasks/:id/claim`
  (null-guarded update settles claim races), complete refuses unclaimed tasks,
  kid list scope widens to own + unassigned. **POST/PATCH task bodies moved onto
  `@family-os/schemas`** (`ChoreTaskInputSchema`/`ChoreRoutineInputSchema`,
  safeParse → 400 flatten) — retires the queue's known hand-rolled offender; `''`
  due date still clears (a test-encoded contract).
- UI: drawer Repeats + day chips + Anyone chip; ↻ row grammar
  (`lib/routines.ts` — daySetLabel/daySetSummary/routineStatusLabel); "Back
  tomorrow" on done ongoing rows; Hearth-spined up-for-grabs lane (board), card
  claim button (taskee), widget group, Focus collapsed section. Edit converts
  between one-shot and routine (create replacement → retire original).
  End-routine confirm replaces the delete copy on routine rows.
- Manifest `publishes` gains the undeclared `chores.task.deleted`. Widget fetch
  also sends `?today=` (the fridge iPad is often the day's first read).
- Tests: +13 API (61 in chores suite; 391 total green), +12 plugin (87 green).

## Sent back / corrected in review

- The Repeats control was first hand-rolled; the user caught that
  `@family-os/ui` already had `SegmentedControl` (a truncated directory listing
  hid it). Swapped — active segment now fills `--primary` per the primitive.
- Focus mode initially excluded grabs chores silently; the user surfaced it and
  it became a gated decision (collapsed-section option chosen).

## Open questions / deferred

- Per-occurrence skip ("no trash this week"), routine end dates, monthly /
  every-N-days patterns — ADR 058's revisit triggers.
- Routine materialization emits no `chores.task.created`; if anything ever
  subscribes to creations for spawned rows, that's a deliberate gap to revisit.
- Claim squatting has no auto-release; parent reassign is the remedy (ADR 059).

## What the next session needs to know

- Divergences from the exploration mockups, both toward house grammar: overdue
  keeps "Overdue · Thu" (not "Was due Thu"), and a pre-load completed ongoing row
  lives in collapsed Done, not inline.
- `GET /chores/tasks` without `?today=` falls back to the server's UTC date —
  only legacy clients hit it; anything new should send the param.
- The one-open-row invariant is softly breakable by tier-4 reopen (by design —
  it is the same-day re-run escape hatch); reconcile tolerates it.
