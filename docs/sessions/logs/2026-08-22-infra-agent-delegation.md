# 2026-08-22 — Infra: delegate the session roles; budget the rest of the docs

**Ad-hoc** (no kickoff; second session of the day — the first is
`2026-08-22-infra-watchdog-quiescence.md`, unrelated and not amended here) ·
**Commits:** `4ac2bf0`, `dda6918`, `fb2f5fb` on `main` ·
**Outcome:** the session roles are agents, the doc budget covers more than
`CLAUDE.md`, and M5 is planned end to end.

## The roles are agents now

`.claude/agents/` holds `pm`, `dev`, `reviewer`, `design`, `architect`. They point
at `docs/sessions/templates/` instead of restating it, so process keeps one home
and the definitions stay short enough to read.

The load-bearing change is in `dev.md`: **correctness routes to `reviewer`, not to
the user.** Typecheck and tests run in-session, the branch goes to `reviewer`, and
the user sees a working change plus a verdict. Only two gates stay human — the UI
design gate and the live-app review gate — because both are taste or physical
reality, and neither can be delegated. `qa` and `audit` folded into `reviewer`;
they were the same job with different entry points.

`pm` gained one rule out of what happened later today: **a decision that crosses a
permission boundary or changes the dependency graph is escalated to `architect`,
never left in a kickoff's decision list.** Sessions decide implementations, not who
can see what.

## The budget was pointed at one file, so one file stayed lean

`scripts/check-context-budget.sh` now pins `queue.md` (16 KB), `architecture.md`,
and `design-system.md` alongside `CLAUDE.md`, and caps every new log, kickoff, and
ADR at 6 KB. Per-file caps run only against what `git` reports as changed, so the
existing corpus is grandfathered and the hook governs new output only.

`queue.md` was **32.5 KB**. `Recently Completed` had become a three-month changelog
sitting directly under a header saying an entry is two or three lines plus a log
pointer — the authoring rule was written and was not enough, which is the whole
argument for the script. Pruned to a twelve-session rolling window: **14.7 KB**.
Nothing was lost. Every pruned entry linked a log that still exists, and
`docs/sessions/logs/` is date-ordered — that directory listing is the changelog.

## M5 planned in one pass

Five kickoffs written together (M5/3, M5/4, M5/5, M5/6, M5/7) so the milestone is
approved once instead of a planning session per story. Each carries a parallel-run
block naming owned vs shared files.

Two findings:

- **M5/4 does not depend on M5/3.** The queue said it did. The nudge poll and the
  day-mark provider contract share no code; only `planned_meals` as shipped in M5/2
  is needed. What survives is a merge-order edge, not a blocker: `isCovered()` is
  frontend-only today and M5/3 is what relocates it somewhere the API can import, so
  M5/4 merges after M5/3 if its registry lands server-side. Build in parallel
  regardless.
- **All four meals sessions collide on two paths** — `apps/api/src/plugins/meals.ts`
  and `plugins/meals/prisma/`. Each lands its routes in a **new file** rather than
  appending to the plugin body, and rebases + `prisma generate` before merging,
  committing only schema-derived generated files.

Waves: **1** = M5/3 + M5/4 + M5/6 (M5/6 is the biggest — land it first if the choice
is free). **2** = M5/5 + M5/7. M5/7 is genuinely serial behind M5/6; it is the same
surface.

## ADR 066 — a day mark carries its provider's permission

M5/4's kickoff carried this as an in-session decision, which is where the new `pm`
rule came from. Escalated to `architect` and settled: both gates apply
conjunctively — `calendar.event.view` gates the surface, the provider's own
`(action, subject)` gates its marks — filtering is server-side before `fetch`, and
the two-mark cap runs **after** filtering, so a caller never loses a mark they can
see to one they cannot. Registration declares the permission; there is no permissive
default.

That collapsed two of M5/4's four open decisions into constraints.

**The leak it closes is latent, not live.** Every tier baseline in
`packages/platform/src/ability.ts:86-106` grants `view calendar.Event` and
`view meals.PlannedMeal` together, so no profile can reach the mismatch today. It
takes one `revoke` override — the mechanism already exists — for a re-published mark
to launder a `meals` fact past a revoked `meals.plan.view`, invisibly.

## Open

- **Nothing here is committed to a PR** — all three commits are on `main` and were
  unpushed at the time of writing.
- The agent definitions are unproven. `dev` handing correctness to `reviewer` is the
  claim worth watching: the first M5 wave is the test of whether a `send back` verdict
  actually catches what the user used to.
