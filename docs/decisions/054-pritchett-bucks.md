# ADR 054 — The Currency Is Named Pritchett Bucks

**Status** — Decided (2026-07-24, ad-hoc naming session) · **Amends ADR 002 and ADR 051**

## Decision

The in-app kid currency is **Pritchett Bucks**, and it wears a **struck mark** rather
than a placeholder glyph.

**The mark** is a `P` whose stem is crossed by a bar — the standard way a letter becomes
a currency (₽, ₱, ₦, ₴ all do it). It is struck at **0.66 of the coin's face, stroke
2.5**, and it **renders only on the coin**, never as inline ink. One object to recognise,
not two.

**Four registers**, each existing because a medium ruled the others out:

| Register              | Where                                                                 |
| --------------------- | --------------------------------------------------------------------- |
| The struck mark       | the coin face — anywhere a value renders with its coin                |
| **`P$`**              | compact text beside a number: chips, buttons, prose, the ledger       |
| **`P-Bucks`**         | any sentence a person reads or **hears** — push, toasts, `aria-label` |
| **`Pritchett Bucks`** | the wallet hero, settings, first use — where the name is taught once  |

A register is chosen by **naming one** — `CURRENCY.code` / `CURRENCY.short` /
`CURRENCY.name` in `packages/ui/src/lib/currency.ts` — never by typing two characters,
which is how a symbol leaks into a sentence it does not belong in.

**A coin beside a value means the text is the amount alone.** `[◉] 10`, not `[◉] 10 P$`
— the coin already states the unit, and the chore row is the tightest surface in the app.
**A value inside a SENTENCE is the exception**, because a sentence has to name what it is
counting: the held chip reads `[◉] 10 P$ when Mom or Dad checks`, and the declined chip —
the one with no coin beside it — reads `No P$ this time`.

Every such chip is written **twice**: once in the code, once spoken. A screen reader
handed `P$` says "P dollar sign", and gets nothing at all from a decorative coin, so
`CoinValue` and `KidPayoutBadge` each pair an `aria-hidden` rendering with an `sr-only`
one built from `CURRENCY.short`.

## Why

- **Nobody had seen "F$" yet.** Every currency surface sits behind `REWARDS_UI_ENABLED`,
  off in prod, and the ledger is dormant because nothing sets `coinReward > 0`. The
  rename cost **zero re-learning**, and this was the last moment that would be true —
  M4/4 (catalog) and M4/5 (store + wallet) triple the copy surface.
- **The `Coins` glyph was always a placeholder.** ADR 051 rejected it at 72px as "a coin
  depicting coins" and kept it only because there was nothing else to strike. A currency
  mark is what a coin face is _for_, so this **retires a placeholder rather than
  overturning ADR 051**.
- **The mark's weight is set by where its counters close.** The bowl's arms run y=4→12
  and the bar crosses at y=8, so each counter is **(4 − stroke)** units tall. Struck at
  0.66 on a **16px coin every weight closes**, stroke 2 included — on a chore row the mark
  is a **silhouette, not a letter**, which is what a struck coin looks like from across a
  kitchen. So weight costs nothing at the sizes that ship most and is decided at 26px and
  up, where **2.5 is the heaviest that still holds an open counter at 44px**.
- **The mark needs no centring transform.** The bar caps at x=5 and `a4 4 0 0 1 0 8` from
  (14,4) is a **semicircle bulging right**, reaching x=18 — extents 5→19, centre exactly 12. Read as ending at x=14 it looks 2 units off-centre, and "correcting" it is what
  actually knocks it off.

## Alternatives considered

- **`[◉] 10 P$` everywhere — the literal `F$` swap.** Smallest diff; states the unit twice
  (once struck, once typed) and keeps the widest chip on the tightest row.
- **An inline ink mark for prose and buttons.** Rejected in favour of `P$` there: one
  fewer thing to place, and the mark stays single-purpose.
- **`Pucks` / `P-money` as the spoken form.** "Pucks" is a hockey puck to anyone who has
  not been told, including a screen reader; "money" is the one word ADR 002 works to keep
  XP away from. Both survive as house slang.
- **Renaming the tokens, components and columns** (`--coin-*`, `CoinValue`, `coinReward`).
  They name the **object**, not the currency. The token rename alone means editing three
  theme blocks — the ADR 041 trap that has already shipped a half-renamed palette once —
  and the column rename costs a migration plus Prisma regenerate churn for no visible gain.

## Note on the household name

"Pritchett" hardcodes a surname into a platform whose vision extends to _"any family that
wants to run it"_. The mitigation is not a settings UI — it is that every string lives in
**one file**, so a rename is a one-line change and the multi-family version is a config
read rather than a refactor.

## Do not revisit unless

The platform ships to a household that is not the Pritchetts, or XP becomes spendable
(which ADR 002 forbids).
