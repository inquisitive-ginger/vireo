# ADR 040 — The Sunken Surface Plane

**Status:** Decided (2026-07-11)
**Amends:** [022](022-widget-system.md) (surface vocabulary),
[030](030-member-identity-colors.md) (reserves the chromatic range for identity),
[039](039-widget-prominence.md) (extends the elevation ladder downward)

## Decision

Add a fourth surface to the elevation system — a **sunken plane**, the ladder's first and
only step _below_ the card:

| Token              | Light                          | Dark                         | Role                          |
| ------------------ | ------------------------------ | ---------------------------- | ----------------------------- |
| `--surface-sunken` | `oklch(0.955 0.006 75)`        | `oklch(0.175 0.008 47)`      | A recess cut _into_ a card    |
| `--shadow-inset`   | warm inner shadow + bottom lip | deep inner shadow, faint lip | Makes the tint read as groove |

Rules:

- **Always paired.** `--surface-sunken` without `--shadow-inset` is a grey rectangle, not a
  recess. Ship both or neither.
- **Only inside a card.** A recess needs something to be recessed _into_; sunken surfaces are
  illegal on `--background`, which is already the bottom of the stack.
- **Near-achromatic on purpose.** Chroma `0.006`, roughly a quarter of `--secondary`'s
  `0.022`. Load-bearing (see below), not a taste call.
- **Not a hover, active or disabled state.** It marks _depth_ and nothing else; interaction
  states stay with `--secondary`/`--primary` per ADR 031.

First consumer: the `calendar.up-next` "all week" band (the multi-day span groove).
Second-order candidates — inset code/quote blocks, well-style form groups, any "this sits
underneath" surface — should adopt it rather than invent a fourth beige.

## Why

**The system could only go up.** `--background` → `--card` → `--shadow-card` →
`--shadow-raised` is a ladder with no bottom rung. Anything needing to read as _recessed_ had
one option, `--secondary` — fine while that meant only "structural chrome" (sidebar, grouped
settings rows).

**But `--secondary` acquired a second meaning.** Under ADR 030 and the M3 calendar colour
language a **no-owner (Family) event is filled with `--secondary`** — the neutral in a
palette where _colour means person_. The token now says two incompatible things depending on
where you meet it: "this is chrome" and "this belongs to everyone".

The calendar widget forced the collision open. Its "all week" band was a recessed
`--secondary` trough directly beneath the up-next hero — and when the next event is a Family
event, **the hero's wash is also `--secondary`**. Two abutting surfaces, the same beige, one
meaning "everyone's" and one "underneath": no seam, no hierarchy, one token doing two jobs.

`--muted` could not rescue it: at `oklch(0.93 0.016 72)` against `--secondary`'s `oklch(0.93
0.022 72)` it is a near-duplicate — same lightness, marginally less chroma. It hides the
collision rather than resolving it.

**Why achromatic is the actual fix.** Every identity fill is chromatic by construction (ADR
030 — six fixed hues, each with a `tint` layer), so a surface _deliberately drained of
chroma_ cannot be read as an identity fill, whoever's hue lands next to it. The distinction
is structural, not a matter of picking a beige far enough from the other beiges — and that is
what earns a token instead of a one-off value.

**Why the inner shadow is not decoration.** A flat darker tint reads as "a different colour
region". The inner shadow at the top lip plus the light bottom lip reads as "a groove cut
into this surface" — the two cues that make a physical channel legible. The depth is the
message; the tint alone does not deliver it.

## Alternatives considered

**Reuse `--muted`.** A near-duplicate of `--secondary` (above), and with no paired shadow it
would have shipped the grey-rectangle failure.

**Give the calendar band a one-off local value.** The collision is a _system_ problem — a
token with two meanings — not a calendar problem, and a local value leaves the next surface
needing a recess to invent its own.

**Re-home the Family fill instead — take `--secondary` back for chrome.** Genuinely tempting,
and it attacks the root. Rejected for now because the Family fill is load-bearing across the
whole calendar colour language (month chips, span bars, agenda rows, the hero) and is already
in users' hands; re-homing it is bigger and riskier than adding the rung the ladder was
missing anyway. **If a future session wants to revisit, this is the door.**

> **Walked through, same day** — see [ADR 041](041-family-identity-hue.md). The Family fill
> now has its own reserved identity hue and `--secondary` is chrome again. This ADR
> **stands**: the ladder still needed its bottom rung, and the groove is still
> `--surface-sunken`. What changed is that the sunken plane is no longer the _only_ thing
> between a recess and an identity fill — and ADR 041 keeps the Family hue chromatic precisely
> so the guarantee above ("near-achromatic on purpose") keeps holding.

**Make the band a card instead of a recess (elevate, don't sink).** Rejected in the
exploration: a raised band next to a raised hero reads as a _second hero_, and the point is
that a week-long condition is not a peer of the next event.

## Do not revisit unless

- ~~The Family fill moves off `--secondary`~~ — **it did** (ADR 041, same day), and that did
  not make the token redundant: `--secondary` is chrome (a hover/rest surface, ADR 031), so a
  recess borrowing it would read as a hover state. The ladder still needs a rung meaning
  _depth_ and nothing else.
- A third surface meaning appears that neither `--secondary` nor `--surface-sunken` can carry
  — then the surface vocabulary needs a proper re-derivation, not another token bolted on.
- Contrast testing shows the near-achromatic plane failing against `--foreground` or
  `--muted-foreground` in either mode.
