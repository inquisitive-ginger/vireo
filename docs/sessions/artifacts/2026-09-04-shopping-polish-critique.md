# Handoff — Shopping polish critique

**Design critique run 2026-09-04** against the live app at `localhost:5173`, routes
`/shopping` and `/shopping/lists`, at 768×1024 and 375×812. Visual reference:
`2026-09-04-shopping-polish-critique.html` (self-contained, tokens inlined from
`packages/ui/src/styles.css` — a snapshot, not a live view).

**This file is the contract; the artifact is where the proportion and the geometry live.
Read both.** The artifact's `Exploration` view carries six panels drawn at real dimensions,
each closing with a spec block holding thresholds, timings, tokens and file anchors. Where a
spec block and an acceptance criterion here disagree, **the spec block is the later thinking.**

**Audit caveat.** Run as the `family` pseudo-profile (tier 1) and `Zoë` (tier 3). The tier-4
pass did not happen live, so everything tier-4-only — the `AisleCorrection` control's size,
glyph and placement, and the unreachable `manage` delete — is read from source, not observed.

---

## Decided

|                      |                                                                                                                                                       |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Row actions**      | Two edges. Drag left → right edge → permission-filtered sheet (Move to aisle · Rename · Note · Remove). Drag right → left edge → remove alone.        |
| **Row chrome**       | Leading ring, `card-title` name, optional `sm` note. **Nothing else, at any tier.** The trailing `AisleCorrection` button comes off every row.        |
| **Removal reach**    | Reachable at 375px. Today there is no removal path on any screen at any tier; `DELETE /shopping/items/:id` has zero client callers.                   |
| **Capture + aisles** | Capture stops naming aisles. Echo reads `Enter to add`. Filing is list-view work done once before a trip.                                             |
| **Duplicate add**    | Notice + action, two clauses: `Already on Grocery.` / `Take it back?` The add still completes. Match key is `normalizeItemName`, unchecked rows only. |
| **Counting**         | One scheme, "what's left." Cumulative cross-list count **deleted**. Pill = remaining on that list. Sticky bar = `{list} · {n} left`.                  |
| **Cleared list**     | A finish state that replaces the meter and **nothing else** — field, pills and aisle toggles stay live and interactive.                               |
| **Quantity**         | Punted to its own design session. One decision made here: see Open questions.                                                                         |

## Reverses a recorded decision — amend the doc in the same PR

Two items contradict written specs. If the docs are not amended, the next session reads them
and puts the behaviour back.

- **The filing echo** — `docs/modules/shopping/design.md` §Anatomy item 3, and ADR 070's
  2026-09-04 amendment, which explicitly lists the filing echo as unchanged. Both must record
  that capture no longer names an aisle, and why: the tiers doing most of the capturing cannot
  correct an aisle at all (`file` is tier 4), so the line reported a problem to an audience
  that could not act on it.
- **The cumulative count** — `design.md` §Anatomy item 1 specifies the title count as
  cumulative across destinations, deliberately, so it does not repeat a pill. It is deleted.

## Rejected, with the reason

- **Aisle on the just-added chip** — carries a fact nobody acts on at capture time, and makes
  the strip wider for no decision.
- **Swipe fires remove directly, single edge** — hardwires a gesture to the only destructive
  verb and leaves nowhere for the other three, so `AisleCorrection`'s button cannot come off.
- **Labelling the three counts into coexistence** — deleting the one nobody uses is the
  smaller change and makes the remaining two arithmetically identical, so they cannot disagree.
- **A confirm dialog on the quick remove** — defeats the reason it is the fast path.
- **`ItemCard` for shopping rows** — ADR 063 rejected it on density grounds and that stands;
  the resolution to "a row needs more verbs" is fewer permanent controls, not a bigger primitive.

---

## Items

Severity: **Blocker** = the product is unusable-as-specified without it. **Should fix** = ships
wrong today. **Polish** = quality. Full acceptance criteria, file anchors and ADR constraints
are in the artifact's `For the planner` view.

| ID    | Item                                                 | Sev        | Notes                                           |
| ----- | ---------------------------------------------------- | ---------- | ----------------------------------------------- |
| SH-09 | Two-edge row affordance in `@family-os/ui`           | Should fix | **Keystone.** Blocks 01, 06, 08                 |
| SH-01 | Row removal, permission-filtered                     | Blocker    | Endpoint exists, no caller                      |
| SH-02 | Retract reaches the phone                            | Blocker    | Narrow is always list mode                      |
| SH-03 | Duplicate notice at the add                          | Blocker    | Quantity punted; see Open questions             |
| SH-04 | A Household aisle                                    | Should fix | **Product story** — schema + walk order         |
| SH-05 | Who may correct an aisle                             | Should fix | **Product story** — new key, not a loosened one |
| SH-06 | Rename a row                                         | Should fix | Rides SH-09; must not teach the dictionary      |
| SH-07 | A cleared-list state                                 | Polish     | Field + aisle toggles stay live                 |
| SH-08 | Remove the permanent trailing control                | Should fix | 44px, under the 48px floor                      |
| SH-10 | One counting scheme                                  | Blocker    | Supersedes the queue's "colliding 14s"          |
| SH-11 | Sticky line carries the list name                    | Should fix | Same element as SH-10, same sitting             |
| SH-12 | No layout shift on first check                       | Polish     | ~58px shove mid-interaction                     |
| SH-13 | Capture stops narrating aisles                       | Should fix | Amends design.md + ADR 070                      |
| SH-14 | The check earns its motion; the wall earns its space | Polish     | Wall content is a product story                 |

### Suggested order

1. **SH-09** — it is the container three other items land in.
2. **SH-01 → SH-02 → SH-08 → SH-06** as one story. Do not split across sessions.
3. **SH-10 + SH-11** together — one element.
4. **SH-12, SH-13, SH-14** — independent.
5. **SH-03, SH-04, SH-05** — product decisions. Queue them; do not build them here.
6. The nav revert (`e4052b0`) stays last, so the family's first sight of Shopping is the
   polished one.

---

## Open questions — answer before building

1. **Reveal-then-tap, or full-swipe-fires-plus-undo?** (artifact E1) **Blocks SH-09, which
   blocks three items.** Removal is a hard delete on both paths (ADR 073 §4 — no `retracted`
   status, no soft delete), so "undo" means re-creating the row with a **new id and a reset
   `added_at`**, silently changing the row's identity and its retract clock. Reveal-then-tap is
   drawn and recommended for this session; full-swipe is the follow-up once rows have a merge
   story. **Do not build the undo variant unless it is explicitly chosen.**
2. **Do duplicates eventually merge, or carry a count?** Decides whether SH-03's notice is a
   stopgap that gets deleted, or the permanent home for the "genuinely two separate things"
   case — and therefore whether the report slot needs room for a second action.
3. **What does "reorganize the aisles in the list view" mean?** Moving items between aisles, or
   reordering the aisles themselves to match a store's walk. The second is currently a recorded
   non-goal (`plugins/shopping/src/lib/aisle-dictionary.ts`: "Per-family reorder is a named
   non-goal") and would make walk order a property of the list rather than of the app. Answer
   before SH-05 is designed.
4. **Household: one aisle or several?** (SH-04) More urgent than it looks now — dropping the
   filing echo removes the only pre-trip signal that filing went wrong, so nobody sees `Other`
   filling up until they are standing in the shop.

## Not re-reported

Already in the queue and untouched here: the check ring's 1.29:1 contrast (**build it with
SH-08** — otherwise the cleaned row still has the faintest element on screen as its primary
target), the 2×2 Home tile's dashboard cost, the add-error strip erasing a previous failure
(**resolve against SH-03 first — same slot**), and `section-label`'s missing block-spacing rule.

Out of scope by instruction: voice, and the hidden nav item.

Settled and not re-litigated: no modes, no list index, no drill-in, no per-row attribution in
either direction (ADR 064), nothing autofocuses (ADR 070).
