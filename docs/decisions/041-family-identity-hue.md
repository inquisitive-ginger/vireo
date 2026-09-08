# ADR 041 — The Family Identity Hue

**Status:** Decided (2026-07-11)
**Amends:** [030](030-member-identity-colors.md) (a seventh, reserved entry),
[040](040-sunken-surface-plane.md) (walks through the door it left open), and
[031](031-interaction-state-language.md) (`--secondary` back to chrome)

## Decision

The household gets **its own identity entry**: a reserved seventh hue the palette owns but
never assigns.

| Token                    | Light                  | Dark                    |
| ------------------------ | ---------------------- | ----------------------- |
| `--identity-family`      | `oklch(0.55 0.022 65)` | `oklch(0.72 0.022 68)`  |
| `--identity-family-tint` | `oklch(0.90 0.018 70)` | `oklch(0.285 0.014 65)` |
| `--identity-family-ink`  | `oklch(0.36 0.020 62)` | `oklch(0.90 0.018 70)`  |

**Hearth** — a warm stone, in the same three layers as every member hue (ADR 030), through
the same `identityToken(hue, layer)` path. Two rules make it work:

- **Reserved, never assigned.** `IDENTITY_HUES`, the rotation the name hash draws from,
  excludes `family`, so `getIdentityHue()` can never hand the household's colour to a person.
  The wider `OwnerHue` (`IdentityHue | 'family'`) is what surfaces accept.
- **A no-owner event resolves to the household, not to nothing.** `huesForEvent([])` returns
  `[FAMILY_HUE]`, so every downstream surface takes **one path** and the "no owner" branch
  that special-cased `--secondary` is gone.

The household pseudo-profile passes `identity={FAMILY_HUE}` to `ProfileAvatar` (sidebar chip,
profile grid, mobile top bar); without it the family's _name_ hashes into a member's hue —
the household in a sibling's colour.

**`--secondary` goes back to one meaning: structural chrome** — a hover/rest surface (ADR
031), not a fill that says anything.

## Why

**One token carried two meanings, and they collided.** `--secondary` was both neutral chrome
_and_ the Family fill, with nothing enforcing the difference — so the two met three times in
one design session:

- The hero's identity dot was `--secondary` **on a `--secondary` Family wash** — invisible,
  but still indenting the eyebrow by 14px. A bug findable only by measuring, because the
  thing you were looking for wasn't there.
- The hero's Family owner pill dissolved into that same wash, for the same reason.
- The multi-day band needed a recessed neutral, and the obvious neutral was already spoken
  for — forcing ADR 040's `--surface-sunken`.

Three symptoms, one cause. ADR 040 treated the third and
[left the door open](040-sunken-surface-plane.md#alternatives-considered); this walks through
it.

**Colour = person is the rule worth protecting** (ADR 030). "Family" is not a person, so it
must not wear a person's hue: if the household were teal, teal would mean two things — the
same bug, relocated. A reserved seventh entry keeps the invariant while giving the household
a place of its own rather than a borrowed one.

**Why warm stone, and why that chroma.** The family is the ground the members stand on, not a
seventh sibling: Hearth is _stone_ — warm, quiet, clearly desaturated next to the six.

The values were **corrected during live review**, and the mistake is easy to repeat. Hearth
first shipped at `0.035` chroma, justified against the members' **base** layer
(`0.09`–`0.13`), where it looks comfortably recessive. But fills use the **tint**, where the
six run `0.035`–`0.05`. At `0.038` Hearth's tint was a _peer_ of terracotta's `0.04`, only
25° away: the Family hero and a terracotta member's fill were the same pale peach — this
ADR's own violation, relocated. So compare the layer that renders. Hearth's tint is `0.018`,
roughly **half** the least-saturated member tint, which makes it read as material, not as a
person.

**Chroma had no room, so lightness does the other job.** Hearth must also not read as
`--secondary` (chrome), and there is no useful gap between chrome's `0.022` and the members'
`0.035`. So it separates from chrome on **lightness**: `0.90` against `0.93` (light), `0.285`
against `0.22` (dark). Two axes, two neighbours.

**It must stay chromatic.** ADR 040's guarantee — a desaturated plane can never be mistaken
for an identity fill — holds only while every identity fill has colour in it. Hearth's
`0.018` is 3× `--surface-sunken`'s `0.006`, and the groove also carries `--shadow-inset`,
which no identity fill does. A **grey** Family would have broken ADR 040 retroactively.

## Alternatives considered

**Ghost — no colour at all** (the household is "unowned", so paint nothing). Clean logic,
rejected twice over: once an identity fill can be achromatic, "desaturated ⇒ not an identity"
stops being true and the sunken plane becomes ambiguous; and it inverts the meaning — a family
event isn't _unassigned_, it is assigned to **everyone**.

**`--primary` / "today's" terracotta.** `--primary` means _now_ and _active_ (ADR 031): a
Family event three weeks out would read as urgent, the sidebar's active item as a Family thing.

**A seventh member hue (e.g. indigo).** At member-hue chroma it reads as another sibling
competing with the six. The household should sit _behind_ its members.

**A gradient of all member hues** ("everyone"). Illegible at 28px, expensive per surface, and
unstable — the household's colour would change whenever a member is added or removed, the
opposite of what an identity colour does.

**Keep `--secondary`, fix the three collisions locally.** Patching the symptoms of a token
with two meanings; the next surface walks into the same wall.

## Do not revisit unless

- Household size exceeds six and the palette must extend — `family` still stays reserved and
  only the assignable rotation grows.
- The explicit `identityHue` profile field lands (ADR 030's planned evolution); it must reject
  `family` as a member's choice, which is the whole point of the reservation.
- Contrast testing shows Hearth's tint/ink pair failing in either mode.
