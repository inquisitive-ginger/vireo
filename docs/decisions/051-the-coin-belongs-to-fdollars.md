# 051 — The Coin Belongs to the Currency That Buys Things

**Status:** Decided · **Amended by ADR 054**

> **Amendment (ADR 054, 2026-07-24).** The currency is **Pritchett Bucks**, and the coin's
> face now bears the **struck P-mark** at 0.66 of the face, stroke 2.5 — not the lucide
> `Coins` glyph named below, which was a placeholder kept only because there was nothing
> else to strike. Everything else here stands: the currency owns gold and the disc, XP is
> a quiet star, and separation from a member's hue rests on **form**.

## Decision

**F$ owns gold, the coin disc, and the `Coins` glyph. XP gives them up.**

- **XP demotes to a quiet star** — a `Star` glyph and the value in
  `--muted-foreground`, keeping its pill shape and losing its metal. A score is a fact
  about you, not a thing you hold.
- **The coin's gold moves off `--identity-marigold`.** Marigold is `oklch(0.71 0.12 78)`
  and the old XP gold was `oklch(0.74 0.13 80)` — the same colour with two jobs. The
  coin is now brass: `hi 0.95/0.09/96 · base 0.79/0.155/90 · deep 0.55/0.125/74 ·
tint 0.96/0.05/95 · ink 0.44/0.105/78`.
- **The coin is ONE disc.** A masked conic sweep paints the outer ~9% as a rim, a
  specular gradient crosses the face, and a raised inner ring sits inside the rim.
  Never a smaller disc nested in a ring — the pale step between them reads as a
  **washer**. Never radial notches — milling reads as a **gear**, and a gear is
  machinery, not money.
- **Separation from a member's hue rests on form, not colour** (ADR 044's second
  channel). A spine is a flat 4px bar and can never be struck metal.
- **The M2 XP surfaces are re-struck as part of M4/3** — `ScorePlate`, `XpPill`,
  `FlightChip`, `FocusView`, `CreateTaskDrawer`. Gold constants move out of
  `plugins/chores/src/lib/gold.ts` and into the shared token set as the currency mark.

## Why

- **The score looked like money and the money had nothing left to wear.** Gold, the
  disc and the coin glyph were assigned to XP in M2, when nothing was spendable and
  the conflict could not appear. F$ arrives second and is the currency that actually
  buys things.
- **The bill only grows.** Every new surface that renders XP makes the swap more
  expensive; M4 is the cheapest this will ever be.
- **There is no ninth hue to give F$ instead.** The identity palette occupies
  35/78/117/148/188/235/268/330 and red is reserved for `--error`. A currency cannot
  take a colour without taking it from a person.
- **The hierarchy inverts correctly when rendered.** XP is the bigger number (1,240 vs 24) and gold puts the smaller one on top — which is the true reading, since the small
  number is the one that can be spent.

## Alternatives considered

- **Two metals — XP gold, F$ silver.** No M2 rework, and the currency that matters
  looks like the cheaper metal.
- **F$ as a note / wallet chip, XP keeps the coin.** Costs nothing today and leaves the
  score permanently dressed as money. Rendered, gated, and rejected.
- **Retire marigold from the identity palette.** ADR 044 paid for the eighth hue and it
  is the hard cap on household size; spending it on a currency is the wrong trade.

## Do not revisit unless

XP becomes spendable (which ADR 002 forbids), or the identity palette changes such that
brass collides with a member hue again.
