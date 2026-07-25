# 053 — A Balance Belongs to a Person

**Status:** Decided · **Naming amended by ADR 054**

> **Naming amendment (ADR 054, 2026-07-24).** Every "F$" / "Family Dollars" below is now "Pritchett Bucks" — written "P$" in compact text beside a number, "P-Bucks" in any sentence a person reads or hears, and struck as the P-mark on the coin face. Strings come from one module, packages/ui/src/lib/currency.ts, so a register is chosen by naming an export rather than by typing two characters. The decision recorded here is unchanged — only the name is. See [ADR 054](054-pritchett-bucks.md).

## Decision

**Only a person holds F$.**

- **The `family` pseudo-profile never holds a balance.** No `ledger_entries` row may
  carry `profile_id = 'family'` (enforced in the route, not just by convention), and the
  family home layout carries no wallet widget.
- **Tier 1 holds a wallet.** The youngest kid reaches their own balance, the store, and
  their own punch card. `design-system.md`'s tier table previously read _"tier 1 — no
  financial data"_; that is **amended** to mean the **M8 real-money surfaces**
  (allowance, cashout, Monarch), which stay tier 4.
- **A balance is visible to its owner and to tier 4, and to nobody else.** F$ is not a
  leaderboard.

## Why

- **A balance with no owner is what forks the economy.** M4's binding constraint is that
  M8's cashout is another **sink** on the same balance (ADR 005). A household pot is a
  second balance by another name, and it arrives before there is any rule for who may
  spend from it.
- **The fridge tablet sits on the default profile.** A household balance would put
  spendable money on the one surface anyone walking past can operate, unattended.
- **Tier 1 is who the module is for.** Chores have minted XP for a tier-1 kid since M2;
  the whole point of M4 is giving that loop its second half. Granting the capability and
  withholding the surface is ADR 044's failure repeated — _a capability with no surface
  is not a capability_.
- **The tier table's original wording predates any in-app currency.** "Financial data"
  meant the household's money — budgets, real balances — which is exactly what M8 holds
  and M4 does not.

## Alternatives considered

- **A household pot for shared goals** ("we're saving for pizza night"). A real feature
  and a good one — but it needs its own rules for who may spend and who may veto, and
  nothing in M4 has them. It can be added later as a **goal** that people contribute to,
  which is a sink, not a balance.
- **Tier 1 sees the store but no balance.** Keeps the old table intact and turns every
  "you can't afford that" into a refusal the kid had no way to see coming.
- **Move the module to tier 2+.** Honours the table exactly and excludes the child the
  milestone exists for.

## Do not revisit unless

A household-level goal is designed with an explicit spend rule, or M8's cashout requires
a staging balance that cannot be modelled as a sink.
