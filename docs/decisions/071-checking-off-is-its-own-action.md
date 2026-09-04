# 071 — Checking Off Is Its Own Action, at Tier 2

**Status:** Decided (2026-09-03, architecture session on the shopping permission
namespace) · Completes the key set ADR 067 opened and ADR 069 renamespaced ·
Applies ADR 018 (CASL `(action, subject)`, `PERMISSION_REGISTRY`, `ability.can`)

## Decision

`shopping.Item` carries **four** actions, not two. The complete key set:

| Key                    | Subject / action       | Baseline | Grantable |
| ---------------------- | ---------------------- | -------- | --------- |
| `shopping.list.create` | `create shopping.List` | Tier 4   | Yes       |
| `shopping.item.view`   | `view shopping.Item`   | Tier 1   | Yes       |
| `shopping.item.add`    | `create shopping.Item` | Tier 1   | Yes       |
| `shopping.item.check`  | `check shopping.Item`  | Tier 2   | Yes       |
| `shopping.item.file`   | `file shopping.Item`   | Tier 4   | Yes       |
| `shopping.item.manage` | `manage shopping.Item` | Tier 4   | Yes       |

1. **Checking an item off is its own action**, `check`, baseline **tier 2**,
   grantable down to tier 1 and revocable per profile. It is not `manage` and it
   is not folded into `add`.
2. **Unchecking is the same key.** `check` is a toggle, not a one-way door. The
   person who mis-taps is in an aisle, one-handed, possibly offline; the recovery
   has to be reachable by them.
3. **The aisle correction is its own action**, `file`, baseline **tier 4**,
   grantable. The tier is exactly the one ADR 067 §2 and ADR 069 §3 set — this
   changes the _granularity of the grant_, not the baseline, so that handing the
   correction to a shopping teen no longer also hands them delete and rename.
4. **`shopping.item.view` is a registry key**, baseline tier 1. `spec.md` already
   said reading is covered by `view shopping.Item`; every other module's read rule
   is enumerated (`chores.task.view`, `calendar.event.view`, `meals.plan.view`) so
   a parent can revoke it for one profile. This writes down what was already true.

Every gate is `ability.can(action, subject)`. No `tier >=` reads (ADR 018).

## Why

- **Tier-4-only checking makes the phone surface read-only for whoever is actually
  in the shop.** The two-shopper case — one adult in the aisle, one adult adding
  from home — is the requirement M5.5/4 exists to satisfy, and a tier-2/3 partner
  or an older kid sent down an aisle is the person holding the cart.
- **`manage` is the delete verb.** Overloading it so that "can check things off"
  implies "can delete the list's items" makes the only available grant far larger
  than the capability being asked for. ADR 067 promised the override system was
  the answer for a shopping teen; that promise is only true if the grant is the
  correction, not everything adjacent to it.
- **A check is reversible and moves nothing.** Chores splits `complete` from
  `reopen` because reopening reverses a ledger entry (ADR 047/048) — reversing is
  a money action there. Here the worst case of a wrong check is a line through a
  word, undone by anyone holding the same key. Splitting the toggle would strand a
  mis-tapped item behind a parent, mid-aisle, on a phone with no signal.
- **The young-child risk is priced at the tier boundary, not at the key.** Tier 1
  keeps `add` — kids adding to the list is the point — and does not get the toggle,
  so the four-year-old at the wall cannot clear a trip. A tier-1 kid who should be
  trusted is one grant away; a tier-2 kid who abuses it is one revoke away. Both
  levers already exist.
- **The aisle correction's blast radius is the family, forever.** It writes a
  family-wide override row that refiles every future add of that name by everyone.
  That is why it stays tier 4 while checking does not.

## Alternatives considered

- **Fold checking into `shopping.item.add`** ("a shopper who can add can check").
  Rejected: `add` is tier 1 on purpose, so this silently gives the youngest kid the
  power to clear a planned trip, and it welds the two capabilities together — a
  parent's only remedy for a kid who clears lists would be to stop them adding.
- **Leave checking under `manage`, tier 4.** Rejected: it breaks the two-shopper
  requirement outright, and the workaround a family would actually reach for is
  sharing the parent PIN, which defeats the whole model.
- **`check` at tier 3.** Rejected: it puts the line above the older kid sent down
  an aisle, who is the second motivating case. Tier 2 plus a per-profile revoke
  prices the risk where it actually is.
- **A separate `uncheck` action at tier 4.** Symmetrical with chores' `reopen` and
  wrong for the same reason it is right there — no ledger moves, and the cost lands
  on the person least able to escape it.
- **A row condition — you may only uncheck what you checked**
  (`can('check', 'shopping.Item', { checkedById: profile.id })`). Rejected: a
  shared list is shopped by two people from two carts, and the person who finds the
  item on the shelf is often not the one who mis-tapped it. A legitimate fix would
  read as a bug.
- **Leave the aisle correction inside `manage shopping.Item`** (literally what 067
  and 069 say). Rejected per §3 — the over-grant, not the tier, is the problem.

## Do not revisit unless

Someone in this house actually clears a list they should not have, more than once —
which is a baseline change (tier 2 → 3), one line in `ability.ts`, not a redesign.
Or a second list producer arrives whose items carry stakes a check cannot reverse —
a spend, a purchase, a booking. At that point checking is buying, and buying is not
this key.
