# Shopping — Progress

Split out of `meals` 2026-09-03 by ADR 069. See `docs/modules/meals/progress.md`
for the M5 grocery rows this replaces. Salvage inventory: `salvage.md`.

## M5.5 — Shopping

Resequenced 2026-09-03 — the old M5.5/4 bundled shop context, sync, the wall and offline;
each is now its own reviewable PR.

| Story                                      | Status         | Notes                                                                                                                                               |
| ------------------------------------------ | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| M5.5/1 — Design: the shopping surface      | ✅ Done        | 2026-09-03. Capture hero on a walk-order list; the wall takes things in only. `design.md` + ADR 070                                                 |
| M5.5/2 — Dev: plugin split + capture       | ✅ Done        | 2026-09-04, PR #132. ADR 071 + 072 came out of the build; the live review cut rendered attribution. `logs/2026-09-04-dev-shopping-split-capture.md` |
| M5.5/3 — Dev: the needs-push contract      | ✅ Done        | 2026-09-04, PR #133. `meals.needs.pushed` over the bus; `emitAndAwait` added so a failed push reports. `logs/2026-09-04-dev-shopping-needs-push.md` |
| M5.5/4 — Dev: shop context + shopper sync  | ⬜ Not Started | Frame S3 — checks, cleared-aisle collapse, progress meter, two shoppers. **Also owns the aisle correction UI** (keys settled by ADR 071)            |
| M5.5/5 — Dev: the wall and the Home widget | ⬜ Not Started | Frame W2 + the zero-navigation widget, which lands the 5th registration point. **Owes the `section-label` distance decision**                       |
| M5.5/6 — Dev: offline                      | ⬜ Not Started | Its own PR — the SW is network-first for `/api` and has bitten twice                                                                                |
