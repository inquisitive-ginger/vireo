# ADR 041 — The Family Identity Hue

**Status:** Decided (2026-07-11)
**Amends:** [030](030-member-identity-colors.md) (adds a seventh, reserved entry), [040](040-sunken-surface-plane.md) (walks through the door it left open), [031](031-interaction-state-language.md) (takes `--secondary` back for chrome)

---

## Decision

The household gets **its own identity entry** — a reserved seventh hue that the
palette owns but never assigns:

| Token                    | Light                  | Dark                    |
| ------------------------ | ---------------------- | ----------------------- |
| `--identity-family`      | `oklch(0.55 0.022 65)` | `oklch(0.72 0.022 68)`  |
| `--identity-family-tint` | `oklch(0.90 0.018 70)` | `oklch(0.285 0.014 65)` |
| `--identity-family-ink`  | `oklch(0.36 0.020 62)` | `oklch(0.90 0.018 70)`  |

**Hearth** — a warm stone. Same three layers as every member hue (ADR 030), so it
resolves through the same `identityToken(hue, layer)` path.

Two rules make it work:

- **Reserved, never assigned.** `IDENTITY_HUES` — the rotation the name hash
  draws from — deliberately excludes `family`. `getIdentityHue()` can therefore
  never hand the household's colour to a person. The wider `OwnerHue` type
  (`IdentityHue | 'family'`) is what surfaces accept.
- **A no-owner event resolves to the household, not to nothing.**
  `huesForEvent([])` returns `[FAMILY_HUE]`, not `[]`. Every downstream
  surface — fill, spine, pill, avatar glyph — takes **one path**, and the
  "no owner" branch that used to special-case `--secondary` is gone.

The household pseudo-profile passes `identity={FAMILY_HUE}` to `ProfileAvatar`
(sidebar chip, profile grid, mobile top bar). Without it the family's _name_
would hash into a member's hue — the household wearing a sibling's colour.

**`--secondary` goes back to meaning one thing: structural chrome.** It is a
hover/rest surface (ADR 031), not a fill that means anything.

---

## Why

**One token carried two meanings, and they collided.** `--secondary` was both
the app's neutral chrome _and_ the Family fill. Nothing enforced the difference,
so the two meanings met three separate times in a single design session:

- The hero's identity dot was `--secondary` **on a `--secondary` Family wash** —
  invisible, but still indenting the eyebrow by 14px. A bug you could only find
  by measuring, because the thing you were looking for wasn't there.
- The hero's Family owner pill dissolved into that same wash, for the same reason.
- The multi-day band needed a recessed neutral, and the obvious neutral was
  already spoken for — which is what forced ADR 040's `--surface-sunken`.

Three symptoms, one cause. ADR 040 treated the third and
[explicitly left the door open](040-sunken-surface-plane.md#alternatives-considered)
to this fix; this walks through it.

**Colour = person is the rule worth protecting** (ADR 030). "Family" is not a
person, so it must not wear a person's hue — if the household were teal, teal
would mean two things, which is the exact bug being closed, just relocated. A
reserved seventh entry keeps the invariant intact while giving the household a
real place in the system rather than a borrowed one.

**Why warm stone, and why the chroma is what it is.** The family is the ground the
members stand on, not a seventh sibling competing with them. Hearth is _stone_:
warm, quiet, and clearly desaturated next to the six.

The values were **corrected during live review**, and the mistake is worth
recording because it is easy to repeat. Hearth first shipped at `0.035` chroma,
justified against the members' **base** layer (`0.09`–`0.13`) — where it looks
comfortably recessive. But fills don't use the base layer; they use the **tint**,
and there the six run `0.035`–`0.05`. At `0.038` Hearth's tint was a _peer_ of
terracotta's `0.04` and only 25° from it in hue: on screen the Family hero and a
terracotta member's fill were the same pale peach. That is the exact
"colour = person" violation this ADR exists to prevent — relocated, not fixed.

So compare the layer that renders. Hearth's tint is `0.018` — roughly **half** the
least-saturated member tint — which is what makes it read as material rather than
as a person.

**Chroma had no room, so lightness does the other job.** Hearth must also not be
mistaken for `--secondary` (chrome), and there is no useful gap to sit in between
chrome's `0.022` and the members' `0.035`. Hearth therefore separates from chrome
on **lightness** instead: `0.90` against `--secondary`'s `0.93` (light), `0.285`
against `0.22` (dark). Two axes, two different neighbours.

**It must stay chromatic.** ADR 040's guarantee is that a _desaturated plane can
never be mistaken for an identity fill_ — which holds only while every identity
fill has colour in it. Hearth's `0.018` is 3× `--surface-sunken`'s `0.006`, and
the groove additionally carries `--shadow-inset`, which no identity fill ever
does. A **grey** Family would have broken ADR 040 retroactively; a quiet warm
stone does not.

---

## Alternatives considered

**Ghost — no colour at all** (the household is "unowned", so paint nothing).
Clean logic, and rejected on two counts. It breaks ADR 040's guarantee above:
once an identity fill can be achromatic, "desaturated ⇒ not an identity" stops
being true and the sunken plane becomes ambiguous. And semantically it inverts
the meaning — a family event isn't _unassigned_, it's assigned to **everyone**.
Absence is the wrong way to say "all of us".

**`--primary` / "today's" terracotta.** Rejected: `--primary` means _now_ and
_active_ (ADR 031). A Family event three weeks out would read as urgent, and the
sidebar's active item would read as a Family thing.

**A seventh member hue (e.g. indigo).** Rejected: at member-hue chroma it reads as
another sibling and competes with the six for attention. The household should sit
_behind_ its members, not beside them.

**A gradient of all current member hues** ("everyone"). Rejected: illegible at
28px, expensive to compute per surface, and unstable — the household's colour
would change whenever a member is added or removed, which is the opposite of
what an identity colour is for.

**Keep `--secondary`, fix the three collisions locally.** Rejected: that's
patching the symptoms of a token with two meanings, and the next surface would
walk into the same wall. (This session already paid that cost once.)

---

## Do not revisit unless

- Household size regularly exceeds six and the palette has to be extended —
  at which point `family` must _stay_ reserved, and only the assignable
  rotation grows.
- The explicit `identityHue` profile field lands (ADR 030's planned evolution).
  It must reject `family` as a member's choice — the reservation is the whole
  point.
- Contrast testing shows Hearth's tint/ink pair failing in either mode.
