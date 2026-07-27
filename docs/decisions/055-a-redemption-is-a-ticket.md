# ADR 055 — A Redemption Is a Ticket

- **Status** — Decided (2026-07-26; gated with the user on the rendered rework
  artifact during the M4/5 design review, all four directions approved as
  recommended)

## Decision

A redemption is a **ticket**: buying and using a reward are two different moments,
and the model separates them.

1. **Buy** — debits the wallet once, at purchase, with no parent gate at any price.
   It is the kid's own money (ADR 053). Cost is snapshotted, the idempotency claim
   and ledger mechanics are unchanged (ADR 047). Stock decrements here.
2. **Own** — the bought ticket sits in the kid's pocket indefinitely. This state is
   the point: anticipation is a feature, not a queue position.
3. **Use** — an explicit, kid-initiated act. `requiresApproval` gates **use, not
   purchase**: a non-approval ticket tears immediately; an approval ticket sends a
   use request to the parents.
4. A parent's decline is **"not now", not confiscation** — the ticket returns to
   owned, the money stays spent, the optional note is quoted back verbatim. There
   is no refund in the kid-reachable flow.
5. **Used is fulfilment.** The separate parent "fulfil" action is deleted; a yes
   tears the ticket then and there.

Statuses: `owned · use_requested · used` (replacing
`pending · granted · declined · fulfilled`). A tier-4 **revoke-and-refund** remains
as the parental exception (mis-buys, retired rewards) — an administrative action,
not a flow state.

## Why

- **Money should move once.** The M4/4 model debited on request and refunded on
  decline, so a parent's "no" clawed back a purchase the kid had already decided
  on — the thing kids remember. With the gate at use-time the parent's question
  becomes "is now a good moment?", which is the question they actually have.
- **The collapsed lifecycle caused the surface problems.** With purchase
  auto-fulfilling, nothing was ever _owned_, so the store had no pocket to point
  to, no moment to celebrate, and no reason to be anything but a checkout — the
  root of the "generic product page" critique.
- **Fewer parent actions.** Grant/decline/fulfil (three) becomes yes/not-now
  (two), and "used" needs no bookkeeping step.
- The model is dormant in prod (plugin unregistered) and M4/5 is unmerged — this
  was the last cheap moment to change what a redemption is (the ADR 054 argument).

## Alternatives considered

- **Gate at purchase (as built in M4/4).** Rejected: makes the parent veto the
  spend of the kid's own money, and a decline is a confiscation.
- **Two gates** (approval at buy _and_ an owned state before use). Rejected: two
  waits for the kid, two decisions for the parent, no principle deciding which
  gate a reward needs.
- **Refund on use-decline.** Rejected: reintroduces confiscation; the refund path
  survives only as the tier-4 exception.

## Do not revisit unless

Real household use shows parents need a purchase-time veto — e.g. stock-limited or
real-money-costly rewards being bought against family plans. If that happens, add
a per-reward purchase gate as a _second_ flag rather than moving the ask back off
the use step.
