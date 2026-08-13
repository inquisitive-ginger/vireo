# Kickoff — M5/2 Dev: Week Plan + Tonight's Dinner (continuation)

**Type:** development · **Branch:** `dev/meals-week-plan-tonight` (all work
committed, no PR yet) · **Updated:** 2026-08-12 after the first live-review
session.

## Where the story stands

Everything in scope is **built and tested** (18 plugin RTL + 66 API tests; full
workspace green). The **widget is locked** — reviewed live on 2026-08-12 and
reworked against Zach's "Meals card v3" artifact. The **week page and the
create/edit drawer are built to design.md §M5/2 but have NOT had their live
review** — that review, the iteration it produces, and story close-out are this
session's work.

## Pre-session reads

- `docs/modules/meals/design.md` §Shared language + §M5/2 — the original build
  target; the widget deviations below amend it at close-out.
- ADR 063 (week plan is `ItemCard`), ADR 064 (meals keeps spines), ADR 041
  (Hearth hue), ADR 043/044.
- `plugins/meals/src/` — the plugin; `apps/api/src/plugins/meals.ts` — routes.

## What the widget review settled (locked — don't re-open)

- **Two audiences, one card:** kid zone (headline `text-display-xl` at large /
  `display-lg` standard / `page-title` compact · sides `text-prose` italic ·
  try-bite accent chip) above a hairline; adult logistics rail below
  (avatar + kind-verb, **second person when the viewer owns tonight**).
- **NEXT UP replaces the seven-chip week strip** at large: the next **3 days**
  in a full-bleed sunken groove that absorbs the card's slack, rows as equal
  flex bands (48px min) with hairline dividers; per-row **store flag**
  (`N to buy` = comma count of `needs`; renders nothing when empty — blank is
  never "everything's in the house"). Widget fetches a rolling today→+3 window,
  not the calendar week.
- **Going out is attribution-free:** ownerless `kind='out'` is covered, not
  unclaimed — no claim button, no escalation, doesn't count toward "days need a
  cook"; marker is a Hearth-toned 32px circle wearing lucide `HandPlatter`;
  page spine goes solid `FAMILY_HUE`, drawer hides "Who's got it?" and clears
  `ownerId` on submit. `isCovered()` in `lib/meals.ts` is the one predicate.
- The dashed absence ring and the family dot both hold the exact `sm`-avatar
  footprint (32px).
- Pushed back (stays out): shop-today banner wash, "Dinner 6:00" constant
  (→ M5/3 with the poll hour), calendar facts inside the lookahead, generic
  unnamed try-bite, punch dots on the meals chip (→ M5/5 table surface).

## This session

1. **Live-review the `/meals` week page** (seven `ItemCard` rows, dashed
   spine/chrome grammar, needs-push deliberately absent until M5/6) and the
   **drawer** (field order title → sides → try bite → needs → kind → owner →
   P$; standing helpers). Iterate on feedback. The page stays **calm** — no
   amber ever. Check whether the page wants the widget's out-kind + second-
   person treatments anywhere it doesn't already have them.
2. **Close out M5/2** once signed off:
   - Fold the widget amendments above into `design.md` §M5/2 (note the type
     mapping: tokens 36/29/26, not the artifact's 52/32/24).
   - Session log (`logs/2026-08-12-dev-meals-week-plan-tonight.md` — cover the
     scaffold, the v3 review, the WIDGET_META discovery), progress board row,
     queue update, CLAUDE.md status — and add **`Home.tsx` `WIDGET_META`** to
     the CLAUDE.md new-plugin checklist (an unlisted fifth registration point
     that silently drops a widget; cost an hour).
   - Delete this kickoff, open the PR (no co-author trailer / no generated
     footer), tier-4 live check on prod after merge.

## Constraints & footguns carried forward

- **Prod won't show the widget from the code deploy alone** — deployed
  `system_config` layout rows override `DEFAULT_LAYOUTS`; re-run the platform
  seed on the Pi (upsert, non-destructive) after merge. Local dev layouts:
  tier_3_4 = calendar 2×4 left, right column meals 2×2 → chores → feed.
- Claim ships in M5/2 via `POST /meals/plan/:id/claim` (emits
  `meals.dinner.claimed`); the poll/nudge, "Parents were nudged" line, and
  earn wiring are **M5/3**. `ESCALATION_HOUR` (16) in `lib/meals.ts` is the
  shared constant.
- Nothing-planned rows offer **Plan it only** — one-tap "I've got it" on an
  unplanned day needs M5/3's "having dinner" semantics.
- Dev DB carries demo `planned_meals` rows from the review; clear with
  `pnpm db:reset --only --module meals` (mind the seed-fixture footgun) or by
  hand before shipping screenshots.
- `familyos_test` needed the meals migration hand-applied (P3009 — done
  locally; CI applies it via the normal loop).
