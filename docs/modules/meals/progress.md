# Meals & Groceries — Progress

---

## M5 — Meals & Groceries · 🔄 In Progress

> **Milestone done when:** Nobody in the house has to ask what's for dinner or who's
> making it, and the week's shopping happens off the list in the app.

| Story               | Status         | Notes                                                                                                                                                            |
| ------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Design gate         | ✅ Done        | 2026-08-11 — three rounds + external critique; `design.md`, ADR 063/064, final artifact. Mode split retired                                                      |
| Week Plan + Tonight | ✅ Done        | 2026-08-13, PR #105 — week page, drawer, widget, one-tap claim. P$ dropped from meals. Log: `2026-08-13-dev-…`                                                   |
| Who's Got Dinner    | ⬜ Not Started | Owner + `kind` (cooked/takeout/leftovers/out); **unclaimed is first-class**; afternoon nudge (claim shipped in M5/2; P$ retired)                                 |
| Calendar Day Marks  | ⬜ Not Started | **Platform story** — read-time provider (ADR 050). Small. Shared with M7 School. One mark/provider/day                                                           |
| Try Bites           | ⬜ Not Started | `meals.trybite.taken` → punches a `rewards` card (ADR 049). Depends on M4                                                                                        |
| Grocery List (M5/6) | ⬜ Not Started | Capture + filing — mode split retired 2026-08-11 (ADR 063): one aisle-grouped `ListRow` list, aisle dictionary + learned corrections, tier 1+ adds, `needs` push |
| Grocery Shop (M5/7) | ⬜ Not Started | Shop context, sync + offline, the wall — whole-row checks, cleared-aisle collapse, shopper sync; **SW is network-first for `/api`**, offline is its own chunk    |
| Recipe Bank         | ⬜ Deferred    | Deliberately out of MVP — the free-text `needs` field removes the reason to build it                                                                             |

> Try bites punch a `rewards` card — punch cards shipped 2026-08-01. The cook
> award is gone: `coinReward` retired from meals 2026-08-13 (M5/2); a paid dinner
> is a dedicated chore.
> Stories 1–2 and the grocery stories depend on nothing and can start first.
