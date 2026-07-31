# ADR 059 — Up-for-Grabs Chores Are Claimed, Then Done

**Status:** Decided — 2026-07-30

## Decision

A chore (or routine) may have **no assignee** (`assignee_id` null): it is **up
for grabs** — owned by the household until a member takes it. Taking it is an
explicit **claim** (`PATCH /chores/tasks/:id/claim` sets the claimer as
assignee); from that instant it is an ordinary assigned task. **Completion of an
unclaimed task is refused** — the economy credits the assignee, so there must be
one first.

- Any member may claim (the `complete` capability gates it — claiming is the
  first half of doing); the family pseudo-profile cannot. A claim race is settled
  by a null-guarded update: the second tap is told someone beat them to it.
- Unowned rows wear the **Hearth** identity (ADR 041), never a member hue or a
  hashed pseudo-member: the up-for-grabs lane on the board, the widget group, and
  the row spine all paint as the household. The drawer's assignee row gains an
  **"Anyone"** chip in the same treatment.
- Focus mode keeps its one-action hero: grabs chores sit in their own collapsed
  section with a per-row "I'll do it"; claiming moves the chore into the kid's
  own list, where it can promote to hero with the normal single **Mark done**.
- Squatting (claim and stall) is remedied by the parent edit — reassign or back
  to Anyone. No auto-release timer.

## Why

- **The economy never learns a new earner.** Payout routing, XP, approval holds,
  and the by-kid approvals queue are all keyed by assignee; claim-first means
  none of them change. The alternative wires `completedBy` through the rewards
  subscriber, the XP handler, and the queue — the deepest cut this feature could
  make into settled money code.
- **Intent is visible.** Two kids can't race the same dishwasher invisibly; the
  spine takes the claimer's hue the moment it's theirs (ADR 043/044).
- **The gesture has precedent** — M5's unclaimed dinner settled on one-tap claim.

## Alternatives considered

- **First-to-finish** (no claim; completer earns). One tap, but reroutes earnings
  through three settled subsystems and loses the visible-intent property.
- **Defer entirely.** A second migration and a second pass through the same
  drawer and rows later, and the dishwasher case — the motivating example for
  ongoing routines — ships half-told.

## Do not revisit unless

Claim-squatting becomes a real household problem (then an auto-release/expiry),
or a bounty-style "first to finish earns extra" mechanic is deliberately wanted —
that is a rewards design, not a chores scoping shortcut.
