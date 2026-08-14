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

## Week-page critique round (2026-08-13) — outcomes

Incorporated: **past days recede** (dimmed, past-tense verbs via `kindVerb`,
no actions at all behind today — the record has no consumer yet, and on touch
tap-row-to-edit would make a "receded" row a full-width drawer target; past
empty reads "No dinner was planned") — also resolves the header count not
reconciling with visible rows, since `daysNeedingCook` already counts today
forward. **Remove now confirms** (`ConfirmDialog`, the chores pattern —
RowActions only reports intent; the page had skipped the host-confirm half).
**"This week" reset** renders beside the chevrons when off-week; a past week
shows no cook count. **Spine dashes lengthened** (4×10px — the 4×6 dash read
as a drag-handle dot column).

Pushed back: attached-plane rebuild of the seven cards (re-litigates ADR 063,
which already held this against the M5/1 critique; its do-not-revisit clause
demands an ADR, and the real rows are ~66px, not the critique mock's 135px);
Hearth spine on "out" (ADR 041, locked in the 2026-08-12 live review — not an
invented hue); needs-push link (deliberately absent until M5/6); paired
"I've got it" on unplanned days (M5/3 semantics); header facts-not-counts
(the count is design.md's spec'd header and breaks at n>3 by the critique's
own admission); title size (token is 16px, the critique measured its own
mock); ghost-button complaint ("ghost" in design.md means not-solid — the
widget's settled `outline` reading).

Carry to M5/5's gate: the critique's teal-chip point is real — the accent
chip spends the identity channel; consider a neutral hairline chip there.

Live-review round 2 (2026-08-13, Zach): **header realigned to the calendar
week view's grammar** — range title ("August 9 – 15", calendar's `weekTitle`
format verbatim), nav cluster inline beside it (h-5 chevrons + always-visible
ghost reset), cook count alone as the subline. `weekTitle`/"This week · Next
week" titles retired from `lib/dates.ts`. One divergence kept: the reset says
"This week", not "Today" — the surface's unit is the week. **Rows hold equal
height** (`min-h-14` content column = the two-line planned block), so
unplanned / going-out / claimed days read as seven equal slots. Amend
design.md §M5/2's header line at close-out.

Live-review round 3 (2026-08-13, Zach) — the drawer: **P$ leaves meals
entirely** (a paid dinner will be a dedicated chore in the chores module):
drawer field, `MealInputSchema.coinReward`, API writes, `PlannedMeal` type,
and the `coin_reward` column all removed — migration
`20260813120000_drop_coin_reward` applied to dev and hand-applied to
`familyos_test` (P3009 footgun); design.md §M5/3's coinReward line dies at
close-out, and M5/3 loses the earn wiring from its scope. **"Nobody yet"
selected state** now dashed-border + muted fill (was font-weight only —
invisible next to MemberChip's tint fill). **Header nav pinned right**
(This week innermost, chevrons outermost) — the inline-after-title cluster
moved with the title's width and the mouse had to chase it. Also fixed:
`home.test.ts` still asserted the pre-M5/2 default layout (calendar 2×2,
chores at y 0) — a gap this branch's layout change left; three tests updated
to the shipped grid.

Live-review round 4 (2026-08-13, Zach) — the widget + polish: **out rows lose
the Hearth spine on the week page** (Zach's call, reversing the 2026-08-12
Hearth-spine decision: the spine is an identity channel and going out names
nobody; transparent spine keeps the day column aligned; the widget's
HandPlatter family dot stays). **Widget headline wraps to two lines** before
ellipsizing (was one-line truncate — it ate the meal name on the surface that
exists to show it; compact keeps truncate). **The whole tile deep-links to
/meals** via ItemCard's overlay recipe (sibling link, controls z-lifted) —
the headline alone was the only target. **"every day's covered" de-emphasized**
(muted regular); a gap renders semibold **primary** — bold ink read as a
heading, not an ask, and the page's calm rule keeps amber off the table.
**Headline descender clipping fixed** (the g in "Rigatoni"):
truncate/line-clamp's overflow-hidden clipped Lora below the 1.2 line box —
pb/-mb pair gives the descenders clip room without moving the layout.

Polish, not blocking (queue if unshipped at close-out): **groove alignment** —
the calendar and meals widgets' sunken-plane top edges near-miss side by side.
Zone spacing already matches (26px both); the delta is content height (hero vs
kid zone). Fix = `min-height` on the meals kid zone tuned live to the default
hero height; drifts only in escalated states.

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
