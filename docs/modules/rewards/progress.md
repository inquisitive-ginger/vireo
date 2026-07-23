# Rewards & Wallet — Progress

---

## M4 — Rewards & Wallet · 🔄 In Progress

> **Milestone done when:** A kid completes a chore, watches their F$ balance go up,
> and spends it on something they chose.

| Story                 | Status         | Notes                                                                                                                                                                                                                                                                                                                                                                   |
| --------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Design gate           | ✅ Done        | ADRs 051–053. Pricing settled (~10 F$/week); F$ takes the coin, XP demotes to a star; store/wallet/punch targets provisional. See `logs/2026-07-22-design-rewards-wallet.md`                                                                                                                                                                                            |
| Ledger + Balance      | ✅ Done        | `ledger_entries` (append-only, ADR 047) + `balances` cache; `GET /rewards/wallet`. Overdrafts permitted — affordability is a spend-site check. See `logs/2026-07-22-dev-rewards-ledger-balance.md`                                                                                                                                                                      |
| Chores Earn           | ✅ Done        | `coinReward` on `chores.Task` (default **0**); `rewards` subscribes credit/debit (ADR 048), idempotent on the completion instance `taskId@completedAt`. XP re-struck to a quiet star (ADR 051); brass `Coin`/`CoinValue` in `@family-os/ui`. **F$ surfaces behind `REWARDS_UI_ENABLED` (off in prod until M4/5).** See `logs/2026-07-23-dev-chores-earn-xp-restrike.md` |
| Payout Approval       | ⬜ Not Started | Hold the **payout**, not the chore — per-chore `requiresApproval`, `pending_payouts` released as the normal entry. **Before Store + Wallet.** Raised in M4/2                                                                                                                                                                                                            |
| Reward Catalog        | ⬜ Not Started | Tier-4 CRUD; `requiresApproval` per reward; audience, stock, active                                                                                                                                                                                                                                                                                                     |
| Redemption Flow       | ⬜ Not Started | Request → debit → parent decide → fulfil; **refund on decline**, not escrow; `notify()` at `alert`                                                                                                                                                                                                                                                                      |
| Store + Wallet Widget | ⬜ Not Started | `/rewards` store page + `rewards.wallet` widget; lead with affordability, not the number                                                                                                                                                                                                                                                                                |
| Punch Cards           | ⬜ Not Started | Template / card / punch (ADR 049); auto-payout + reset at goal; **the kid punches their own card**                                                                                                                                                                                                                                                                      |
| Parent Bonus Grant    | ⬜ Not Started | Tier-4 "give N F$, reason: …" — makes the ledger's `reason` field earn its keep                                                                                                                                                                                                                                                                                         |

> Currency model is **already settled by ADR 002 / ADR 005** and is not reopened:
> XP never converts, F$ is the redeemable wallet, the system is a ledger and never a bank.
> Allowance, cashout, and Monarch stay in **M8 Finance** — this module is built so
> cashout is another **sink**, not a second balance.
