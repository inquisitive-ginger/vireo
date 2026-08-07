# 061 — The XP Sink Is a Companion

**Status:** Decided (2026-08-07, M4/9 direction session) · Completes ADR 056's
deferral · Amends ADR 028 (tier 1–2 default layout)

## Decision

**XP's sink is a per-kid critter — hatched once, grown by XP earned since hatch,
dressed by choices made at milestones.** Direction artifact (v3, kid-tested roster):
`docs/sessions/artifacts/2026-08-07-xp-sink-direction.html`.

- **A new `companion` plugin owns it** (mirror `family-feed` structure). It reads
  `chores` XP server-side via the `@family-os/plugin-chores/db` export (the
  API-imports pattern) and subscribes to `chores.task.completed` for threshold
  detection. It never touches the `rewards` ledger — keeping "XP is not currency"
  structural.
- **Unlock, never spend.** Level is a pure function of **XP earned since hatch**
  (`total_xp` minus the value snapshotted at hatch). `xp_balances` is untouched;
  the ScorePlate stays the lifetime score. Everyone hatches at Level 0 — no
  banked-XP launch flood, siblings start equal, the curve stays tunable.
- **Milestone choice:** at each level the kid picks **1 of 3** offered items
  (the punch-card prize-pick interaction). Unchosen items may return later. Picks
  never expire.
- **Species is the kid's choice; color is their identity hue.** Roster (kid-tested
  2026-08-06): **Whisp** (dreamy floater) · **Skitter** (six-legged monster,
  spider-like never creepy) · **Sprout** (leafy seedling). Species sets character;
  **gear carries personality** — worn (head/face/neck) and **props** (drum kit,
  skateboard). The kid names the critter at hatch; species and name are permanent.
- **Gear renders on the critter only.** The avatar, the photo, and every identity
  surface are untouched — **ADR 042 needs no amendment.**
- **Mood is derived, never punitive:** perky after recent XP, resting after quiet
  days — computed from XP-balance recency at read time. Never sick, sad, or
  losing anything. No care loop.
- **Placement:** the companion widget takes the tier 1–2 **feature** slot; the
  wallet steps down to card (this amends ADR 028's default layout). The family
  dashboard gets a **flock** strip — every hatched critter, identified by species
  shape + hue (ADR 044's two channels). Tiers 1–3 hatch by default; tier 4 opts
  in from Settings; the family pseudo-profile never hatches.
- **XP's register is unchanged** (ADR 051/054 hold): quiet muted star, no gold,
  no brass. The progress meter fills in the kid's identity hue.

## Why

- P$ owns extrinsic motivation; the sink's job is a different loop — a reason to
  open the app on a no-chore day, and a dashboard that feels _owned_. An
  affection loop (grow something) beats a status loop (rank something) in a
  house with siblings.
- ADR 056 deferred the sink on two hard questions; both are answered here: gear
  lives on a critter, not the avatar (042 stands), and a new plugin owns
  cosmetic state across the chores/profile boundary using only established
  patterns.
- Fresh-start-at-hatch: lifetime-XP levels would dump ~8 milestone picks on
  day one, devaluing each; a capped back-credit is a rule nobody remembers.

## Alternatives considered

- **Den/dashboard customization** as the anchor — expression without a character;
  weakest daily-return pull. Folded in as future unlock content (scenes).
- **Trophy ladder** (levels/titles/badges/avatar frames) — needs an ADR 042
  amendment and invites sibling status souring.
- **Lifetime XP counts toward levels** — honors history, spends the whole early
  curve on arrival.
- **Cosmetics owned by `chores` or `rewards`** — chores is task management;
  rewards is commerce, and pet-beside-ledger is exactly the adjacency that makes
  XP read as money.

## Do not revisit unless

A real term shows the affection loop not landing (widget engagement flat after
the novelty month), or the companion needs to become spendable/tradeable —
which ADR 002 forbids and would be a product change, not a tuning change.
