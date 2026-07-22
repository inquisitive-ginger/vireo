# Rewards & Wallet — Progress

---

## M4 — Rewards & Wallet · ⬜ Not Started

> **Milestone done when:** A kid completes a chore, watches their F$ balance go up,
> and spends it on something they chose.

| Story                 | Status         | Notes                                                                                                       |
| --------------------- | -------------- | ----------------------------------------------------------------------------------------------------------- |
| Design gate           | ⬜ Not Started | Store surface, wallet widget, redemption confirm moment, punch-card render. **Pricing model is an output.** |
| Ledger + Balance      | ⬜ Not Started | `ledger_entries` (append-only, ADR 047) + `balances` cache; history view; `GET /rewards/wallet`             |
| Chores Earn           | ⬜ Not Started | `coinReward` on `chores.Task`; subscribe `chores.task.completed` / `.reopened` (ADR 048); idempotent        |
| Reward Catalog        | ⬜ Not Started | Tier-4 CRUD; `requiresApproval` per reward; audience, stock, active                                         |
| Redemption Flow       | ⬜ Not Started | Request → debit → parent decide → fulfil; **refund on decline**, not escrow; `notify()` at `alert`          |
| Store + Wallet Widget | ⬜ Not Started | `/rewards` store page + `rewards.wallet` widget; lead with affordability, not the number                    |
| Punch Cards           | ⬜ Not Started | Template / card / punch (ADR 049); auto-payout + reset at goal; **the kid punches their own card**          |
| Parent Bonus Grant    | ⬜ Not Started | Tier-4 "give N F$, reason: …" — makes the ledger's `reason` field earn its keep                             |

> Currency model is **already settled by ADR 002 / ADR 005** and is not reopened:
> XP never converts, F$ is the redeemable wallet, the system is a ledger and never a bank.
> Allowance, cashout, and Monarch stay in **M8 Finance** — this module is built so
> cashout is another **sink**, not a second balance.
