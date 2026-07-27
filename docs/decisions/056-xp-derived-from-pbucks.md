# 056 — XP Is Derived From P-Bucks

**Status:** Decided · Amends ADR 052

## Decision

**A parent sets one value at assignment — the P-Bucks amount. XP is derived:
`xp = 5 + coinReward × 10`.**

- Free **5** · 1 P$ → **15** · 2 → **25** · 5 → **55** · 10 → **105**. The base and
  slope are tuning knobs with one definition — `plugins/chores/src/lib/economy.ts`
  (`XP_BASE`, `XP_PER_COIN`); the API imports it via `@family-os/plugin-chores/economy`.
- **The server derives on create and re-derives on every edit; a client-sent
  `xpReward` is ignored.** The column stays — it is the award record the completion
  subscriber credits, and history keeps what was promised.
- **Legacy hand-picked values drain, never migrate.** The award was a promise made at
  assignment; a migration would silently re-base pending chores, which ADR 052 forbids.
  Any edit re-derives, and one-shot chores clear naturally.
- **The XP picker is gone.** The drawer's one reward control is the P$ amount; the
  derived score is stated beside it as a quiet star line ("Scores 25 XP") — taught at
  the one place pricing is decided, configured nowhere.
- **The paying ladder is presets, not a cage.** A chore's Pays and a reward's Cost
  share one `CoinAmountField` in `@family-os/ui` (free-typed amount · preset chips):
  chore presets 1/2/5/10 with free = an empty input (resolving ADR 052's recorded
  0/2/5/10 — 0 was always "no tier selected"), catalog presets 5/10/15/25/40.
- **This is not conversion.** ADR 002 holds: the balances stay independent and
  non-exchangeable — deriving the _award_ is not exchanging the _balance_. XP stays
  up-only; a reopen debits P-Bucks, never XP.
- **The XP sink (cosmetic ladder) is deliberately not here.** It needs its own design
  session: gear on an avatar collides with ADR 042 (a photo is a face), and XP lives
  in `chores` while cosmetics would live on the profile — an unanswered ownership
  question. Deferred, not dropped: XP unlocks cosmetics; neither P-Bucks nor real
  money ever buys gear.

## Why

- **Two pickers made inversions expressible.** "Worth 100 XP but 1 P$" was a state a
  tired parent could produce by accident; derivation makes more P$ always mean more
  XP, structurally.
- **One decision at assignment** is ADR 052's own principle — pricing is decided
  where the chore is set up. Two sliders for one judgment is a form asking the same
  question twice.
- **The launch forced the timing.** With P-Bucks flagged off, `coinReward` is always
  0 and dropping the picker would flatten every prod chore to base XP — so this lands
  with the flag flip (the `dev/rewards-store-wallet` merge), not before.

## Alternatives considered

- **Keep both pickers.** Preserves flexibility nobody asked for, at the price of the
  mismatch being the default experience.
- **Derive coins from XP.** Already rejected by ADR 052 — it makes every routine task
  transactional and moves the weekly earn whenever the chore list moves.
- **Retire XP.** Loses the game layer ADR 002 exists to protect, and free chores
  would earn nothing at all.
- **Migrate legacy XP values.** Consistent on day one, but a silent re-basing of
  promises kids can already see.

## Do not revisit unless

A full term of real use shows the base or slope wrong in practice — retune openly,
announced to the kids, never as a silent re-basing. Or the XP-sink design session
needs a different award shape to make thresholds land well.
