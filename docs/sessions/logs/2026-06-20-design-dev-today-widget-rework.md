# Session Log — Design + Dev: Today Widget Rework

**Date:** 2026-06-20
**Type:** design + development
**Story:** `chores.today-summary` widget (M2 Chores enhancement)
**Origin:** Post-M2 chores live review (2026-06-19). The widget shipped via the
agent team (#22) **without the UI design gate** and quietly simplified the locked
exploration. This session ran the gate it skipped.

---

## What was decided

**Visual direction: "Hero split"** (playground direction A) for **both** framings,
chosen at the gate after restoring the original exploration.

- The shipped widget was **spec-complete but flat**: a `card-title` sentence
  headline instead of a hero count, a bare-spine peek, **no daily XP** (a §4
  element it had dropped), and no per-task XP. The gate restored the richer
  direction the agent build had collapsed.
- **Taskee:** a hero `text-metric` count anchors the glance; **filled task rows**
  (muted / overdue-wash) carry a status spine + title + per-task `+XP`; **daily XP**
  (`+N today`) is back in the header beside the **lifetime coin score**.
- **Family:** `+N pending today` hero + "X of Y done" + overdue pill; filled
  **person tiles** (identity avatar + labelled count chips, no XP); per-person
  **"✓ all done"**.

**Taskee Focus widget variant (direction C — "Next up") deferred to Focus Mode.**
The taskee widget shipped here is the **Agency / default** framing. A Focus
variant (single hero "Next up" row + "+N more") was explored and approved in
principle, but it needs the per-profile **`focusMode`** setting to branch on —
that setting is introduced by **M2 Dev: Focus Mode**, so the widget Focus branch
was **folded into that session's kickoff** (gated on the same setting). Recorded
in `design.md` §4 ("Focus-mode widget variant owed") and the Focus Mode kickoff.

---

## What was built

- **`TodaySummaryView.tsx` rebuilt to "Hero split"** — `HeroCount` (on `text-metric`,
  the governed widget-count token), `CoinScore` (lifetime), `DailyXp` (today),
  filled `TaskRow` (+XP) and `PersonTile`, all DM Sans + gold-XP tokens.
- **Real XP wiring** (`TodaySummary.tsx`): lifetime now reads the persisted
  **`GET /api/chores/xp`** balance (taskee framing only; the container's "no /xp
  call" comment was stale post-#23, the XP-query prefix `['chores/xp']` is shared
  with the page so a completion's invalidation refreshes both). Daily XP =
  sum of today's completed-task rewards — distinct from lifetime.
- **Widget self-sizes via CSS container queries** (`TodaySummaryView`): the grid
  sizes each row to fill the viewport (clamped 180–400px/row), so the `h=2` Home
  slot is ~600–800px tall — the widget had rendered a fixed `standard` and its
  `justify-*` layout scattered across the tall box. _First pass_ derived a `size`
  from the layout cell in the shell (`Home.tsx` + a typed `WidgetProps`); **on PR
  review (#25) this was reverted to self-sizing via CSS container queries** — the
  content-widget standard documented in `design-system.md` and already used by
  `family-feed` (the shell-delegated prop was a lossy proxy for the dynamic row
  height and coupled shell↔widget). The widget now ships every variant's markup and
  `@container` rules reveal the fit. The two-column **standard** is gated as a
  _wide-and-short_ layout (`≥440px` wide **and** `≤299px` tall); a tall slot → large
  at any width; **narrower slots (mobile full-width stack) reflow to a single
  column** per the design-system mobile rule (taskee → compact/large; family → the
  full-width stacked list, so the per-person chips stop clipping — caught in mobile
  live review). `size` stays as an optional override for Storybook / fixed hosts;
  `Home.tsx`/`load-plugin.ts` reverted to `<Widget />`.
- **Lists fill height + sort urgent-first.** Dropped the family **2-row cap** and
  the "overdue-priority" filter that had been **hiding every non-overdue member**
  (only the one overdue person showed). All members/tasks now render, sorted
  overdue → pending → completed, in `flex-1 … overflow-hidden` lists that grow to
  fill and only clip on true overflow (the clip drops the least-urgent row).
- **All-done celebration.** Standard → centered 🎉 + "All done today" + gold
  **earned-XP pill**; large → celebratory hero + the completed-task list retained.
- **Storybook:** `Chores/Today Widget` is the final story set — **one per unique
  enumerable variant**, size-ascending: taskee compact/standard/large/all-done +
  two tier-aware empties; family compact/standard/large/all-done. Removed the
  duplicative **Family Dashboard** story (the `isFamily` pseudo-profile renders
  identically to Family Standard — folded into its annotation). Playground
  (`TodayWidget.playground.stories.tsx`) deleted after the gate.
- **Family compact variant added** (responsive-reflow follow-up): a family slot can
  be **short** (an `h=1` slot is 180px on the mobile stack) where the stacked list
  clipped mid-tile. `FamilyCompact` = count + progress + overdue, no per-person rows
  (detail is one tap away). Container queries: family short+narrow → compact,
  short+wide → standard, tall → large. (The grid's fixed `MIN_ROW_HEIGHT` is a
  deliberate mobile choice, so the fix is widget-level, not a grid change.)

### Bug fixes folded in

- **Today Widget stories were throwing** `LinkWithRef … basename of null` —
  `TodaySummaryView` wraps its tile in a react-router `<Link>` but the stories had
  no Router context (broken since the widget shipped without the gate). Added a
  `MemoryRouter` decorator (shell `Sidebar.stories.tsx` pattern).
- **Family widget hid non-overdue members** (see above) — a real data bug, not
  just layout.

### Typography alignment (design-system check)

Initial all-done headings used **`display-lg` (29px Lora)**. Per `design-system.md`
(line 119) `display-lg` is reserved for **full-size** empty-state / error-page
headings; **widget** empty states use the **compact `EmptyState` → `card-title`
(16px DM Sans)**, which the widget's own "No tasks today" states already use.
Corrected all all-done headings to **`card-title`**; prominence now comes from the
🎉 graphic + gold XP pill (both governed semantics). No `design-system.md` change
needed — the implementation was the deviation.

---

## Outputs

- `TodaySummaryView.tsx` + `TodaySummary.tsx` (chores plugin) — rebuilt
- `apps/shell/src/pages/Home.tsx` + `apps/shell/src/lib/load-plugin.ts` — widget sizing
- `TodaySummary.stories.tsx` — final stories (+ MemoryRouter, All-done story)
- `docs/modules/chores/design.md` §4 — "Hero split" recorded; fill-height/clip +
  size-derivation documented; Focus widget variant flagged as owed
- `docs/sessions/kickoffs/dev-chores-focus-mode.md` — widget Focus variant folded in

## Verification

- typecheck + lint green (chores + shell); chores + shell federated builds green
- **163 API tests pass** (no server change; client now calls the existing `/xp`)
- **Live-app review signed off** across taskee + family on Home (sparse + full
  data, all-done state, large + standard slots) over several iterations

## What the next session needs to know

- **Focus Mode** owes the **widget Focus variant** ("Next up", direction C),
  gated on the per-profile `focusMode` setting it introduces — kickoff updated.
- Widget `size` is now shell-derived from the layout cell; widgets that self-size
  via container queries (family-feed) ignore the prop.
