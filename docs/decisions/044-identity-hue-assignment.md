# ADR 044 — A colour is assigned, not derived; and it is not the only channel

**Status:** Decided (2026-07-12)
**Amends:** ADR 030 (member identity colours)
**Relates to:** ADR 040 (the chromatic guarantee), ADR 041 (the reserved family hue),
ADR 042 (the avatar is a face), ADR 043 (identity takes the edge)

---

## Decision

Three things, and the third is the one that matters.

1. **A member's hue is ASSIGNED and PERSISTED** (`Profile.identityHue`, `UNIQUE`), chosen
   from a curated palette. `getIdentityHue(name)` survives **only as a fallback** for a
   profile that has not been assigned one.
2. **The palette grows from six hues to eight** — `moss` (117°) and `indigo` (268°) join
   the original six, which are **unchanged**. The **tint layer is rebuilt**; it was broken.
3. **Colour is the PRIMARY identity channel, not the ONLY one.** Any surface where a hue
   is the only thing distinguishing two people **owes a second channel**. The calendar
   month chip now carries its owner's initial.

Point 3 amends the premise ADR 030 rests on, and it is the whole reason this ADR is
interesting.

---

## Why

### The hue could not stay derived from the name

`getIdentityHue` hashed a name into the palette. Two live bugs followed, and ADR 043 had
just raised the stakes by putting the hue on **every row spine**, with member groups
stacked adjacently.

- **It collided.** `"Zach"` and `"Emma"` hashed to the same bucket. A shared hue does not
  _degrade_ "colour = person" — it points the mapping **at two people at once**, which is
  the one thing this colour language cannot survive. (Note the collision is **not** fixed
  by a bigger palette: at eight hues they _still_ collide. More buckets makes a collision
  rarer, never impossible. Only assignment makes the rule true.)
- **A rename silently re-coloured someone.** `"Teddy"` is terracotta and `"Ted"` is sage,
  so shortening a nickname repainted a person across the calendar, the feed and the board.

### Uniqueness makes the palette a cap on household size

The moment hues are unique, `IDENTITY_HUES.length` **is the maximum number of members**.
Six was not enough — ADR 042 already assumed ~8 — so the palette had to grow. That turned
a decorative question into a structural one.

### The trilemma (the actual finding)

Red (~335°–30°) is permanently unusable: it belongs to `--error`, and ADR 030 forbids an
identity hue there. That leaves ~305° of arc. Inside it, you can have any **two** of:

- **eight colours**,
- **each nameable as a different colour** ("Zach is the teal one"),
- **all separable to a red-green colour-blind viewer** (~1 in 12 men).

This was measured, not asserted — oklab ΔE through deuteranopia/protanopia/tritanopia
simulations, on **both** the spine and the fill layer.

Three palettes were rendered against real components with a vision switch, and gated:

|                                 | gets                                                       | gives up                                               |
| ------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------ |
| **A** keep six                  | nobody's colour moves; passes every vision model           | the family caps at **six**, forever                    |
| **B** eight, in the app's voice | the six unchanged + moss/indigo; still looks like this app | two pairs collide for a deuteranope                    |
| **C** eight, engineered         | passes **everything** — the only one that does             | terracotta becomes a **dark brown**, plum a pale lilac |

**We chose B.** C is the one that wins on the numbers, and that is exactly why it is
wrong: it buys separability with a **lightness ladder**, fixing colour-blindness by making
the palette worse for _everyone_, including the eleven-in-twelve who could already see it
— and terracotta is the app's primary brand hue.

**B fails honestly. The fix for its failure was never a better hue — it was to stop asking
colour to work alone.** Hence point 3.

### The fill layer was already broken — before any of this

The month grid renders its chips through `fillForHues` → `identityToken(hue, 'tint')`, and
the tint layer flattened **every** hue to L≈0.92 / C≈0.04. On the app's flagship
"colour does all the work at a distance" surface, the closest pair sat **0.025 ΔEok apart
at normal vision** and **0.013 for a deuteranope** — the same pill.

This was live, and it had nothing to do with growing the palette. Adding two hues without
touching it would only have made a broken surface busier. The tint layer now **inherits the
base's lightness order and carries real chroma**: closest fill pair **0.046** at normal
vision, in both themes.

> **Judge a colour on the layer that renders it** (ADR 041's lesson, and this is the second
> time it has bitten). Hues get quoted at `base`. The month grid paints at `tint`.

---

## The second channel

The chip stops being _"a coloured pill and nothing else"_ — it carries the owner's initial.

Two details worth keeping:

- **The family case already had one.** A household event has worn a `Users` glyph all
  along. It was only a _person's_ event that had no fallback — the exact case where
  telling two people apart is the entire job.
- **It is one letter in one component.** That is the whole cost of making an eight-hue
  palette honest for the 1 in 12. The initial is `aria-hidden` (it is a visual shorthand
  for the hue), so the owner's **name** went into the chip's accessible text — a screen
  reader previously got no owner at all.

---

## Consequences

- **`resolveHue(name, assigned)` is the one place** a caller resolves "which hue is this
  person". Assigned wins; the hash is the fallback. Never re-derive a hue from a name when
  the profile is in hand.
- **The hue travels with the data.** Every payload carrying a person carries their hue
  (`assigneeHue`, `author.identityHue`, `CalendarMember.identityHue`, `/auth/me`) — the
  same shape as ADR 042's `avatarUrl` plumbing.
- **`IDENTITY_HUES` moved to `@family-os/schemas`.** The API allocates and validates hues;
  the UI paints them; it is the only leaf package both can import. Two copies of this list
  would drift, and a hue the API can hand out but the UI cannot paint is a member with no
  colour.
- **A colour is assigned on creation, never demanded before it.** Onboarding auto-assigns
  the next free hue and _shows_ it; tapping the dot changes it. Nobody is blocked from
  setting up their house on a colour decision.
- **The ninth member is refused, not fudged.** `nextFreeHue` returns `null` on a full
  palette and callers must **say so**. Handing out a duplicate would be worse than handing
  out nothing.
- **`platform.profile.color` is update-own for every tier**, manage-all for tier 4 — the
  same argument as ADR 042's `profile.avatar`: choosing your own colour is not
  administration. **A capability with no surface is not a capability** (see below).
- **Hearth stays reserved** (ADR 041) and is excluded from `IDENTITY_HUES`, so it can never
  be assigned and consumes no member hue. `identity_hue` is nullable precisely so the
  `family` row holds none.
- **The name hash is now palette-length-dependent.** Growing from six to eight moved every
  bucket. Assigned profiles are unaffected (the migration backfills them), but no test may
  pin an expectation to `getIdentityHue(name)`.

### Backfill: nobody's colour moves unless it has to

Every existing profile is already _wearing_ a hue. The migration reproduces the old
six-hue hash, honours it where free, and moves only the loser of a collision — who lands
on `moss`/`indigo` **first**, since nobody can already be wearing those, so a displacement
can never cascade into stealing someone else's colour.

---

## Alternatives considered

- **Palette C (the engineered eight).** Rejected: see above. It is the correct answer to
  the wrong question — _"which palette maximises separation?"_ rather than _"which palette
  can a family live with?"_
- **A pure ΔE optimiser.** Run, and it returned **five blues**: numerically excellent,
  humanly useless. **Distinguishable ≠ nameable.** A family needs _"Zach is the teal one"_,
  which requires colours that are different _kinds_ of colour, not different measurements.
  This is why the palette is curated and then _checked_, never solved.
- **A free colour picker.** Rejected outright: the fixed palette is precisely what keeps a
  household off neon green and off two near-identical greys.
- **Capping the family at six** (palette A). Rejected — ADR 042 already assumed ~8, and a
  colour palette should not be what decides how many children you may have.

---

## Do not revisit unless

- The identity system stops being load-bearing (colour no longer says _who_), **or**
- A surface appears where a hue is the sole discriminator and **cannot** take a second
  channel — in which case the trilemma bites again and palette C returns to the table, **or**
- The household needs to exceed **eight** members. Then the palette must grow again, and
  every new hue must be checked **at the `tint` layer, under CVD simulation, in both
  themes** — not eyeballed at `base`.
