# ADR 040 — The Sunken Surface Plane

**Status:** Decided (2026-07-11)
**Amends:** [022](022-widget-composition.md) (surface vocabulary), [030](030-member-identity-palette.md) (reserves the chromatic range for identity), [039](039-widget-prominence.md) (extends the elevation ladder downward)

---

## Decision

Add a fourth surface to the elevation system — a **sunken plane**, the ladder's
first and only step _below_ the card:

| Token              | Light                                | Dark                                  | Role                                       |
| ------------------ | ------------------------------------ | ------------------------------------- | ------------------------------------------ |
| `--surface-sunken` | `oklch(0.955 0.006 75)`              | `oklch(0.175 0.008 47)`               | A recess cut _into_ a card                 |
| `--shadow-inset`   | warm inner shadow + light bottom lip | deep inner shadow, near-invisible lip | The depth cue that makes the tint a groove |

Rules:

- **Always paired.** `--surface-sunken` without `--shadow-inset` is a grey
  rectangle, not a recess. Ship both or neither.
- **Only inside a card.** A recess needs something to be recessed _into_.
  Sunken surfaces are illegal on `--background` — the page is already the
  bottom of the stack.
- **Near-achromatic on purpose.** Chroma is `0.006`, roughly a quarter of
  `--secondary`'s `0.022`. This is load-bearing (see below), not a taste call.
- **Not a hover/active state and not a disabled state.** It marks _depth_, and
  nothing else. Interaction states stay with `--secondary`/`--primary` per
  ADR 031.

First consumer: the `calendar.up-next` "all week" band (the multi-day span
groove). Second-order candidates — inset code/quote blocks, well-style form
groups, any "this sits underneath" surface — should adopt it rather than
inventing a fourth beige.

---

## Why

**The system could only go up.** `--background` → `--card` → `--shadow-card` →
`--shadow-raised` is a ladder with no bottom rung. Anything that needed to read
as _recessed_ had exactly one option: `--secondary`. That worked while
`--secondary` meant only "structural chrome" (sidebar, grouped settings rows).

**But `--secondary` acquired a second meaning.** Under ADR 030 and the M3
calendar colour language, a **no-owner (Family) event is filled with
`--secondary`** — it's the neutral in a palette where _colour means person_. So
`--secondary` now says two incompatible things depending on where you meet it:
"this is chrome" and "this belongs to everyone."

The calendar widget forced the collision into the open. Its "all week" band was
built as a recessed `--secondary` trough sitting directly beneath the up-next
hero — and when the next event is a Family event, **the hero's wash is also
`--secondary`**. Two abutting surfaces, the same beige, one meaning "everyone's"
and one meaning "underneath". No seam, no hierarchy, and a token quietly
carrying two jobs.

`--muted` could not rescue it: at `oklch(0.93 0.016 72)` against `--secondary`'s
`oklch(0.93 0.022 72)` it is a near-duplicate — same lightness, marginally less
chroma. It hides the collision rather than resolving it.

**Why achromatic is the actual fix.** Every identity fill in the palette is
chromatic by construction (ADR 030 — six fixed hues, each with a `tint` layer).
A surface that is _deliberately drained of chroma_ therefore cannot be read as
an identity fill, no matter whose hue lands next to it. The distinction is
structural, not a matter of picking a beige far enough away from the other
beiges. That property is what earns this a token instead of a one-off value.

**Why the inner shadow is not decoration.** A flat darker tint reads as "a
different colour region." The inner shadow at the top lip plus the light bottom
lip reads as "a groove cut into this surface" — the same two cues that make a
physical channel legible. The depth is the message; the tint alone doesn't
deliver it.

---

## Alternatives considered

**Reuse `--muted`.** Rejected: a near-duplicate of `--secondary` (see above). It
also has no paired shadow, so it would have shipped the grey-rectangle failure.

**Give the calendar band a one-off local value.** Rejected: the collision is a
_system_ problem (a token with two meanings), not a calendar problem. A local
value would leave the next surface that needs a recess to invent its own.

**Re-home the Family fill instead — take `--secondary` back for chrome.**
Genuinely tempting, and it attacks the root: one token, two meanings. Rejected
for now because the Family fill is load-bearing across the whole calendar
colour language (month chips, span bars, agenda rows, the hero) and is already
in users' hands; re-homing it is a bigger, riskier change than adding the rung
the ladder was missing anyway. **If a future session wants to revisit, this is
the door.**

**Make the band a card instead of a recess (elevate, don't sink).** Rejected in
the exploration: a raised band next to a raised hero reads as a _second hero_.
The whole point is that a week-long condition is not a peer of the next event.

---

## Do not revisit unless

- The Family fill moves off `--secondary` (which would free `--secondary` to
  mean "recessed" again, and make this token redundant for that one case —
  though not for the ladder generally).
- A third surface meaning appears that neither `--secondary` nor
  `--surface-sunken` can carry, at which point the surface vocabulary needs a
  proper re-derivation rather than another token bolted on.
- Contrast testing shows the near-achromatic plane failing against
  `--foreground` or `--muted-foreground` in either mode.
