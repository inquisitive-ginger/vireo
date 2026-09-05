# Decision set — Shopping polish

The contract is `artifacts/2026-09-04-shopping-polish-critique.md`; the geometry is in
`...critique.html` (`Exploration`, six spec blocks). **This file settles what those left open**
and wins where the three disagree. Settled with Zach 2026-09-04. **Nothing here is re-decided in
situ** — if the build proves one wrong, stop and say so.

## D1 — The row gesture is reveal-then-tap (SH-09)

Drag right → left edge reveals `Remove` / `Take it back`, 112px, threshold 56px, **fires on
tap**. Drag left → right edge reveals 96px, threshold 96px or 40% of row width, opens the
permission-filtered sheet **on release**. Full-swipe-plus-undo is **rejected here**: removal is a
hard delete both ways (ADR 073 §4), so undo re-creates the row with a new id and a reset
`added_at`, silently changing its identity and its retract clock. **Do not build that variant.**
The rest of E1's spec block stands verbatim — one open row at a time, 8px axis lock, the overlay
survives the offset, a drag never fires the check, `Shift+F10` and long-press reach the sheet,
**no keyboard route to the quick path**, zero permitted verbs binds no gesture, reduced motion
honoured.

## D2 — `--input` is the interactive-control outline, at 3:1

The ring fails WCAG 1.4.11 at **1.37:1 light / 1.45:1 dark** (re-measured against
`--background`; the critique's 1.29/1.55 is the same defect). `--input` comes up in **all three
theme blocks** of `packages/ui/src/styles.css` (~243, ~431, ~432 — grep all three):

| Block | Today                   | Ships                   | On `--background`   |
| ----- | ----------------------- | ----------------------- | ------------------- |
| light | `oklch(0.88 0.02 100)`  | `oklch(0.62 0.02 100)`  | 1.37:1 → **3.48:1** |
| dark  | `oklch(0.30 0.018 105)` | `oklch(0.52 0.018 105)` | 1.45:1 → **3.58:1** |

`--border` is **not** touched. Shopping's two `Ring`s (`ShoppingPageView`, `CaptureWidgetView`)
move `border-border` → `border-input`. `CompletionToggle` already reads `border-input`, so
**chores moves with this and is reviewed live** — the blast radius, not a side effect. Record
the shipped ratios in the log.

## D3 — Feed yields its cell; Shopping is a 2×2

`family-feed.feed` comes **off all three default layouts**; `shopping.capture` takes a 2×2 below
`chores.today-summary`. The grid grows one row, not two; the Feed page stays one nav tap away.
**Queued, not decided:** a dedicated Home-dashboard composition session, now that six widgets
compete for it (Zach). This is a holding position — no elevation-ladder ADR off the back of it.
**Verify before claiming the tile ships:** whether a real profile resolves `DEFAULT_LAYOUTS` or
reads a persisted layout row. If prod holds saved layouts, the default announces nothing —
**stop and report**, do not write a migration.

## D4 — The report slot: errors are sticky and counted

One line, `min-h-10` reserve, **never resizes, never steals focus, never blocks** (ADR 070).

- A **success never clears a standing error** — delete `setAddError(null)` on success
  (`lib/use-ambient-capture.ts:73`, `pages/ShoppingPage.tsx:193/357`).
- A second failure names the newest and counts the rest: `Couldn't add "bread" · 1 more`.
- A `✕` on the line clears it; nothing else does.
- **Precedence: error > duplicate notice > idle.** A lost item is worse news than a doubled one.
- Duplicate copy, verbatim, list name interpolated: `Already on Grocery.` / `Take it back?` —
  no aisle, no "added anyway".

## D5 — Rename is `manage`-gated only (SH-06)

No new permission key: SH-05 says "let a lower tier fix their own row" is a new key and a
**product** decision. A kid fixing `mikk` takes it back and adds it again. Rename shows in the
sheet only under `can('manage','shopping.Item')`, **does not re-file the aisle**, and **does not
teach `Entry`** (no `remember()` — the asymmetry ADR 073 §4 records for retract).

## D6 — The widget keeps its house-wide count

SH-10 deletes the **page's** cumulative strip. The widget header stays house-wide: its rows are
cross-list and each names its list, so the figure and what it counts share a screen. One
arithmetic everywhere ("what's left"), differing only in a scope the surface states. `1 left`.

## D7 — SH-14 is motion only

Ring fill `--duration-fast`, scale 1 → 1.08 → 1, no bounce, cancelled under reduced motion. The
phone's above-the-fold gain is **what deleting the count strip buys and nothing more**. The
wall's blank lower half is **left deliberately and recorded in the log** — filling it changes
what the wall shows, which design.md marks a product story.

## D8 — `section-label` block spacing is not in this session

The critique never reached it; it is a four-call-site design-system decision with no decision
made. **Its queue entry stays open** — say so in the log.

## The API contract, fixed before either dev starts

**`POST /shopping/lists/:id/items`** → `201 { item: <serializeItem, unchanged>, duplicateOf:
{ id, name } | null }`. `duplicateOf` is the **pre-existing** row on the **same list** whose
`normalizeItemName` matches and whose status is **`needed`** (unchecked only — re-adding
something already in the cart is a real second-trip item). Never the row just created. The add
**always completes**; the collision rides back with it so the client needs no second read.

**`PATCH /shopping/items/:id`** — new. Body `{ name }` via a new `ShoppingItemRenameSchema` in
`@family-os/schemas` (`safeParse` → 400 `flatten()`, mirroring `ShoppingItemCreateSchema`).
Gated `can('manage','shopping.Item')`, 404 on a missing row, no re-file, no `remember()`.
Returns `200 <serializeItem>`, emits `shopping.item.renamed { itemId, listId, name, renamedBy }`
— the live-staleness argument ADR 073 made for removal.

**`DELETE /shopping/items/:id`** and **`.../retract`** are unchanged and already correct. Their
zero client callers are SH-01/SH-02's whole job.
