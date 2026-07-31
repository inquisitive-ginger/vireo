# ADR 058 — Chore Routines Materialize Real Tasks

**Status:** Decided — 2026-07-30

## Decision

A recurring chore is a **routine** — a `chores.routines` row holding the rule
(`kind: 'days' | 'ongoing'`, `repeat_days int[]`) plus the task fields it stamps
onto each occurrence. Occurrences are **ordinary `Task` rows**, materialized
**lazily on read**: `GET /chores/tasks?today=YYYY-MM-DD` reconciles every active
routine against the client's local date. There is no scheduler and no clock-driven
spawn.

- **At most one open (pending) row per routine.** A `days` routine keeps its next
  occurrence visible ahead ("Due Mon"); an `ongoing` routine keeps today's row.
  The `(routine_id, due_date)` unique index makes spawning idempotent — concurrent
  reads race benignly and the loser is a no-op.
- **Ongoing = done for today, back tomorrow.** Completing today's row is the day's
  completion; the unique index blocks a same-day respawn, and the next day's read
  spawns fresh. One payout and one XP award per routine per day; the tier-4
  reopen is the same-day escape hatch.
- **A missed day stays overdue until the next occurrence, then rolls.** The open
  row re-dates to the newest scheduled day ≤ today — this week's trash, not last
  week's debt. Overdue never stacks.
- **`repeat_days` are absolute local weekdays** (Sunday 0). A chore day is a date
  key, and a calendar date has an unambiguous weekday — the timestamp problem
  ADR 057 solved with offsets does not exist here.
- **Series-level mutations** (ADR 038's contract): editing edits the routine and
  respawns the open row from the new rule; delete sets `ended_at`, removes the
  open row, and keeps completed history (and its ledger entries) intact.

## Why

- **A chore occurrence carries mutable state** — `status`, `completedAt`,
  `xpAwarded`, and it is the target of `PATCH /complete`. Calendar's
  compute-on-read (ADR 038) works because an event occurrence needs no row; a
  computed chore occurrence would have nothing to write to.
- **Real rows leave the economy untouched.** `xpAwarded` stays once-per-row (each
  occurrence pays XP exactly once), the reopened badge keeps its second meaning,
  and the P-Bucks ledger key `taskId@completedAt` (ADR 047/048) already treats
  each row as its own instance. Approval holds, clawback, the widget, and the
  Done clamps all keep working with zero changes.
- **Lazy materialization sidesteps the timezone the server doesn't have**
  (ADR 057). The client already owns the local-date boundary (`toDateKey` in the
  drawer); sending `?today=` extends that convention instead of inventing a
  household-timezone setting or spawning at the wrong UTC hour.

## Alternatives considered

- **One canonical row that resets on completion.** Cheapest schema, but
  `handleXpAward` claims on `xpAwarded: false` and never resets it — the row
  silently stops paying XP after its first completion, and clearing the flag
  corrupts the reopened-badge signal. History vanishes unless a completion ledger
  is added, at which point half of the alternative below has been built anyway.
- **Canonical row + sparse completions ledger** (the ADR 038/045 shape). No row
  growth, but XP idempotence, the rewards reopen/void path, and every consumer of
  `Task[]` learn synthetic occurrences — the deepest possible cut into settled
  economy code, bought back a few hundred rows a year.
- **A scheduler tick** (ADR 045's poll) spawning rows at midnight. Midnight in
  which timezone? The tick would spawn hours early or late for any real
  household, and restart-safety re-derives on read anyway — which is the whole
  mechanism, so the tick adds nothing.

## Do not revisit unless

Occurrence patterns outgrow weekday sets (every-other-week, monthly-nth — the
same trigger as ADR 038/057), a household-timezone setting lands (a server-side
spawn becomes possible; it still may not be worth it), or routine row growth
actually shows up in profiling at family scale.
