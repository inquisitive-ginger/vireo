# 005 — Allowance System as Ledger, Not Bank

**Status:** Decided

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
