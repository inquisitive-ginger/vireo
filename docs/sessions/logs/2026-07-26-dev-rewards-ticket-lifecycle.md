# 2026-07-26 — Dev: Ticket Lifecycle (API) — M4/5a

**Branch:** `dev/rewards-store-wallet` (worktree `../family-os-store-wallet`), commit
`[rewards/ticket-lifecycle] a redemption is a ticket (M4/5a, ADR 055)`. Backend-only,
no design gate (the model was gated 2026-07-26). All ACs met.

## What was built

ADR 055 in the API. Statuses collapse to **`owned · use_requested · used`**:

- **Buy** (`POST /rewards/redemptions`) always debits and lands `owned` — the approval
  branch and the parent notification at purchase are gone. Cost snapshot, guards
  (family/active/audience/stock/affordability) and the `(redemption, id)` ledger claim
  unchanged.
- **Use** (`POST /rewards/redemptions/:id/use`, new) — kid-initiated, own-ticket only
  (someone else's ticket **404s**, not 403s — the response shouldn't confirm it
  exists). Non-approval → `used` on the spot, no parent interaction at all;
  `requiresApproval` → `use_requested` + `notifyParents`. Reuses the `create
rewards.Redemption` ability — using what you bought is not a second capability.
- **Decide** (`PATCH :id`, tier-4 `decide`) — actions **`yes` | `not_now`**. Yes tears
  (`used`, `usedAt`); not-now returns the ticket to `owned` with the optional note,
  **no refund**. A fresh ask clears the previous not-now's `decidedBy/At/Note` — the
  note answered _that_ ask. Kid notified either way.
- **Revoke** (`DELETE :id`, tier-4 `decide`) — the ADR 055 exception: refund the
  snapshot via `postEntry` (`(refund, id)`), then **delete the row**. Refund-before-
  delete on purpose: a retried revoke replays the refund as a ledger no-op and deletes
  cleanly. A `used` ticket 409s — it was consumed.
- **Queue** (`GET /rewards/redemptions`) defaults to `use_requested`.
- **Events** (named in-session): `rewards.redemption.purchased · use-requested · used ·
deferred · revoked`. **Gotcha, caught by a test as a 500:** the event bus enforces
  lowercase **kebab-case** segments, so the event is `use-requested` while the DB/API
  status stays `use_requested`.

**Semantics settled in-session:** `requiresApproval` is read at **use time**, not
snapshotted — a parent editing the flag re-gates tickets already owned, which is the
point of a flag about timing. A **retired** reward's ticket still tears (retiring stops
purchases, never the use of what was bought). **Stock counts tickets ever sold**: every
surviving row holds a unit (`used` keeps its), and only a revoke frees one — by
deleting the row, so `claimedCount` is just a row count.

**Schema** (`20260726120000_redemption_is_a_ticket`): default `'owned'`,
`requested_at → purchased_at` (indexes renamed too — Postgres keeps index names across
a column rename, Prisma derives them from the column), new nullable
`use_requested_at` + `used_at` (a non-approval tear has no `decidedAt`, and the memory
shelf needs an order), old dev rows mapped (`declined` deleted — it was refunded, so in
ticket terms it never existed). Rewards' regenerate was churn-free (still the one clean
client).

## The kickoff premise that was wrong

"Edit the branch migration in place (unmerged, prod-dormant)" — **the M4/4 migration is
not branch-work.** It merged in PR #71, `docker-entrypoint.sh` runs `migrate deploy`
for `plugin-rewards`, and deploys are automatic, so prod has it recorded. Editing it in
place would have changed its checksum against every DB that applied it. A **stacked**
migration costs the same (status is plain TEXT, both tables empty in prod).

Two DB findings while applying it:

1. **Dev never recorded the M4/4 migration** — its tables arrived via `db push` during
   that session — so `migrate deploy` failed (42P07 "relation rewards already exists")
   and left a failed row. Recovered with `migrate resolve --rolled-back` →
   `--applied` → deploy.
2. `plugins/rewards/prisma.config.ts` sets `migrationTableSchema: 'rewards'`, but every
   rewards migration is recorded in `public._prisma_migrations` — the option appears to
   be silently ignored. Not chased; worth knowing before anyone trusts it.

`familyos_test` hand-applied per the standing P3009 caveat.

## UI: protocol alignment only

The branch's in-flight store WIP had to keep compiling and speaking the new protocol,
so `types.ts`/`hooks.ts` statuses, the queue's actions (`yes`/`not_now`, dead
`granted`/fulfil branch deleted), and the test fixture were mechanically aligned —
copy/tense stays for M4/5d, the pocket/ticket UI for M4/5b. One deliberate exception:
**RedeemDialog's purchase-approval fork was stripped**, because its copy ("set aside —
you get it back if it's a no") states the exact refund-on-decline model ADR 055
deleted; buying is now always the before→after confirm and the it's-yours outcome.
`redeemMode`'s `ask` survives only to say "you'll ask a parent when you use it."

**Commit hygiene:** the branch commit carries the store WIP (it is inseparably tangled
with the alignment edits), but **`plugins.json` + `load-plugin.ts` stay uncommitted** —
they are the prod gate M4/4 defined, and M4/5b flips it.

## Verification

Redemption suite rewritten to the ACs: buy-lands-owned at any price · replayed debit
no-op · use→not-now→use→yes = exactly one debit, note survives the not-now and clears
on the re-ask · non-approval tear immediate (and nothing for a parent to answer) ·
revoke refunds the snapshot after a reprice, row gone, cache = recomputed sum · revoke
frees stock, used doesn't · retired-reward ticket tears · queue default + own-scope ·
403/404/409 guards. **api 350 · rewards 23 · ui 178 · chores 56 · calendar 105 ·
platform 43 · shell 17**; typecheck/lint clean workspace-wide.

## What the next sessions need to know

- **M4/5b** builds the ticket store/pocket UI to the artifact and flips the gate. The
  starter-catalog seed (with descriptions) is already committed on the branch in
  `packages/platform/prisma/seed.ts`; the wallet widget files are committed too.
- The serializer now sends `purchasedAt` / `useRequestedAt` / `usedAt` and the queue's
  `reward` include carries `requiresApproval`.
- M4/5d's queue rework: the protocol is already `yes`/`not_now` — only the words and
  tense remain (the tray still says "to spend"/"Approve").
- Revoke exists at `DELETE /rewards/redemptions/:id` and is deliberately absent from
  every kid-reachable surface.
