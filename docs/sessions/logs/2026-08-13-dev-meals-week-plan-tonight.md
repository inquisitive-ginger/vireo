# 2026-08-12/13 — dev, meals/week-plan-tonight (M5/2)

**Shipped:** PR #105 — the meals plugin's first slice: `/meals` week page,
plan/edit drawer, `meals.tonight` widget, one-tap claim
(`POST /meals/plan/:id/claim`, emits `meals.dinner.claimed`). Branch
`dev/meals-week-plan-tonight`, two commits (`63fc0ac` build, `ec554ff` review
iterations).

**Scaffold (08-12):** plugin mirrored from `family-feed`; `planned_meals` in a
`meals` schema (plain-uuid owner/creator, calendar precedent);
`MealInputSchema` in `@family-os/schemas`; 14 API + RTL suites. **The
WIDGET_META discovery:** `Home.tsx`'s `WIDGET_META` is an unlisted fifth
registration point — a widget silently drops without it; cost an hour, now on
the CLAUDE.md checklist.

**Widget v3 rework (08-12 live review, locked):** two audiences, one card —
kid zone above the hairline, adult logistics rail below (second-person verb
for the viewer); NEXT UP 3-day groove replaces the seven-chip strip, per-row
`N to buy` store flag; going out is attribution-free (`isCovered()`), Hearth
`HandPlatter` dot. Type mapping: tokens 36/29/26.

**Week page + drawer review (08-13, four rounds + an external critique):**

- **Past days recede** — dimmed, past-tense `kindVerb`, no actions at all
  behind today ("No dinner was planned"). Resolves the critique's real catch:
  the header count (today-forward) didn't reconcile with past rows rendered
  live. Critique's structural rebuild (attached plane) pushed back — ADR 063
  held, twice now; teal-chip point carried to M5/5's gate.
- **Header = the calendar week view's grammar** — range title (`weekRangeLabel`,
  full months), nav pinned right (This week innermost, always visible), cook
  count as the subline: semibold primary when >0, muted murmur at zero, hidden
  for past weeks. `weekTitle`/"This week · Next week" retired from
  `lib/dates.ts`.
- **Rows are seven equal slots** (`min-h-14` content column); **out rows have
  no spine** (Zach reversed the 08-12 Hearth-spine call — transparent keeps
  the day column aligned); remove confirms via `ConfirmDialog` (RowActions
  only reports intent — the page had skipped the host-confirm half).
- **P$ left meals entirely** (Zach: a paid dinner is a dedicated chore) —
  drawer field, schema, API writes, type, and the `coin_reward` column
  (migration `20260813120000_drop_coin_reward`; hand-applied to
  `familyos_test` per the P3009 footgun). M5/3 loses the earn wiring.
- **Widget:** headline wraps to two lines before ellipsizing; descender
  clipping fixed (`pb`/`-mb` clip room — overflow-hidden vs Lora below the
  1.2 line box); the whole tile deep-links to `/meals` (ItemCard overlay
  recipe); "Nobody yet" chip got a real selected state (dashed border + muted
  fill). Shared `Spine` dashes lengthened 4×6 → 4×10 (read as a drag handle).

**Also fixed:** `home.test.ts` asserted the pre-M5/2 default layout — three
tests updated to the shipped grid (calendar 2×4, meals leading the right
column at 2×2).

**Verification:** full `turbo build` green; API 453/453 on `familyos_test`;
plugin 21/21; ui 192/192.

**Next session needs to know:**

- Prod needs the **platform seed re-run** after deploy (deployed
  `system_config` layout rows override `DEFAULT_LAYOUTS` — the widget won't
  appear without it) and a tier-4 live check.
- **Polish queued:** calendar/meals sunken-groove top edges near-miss side by
  side; spacing already matches (26px both) — fix is a live-tuned
  `min-height` on the meals kid zone.
- M5/5 gate: the try-bite accent chip spends the identity channel (teal) —
  consider a neutral hairline chip.
- Empty-state history prompt ("last Thursday you did tacos") stayed gated —
  not free in this story.
