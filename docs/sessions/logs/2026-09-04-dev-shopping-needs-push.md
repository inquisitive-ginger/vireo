# 2026-09-04 — Dev: the needs-push contract (M5.5/3)

**Shipped:** PR #133, merged `5aeb446`. Branch `dev/shopping-needs-push`.
`meals` publishes `meals.needs.pushed`; `shopping` consumes and files. `meals`
writes no shopping rows and imports no shopping client (ADR 069 §3, §4).

## Why the bus and not an ADR 050-style registry

ADR 050's day-mark registry is a **pull** contract: the reader asks providers for
data at read time. This is a push, and modelling it as a registry would decorate
`fastify` with shopping's callable surface for `meals` to invoke — the same
direct coupling ADR 069 §4 removes, one indirection further away. The bus keeps
the producer ignorant of who, if anyone, is listening.

**`emitAndAwait` was added to the platform bus.** `emit` is untouched, so a failed
XP award still cannot fail a chore. Fire-and-forget could not report a failed push
to the person who just tapped it, and a push that silently didn't land is exactly
the invisible failure the standing `catch {}` rule exists to prevent.

## `noteFor`'s meal lookup could not survive the split

The old note line derived its words by reading `planned_meals`. `shopping` cannot
do that any more, so the **producer owes the words**: a new `source_label` column
carries them. It is stored rather than derived because there is nothing on
shopping's side to look it up _from_ — the push is the only moment those words
exist. `source_id` stays an opaque handle back to whoever pushed, not a FK.

## The failure renders inside the tapped row

A page-scoped error line for a row-scoped action names no meal when two rows are
pushable, and the pushed row was otherwise pixel-identical to its neighbour. The
outcome — success and failure both — lands in the row that was tapped.

## Decided, not open: the duplicate-push residue

One person, two fast taps on two meals sharing an ingredient, files it twice.
Closing it needs a `normalized_name` uniqueness rule that would also constrain
manual adds — a family that wants two entries of the same thing is not wrong.
**Zach decided 2026-09-04 not to fix it for now.** It is a decision, not a bug;
do not re-raise it as one.

## Two things the ACs get wrong, recorded

- **AC3 says "the bus enforces the shape". It enforces the _name_** — the
  `module.noun.verb` kebab-case rule, and nothing about the payload. The shape is
  enforced by a Zod schema in the **consumer**, before any write. That is the
  better place (the consumer is what breaks if the shape is wrong), but the AC
  wording and the code disagree and the code is right.
- **`shopping.ts` has no _value_ imports from `@family-os/platform`.** One
  `import type { EventBus }` remains and compiles away. Any grep-based claim of
  "zero imports" should say type-only.

## Per-list aisle grouping is transparent to the push

Filing assigns `category`; the **read** decides order. A future producer targeting
Costco would file rows into aisles that Costco then ignores in favour of
`added_at`. That is correct and needs no code change — recorded here so a later
session does not rediscover it as a suspected bug.

## The two `tier >=` gates in `MealsPage`

Both fixed — ADR 018 forbids them and this session was already in the file.
`canClaim` now asks the ability rather than comparing the id. That moves
`meals.planned_meals.owner_id` closest to the trigger on the `@db.Uuid` deferred
backlog entry: the route guard is intact and load-bearing, but the refusal is now
**visible** rather than silent, so the day a family-profile surface tries to claim,
it will be a UI refusal and not a 500.

## What the next session needs to know

- `emitAndAwait` exists alongside `emit`. Use it only where a caller is waiting on
  the outcome; everything fire-and-forget stays on `emit`.
- `source_label` is the producer's own words. Never derive a note line by joining
  across a plugin schema boundary.
- The duplicate-push residue is closed by decision. See above.
