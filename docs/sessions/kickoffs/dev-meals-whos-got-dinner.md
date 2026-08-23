# Kickoff — M5/3 · Dev: Who's Got Dinner

**Type:** Development · **Module:** `meals` · **Branch:** `dev/meals-whos-got-dinner`
**Depends on:** M5/2 ✅ (claim, kind verbs, widget escalation all shipped)

## Pre-session checklist

- [ ] Read `CLAUDE.md` (Standing Engineering Conventions), `docs/modules/meals/spec.md`
      §"Day-level nudge", `docs/modules/meals/design.md` §M5/3
- [ ] Read **ADR 045** — this session's blueprint, not just a precedent — and
      `apps/api/src/lib/reminder-scheduler.ts` + its test (mocked-clock tick)
- [ ] Read **ADR 029** for `notify()` levels; `apps/api/src/lib/notify.ts` (tier-2+
      gate, `alert` → Web Push)
- [ ] Read `plugins/meals/src/lib/meals.ts` — `ESCALATION_HOUR`, `DINNER_DONE_HOUR`,
      `isCovered()` already exist and already drive the widget
- [ ] Worktree: copy `.env` from the main checkout or `turbo dev` dies at
      `node: ../../.env: not found`

## Session scope

_One sentence:_ Meals grows the afternoon nudge — a poll that at `ESCALATION_HOUR`
tells the owner they've got dinner (carrying the try bite) and tells tier 4 when
nobody does, exactly once per day, durable across restarts.

**Already shipped, do not rebuild:** one-tap claim, kind verbs, the widget's
escalated badge + solid claim button. This session is the server half.

## Acceptance criteria

1. At/after 16:00 local, a claimed dinner nudges its owner: _"You've got dinner
   tonight: rigatoni"_, carrying the try bite when set.
2. At/after 16:00, an **uncovered, unclaimed** dinner nudges every tier-4 parent:
   _"Nobody's got dinner."_ `isCovered()` days (going out, ownerless takeout) and
   days with no meal at all nudge nobody.
3. Exactly once per day per audience — a restart at 17:00 does not re-fire, and a
   restart that spans 16:00 still fires.
4. Nothing fires at/after `DINNER_DONE_HOUR` — after dinner the surfaces record.
5. Claiming after the tier-4 nudge fires the owner nudge; it does not re-nudge tier 4.
6. The tick is not started under `NODE_ENV=test`; tests drive it directly with a
   mocked clock.

## Constraints coming in

- **ADR 045 shape, verbatim:** 60s in-process `setInterval` started in the plugin's
  registration, stopped on `onClose`; due-ness computed on read; a sparse
  **past-only** ledger for exactly-once, the insert being the claim (unique violation
  → skip, failed dispatch → delete the claim so the next tick retries). No cron, no
  broker, no materialized future.
- **One hour, two channels.** The widget already flips at `ESCALATION_HOUR`; the poll
  must fire at the same constant, not a second copy of 16. The constant currently
  lives in `plugins/meals/src/lib/meals.ts` and `apps/api` already imports
  `@family-os/plugin-meals/db` — one home, imported twice.
- Priority `alert` so the nudge reaches Web Push; `notify()` applies the tier gate.
- No blind `catch {}` — a swallowed dispatch failure is invisible in this house.
- **Parallel run:** wave 1 alongside M5/4 and M5/6. You own
  `apps/api/src/lib/meals-nudge*.ts`; you share `apps/api/src/plugins/meals.ts` and
  `plugins/meals/prisma/`. Rebase and re-run `prisma generate` before merging, and
  commit only schema-derived generated files.

## Decisions to make

1. **Ledger shape** — the dual of `reminder_log`: PK on `(date, audience)` in the
   `meals` schema, or one row per notified profile. Pick the one that makes AC5 fall
   out rather than needing a special case.
2. **Where the constants live** so both halves import one value (export from the
   plugin package vs. a shared module) — and whether `isCovered()` moves with them.
3. **Timezone.** `date` is `@db.Date` with no timezone math today; the poll needs a
   local 16:00. State the server-local assumption explicitly.
4. **Tier-4 fan-out** — one notification each, or the family profile.

## Non-goals

`meals.dinner.fulfilled` / a done flag (the widget uses `DINNER_DONE_HOUR`), the
history prompt in the empty state, anything grocery.

## Outputs (required before closing)

- [ ] Live-app review gate passed (drive the tick with a mocked clock in the running
      app; a nudge landing in the tray + on a phone is the proof)
- [ ] Unit tests over the tick at 15:59 / 16:00 / 20:00, restart re-entry, and the
      claim-after-escalation path
- [ ] `pnpm typecheck` + `pnpm test` clean (per-package; API suite on `familyos_test`,
      hand-apply the new migration's SQL there)
- [ ] `progress.md` row ✅, session log, `CLAUDE.md` status, queue entry, PR; delete
      this kickoff
