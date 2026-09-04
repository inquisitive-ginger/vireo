# Shopping — Progress

Split out of `meals` 2026-09-03 by ADR 069. See `docs/modules/meals/progress.md`
for the M5 grocery rows this replaces.

## M5.5 — Shopping

| Story                                 | Status         | Notes                                                                                                     |
| ------------------------------------- | -------------- | --------------------------------------------------------------------------------------------------------- |
| M5.5/1 — Design: the shopping surface | ⬜ Not Started | Fresh exploration. Axis set by the brief, not the agent. Prior handoff spec is superseded, not a baseline |
| M5.5/2 — Dev: plugin split + capture  | ⬜ Not Started | Scaffold `shopping`, move 4 tables to the `shopping` schema, renamespace subjects, salvage the dictionary |
| M5.5/3 — Dev: the needs-push contract | ⬜ Not Started | `meals` → `shopping` across the bus (ADR 050 precedent); meals stops touching grocery rows                |
| M5.5/4 — Dev: shop context + offline  | ⬜ Not Started | Was M5/7. SW is network-first for `/api` — offline is its own reviewable chunk                            |
