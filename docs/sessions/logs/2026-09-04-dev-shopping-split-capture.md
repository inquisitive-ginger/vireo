# 2026-09-04 — Dev: the plugin split + the capture surface (M5.5/2)

**Shipped:** PR #132, merged `2d9bec7`. Branch `dev/shopping-split-capture`.
`shopping` is its own plugin with its own schema, and `/shopping` opens as a
capture field on a walk-order list (ADR 069, 070).

## What was built

- `plugins/shopping/` mirroring `family-feed`, port 3016, `shopping` schema,
  `apps/api/src/plugins/shopping.ts`. **Four of five registration points** —
  `plugins.json`, `load-plugin.ts`, `federation.d.ts`, `ICON_MAP`. **`Home.tsx`
  `WIDGET_META` is untouched on purpose; M5.5/5 lands it with the widget.**
- The four models move to `shopping.{items,lists,entries,aisle_overrides}`;
  `meals` keeps `PlannedMeal` + `DinnerNudgeLog` and declares no grocery model.
- `ListRow` + ADR 068 and `CaptureField` (ADR 070) land in `@family-os/ui`.
- Frames S1/S2 at `PageContainer width="list"`; filing echo before the commit.
- `plugins.json` reordered — the phone reads `Home · Calendar · Meals · Shopping ·
More`, `chores` into More (ADR 033's five-tab cap, settled at the M5.5/1 gate).

## Two ADRs came out of the build

**ADR 071 — checking off is its own action, at tier 2.** There was no permission
key for checking an item off, so it fell to `manage`, which is tier 4: the shop
surface would have been read-only for whoever is holding the cart. Folding it into
`manage` is worse than a tier mismatch — `manage` is the _delete_ verb, so the only
grant a parent could hand a shopper would be "check things off **and** delete the
list's items". Now `check` at tier 2, unchecking on the same key (a toggle, not a
one-way door), and the aisle correction split out as `file`.

**ADR 072 — the wall adds as the house.** The wall could not add anything:
`items.added_by` was `@db.Uuid` while `FAMILY_PROFILE_ID` is the string `family`.
The column was the error, not the guard — `platform.profiles.id` is already text and
holds `family` in production, so every `@db.Uuid` pointing at it narrows below the id
space it references. Landed here rather than in M5.5/5 because the `uuid`→`text`
change was free only while the branch was unmerged: one init migration, no rows.
After merge it is a migration with a cast on live data.

That finding generalizes — `family-feed.posts.author_id`,
`calendar.events.created_by`, `meals.planned_meals.owner_id` all have it, each
hidden behind a hand-written 403. Carried in the queue's deferred backlog.

## The live review changed three things (Zach, 2026-09-04)

1. **Aisle grouping follows each list's `group_by_aisle` flag — and so does
   ordering.** A flat list sorted by our grocery walk imposes an order its shopper
   cannot see. Costco ships `false` and renders by `added_at`.
2. **Who added a row is never rendered.** `added_by` is still stored (permissions
   and audit need it), but a shared list does not answer "whose milk is this", and
   thirty rows of `Emma added` sit between the shopper and the next word.
3. **The family profile lost all special-casing** — no "Added by the house", no
   Family branch at all. ADR 072 §3/§4 are withdrawn as _rendered_ behaviour; §1,
   §2, §5, §6 stand, and the no-hue-no-face rule survives for anywhere else.

Dropping attribution also deleted a per-request N-profile query from
`GET /shopping/lists/:id`. `· just now` went with it as part of the same string —
if recency comes back it is a new decision, not a restoration.

## ADR 072 was rewritten to fit its cap

7456 → 5971 bytes with all six Why bullets and six Alternatives intact; 1128 bytes
of prose came out. The compressible mass was the Decision section _arguing_ as well
as stating — the argument already lived under Why. Nothing was cut for length that
carried a reason.

## What the next session needs to know

- **`WIDGET_META` is the fifth registration point and is still open.** M5.5/5.
- **`POST /items/:id/aisle` ships and nothing reaches it** — a mis-filed item sits
  in `Other` forever. M5.5/4 owns the correction UI; keys settled by ADR 071.
- **Per-list ordering is a property of the list, not the app.** Do not reintroduce a
  global walk-order sort.
- Salvage inventory: `docs/modules/shopping/salvage.md`.
- `design.md` §W2's chip strip is corrected to show _what_ was added, not who —
  M5.5/5 builds to that.
