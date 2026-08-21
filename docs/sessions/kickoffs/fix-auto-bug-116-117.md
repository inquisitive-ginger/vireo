# Fix session — auto-bug #116 + #117 + #118

Ad-hoc fix session (fix-it playbook). Branch `fix/auto-bug-116-117`.

## Reports (both from Dad, tier 4, build `CmVOT_Jt` — matches live)

- **#116** — large screen (2560×1352), route `/`: right column gives meals 50%,
  chores/feed 25% each; those cut off content; "dynamic row display doesn't seem
  to be kicking in". Report id `5a6cfca1-3d08-412c-8fb9-2a53433c918c`.
- **#117** — mobile (426×860), route `/`: day planner (calendar up-next, stacked
  mode) truncates event names; Dad asks for options. Report id
  `67345432-8071-4f37-88c0-2334741b0073`.
- **#118** — Teddy (tier 2), desktop: kid layout rework — wallet 2×1 + calendar
  2×2 left, meals/chores/feed 2×1 right (old paired grid left an empty slot).
  Report id `f21228f7-0024-490e-992f-b8b045e9a184`. Pulled in mid-session.

## Diagnosis

- Right-column heights on Dad's screen ≈ 305–310px per h=1 row (grid derives row
  height from container; `MAX_ROW_HEIGHT` 400). That crosses `tallMinHeight`
  300px, so family-feed renders its **multi** variant — a hard `slice(0, 3)` +
  `overflow-hidden` with no `useFitRows` → mid-post crop. Chores' large family
  variant clamps via `FitList` but has ~166px of list for 4+ member tiles.
- Ratio itself is `DEFAULT_LAYOUTS.default_layout_tier_3_4` (meals 2×2 per
  2026-08-12 live review; Dad is now asking to re-rank) — design gate.
- #117: stacked calendar slot is ~394px wide in the **large** variant; the 84px
  day gutter + 64px time column + owner avatars leave ~150px for the title —
  design gate on what gives.

## Scope

1. Gate: tier-3/4 right-column geometry → equal thirds, then **reverted to
   meals 2×2** on live review: h=2 (≥376px) is what guarantees ≥1 NEXT UP
   lookahead row on every screen; the crop was the clamping, not the split.
2. Gate: narrow day-list treatment → **stacked day headers**, avatars kept.
3. No-gate bug fixes: family-feed multi variant adopts `useFitRows`; the hook
   re-measures when a hidden-at-mount variant is revealed; seed//dev-reset stop
   caching `default_layout_*` config rows (migration deletes prod's).
4. Gate (#118): kid + teen grids → wallet 2×1 + calendar 2×2 left; chores,
   meals, feed 2×1 right (chores first — column elevation order).
5. Verify on dev at the captured viewports; PR; live review before merge; close
   out on main; flip all three reports `deployed`.

## Constraints

ADR 042/043/044 (spine carries identity), ADR 039 (prominence), useFitRows for
any height-clamped widget list, container-query self-sizing pattern.
