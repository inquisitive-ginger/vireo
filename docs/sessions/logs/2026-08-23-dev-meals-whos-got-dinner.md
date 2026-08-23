# 2026-08-23 — dev, meals/whos-got-dinner (M5/3)

**Shipped:** PR #124, merged `6bf0e88`. The afternoon nudge poll — ADR 045's
shape verbatim, `apps/api/src/lib/meals-nudge.ts` + tests. Branch
`dev/meals-whos-got-dinner`.

## What was built

- `runMealsNudgeTick(bus, now)` on a 60s `setInterval` (`unref`'d, one in-flight
  tick at a time), started at plugin registration, stopped on close, not started
  under `NODE_ENV=test`. Fires only inside `[ESCALATION_HOUR, DINNER_DONE_HOUR)`
  — 16:00–20:00, the same constants the widget escalates on.
- Owner nudge: _"You've got dinner tonight: {title}"_, try bite as the body line,
  `priority: 'alert'`.
- Escalation: no owner and `!isCovered(meal)` → _"Nobody's got dinner."_ to every
  tier-4 parent, one notification each. Covered days and days with no meal nudge
  nobody.
- Ledger `meals.dinner_nudge_log`, PK `(date, audience)`, migration
  `20260822143000_add_dinner_nudge_log`. The insert **is** the claim: unique
  violation → skip; dispatch failure → delete the claim so the next tick retries.
  Rows older than 30 days pruned each tick.

## Acceptance criteria status

All six pass. AC5 (claim after the tier-4 nudge fires the owner nudge, does not
re-nudge tier 4) falls out of the `(date, audience)` PK with no special case —
that was the point of decision 1.

## Decisions made

1. **Ledger keyed `(date, audience)`**, not one row per notified profile. AC5 is
   free; the tier-4 fan-out is one claim covering N dispatches.
2. **Constants have one home** — `ESCALATION_HOUR`, `DINNER_DONE_HOUR`, and
   `isCovered()` are now exported from `@family-os/plugin-meals/lib/meals` and
   imported by both halves. No second copy of 16.
3. **Timezone: server-local, stated.** `date` is `@db.Date`; `todayDateOnly()`
   builds the UTC-midnight `Date` the column stores for the local calendar day.
   Assumes the API and the family share one clock — true on a single Pi, and the
   same stance the widget already took against `now.getHours()`.
4. **Tier-4 fan-out is per profile**, not the family profile — the family profile
   is tier 1 and is never a parent.

## The precedent-vs-standing-rule call (worth carrying forward)

Review let a bare `catch { return }` stand on the dedupe path, citing ADR 045's
reminder scheduler as precedent. **Overruled.** The Standing Engineering
Conventions require `console.error` even when the recovery is correct — ADR 046's
ring buffer is only worth what reaches it, and "expected on a re-tick" is a thing
a future outage will want to read. Follow-up commit `7f10605`. A standing
convention outranks a precedent set before it; the next session that finds a
silent `catch` in older code should expect the same answer.

## Live-app review

**Passed.** Zach drove both scenarios in the running app with a widened window:
owner nudge and tier-4 escalation both landed in the tray, tier 3 and tier 2
correctly got nothing.

## What the next session needs to know

- The nudge is server-local-clock only. If the deployment ever stops being one Pi
  in one timezone, this and the widget both need the same fix, together.
- `@family-os/plugin-meals/lib/meals` is now an API-importable module. M5/5 and
  M5/7 should put shared meals predicates there rather than re-deriving them.
- Reviewer verdict: pass with notes, after two rounds.
