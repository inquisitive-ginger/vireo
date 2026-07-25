# 047 — The F$ Ledger Is Append-Only; Balance Is Derived

**Status:** Decided · **Naming amended by ADR 054**

> **Naming amendment (ADR 054, 2026-07-24).** Every "F$" / "Family Dollars" below is now "Pritchett Bucks" — written "P$" in compact text beside a number, "P-Bucks" in any sentence a person reads or hears, and struck as the P-mark on the coin face. Strings come from one module, packages/ui/src/lib/currency.ts, so a register is chosen by naming an export rather than by typing two characters. The decision recorded here is unchanged — only the name is. See [ADR 054](054-pritchett-bucks.md).

## Decision

Every F$ movement is an **immutable row** in `rewards.ledger_entries`. A balance is a
**derived cache**, never the source of truth.

- **Entries are never edited or deleted.** A correction is a **compensating entry**
  with its own reason. A declined redemption is refunded by a `+cost` entry, not by
  deleting the debit.
- **Every entry carries a reason and a provenance** — `(source_type, source_id)`.
  That pair is **unique**, which is the idempotency claim: a replayed
  `chores.task.completed` cannot credit twice. (Same stance as the already-shipped
  idempotent XP subscriber.)
- **`rewards.balances` is a cache** — `profile_id → balance`, recomputable from the
  entries at any time. It exists so a widget doesn't sum a growing table on every
  render, not because it is authoritative.
- **Cost is snapshotted onto a redemption.** A parent repricing a reward must not move
  what a pending redemption already committed.

## Why

- **A balance a kid cannot explain is a balance a kid will argue with.** The history
  _is_ the feature — "where did my 12 F$ go" has to have an answer that isn't "trust
  the number." This is the difference between a wallet and a score.
- **`chores.xp_balances` is the wrong precedent to copy.** A bare mutable total is fine
  for a number that only ever goes _up_ — there is nothing to dispute. F$ goes down, and
  the moment it does, the total alone is insufficient.
- **Refund-on-decline needs a reversal entry regardless** (see ADR 002's approval path),
  so the append-only shape is not extra work — it is the shape the flow already requires.
- **Idempotency has to live somewhere.** The provenance pair puts it in the schema as a
  constraint rather than in a handler as a convention.

## Alternatives considered

- **Mutable balance column only** (mirroring `chores.xp_balances`). No audit trail, no
  dispute resolution, no way to answer the most-asked question in the whole feature.
  Cheaper to write and immediately regretted.
- **Event-sourced with no local table** — replay the bus to compute a balance. ADR 008's
  bus is in-process and not durable storage; a restart would lose the household's money.

## Do not revisit unless

Ledger volume becomes a real performance problem at family scale (it will not — a
family generates single-digit entries per day), or F$ gains a second denomination that
makes a single integer delta insufficient.
