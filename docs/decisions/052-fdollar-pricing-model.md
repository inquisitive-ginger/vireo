# 052 — The Economy Is Priced From a Weekly Earn Rate

**Status:** Decided · **Naming amended by ADR 054**

> **Naming amendment (ADR 054, 2026-07-24).** Every "F$" / "Family Dollars" below is now "Pritchett Bucks" — written "P$" in compact text beside a number, "P-Bucks" in any sentence a person reads or hears, and struck as the P-mark on the coin face. Strings come from one module, packages/ui/src/lib/currency.ts, so a register is chosen by naming an export rather than by typing two characters. The decision recorded here is unchanged — only the name is. See [ADR 054](054-pritchett-bucks.md).

## Decision

**A normal week earns about 10 F$.** Every other number is derived from that one.

- **Chores opt IN to paying.** `coinReward` defaults to **0**; a parent ticks the chores
  that pay when they set them up (ADR 048 — the earner owns the amount). XP is
  unchanged and still lands on every chore.
- **The chore ladder:** routine (bed, plate in the sink) **0** · weekly effort
  (dishwasher, recycling) **2** · real effort (mow, bathroom) **5** · big or unpleasant
  **10**. Two to four paying chores a week is the target shape.
- **The catalog ladder:** impulse **5** · small **10** (≈1 week) · choice **15** ·
  outing **25** · big **40** (≈1 month).
- **Balances stay in tens.** No denominations, no cents, no thousands. A kid must be
  able to do the subtraction in their head at the moment of spending.
- **No real-money exchange rate is defined.** F$ buys catalog rewards and nothing else.
  M8 may set a cash rate later; nothing in M4 assumes one.

## Why

- **The economy dies in both directions.** Unaffordable is demoralising; instantly
  affordable is worthless. Anchoring the small reward at one week and the big one at one
  month is what keeps the middle honest.
- **Paying for routine participation is the wrong lesson** and inflates the currency
  with the chore list — add ten small chores and the weekly earn doubles without anyone
  deciding it should.
- **Pricing is decided where the chore is set up**, so the number is visible at the
  moment it is chosen rather than buried in a mapping table.
- **Repricing after launch is a household event, not a config change.** A kid who saved
  30 F$ under one scale is silently re-based under another, so the scale is chosen once,
  before the first kid sees it.

## Alternatives considered

- **Derive coins from XP** (`coinReward = xpReward / 5`). Zero setup; makes every
  routine task transactional and moves the weekly earn whenever the chore list moves.
- **Flat 1 F$ per chore.** Simplest rule; loses the ability to make a hard job worth
  more than an easy one.
- **A hundreds scale** matching XP. Familiar from games, and balances reach four digits
  within a term, at which point the number stops meaning anything to a six-year-old.

## Do not revisit unless

The family has run the economy for a full term and the rate is wrong in practice — in
which case reprice **openly**, with the change announced to the kids, never as a silent
re-basing. Or M8 sets a cash rate, which prices F$ against real money for the first time.
