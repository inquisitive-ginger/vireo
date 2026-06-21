# Audit — Post-M2 Coherence (2026-06-21)

Cross-document consistency sweep after M2 — Chores completed. M2 was the first
feature milestone and carried a mid-milestone plugin rename (`chore-engine → chores`,
#24) plus two unscoped add-ons (Task Editing, Focus Mode / ADR 036) — prime
conditions for doc drift. Checked all six audit areas against the live code
(`PERMISSION_REGISTRY`, the Prisma `Profile` model, the chores routes + manifest).

## What was checked

- **Milestone coherence** — sequencing, done-definitions, scope assignment: clean.
- **Cross-document consistency** — roadmap vs CLAUDE.md/progress; architecture schema
  vs ADRs; design-system To Be Defined; milestone numbers: 4 drifts found (#1–#5).
- **Story completeness** — settled decisions → ACs; module spec vs shipped routes: the
  spec's events/permissions tables lagged the shipped `reopen`/`update`/`delete`
  routes and the enriched `completed` payload (#5).
- **Session queue health** — SW-cache + design-sync deps, blocking notes: clean.
- **ADR integrity** — milestone-number drift, unmarked supersession (033←034): clean.

## Issues found & resolved

| #   | Issue                                                                                                       | Fix applied                                                                                                         | Deferred? |
| --- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | --------- |
| 1   | `roadmap.md` showed M2 "🔄 In Progress" as Active Milestone; Completed listed only M0/M1                    | Active Milestone → none-active note; M2 added to Completed + a detailed M2 block in Completed Milestones            | No        |
| 2   | `architecture.md` `profiles` table missing `dark_mode` / `focus_mode` / `push_enabled`                      | Added the three columns with provenance comments; refreshed the "Last updated" stamp                                | No        |
| 3   | `architecture.md` manifest example used pre-rename `chore-engine` / `chore_engine` (events were `chores.*`) | Renamed name/schema → `chores`; bumped example `remoteEntry` port to 3012                                           | No        |
| 4   | `chores/spec.md` used pre-rename `chore-engine` / `chore_engine` (Published-by, manifest, schema heading)   | Renamed all to `chores`                                                                                             | No        |
| 5   | `chores/spec.md` events/permissions tables lagged shipped routes                                            | Added `chores.task.reopened`; enriched `completed` payload; added tier-4 `reopen`/`update`/`delete` CASL-rule table | No        |
| 6   | `plugins/chores/public/manifest.json` `publishes` omitted `chores.task.reopened` (route emits it)           | Added it to `publishes`                                                                                             | No        |
| 7   | Pre-rename `chore-engine` in completed story specs + `design.md` prose                                      | **Left as-is** — frozen/historical artifacts                                                                        | Deferred  |

## Deliberately not touched

- **Session logs** (`logs/*`, queue "Recently Completed") and **ADRs 009/019/027**
  still carry `chore-engine` / `chore_engine` — immutable historical records and
  illustrative examples that were accurate when written. Editing them would rewrite
  history, not fix drift.
- **Completed story specs** (#7) — they record the story as written; the living
  module spec (`spec.md`) now carries the corrected, current shape.

## Notes for the next session

- No new sessions queued by this audit. Next up is unchanged: **Platform — Service
  Worker Cache Strategy** (queue), then M3 — Calendar product planning.
- The `reopen`/`update`/`delete` actions are tier-4 CASL baseline rules, **not**
  `PERMISSION_REGISTRY` entries — intentional (they're not grant/revoke-able). The
  spec now states this explicitly so a future session doesn't "fix" it by adding
  registry keys.
