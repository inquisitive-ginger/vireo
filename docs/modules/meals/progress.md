# Meals — Progress

> **Frozen 2026-11-14.** Work is tracked in `docs/roadmap.md` (sessions, fixes, enhancements) and features in `docs/idea.md`; this board is the record of what shipped before.

> **Groceries split out 2026-09-03 (ADR 069)** into the `shopping` module.
> M5/6 and M5/7 are retired here and re-planned as M5.5 —
> `docs/modules/shopping/progress.md`.

---

## M5 — Meals · ✅ Done (2026-09-07)

> **Milestone done when:** Nobody in the house has to ask what's for dinner or who's
> making it. (The shopping half of the original wording moved to M5.5 with the module.)

| Story                   | Status      | Notes                                                                                                                                                                                            |
| ----------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Design gate             | ✅ Done     | 2026-08-11 — three rounds + external critique; `design.md`, ADR 063/064, final artifact. Mode split retired                                                                                      |
| Week Plan + Tonight     | ✅ Done     | 2026-08-13, PR #105 — week page, drawer, widget, one-tap claim. P$ dropped from meals. Log: `2026-08-13-dev-…`                                                                                   |
| Who's Got Dinner        | ✅ Done     | 2026-08-23, PR #124 — afternoon nudge poll (ADR 045): owner at 16:00, every tier-4 parent when nobody has it; `(date, audience)` ledger. Log: `2026-08-23-dev-…`                                 |
| Calendar Day Marks      | ✅ Done     | 2026-08-23, PR #125 — platform provider contract (ADR 050/066), meals first consumer; marks are **today-forward only**. Log: `2026-08-23-dev-…`                                                  |
| Recipe link             | ✅ Done     | 2026-09-03, PR #131 (auto-bug #129) — a nullable `recipe_url`, meta-line link + widget rail, cooking only. **Not** a recipe bank: the artifact ledgers what was refused. Log: `2026-09-03-dev-…` |
| Move / swap a dinner    | ✅ Done     | 2026-11-01, PR #149 (auto-bug #146) — drag a row's grip to another day: empty → move, occupied → swap; past days inert. `POST /meals/plan/:id/move`. Log: `2026-11-01-fix-…`                     |
| ~~Grocery List (M5/6)~~ | 🔁 Moved    | **Retired 2026-09-03 (ADR 069).** PR #127 closed unmerged; the surface is re-planned as M5.5/1–2. Its data layer was carried into M5.5/2–/4                                                      |
| ~~Grocery Shop (M5/7)~~ | 🔁 Moved    | **Retired 2026-09-03 (ADR 069)** → M5.5/4. Shop context, sync + offline; **SW is network-first for `/api`**, offline is still its own chunk                                                      |
| Recipe Bank             | ⬜ Deferred | Deliberately out of MVP — the free-text `needs` field removes the reason to build it                                                                                                             |

> The cook award is gone: `coinReward` retired from meals 2026-08-13 (M5/2); a paid
> dinner is a dedicated chore.
>
> **Try Bites (M5/5) was recycled 2026-09-07** — the `try_bite` field on a planned meal
> ships and renders; the punch half was never built and is not queued.
