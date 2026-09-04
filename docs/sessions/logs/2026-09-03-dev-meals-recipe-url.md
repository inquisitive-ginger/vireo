# 2026-09-03 — Dev: a recipe link on a planned meal (auto-bug #129)

**Type:** development (feature request, ad-hoc) · **PR:** #131 (merged, `30428f8`)
**Issue:** #129 · **Report id:** `cfc58841-2558-48bd-8f79-1be4ba8283b7` — Dad
(tier 4), route `/meals`, 2560×1352, macOS Chrome, build `DevSCXR5`

## What was asked

> It'd be great if it was possible to add a recipe URL to the meal record

A request, not a bug — the first one to arrive through the ADR 046 pipe.

## The line that had to hold

`spec.md` §"Why there is no recipe bank" is the standing decision: structured
recipes are expensive and are the reason recipe features stall, so a planned meal
carries free-text `needs` instead and the parsing problem is deleted. A URL field
is the one shape that answers the request **without** reopening that — but it is
also an invitation to reopen it, so the artifact carries an explicit ledger of
what was refused: no page fetch (title/image/favicon), no ingredient parsing into
`needs`, no library or reuse, no second link, no offline copy.

That ledger is the durable output of this session. The next person who wants a
thumbnail should find it already answered.

## Why not `notes`

`planned_meals.notes` exists, is plumbed through the API and the client type, and
renders nowhere. Reusing it was tempting and wrong: storing a URL in free text
means parsing one back out — the exact problem the spec deleted — and it strands
whatever `notes` is eventually for. A new nullable `recipe_url` column instead.

## The design gate

Four decisions, each rendered inside the real components at true size — 840px
`PageContainer width="list"` for the row, 440px for the widget slot — rather than
compared only against each other:
[artifact](../artifacts/2026-09-03-meal-recipe-url.html).

| Decision       | Outcome                          | The cost accepted                                                                 |
| -------------- | -------------------------------- | --------------------------------------------------------------------------------- |
| Row affordance | `· Recipe ↗` on the meta line    | Eats width the try bite had; M5.5's needs-push will want this line too            |
| Wording        | "Recipe", not the domain         | You tap without knowing where it goes                                             |
| Tonight widget | Carries it on the logistics rail | A second control on a rail that already holds a ring + solid claim when escalated |
| Kinds          | Cooking only                     | A takeout menu link is a real want, deliberately declined                         |

The widget call is the one that decides whether the feature gets used: the cook is
standing at the fridge at 5pm, and routing them through the tile to `/meals` is two
taps. It goes **below the hairline** — the card's kid zone above it stays what a kid
reads at 3:30. NEXT UP gets no link; tomorrow's recipe is not a thing anyone opens
tonight.

Rejected on the way: the title-as-link (tapping a title would mean two different
things depending on data) and a trailing glyph (trailing is action territory, and
an icon names nothing on a page briefed as calm).

## Validation is a security boundary, not a nicety

The value lands in an `href` on every profile's screen, so a `javascript:` or
`data:` URL in that column is stored XSS. `OptionalHttpUrl` in
`@family-os/schemas` collapses blanks to null, then admits `http:`/`https:` only.
The route is the gate; the drawer's identical check only saves a round trip. Three
API tests cover the rejection explicitly so a later refactor can't quietly widen it.

## What was built

- `meals.planned_meals.recipe_url text null` — migration `20260903120000_add_recipe_url`
- `MealInputSchema.recipeUrl` via the new `OptionalHttpUrl`; POST + PATCH carry it
- Drawer: "Recipe link", cooking only, after Needs, with an inline invalid-paste error
- Row + widget links are `shrink-0` (the text run truncates around them) and `z-20`
  (clears `ItemCard`'s activate overlay and the widget's whole-tile `CardLink`)

## Verification

32 meals plugin tests (6 new) · 481 API tests (4 new) · typecheck, eslint, prettier
clean. Reviewed live in the dev shell against four seeded fixtures: claimed+link,
unclaimed+link, no-link, and a past day with a link.

## Open question, deliberately left open

**Past days render no link.** `design.md` §M5/2 says "no actions at all behind
today — the page records", and a link navigates away. But re-finding last
Thursday's recipe is a genuine want, and it is the one use the rule blocks. Flagged
at review and left as shipped; flip it if the house asks twice.

## What the next session needs to know

- **The `deployed` flip is owed** on report `cfc58841` — moved to `fixing` during
  this session (direct `update` on `platform.bug_reports`, which fires nothing;
  only `deployed` notifies, ADR 046 §4). Needs a tier-4 PIN session.
- **`notes` is still dormant** — plumbed end to end, rendered nowhere. It survived
  this session on purpose; it is not a free field to grab.
- Local dev ports are singletons across worktrees (3000 API, 3015 meals remote). A
  second `pnpm dev` silently serves the _other_ worktree's plugin to your shell, so
  a live review can be reviewing code that isn't yours. Check `lsof` cwd before
  trusting a review.
