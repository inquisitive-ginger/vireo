# 073 — Taking Back Your Own Add Is Tier 1, for Fifteen Minutes

**Status:** Decided (2026-09-04, architecture session on the wall's undo gap) ·
Extends the key set ADR 071 completed · Applies ADR 018 (CASL conditions,
`ability.can`) and ADR 072 (the wall adds as the family profile)

## Decision

A seventh key: **`shopping.item.retract` → `retract shopping.Item`, baseline tier 1,
grantable.**

1. **Scoped to your own adds, by CASL condition** —
   `can('retract', 'shopping.Item', { addedBy: profile.id })`. Removing anything else
   stays `manage shopping.Item`, tier 4.
2. **"Recent" is fifteen minutes from `added_at`**, checked in the route, never a
   position in a list. At the boundary the affordance goes on the next fetch, and a
   stale client that taps anyway gets a 403 it must **show** ("too old to take back"),
   not swallow. Nothing restarts the clock — not a check, not a re-file, not an edit.
3. **On the wall, "yours" is the house's.** ADR 072 gives everyone at W2 the same
   `added_by = 'family'`, so anyone there retracts anything the wall added in the
   window, and nothing a phone added. It falls out of §1 with no special case, and is
   intended: refusing it leaves the one surface never logged in as the one that can
   never undo.
4. **A retract deletes the row.** No `retracted` status, and it does **not**
   un-teach `Entry`.
5. **It emits `shopping.item.removed`** — `{ itemId, listId, name, by, reason }`,
   `reason: 'retracted' | 'managed'`. The tier-4 `manage` delete emits it too; today
   it emits nothing, which is a live staleness bug.
6. **The route enforces ownership itself**, not only the ability — an override
   carries no conditions (last bullet under Why).

The `shopping permission registry` test asserts exactly six keys, in order, and will
fail on the seventh by design. Update it — that is the cost of a key.

## Why

- **The cheapest action sat behind the most dangerous verb.** M5.5/5 drove the real
  wall: **zero** remove controls. Typos are likeliest where nobody can authenticate
  out of one. ADR 071's fault repeated — `manage` is the delete verb, so the only
  grant covering "take back my typo" also says "and delete the list".
- **Not a condition on `manage`.** `manage` is CASL's any-action wildcard, so
  `can('manage', 'shopping.Item', { addedBy: profile.id })` makes `can('check', …)`
  true for those rows, handing tier 1 the checkoff ADR 071 withheld on purpose. A
  distinct verb is the only shape that does not leak.
- **Time is arbitrary; position is arbitrary _and_ coupled.** "Still in the
  `Just added` strip" makes a permission a function of a design token; "the last N
  adds" lets other people's adds evict your right to undo your own. Fifteen minutes
  covers the typo caught at the fridge and the "wait, we have that" on the walk back,
  and excludes yesterday's list, which is what `manage` is for. Its length is priced
  by the wall, where scope dissolves (§3) and the window is the only guard: it bounds
  a bored kid to minutes of the house's adds, not a week.
- **Delete, because `check` already owns the lifecycle.** "Never needed" is the row
  not existing, not a third stage; a `retracted` status makes every query filter it
  and every consumer branch on it for a layer nothing renders. No ledger reverses
  either — chores' `reopen` is durable because it moves money (ADR 047/048); this
  moves a word, and the recovery is retyping it. What it leaves standing is `Entry`,
  below.
- **One event for one transition** (ADR 072 §5). Gone is gone; a consumer drops the
  row identically either way, and two names guarantee someone subscribes to one only.
  `name` rides along because the row cannot be looked up after.
- **An override grant strips the condition.** `ability.ts` replays overrides as
  `can(action, subject)`, unconditioned, so a revoke-then-regrant returns this key
  unscoped. Baseline tier 1 makes a grant a no-op and revoke the only real lever, but
  the route must check `addedBy` regardless — shared with `rewards.Wallet`, not ours
  to fix.

## Alternatives considered

- **Drop `manage shopping.Item` to tier 1.** Rejected: hands the four-year-old at the
  wall the whole list, plus rename and delete of a planned trip.
- **A `retracted` status, hidden and recoverable.** Rejected above: buys an audit
  trail the event already carries, costs a filter in every query forever.
- **Un-teach `Entry` on retract**, so a retracted typo cannot autocomplete back.
  Rejected: `Entry` is one row per normalized name, no count, no back-reference, and
  `remember()`'s upsert has already overwritten the prior spelling and
  `last_added_at` — the add destroyed what un-teaching would restore, and a delete
  erases a name five other people added. The residue is accepted: nothing reads
  `Entry` yet, and un-teaching is not expressible until it carries a per-name count.
  That counter, decremented on retract, is its own ADR.
- **Unscoped `retract` at tier 1** (anyone retracts any recent add). Rejected: the
  wall's loss of scope is tolerable _because_ it is one surface; as the rule it lets a
  kid on a phone undo a parent's adds with nothing to tell them apart.
- **A longer window, or none.** Rejected: with `family` as an owner, ownership
  guards nothing on the surface that needs a guard most.
- **Scoping by session rather than `added_by`** ("what this device added"). Gives W2
  per-person scoping the profile cannot, but invents the second identity ADR 072 spent
  an ADR refusing, and fails the phone that reloads.
- **No event, let Query invalidation cover it.** Rejected: invalidation is
  same-client, and the two-shopper case (ADR 071) is two clients.

## Do not revisit unless

Someone retracts what they should not have, repeatedly — a revoke row, or a smaller
constant. Or an add acquires a consequence a delete cannot reverse (a spend, a
booking), at which point retracting is refunding, and that is not this key.
