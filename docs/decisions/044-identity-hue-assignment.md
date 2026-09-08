# ADR 044 — A colour is assigned, not derived; and it is not the only channel

**Status:** Decided (2026-07-12) · **Amends:** ADR 030

## Decision

1. **A member's hue is ASSIGNED and PERSISTED** (`Profile.identityHue`, `UNIQUE`) from a
   curated palette; `getIdentityHue(name)` survives **only as a fallback**.
2. **The palette grows from six to eight** — `moss` (117°) and `indigo` (268°) join the six,
   unchanged. The **tint layer is rebuilt**; it was broken.
3. **Colour is the PRIMARY identity channel, not the ONLY one.** Any surface where a hue
   alone separates two people **owes a second channel**; the month chip now carries its
   owner's initial — amending the premise ADR 030 rests on.

## Why

**The hue could not stay derived from the name.** ADR 043 had just put it on **every row
spine**, member groups adjacent. Hashing produced two live bugs:

- **Collisions.** `"Zach"` and `"Emma"` hashed to one bucket, pointing the mapping at **two
  people at once** — the one thing this colour language cannot survive. A bigger palette is
  no fix: at eight they still collide; more buckets only makes it rarer.
- **A rename re-coloured someone.** `"Teddy"` is terracotta, `"Ted"` sage; shortening a
  nickname repainted a person across every surface.

**Uniqueness caps household size.** `IDENTITY_HUES.length` becomes the member limit, and six
was not enough: ADR 042 already assumed ~8.

**The trilemma.** Red (~335°–30°) belongs to `--error` and ADR 030
forbids an identity hue there, leaving ~305° of arc. Inside it you may have any **two** of:
eight colours; each **nameable** ("Zach is the teal one"); all separable to a red-green
colour-blind viewer (~1 in 12 men). Measured — oklab ΔE under CVD simulation, on **both** the
spine and the fill layer, across three palettes rendered in real components.
**A** keeps six: passes everything, caps the family forever. **B** adds moss and indigo in
the app's voice: two pairs collide for a deuteranope. **C** engineers eight: the only one
passing everything, but terracotta becomes dark brown and plum a pale lilac.

**We chose B.** C wins on the numbers, which is why it is wrong: separability bought with a
**lightness ladder** makes the palette worse for everyone, including the eleven in twelve
who could already see it — and terracotta is the brand hue. **B fails honestly, and the fix
was never a better hue but to stop asking colour to work alone.** Hence point 3.

**The fill layer was already broken, before any of this.** The month grid paints chips
through `identityToken(hue, 'tint')`, which flattened **every** hue to L≈0.92 / C≈0.04. On
the flagship distance-reading surface the closest pair sat **0.025 ΔEok** at normal vision
and **0.013** for a deuteranope — the same pill. Unrelated to the palette: two more hues on
a broken layer only makes it busier. The tint now **inherits the base's
lightness order and carries real chroma** — closest pair **0.046**, both themes.

> **Judge a colour on the layer that renders it** (ADR 041's lesson, biting twice). Hues are
> quoted at `base`. The month grid paints at `tint`.

## Consequences

- **The month chip stops being _"a coloured pill and nothing else"_.** A household event has
  worn a `Users` glyph all along; only a _person's_ event lacked a second channel — the case
  where telling two people apart is the whole job. One letter buys eight honest hues for the
  1 in 12.
- **The initial is `aria-hidden`**, so the owner's **name** went into the chip's accessible
  text — a screen reader previously got no owner.
- **`resolveHue(name, assigned)` is the one place** a hue is resolved: assigned wins, hash is
  the fallback. Never re-derive from a name when the profile is in hand.
- **The hue travels with the data** — `assigneeHue`, `author.identityHue`, `/auth/me`, on
  ADR 042's `avatarUrl` plumbing.
- **`IDENTITY_HUES` lives in `@family-os/schemas`**, the only leaf the allocating API and the
  painting UI both import. Copies drift, and a hue the API hands out but the UI cannot paint
  is a member with no colour.
- **Assigned on creation, never demanded before it.** Onboarding assigns the next free hue
  and _shows_ it; tapping the dot changes it — nobody is blocked on a colour decision.
- **The ninth member is refused, not fudged.** `nextFreeHue` returns `null` on a full palette
  and callers must **say so**; a duplicate is worse than none.
- **`platform.profile.color` is update-own at every tier**, manage-all at tier 4 (ADR 042's
  argument). **A capability with no surface is not a capability.**
- **Hearth stays reserved** (ADR 041) and out of `IDENTITY_HUES`: never assigned, costing no
  member hue. `identity_hue` is nullable so the `family` row holds none.
- **The name hash is palette-length-dependent**: six→eight moved every bucket. Assigned
  profiles are backfilled, but no test may pin `getIdentityHue(name)`.
- **Backfill moves nobody unless it must.** It replays the old hash, honours it where free,
  and moves only a collision's loser — onto `moss`/`indigo` **first**, hues nobody can
  already wear, so displacement never cascades.

## Alternatives considered

- **Palettes A and C** — rejected in the trilemma above.
- **A pure ΔE optimiser** returned **five blues**: numerically excellent, humanly useless.
  **Distinguishable ≠ nameable** — "Zach is the teal one" needs different _kinds_ of colour,
  not different measurements. Hence curated, then _checked_.
- **A free colour picker** — the fixed palette keeps a household off neon green and off two
  near-identical greys.

## Do not revisit unless

- Colour stops saying _who_, **or**
- A surface appears where a hue is the sole discriminator and **cannot** take a second
  channel — the trilemma bites again and palette C returns, **or**
- The household must exceed **eight**. Then the palette grows, and every new hue is checked
  **at `tint`, under CVD simulation, in both themes** — never eyeballed at `base`.
