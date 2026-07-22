# Meals & Groceries — Progress

---

## M5 — Meals & Groceries · ⬜ Not Started

> **Milestone done when:** Nobody in the house has to ask what's for dinner or who's
> making it, and the week's shopping happens off the list in the app.

| Story                | Status         | Notes                                                                                                      |
| -------------------- | -------------- | ---------------------------------------------------------------------------------------------------------- |
| Design gate          | ⬜ Not Started | Tonight's Dinner widget (readable from the door), unclaimed state, day-mark density, **shop mode**         |
| Week Plan + Tonight  | ⬜ Not Started | `planned_meals`; `/meals` week view; `meals.tonight` widget at the 18px across-room floor                  |
| Who's Got Dinner     | ⬜ Not Started | Owner + `kind` (cooked/takeout/leftovers/out); **unclaimed is first-class**; afternoon nudge; optional F$  |
| Calendar Day Marks   | ⬜ Not Started | **Platform story** — read-time provider (ADR 050). Small. Shared with M7 School. One mark/provider/day     |
| Try Bites            | ⬜ Not Started | `meals.trybite.taken` → punches a `rewards` card (ADR 049). Depends on M4                                  |
| Grocery — Build Mode | ⬜ Not Started | Manual adds (tier 1+), staples, meal `needs` push. No recipe model                                         |
| Grocery — Shop Mode  | ⬜ Not Started | Aisle grouping, big targets, checked items dim in place, live sync between shoppers                        |
| Grocery — Offline    | ⬜ Not Started | **SW is network-first for `/api`** — the list fails in the one place it's used. Touches the service worker |
| Recipe Bank          | ⬜ Deferred    | Deliberately out of MVP — the free-text `needs` field removes the reason to build it                       |

> **Depends on M4** for try bites (punch cards) and the optional cook award.
> Stories 1–2 and the grocery stories depend on nothing and can start first.
