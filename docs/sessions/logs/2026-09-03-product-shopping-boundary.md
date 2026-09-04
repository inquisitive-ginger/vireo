# 2026-09-03 — Product: the groceries boundary

Ad-hoc session, no kickoff (the queue entry "Groceries' home, and an index-count
animation" was the standing question). Started as "pick the grocery list back up
and push it"; ended with the module split out and the surface sent back to design.

## What happened

Picked up PR #127 for a live review. The reaction to the built surface was that the
index of lists is **not fresh** — it reads as filing, not shopping — and that
groceries living inside `meals` is friction. Both were already on the queue as the
open question the M5/6 build ran ahead of.

## What was decided

**ADR 069 — shopping is its own plugin, and meals is a producer.** Groceries leaves
`meals`, becomes `shopping`, gets its own schema, nav entry and subjects. Meals pushes
a planned meal's `needs` across a contract (ADR 050's provider pattern) instead of
writing grocery rows.

The name is `shopping`, not `groceries`, deliberately. ADR 067 established that
subjects are namespaced to the producer and that a rename is a data migration on live
`platform.permission_overrides` rows — nothing had shipped, so the rename was free
today and would not have been later.

## The evidence that made it near-binary

The split had already half-happened by accident, and nobody had drawn the boundary:

| Already separate                                 | Still joined                         |
| ------------------------------------------------ | ------------------------------------ |
| `/groceries/*` was a **top-level** route         | One manifest, one nav item ("Meals") |
| `apps/api/src/plugins/groceries.ts` its own file | Grocery tables in the `meals` schema |
| `meals.grocery.added` already on the bus         | `groceries.ts` imported `mealPrisma` |
| 4 of 6 models in `meals` were grocery models     |                                      |

The decider was **ADR 032 — one sidebar nav entry per plugin** (`types.ts:259`). A
top-level destination _is_ a plugin, so groceries could not be first-class while
living inside meals; it was reachable only through a link in the meals header, which
is exactly the "crowded meals header" the M5/6 live review logged as a symptom. The
UX friction and the architecture were the same question.

The only real coupling was `push-needs` — it reads a free-text field and writes items.
That is a contract, not a shared data model.

## What was closed, and what survives

**PR #127 closed unmerged**, branch kept. Everything above the data layer is
unsettled. Salvage: the aisle dictionary (~373 lines), the Zod schemas, the API
routes, the migrations and the filing tests — all need renamespacing to `shopping`,
none need rethinking.

**ADR 068's `ListRow` target-inset fix was committed to the branch before closing.**
It is a UI primitive correction, not a shopping decision: the overlay lays out against
the padding box and the hairline sits outside it, so `inset-y-1` measured 47px live /
9px dead — under the declared 48px minimum. It is `inset-y-[3.5px]`, derived from the
two invariants rather than chosen. **It is on `dev/meals-grocery-list` only and still
owes a path to `main`** — see open questions.

## Superseded, and banner-marked so a cold session cannot mistake them

- `artifacts/2026-08-23-grocery-list-handoff.md` — was the build contract
- `artifacts/2026-08-23-grocery-list-devready.html` — the dev-ready visual
- `docs/modules/meals/design.md` §M5/6 + §M5/7 — removed, pointer left. They were
  **twice-stale**: the 2026-08-23 gate had already killed the note line, the chip
  strip and the three-column wall the text described, and ADR 069 then superseded the
  gate's own index-of-lists outcome.
- ADR 067 — superseded **in part**: the reasoning stands, the namespace does not.

## A note on how this went wrong

M5/6 was built to a closed design gate, and the gate itself was sound — it correctly
rescued the aisle dictionary and correctly validated that `ListRow` needed no change.
What neither the gate nor the build could do was answer a question that was filed
**one level up** from both: whether the module boundary was right. That question was
raised at the M5/6 live review, queued, and then the build continued anyway.

The cheap lesson: a queued question about _where something lives_ blocks the design of
what lives there. It is not a parallel track.

## Open questions

- **ADR 068 needs a path to `main`.** It is a `packages/ui` primitive fix stranded on
  a closed PR's branch, and `MealsPageView` consumes `ListRow` too. Cherry-pick it to
  `main` on its own, or fold it into M5.5/2 — but it should not wait on shopping.
- **`MealsPage.tsx:35` still reads `const canManage = tier >= 4`.** The identical
  `TierGate` defect ADR 018 forbids, one file over from the one M5/6 fixed. Not in any
  story's scope right now.

## What the next session needs to know

M5.5/1 is a **fresh design exploration**, kickoff written
(`kickoffs/design-shopping-surface.md`). The axis is set in the brief, not left to the
agent — the last diverge pass was thrown away whole for choosing its own. The axis is
_"what is the primary object on screen, and what does the app think you are about to
do?"_, and "an index of lists" is the answer already rejected.
