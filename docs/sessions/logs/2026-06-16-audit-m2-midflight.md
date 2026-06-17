# Audit — M2 mid-flight consistency pass

**Type:** audit
**Date:** 2026-06-16
**Scope:** Cross-document consistency only (no new stories). Ad-hoc, no kickoff
(kickoffs are reserved for queued sessions).

---

## Why

M1 closed and M2 dev is underway (1 of 5 stories done). A run of design + dev
sessions had landed since the last cross-document pass (chores task-model + design,
mobile brand top bar, ADRs 030–034). Ran the `audit.md` checklist to catch drift
before the next dev session opens.

## What was checked

`docs/roadmap.md`, `docs/architecture.md`, `docs/design-system.md`,
`docs/modules/chores/**` (spec, design, progress, all 5 story specs),
ADRs 030–034, `docs/sessions/queue.md`. Cross-referenced doc claims against the
actual repo (playground dir, `PERMISSION_REGISTRY` in `packages/platform/src/types.ts`).

## Issues found & resolved

| #   | Sev  | Issue                                                                                                                                                            | Resolution                                                                                                                                              |
| --- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | High | `roadmap.md` "Active Milestone" still said **M1 · In Progress**; M1 never marked Done despite all its stories shipping and M2 being the tracked active milestone | M1 → ✅ Done (2026-06-15) and added to Completed Milestones; M2 set Active. Noted the two deferred M1 extras fall outside M1's done-when                |
| 2   | Med  | architecture.md settled-decisions index stopped at ADR 029 (030–034 missing)                                                                                     | Appended rows for ADRs 030–034, including the 033←034 supersession note                                                                                 |
| 3   | Med  | chores/design.md referenced the Storybook playground in present tense; it was deleted in the task-model session                                                  | Rewrote header + closing note to reflect deletion; live reference is now the plugin's `Chores/…` stories                                                |
| 4   | Low  | Illustrative widget-manifest examples used stale `requiredPermission: "chores.view"` and `supportedSizes: ["compact","standard"]`                                | Fixed to `chores.task.view` + `["compact","standard","large"]` in architecture.md and design-system.md                                                  |
| 5   | Low  | architecture.md `PERMISSION_REGISTRY` excerpt missing the chores entries                                                                                         | Added `chores.task.{view,create,complete}` — labels copied verbatim from `packages/platform/src/types.ts` after verifying against code                  |
| 6   | Low  | Owed member-capacity ADR (gates chores 1.5 capacity-aware load meter) tracked only in design.md                                                                  | Added a new **"Deferred — Owed ADRs"** section to the queue with the question, what it gates, and reads. No kickoff (per decision — premature to scope) |

## Decisions made

- #6 resolution: owed-but-unscoped ADRs get a queue "Deferred — Owed ADRs" entry
  (visible from the planning surface) but **no kickoff** until the dependent work is
  actually picked up.

## Notes for next session

- No code changed; docs only. M2 Dev: Completion Flow is unaffected and remains next.
- Clean audit otherwise: milestone numbering consistent (roadmap authoritative),
  design-system To Be Defined has no stale rows, story dependency chains intact,
  ADR supersession correctly annotated.

## Next session

M2 Dev: Completion Flow (unchanged — top of queue).
