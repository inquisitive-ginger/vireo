# 048 — Earning Is Contributed, Not Owned

**Status:** Decided · **Naming amended by ADR 054**

> **Naming amendment (ADR 054, 2026-07-24).** Every "F$" / "Family Dollars" below is now "Pritchett Bucks" — written "P$" in compact text beside a number, "P-Bucks" in any sentence a person reads or hears, and struck as the P-mark on the coin face. Strings come from one module, packages/ui/src/lib/currency.ts, so a register is chosen by naming an export rather than by typing two characters. The decision recorded here is unchanged — only the name is. See [ADR 054](054-pritchett-bucks.md).

## Decision

The `rewards` plugin **never imports another plugin**. Any plugin can mint F$ by
publishing an event that carries the award; `rewards` subscribes and credits the ledger.

- **The earning plugin owns the _amount_.** `coinReward` sits on the chores `Task`
  next to `xpReward`, because pricing a chore is a parent decision made where the chore
  is set up — not in a mapping table somewhere else.
- **`rewards` owns the _ledger_.** It credits whatever the event carries and knows
  nothing about chores, meals, or anything downstream.
- **Reversal is symmetric.** `chores.task.reopened` debits by the same rule that
  `chores.task.completed` credits.
- **Idempotency travels with the event** — `(source_type, source_id)` per ADR 047, so a
  redelivered event is a no-op rather than a double payday.
- **Adding an earn source is a manifest line plus a handler**, not a schema change.

## Why

- **Chores must not become the owner of the household economy.** It is the first earn
  source, not the only one; an economy welded to one plugin cannot grow a second.
- **The second source already exists and proves it.** A meals cook assignment can carry
  an award (`meals.dinner.fulfilled`) — cooking dinner _is_ a chore, and it is filed
  under a different plugin. If the contract only fits chores, it was a chores hook
  wearing a costume.
- **The bus is already the seam** (ADR 008). Using it here costs nothing and is exactly
  what it is for.
- **Punch-card payouts arrive the same way** (ADR 049), so one contract covers both
  earning mechanics.

## Alternatives considered

- **`rewards` reads chores' tables directly.** Cross-schema coupling the codebase
  otherwise avoids (see the calendar↔platform attendee precedent), and structurally
  impossible for a plugin that ships after `rewards`.
- **An `earn()` API on `@family-os/platform`.** Puts feature policy in the platform
  layer and makes every earner a synchronous dependency of the economy — a failed
  credit would then fail the chore completion.
- **A central earn-rules table in `rewards`** mapping event → amount. Moves pricing away
  from the surface where a parent sets the thing up, so the number becomes invisible at
  the moment it is decided.

## Do not revisit unless

An earn source needs to be priced centrally across plugins (e.g. a household-wide
multiplier), or the bus gains cross-process delivery (ADR 008) and at-least-once
semantics stop being free.
