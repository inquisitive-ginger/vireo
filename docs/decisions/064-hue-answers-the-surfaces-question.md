# 064 — Identity hue appears where the person is the answer

**Status:** Decided (2026-08-11, M5/1 Meals & Groceries design) ·
**Amended 2026-09-04** (M5.5/2, M5.5/4) — the shopping bullet's second sentence
withdrawn; the narrowed trigger and everything else stand.
**Amends:** the _application_ of ADR 043/044 (the palette, assignment, and
second-channel rules are untouched)

## Decision

The trigger for identity colour narrows:

> **Identity hue appears where the person is the answer to the surface's
> question** — not on every multi-person surface.

- **Meals surfaces keep spines.** "Who's got Thursday" is the module's whole
  sentence; the week plan's spine is the point, and an unclaimed day renders a
  dashed spine — identity's absence made visible.
- **Groceries carries no identity chrome at all.** "Who added the milk" is not
  a question the list answers. ~~Adder and partner-shopper facts render as
  **text notes** ("Emma added these", "Sam got it").~~ **Withdrawn 2026-09-04**
  — they are not rendered at all. See the amendment below.

Where hue does appear, ADR 043 (identity takes the edge, status the field) and
ADR 044 (assigned, unique, never hue-only) apply unchanged.

## Amendment — 2026-09-04

**Per-row attribution is not rendered on the shopping surface in either
direction.** Not who added a row (live review, M5.5/2 — carried in `design.md`
and ADR 072's own amendment), and not who checked one (Zach, M5.5/4). The note
line carries **producer** words only — why the row exists, `for Thursday`.
`added_by` and `got_by` are still stored for permissions and audit; neither
reaches the wire.

The original bullet reached the right answer through the wrong step. It ruled
out hue and then reached for text as the cheaper channel, which reads as "the
fact belongs on the row, just not in colour". The fact does not belong on the
row: a shared list does not answer whose milk it is, and thirty rows of it sit
between the shopper and the next word they have to read. Two shoppers converge
on the row's **state** — dimmed, struck through, in place — which is the thing
either of them acts on.

**This narrows what the ADR governs; it does not weaken it.** The decision above
is about where identity _hue_ appears, and that is untouched. What is withdrawn
is the sentence prescribing a text fallback on one surface — a rendering call
that had no business being settled by the colour ADR, and that the surface's own
design has now made.

## Why

- ADR 043's trigger — "multi-person surfaces get identity spines" — put a hue
  bar on grocery rows that nobody would ever decode. A colour bar doesn't make
  a kid's contribution visible: nobody translates plum into "Emma" mid-aisle,
  and the payoff the spec wants (the kid's snap peas coming home) lands at the
  table, not in a hue. Text does the job legibly and is already the accessible
  name.
- The narrowed rule keeps the identity system loud where it earns its pixels
  and stops it decaying into decoration-with-a-rationale, which is how colour
  languages die.
- Surfaced by an external design critique of the M5/1 gate; the sharper
  formulation ("the answer to the surface's question") is the critique's.

## Alternatives considered

- **Keep the broad trigger** — consistent, but consistency in applying a rule
  whose premise fails on a surface is how ADR 030's collisions survived a year.
- **Hue on groceries at lower intensity** — quieter decoration is still
  decoration.

## Do not revisit unless

A surface appears where the person is genuinely the answer but text can't
carry it (space, distance) — then hue returns there under ADR 044's rules.
