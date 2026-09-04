# Shopping — Progress

Split out of `meals` 2026-09-03 by ADR 069. See `docs/modules/meals/progress.md`
for the M5 grocery rows this replaces. Salvage inventory: `salvage.md`.

## M5.5 — Shopping

Resequenced 2026-09-03 — the old M5.5/4 bundled shop context, sync, the wall and offline;
each is now its own reviewable PR.

| Story                                      | Status         | Notes                                                                                                                                                               |
| ------------------------------------------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| M5.5/1 — Design: the shopping surface      | ✅ Done        | 2026-09-03. Capture hero on a walk-order list; the wall takes things in only. `design.md` + ADR 070                                                                 |
| M5.5/2 — Dev: plugin split + capture       | ⬜ Not Started | Scaffold `shopping` (4 of 5 registration points), move the 4 tables, renamespace subjects, land `ListRow`+ADR 068 and `CaptureField`, S1/S2, reorder `plugins.json` |
| M5.5/3 — Dev: the needs-push contract      | ⬜ Not Started | `meals` publishes, `shopping` consumes (ADR 050 precedent); meals stops writing shopping rows                                                                       |
| M5.5/4 — Dev: shop context + shopper sync  | ⬜ Not Started | Frame S3 — checks, cleared-aisle collapse, progress meter, two shoppers. **Owes the check-permission escalation**                                                   |
| M5.5/5 — Dev: the wall and the Home widget | ⬜ Not Started | Frame W2 + the zero-navigation widget, which lands the 5th registration point. **Owes the `section-label` distance decision**                                       |
| M5.5/6 — Dev: offline                      | ⬜ Not Started | Its own PR — the SW is network-first for `/api` and has bitten twice                                                                                                |
