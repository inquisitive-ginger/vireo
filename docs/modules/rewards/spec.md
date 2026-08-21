# Rewards & Wallet — Module Spec

> Spec drafted in the M4/M5 planning session (2026-07-21); pricing, surfaces and the
> currency mark settled at the design gate (2026-07-22, ADRs 051–053).

---

## What it is

The sink for everything the family earns. Chores have minted XP since M2 with nothing
to spend it on — this module gives the loop its second half: **do a thing → earn P-Bucks →
spend it on something you want.**

It is the **top half of the old M6 Finance milestone**, pulled forward. The bottom half
(allowance schedules, cashout to real money, Monarch sync) stays in M8 Finance. The
wallet is built so **cashout is another sink**, not a second balance.

## Currency model — already settled

**ADR 002** decides this and is not reopened: two currencies. **XP** is pure
gamification and never converts. **P-Bucks** is earnable and redeemable and can convert to
real money later. **ADR 005** keeps the system a ledger, never a bank.

So: **XP only ever goes up** — it stays the lifetime score plate shipped in M2, and
nothing about it changes. **P-Bucks goes up and down.** A chore completion mints both.

## M4 scope (MVP)

- P-Bucks ledger + derived balance (ADR 047)
- Chores earn: `coinReward` on the task, credited off `chores.task.completed` (ADR 048)
- Reward catalog — tier-4 CRUD, per-reward `requiresApproval` flag
- Redemption is a **ticket** (ADR 055): buy debits at once (no parent gate) → owned →
  explicit use; `requiresApproval` gates **use**, a not-now keeps the ticket, used IS
  fulfilment. Tier-4 revoke-and-refund is the administrative exception.
- Reward store surface + `rewards.wallet` home widget
- Punch cards (ADR 049) — template, per-profile card, punch, auto-payout + reset
- Parent bonus grant — tier-4 "give N P-Bucks, reason: …"

## Explicitly deferred

- Allowance schedules and recurring income (M8)
- Cashout to real money + Monarch sync (M8, ADR 005)
- Savings goals / interest / lending
- Reward images beyond an emoji (reuse the ADR 042 bytes-in-Postgres pattern when needed)
- Wishlists, kid-proposed rewards
- Leaderboards, streaks, levels (XP-side gamification stays as shipped)
- Auction/dynamic pricing, family-wide shared goals

---

## Pricing — settled (ADR 052)

**A normal week earns about 10 P-Bucks**; chores opt IN to paying (`coinReward`
defaults to **0**) and balances stay in tens. The full ladder and rationale are
ADR 052's — amended by **ADR 056**, which made XP derived (`5 + coinReward × 10`)
rather than independent.

### Seed catalog

> Grounded in the reward emoji set settled 2026-07-25 (one emoji per real reward, not an
> emoji keyboard — see `plugins/rewards/src/lib/reward-emojis.ts`). This is the starter
> set a fresh family gets; the code-seed lands with the store (M4/5).

| Reward               | Emoji | Cost | Approval | Reads as |
| -------------------- | ----- | ---- | -------- | -------- |
| Pick the car music   | 🎧    | 5    | —        | impulse  |
| Extra 30 min screen  | 🎮    | 10   | —        | ~1 week  |
| Stay up 30 min late  | 🌙    | 10   | —        | ~1 week  |
| Bake something       | 🍪    | 10   | —        | choice   |
| Movie night          | 🍿    | 15   | —        | choice   |
| Pick Friday's dinner | 🍗    | 15   | —        | choice   |
| Ice cream run        | 🍦    | 25   | yes      | outing   |
| Day out / adventure  | 🎡    | 40   | yes      | ~1 month |
| Yes day              | 👑    | 40   | yes      | ~1 month |

**No real-money exchange rate.** P-Bucks buys catalog rewards and nothing else; M8 may price
P-Bucks against cash later and nothing in M4 assumes it will.

---

## Events namespace

`rewards.*`

| Event                              | Published by              | Payload                                                                        |
| ---------------------------------- | ------------------------- | ------------------------------------------------------------------------------ |
| `rewards.balance.credited`         | ledger on credit          | `{ profileId, delta, balance, reason, sourceType, sourceId }`                  |
| `rewards.balance.debited`          | ledger on debit           | `{ profileId, delta, balance, reason, sourceType, sourceId }`                  |
| `rewards.redemption.purchased`     | POST redemption (buy)     | `{ redemptionId, profileId, rewardId, cost }`                                  |
| `rewards.redemption.use-requested` | POST :id/use (gated)      | `{ redemptionId, profileId, rewardId }`                                        |
| `rewards.redemption.used`          | tear (immediate or a yes) | `{ redemptionId, profileId, rewardId, decidedBy? }`                            |
| `rewards.redemption.deferred`      | PATCH not-now             | `{ redemptionId, profileId, rewardId, decidedBy }`                             |
| `rewards.redemption.revoked`       | DELETE (tier-4 exception) | `{ redemptionId, profileId, rewardId, cost, revokedBy }`                       |
| `rewards.card.punched`             | punch handler             | `{ cardId, profileId, templateId, count, goal }`                               |
| `rewards.card.completed`           | punch handler at goal     | `{ cardId, profileId, templateId, payout }` — payout null while a choice waits |
| `rewards.card.prize-claimed`       | the mint (pick or claim)  | `{ cardId, profileId, templateId, rewardId, redemptionId }`                    |

**Subscribes** (the earn contract, ADR 048 — each is one manifest line + one handler):

| Event                    | Effect                                           |
| ------------------------ | ------------------------------------------------ |
| `chores.task.completed`  | credit `coinReward`                              |
| `chores.task.reopened`   | debit `coinReward` (symmetric reversal)          |
| `meals.dinner.fulfilled` | credit the cook's award, if the meal carries one |
| `meals.trybite.taken`    | punch the taker's try-bite card                  |

---

## Permissions namespace

| Permission key              | CASL                                  | Default baseline         |
| --------------------------- | ------------------------------------- | ------------------------ |
| `rewards.wallet.view`       | `can('view', 'rewards.Wallet')`       | Tier 1+ (row-level: own) |
| `rewards.redemption.create` | `can('create', 'rewards.Redemption')` | Tier 1+ (row-level: own) |
| `rewards.card.punch`        | `can('punch', 'rewards.PunchCard')`   | Tier 1+ (row-level: own) |

Tier-4 management actions are CASL baseline rules, not registry keys (the chores
precedent):

| CASL action                           | Route                                                           | Baseline |
| ------------------------------------- | --------------------------------------------------------------- | -------- |
| `can('manage', 'rewards.Reward')`     | catalog CRUD                                                    | Tier 4   |
| `can('decide', 'rewards.Redemption')` | `PATCH` (answer) + `DELETE` (revoke) `/rewards/redemptions/:id` | Tier 4   |
| `can('create', 'rewards.Grant')`      | `POST /rewards/grants`                                          | Tier 4   |
| `can('manage', 'rewards.PunchCard')`  | template CRUD + undo a punch                                    | Tier 4   |
| `can('view', 'rewards.Wallet')` (all) | any profile's wallet + history                                  | Tier 4   |

> **Tier 1 must reach its own balance and the store.** That is the entire point of the
> module — a capability with no surface is not a capability (ADR 044's lesson).
> Settled in **ADR 053**, which also amends the `design-system.md` tier table: "no
> financial data" at tier 1 means the **household's** money (M8), not a kid's own P-Bucks.

---

## Widget

### `rewards.wallet`

| Field                | Value                                                   |
| -------------------- | ------------------------------------------------------- |
| `id`                 | `rewards.wallet`                                        |
| `displayName`        | Wallet                                                  |
| `defaultSize`        | `compact`                                               |
| `supportedSizes`     | `compact`, `standard`                                   |
| `minTier`            | 1                                                       |
| `requiredPermission` | `rewards.wallet.view`                                   |
| `description`        | Your P-Bucks balance and what you can afford right now. |

**Affordability is the motivating fact, not the number.** `compact` states the balance
and then **one adaptive line**: "3 rewards you can get", or — when nothing is affordable —
"3 more for 🍿 Pick the movie" with a meter. The zero state is the one that decides the
widget, because it is where a kid spends most of their time. `standard` moves the balance
into the header and makes what you can have the body. See `design-system.md`
§Rewards surfaces.

**Not on the family pseudo-profile** (ADR 053) — a household has no balance.

---

## Database schema (`rewards`)

```
ledger_entries                        -- append-only (ADR 047)
  id            uuid  PK
  profile_id    uuid  FK → platform.profiles.id (validated in route)
  delta         integer               -- signed; never zero
  reason        text
  source_type   text                  -- 'chores.task' | 'meals.dinner' | 'redemption' | 'grant' | 'punch_card' | 'refund'
  source_id     text  nullable
  created_by    uuid  nullable        -- the parent, for grants
  created_at    timestamptz
  UNIQUE (source_type, source_id) WHERE source_id IS NOT NULL   -- idempotency claim

balances                              -- cache; recomputable from ledger_entries
  profile_id    uuid  PK
  balance       integer  default 0
  updated_at    timestamptz

rewards
  id                uuid  PK
  name              text
  emoji             text
  description       text  nullable        -- one line, shown on the confirm ("Friday night is yours")
  cost              integer
  requires_approval boolean  default false
  audience          uuid[]  nullable   -- null = everyone
  stock             integer nullable   -- null = unlimited
  active            boolean default true
  created_by        uuid
  created_at        timestamptz

redemptions                           -- a TICKET (ADR 055)
  id               uuid  PK
  reward_id        uuid
  profile_id       uuid
  cost             integer            -- SNAPSHOT: repricing must not move an owned ticket
  status           text               -- 'owned' | 'use_requested' | 'used'
  purchased_at     timestamptz
  use_requested_at timestamptz nullable
  used_at          timestamptz nullable
  decided_by       uuid  nullable
  decided_at       timestamptz nullable
  decided_note     text  nullable       -- OPTIONAL not-now reason, quoted back verbatim

punch_card_templates                  -- shipped shape (M4/6 choice rework)
  id                 uuid  PK
  name               text
  glyph              text
  goal               integer
  payout_kind        text             -- 'coins' | 'reward' (a CHOICE of catalog rewards)
  payout_coins       integer nullable
  payout_option_ids  uuid[]           -- the parent-curated prize options; no FK —
                                      -- the reward DELETE route counts membership
  audience           uuid[]           -- empty = everyone (tiers 1–3)
  active             boolean default true

punch_cards
  id                uuid  PK
  template_id       uuid
  profile_id        uuid
  count             integer default 0
  chosen_reward_id  uuid  nullable    -- the kid's pick; changeable until the mint
  completed_at      timestamptz nullable  -- set at goal
  prize_claimed_at  timestamptz nullable  -- the mint; the fresh card opens HERE,
                                          -- not at completion
  created_at        timestamptz
  UNIQUE (template_id, profile_id) WHERE completed_at IS NULL  -- one open card
                                          -- (materialization occupancy also spans
                                          -- unclaimed finishes: prize_claimed_at NULL)

punches
  id            uuid  PK
  card_id       uuid
  source_type   text                  -- 'meals.trybite' | 'manual'
  source_id     text  nullable
  created_by    uuid
  created_at    timestamptz
  UNIQUE (source_type, source_id) WHERE source_id IS NOT NULL
```

**Money moves once** (ADR 055): buy debits, and the only refund is the tier-4 revoke,
which deletes the ticket. A parent's not-now moves nothing — the ask was about timing,
not permission to spend. A revoked ticket frees its stock unit (the row is gone); a
used one keeps it.

**`profile_id` is never the `family` pseudo-profile** (ADR 053) — enforced in the route,
not left to convention. Only a person holds a balance.

**The store endpoint returns the whole catalog plus the balance**, never a pre-filtered
affordable list: the store shows unaffordable rewards with their distance, so filtering
server-side would delete the feature.

---

## Home surface placement

To be reserved in the ADR 028 default layouts during the design session. Expected:
`compact` wallet high on the tier 1–2 layout (it is the thing they came for), and
absent or `compact` on the family pseudo-profile.
