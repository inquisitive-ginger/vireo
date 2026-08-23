# Handoff spec — M5/6 grocery list

Design gate closed 2026-08-23. Options and rejected directions:
`2026-08-23-grocery-list-diverge.html` (self-contained, tokens inlined from
`packages/ui/src/styles.css` — a snapshot, not a live view).

This spec is the contract. Build from it, not from the exploration.

---

## Decided

|                     |                                                                                                                        |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Structure**       | Each store is its own list. Home is an index of lists; tap enters one full-screen. Not one list grouped by store.      |
| **Empty lists**     | Permanent lists (Grocery Store, Costco) stay visible and dim at zero. Runtime lists appear only while they hold items. |
| **Creating a list** | Tier 4. Anyone who can add an item can add to an existing list.                                                        |
| **Grouping**        | Aisle, **inside** a store — there aisle order is walk order. Not universal: a non-food list has no aisles.             |
| **Adding**          | Inside a list the destination is implied; no store picker. Only the index needs `Add to…`.                             |
| **Typing**          | Inline ghost completion in the field. Nothing appears, nothing moves. Tab or right-arrow accepts.                      |
| **Row content**     | Name, plus quantity right-aligned and tabular when set. **No note line.**                                              |
| **Wall tablet**     | Same index → drill-in as the phone. **No columns.**                                                                    |

## Rejected, with the reason

- **One list grouped by store** — can't tell you what a trip contains; you'd see Costco at the grocery store.
- **Tabs** — a fourth list overflows 390px, and a list that appears and vanishes makes the strip jump between visits.
- **Segmented pill switcher** — a fourth navigation pattern beside the sidebar, tab bar, and drawers.
- **Suggestion sheet / labelled pill strip** — both move layout while typing; inline completion doesn't.
- **Purpose on the note line** (`for Sunday's ziti`) — aisle grouping guarantees a meal's items are never adjacent, so the note repeats.
- **Who-added dot** — on a two-person list the answer is always one of two people. Revisit only if tier 1 gains add.
- **Wall columns** — would have cost aisle heads at four feet and made the wall group differently from the phone.

## Component mapping

**`ListRow` needs no change.** It already takes a generic `leading` slot rather
than owning a check ring, which was ADR 063's open question — that answer
survives the gate. Quantity goes in `children` beside the `min-w-0 flex-1`
wrapper; no new prop.

| Surface          | Build from                                                                                |
| ---------------- | ----------------------------------------------------------------------------------------- |
| Grocery item row | `ListRow` — `leading` = check ring, `children` = name + right-aligned qty                 |
| List index row   | `ItemCard` — it owns the row skeleton and `onActivate`; do not hand-roll                  |
| Aisle group head | Existing section-label treatment (`text-section-label`), sticky within the scroll context |
| Page frame       | `PageContainer width="list"` — a list is not prose                                        |

**Genuinely new:** the add bar (bottom on phone, no existing primitive covers a
persistent composer) and the inline-completion input behaviour.

## Tokens

Rows `--spacing-row-touch` minimum, hairline `--border`, no per-row radius or
shadow. Quantity uses `font-variant-numeric: tabular-nums` and `--muted`
ground. Ghost completion text is `--muted-foreground` in the same field, not a
separate node. Just-added flash is `--primary` at low mix against
`--background`. Checked rows dim to 0.46 with strikethrough and hold position.

## Behaviour by surface

- **Phone** — index → list. Add bar pinned bottom, thumb zone.
- **Wall tablet** — identical structure, larger type. No columns, no separate layout.
- **Desktop** — same; the keyboard makes inline completion cheapest here.

## Amendments this gate makes

**Needs-push items arrive as plain items** (decided 2026-08-23). A meal pushing
three items is exactly the duplication the note line was cut for, so there is
nowhere for "each item noted with its meal" to land. This **amends AC6 and AC7**
and supersedes design.md's "provenance is one grammar: the note line" for
groceries. The week page's `N things needed` link still creates the items; it
just doesn't mark them. Do not quietly reintroduce the note.

## Open — not for the dev session to decide

1. **Permissions → one ADR, via `architect`.** Tier 4 creating lists needs a new
   `PERMISSION_REGISTRY` subject, and the `Which aisle?` correction prompt is
   currently gated tier-4 against AC4's untiered wording. Both in one ADR, before
   the build kickoff is written.
2. **Cross-plugin lists.** A Home Depot or Michaels list is the same need and
   not meals' business. **Not building it.** What must not preclude it: a list
   is its own row (never a column on the item), the list carries its producer,
   and aisle grouping is a property of the list rather than of the app.

## What this invalidates on #127

The aisle dictionary, schemas, routes, migrations and tests **stand** — aisle
grouping survives inside a store. What changes is above them: the page becomes
an index plus a per-list view, `grocery_items` needs a list reference rather
than a bare store value, and the ungated 44-line `ListRow` entry in
`design-system.md` is **replaced** by this outcome, not appended to.
