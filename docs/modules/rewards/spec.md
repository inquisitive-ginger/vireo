# Rewards & Wallet — Module Spec

> Spec drafted in the M4/M5 planning session (2026-07-21). Story-level design
> decisions are still owed to a design session; this is the scope boundary.

---

## What it is

The sink for everything the family earns. Chores have minted XP since M2 with nothing
to spend it on — this module gives the loop its second half: **do a thing → earn F$ →
spend it on something you want.**

It is the **top half of the old M6 Finance milestone**, pulled forward. The bottom half
(allowance schedules, cashout to real money, Monarch sync) stays in M8 Finance. The
wallet is built so **cashout is another sink**, not a second balance.

## Currency model — already settled

**ADR 002** decides this and is not reopened: two currencies. **XP** is pure
gamification and never converts. **F$** is earnable and redeemable and can convert to
real money later. **ADR 005** keeps the system a ledger, never a bank.

So: **XP only ever goes up** — it stays the lifetime score plate shipped in M2, and
nothing about it changes. **F$ goes up and down.** A chore completion mints both.

## M4 scope (MVP)

- F$ ledger + derived balance (ADR 047)
- Chores earn: `coinReward` on the task, credited off `chores.task.completed` (ADR 048)
- Reward catalog — tier-4 CRUD, per-reward `requiresApproval` flag
- Redemption: kid requests → debit → parent decides → fulfilled; **refund on decline**
- Reward store surface + `rewards.wallet` home widget
- Punch cards (ADR 049) — template, per-profile card, punch, auto-payout + reset
- Parent bonus grant — tier-4 "give N F$, reason: …"

## Explicitly deferred

- Allowance schedules and recurring income (M8)
- Cashout to real money + Monarch sync (M8, ADR 005)
- Savings goals / interest / lending
- Reward images beyond an emoji (reuse the ADR 042 bytes-in-Postgres pattern when needed)
- Wishlists, kid-proposed rewards
- Leaderboards, streaks, levels (XP-side gamification stays as shipped)
- Auction/dynamic pricing, family-wide shared goals

---

## Pricing is a design output, not a code output

The economy dies in either direction: unaffordable is demoralising, instantly
affordable is worthless. The design session picks the **weekly earn rate first**, then
prices the small reward at **~1 week** and the big one at **~1 month**. Seed the catalog
with real numbers before the first kid sees it.

---

## Events namespace

`rewards.*`

| Event                          | Published by          | Payload                                                         |
| ------------------------------ | --------------------- | --------------------------------------------------------------- |
| `rewards.balance.credited`     | ledger on credit      | `{ profileId, delta, balance, reason, sourceType, sourceId }`   |
| `rewards.balance.debited`      | ledger on debit       | `{ profileId, delta, balance, reason, sourceType, sourceId }`   |
| `rewards.redemption.requested` | POST redemption       | `{ redemptionId, profileId, rewardId, cost, requiresApproval }` |
| `rewards.redemption.decided`   | PATCH approve/decline | `{ redemptionId, profileId, status, decidedBy }`                |
| `rewards.redemption.fulfilled` | PATCH fulfil          | `{ redemptionId, profileId, rewardId }`                         |
| `rewards.card.punched`         | punch handler         | `{ cardId, profileId, templateId, count, goal }`                |
| `rewards.card.completed`       | punch handler at goal | `{ cardId, profileId, templateId, payout }`                     |

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

| CASL action                           | Route                            | Baseline |
| ------------------------------------- | -------------------------------- | -------- |
| `can('manage', 'rewards.Reward')`     | catalog CRUD                     | Tier 4   |
| `can('decide', 'rewards.Redemption')` | `PATCH /rewards/redemptions/:id` | Tier 4   |
| `can('create', 'rewards.Grant')`      | `POST /rewards/grants`           | Tier 4   |
| `can('manage', 'rewards.PunchCard')`  | template CRUD + undo a punch     | Tier 4   |
| `can('view', 'rewards.Wallet')` (all) | any profile's wallet + history   | Tier 4   |

> **Tier 1 must reach its own balance and the store.** That is the entire point of the
> module — a capability with no surface is not a capability (ADR 044's lesson).

---

## Widget

### `rewards.wallet`

| Field                | Value                                              |
| -------------------- | -------------------------------------------------- |
| `id`                 | `rewards.wallet`                                   |
| `displayName`        | Wallet                                             |
| `defaultSize`        | `compact`                                          |
| `supportedSizes`     | `compact`, `standard`                              |
| `minTier`            | 1                                                  |
| `requiredPermission` | `rewards.wallet.view`                              |
| `description`        | Your F$ balance and what you can afford right now. |

**Affordability is the motivating fact, not the number.** At `standard`, lead with
"3 rewards you can afford" over a bare balance.

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
  cost              integer
  requires_approval boolean  default false
  audience          uuid[]  nullable   -- null = everyone
  stock             integer nullable   -- null = unlimited
  active            boolean default true
  created_by        uuid
  created_at        timestamptz

redemptions
  id            uuid  PK
  reward_id     uuid
  profile_id    uuid
  cost          integer               -- SNAPSHOT: repricing must not move a pending request
  status        text                  -- 'pending' | 'granted' | 'declined' | 'fulfilled'
  requested_at  timestamptz
  decided_by    uuid  nullable
  decided_at    timestamptz nullable

punch_card_templates
  id                uuid  PK
  name              text
  glyph             text
  goal              integer
  payout_kind       text              -- 'coins' | 'reward'
  payout_coins      integer nullable
  payout_reward_id  uuid    nullable
  audience          uuid[]  nullable
  active            boolean default true

punch_cards
  id            uuid  PK
  template_id   uuid
  profile_id    uuid
  count         integer default 0
  completed_at  timestamptz nullable  -- set at goal; a fresh card is opened
  created_at    timestamptz

punches
  id            uuid  PK
  card_id       uuid
  source_type   text                  -- 'meals.trybite' | 'manual'
  source_id     text  nullable
  created_by    uuid
  created_at    timestamptz
  UNIQUE (source_type, source_id) WHERE source_id IS NOT NULL
```

**Debit on request, refund on decline** — not escrow. Same effect, half the state.

---

## Home surface placement

To be reserved in the ADR 028 default layouts during the design session. Expected:
`compact` wallet high on the tier 1–2 layout (it is the thing they came for), and
absent or `compact` on the family pseudo-profile.
