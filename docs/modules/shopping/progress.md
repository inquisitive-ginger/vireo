# Shopping — Progress

> **Frozen 2026-11-14.** Work is tracked in `docs/roadmap.md` (sessions, fixes, enhancements) and features in `docs/idea.md`; this board is the record of what shipped before.

Split out of `meals` 2026-09-03 by ADR 069. See `docs/modules/meals/progress.md`
for the M5 grocery rows this replaces.

## M5.5 — Shopping — ✅ closed 2026-09-07

Resequenced 2026-09-03 — the old M5.5/4 bundled shop context, sync, the wall and offline;
each is now its own reviewable PR.

| Story                                      | Status  | Notes                                                                                                                                                                                                                                                                                                                        |
| ------------------------------------------ | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| M5.5/1 — Design: the shopping surface      | ✅ Done | 2026-09-03. Capture hero on a walk-order list; the wall takes things in only. `design.md` + ADR 070                                                                                                                                                                                                                          |
| M5.5/2 — Dev: plugin split + capture       | ✅ Done | 2026-09-04, PR #132. ADR 071 + 072 came out of the build; the live review cut rendered attribution. `logs/2026-09-04-dev-shopping-split-capture.md`                                                                                                                                                                          |
| M5.5/3 — Dev: the needs-push contract      | ✅ Done | 2026-09-04, PR #133. `meals.needs.pushed` over the bus; `emitAndAwait` added so a failed push reports. `logs/2026-09-04-dev-shopping-needs-push.md`                                                                                                                                                                          |
| M5.5/4 — Dev: shop context + shopper sync  | ✅ Done | 2026-09-04, PR #136. Checks both directions, cleared-aisle collapse, meter, two-shopper convergence + the aisle correction UI. ADR 064 amended. **Ships with the nav item and widget disabled** — the polish sessions (design critique → dev, both ahead of /6) turn them on. `logs/2026-09-04-dev-shopping-shop-context.md` |
| M5.5/5 — Dev: the capture surface + widget | ✅ Done | 2026-09-04, PR #134. One route, two layouts by viewport; the 5th registration point landed. ADR 070 amended (nothing autofocuses); ADR 073 written and built. `logs/2026-09-04-dev-shopping-capture-surfaces.md`                                                                                                             |
| M5.5 — Design: the polish critique         | ✅ Done | 2026-09-04. SH-01…SH-14 + four open questions; artifacts `2026-09-04-shopping-polish-critique.{md,html}`                                                                                                                                                                                                                     |
| M5.5 — Dev: the polish build               | ✅ Done | 2026-09-04, PR #138. The critique's items, a long live pass, and **Shopping is announced** (nav yes, Home tile no — pulled by Zach, one revert). Reverses design.md §Anatomy 1/3, §W2, ADR 070's amendment; ADR 043 narrowly amended. `logs/2026-09-04-dev-shopping-polish.md`                                               |
| M5.5/6 — Dev: offline                      | ✅ Done | 2026-09-07, PR #144. Snapshot-seeded reads + a durable check queue replayed on reconnect; **the SW is not touched**, which is how AC5 is held. Adds are refused offline, not queued. `logs/2026-09-07-dev-shopping-offline.md`                                                                                               |
