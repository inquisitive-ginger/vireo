# 049 — Punch Cards Are a Rewards Primitive

**Status:** Decided

## Decision

A **punch card** — a fixed-goal, resettable counter with a payout at the goal — lives in
`rewards`, not in the plugin that generates the punches.

- **Anatomy.** A template (name, glyph, goal count, payout, audience) → a per-profile
  card instance → punch rows. At `count == goal` the payout lands and the card resets;
  the completed card is retained as history.
- **The payout is `{coins}` or `{rewardId}`** — both are `rewards` concepts, which is
  the tell that the card is one too.
- **Punches arrive over the earn contract** (ADR 048). Meals publishes
  `meals.trybite.taken`; `rewards` punches. Meals does not know what a card is.
- **The kid punches their own card.** A parent can undo. The joy of the paper sheet is
  drawing the check — do not take that and hand it to an adult.
- **Punches are idempotent** on `(source_type, source_id)`, same as ledger entries.

## Why

- **Try bites is one instance of a recurring shape.** Teeth brushed without a fight,
  reading sessions, shoes in the bin — the second and third consumers are obvious, and
  none of them are about food. A primitive built inside `meals` would be reimplemented
  the first time one appears.
- **The payout is already a rewards object.** Building the card in `meals` means `meals`
  reaching into the catalog and the ledger — the exact coupling ADR 048 forbids.
- **It is the second earning mechanic, not a second economy.** A punch card feeds the
  same wallet through the same contract, so it adds a mechanic without adding a balance.

## Alternatives considered

- **Punch cards in `meals`.** Fits today's only consumer and nothing after it; forces
  `meals` to depend on the catalog and the ledger.
- **A generic counter primitive in `@family-os/platform`.** No consumer outside
  `rewards` exists or is foreseen, and the payout is inherently a rewards concept —
  platform would have to import the feature it serves.
- **Model a card as a chore with a target count.** Conflates an assigned task with a
  self-paced tally; a punch has no assignee, no due date, and no completion state.

## Do not revisit unless

A punch card needs a payout that is neither F$ nor a catalog reward, or a consumer
appears that wants cards without the rewards module installed.
