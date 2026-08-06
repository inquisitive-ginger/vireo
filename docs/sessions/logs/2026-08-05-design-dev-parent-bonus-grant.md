# Session — Design+Dev: Parent Bonus Grant (M4/7)

**Date:** 2026-08-05 · **Type:** design + development · **PR:** #101 (merged)
**Artifact:** https://claude.ai/code/artifact/f7b05a8c-2afe-4ccc-a1f0-273875763eb4

## What was decided

The gate offered two complete flows rendered in the real tokens: **A** — a global
"Give a bonus" beside the page title opening a recipient-picking drawer; **B** — the
Tickets tab grows into the per-kid money view, balance in each group header, give on
the header's action slot. **B won**, with two amendments from the gate: the tab is
renamed **Wallets** and moves **leftmost, becoming the tier-4 landing tab** (its added
prominence earned the position; Approvals keeps its badge).

Why B: the bonus is praise attached to a person, and B is the only option where the
interface says so — and it closes a real gap, since a parent had no in-app view of any
kid's balance. A's advantages (one fewer tap, both-kids-at-once) can be added later
without moving anything B built.

## What was built

- **`POST /rewards/grants`** — tier-4 (`can('create', 'rewards.Grant')`, added to the
  CASL `Subjects` union). The grant IS its ledger entry: `sourceType 'grant'`,
  `createdBy` = the parent, reason verbatim. No table, no migration. A client-minted
  `grantId` rides the ledger's `(sourceType, sourceId)` idempotency claim — a
  double-tapped submit replays instead of paying twice. `GrantCreateSchema` in
  `@family-os/schemas`; reason required (the story exists to make `reason` earn its
  keep). The family pseudo-profile needs no route check — 'family' is not a UUID, so
  the schema refuses it and `postEntry` guards it regardless.
- **`GET /rewards/balances`** — tier-4, every wallet at a glance; a kid with no
  history has no row and reads as zero client-side.
- **`WalletsView`** (né `TicketsView`) — sections seeded from kid profiles
  (tiers 1–3) whether or not they hold anything ("a kid with an empty pocket is
  exactly who a bonus finds"), brass `BalanceChip` in the `MemberGroupHeader` status
  slot (the coin's colour, never the member's — ADR 051), "🎁 Give a bonus" in the
  action slot. Ticket/punch-card corrections unchanged beneath.
- **`GrantDialog`** — compact 420px Modal, kid's name in the title; `CoinAmountField`
  on the 1/2/5/10 chore-pay ladder (ADR 052); "For what?" required, hint "Goes on
  their money story, word for word."; submit speaks the amount ("Give 5 P$").
- **Kid side** — `notify()` at `alert`: "+N P$ from ⟨parent⟩" with the reason as
  body; the history sheet's 🎁 row gains a "from ⟨parent⟩" sub-line off `createdBy`
  (the "checked by" pattern generalized).

## Live review notes

Two corrections during the shell review: the Modal's default 320px wrapped the preset
ladder (widened to 420px), and the notification title used the sentence register
("P-Bucks") where the compact register belongs ("P$").

## Tests

API 69/69 (8 new: grant credit/provenance, replay, tier gate, reason required,
family/missing recipient, balances read + gate). Rewards plugin 67/67 (3 new: seeded
empty section with balance, full grant flow with minted `grantId`, reason-required
disable; count-chip assertions retired with the chip). Platform 44/44.

## What the next session needs to know

- The ad-hoc kickoff was never committed; this log is the record.
- Grants offer no both-kids-at-once; if that turns out to matter in practice, Option
  A's drawer composes on top without moving anything.
- `GET /rewards/balances` exists now — anything else wanting a family-wide money
  glance (e.g. an M8 allowance surface) should read it rather than N wallets.
