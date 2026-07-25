# 005 — Allowance System as Ledger, Not Bank

**Status:** Decided · **Naming amended by ADR 054**

> **Naming amendment (ADR 054, 2026-07-24).** Every "F$" / "Family Dollars" below is now "Pritchett Bucks" — written "P$" in compact text beside a number, "P-Bucks" in any sentence a person reads or hears, and struck as the P-mark on the coin face. Strings come from one module, packages/ui/src/lib/currency.ts, so a register is chosen by naming an export rather than by typing two characters. The decision recorded here is unchanged — only the name is. See [ADR 054](054-pritchett-bucks.md).

**Decision:** The system tracks F$ balances and calculates real-money
owed but never moves real money itself. Cashout is a parent-confirmed
event; actual transfer happens outside the system (cash, Venmo,
Greenlight, etc.). Monarch logs it as a budget line item.

**Why:** Avoids regulatory complexity and trust issues of touching real
money. Keeps the system as a ledger + nudge. Optional Greenlight
integration can automate transfer for families that want it without
it being required.

**Alternatives considered:** Automated real-money movement (high
complexity, regulatory risk); virtual-only with no real-money path
(misses the financial education layer).

**Do not revisit unless:** A fintech integration makes real-money
automation trivially safe and low-friction.
