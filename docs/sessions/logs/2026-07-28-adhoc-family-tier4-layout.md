# Ad-hoc: Family Pseudo-Profile Gets the Tier-4 Home Layout

**Date:** 2026-07-28
**PR:** [#80](https://github.com/inquisitive-ginger/family-os/pull/80)

## What changed

The fridge tablet (the `family` pseudo-profile) now gets the same home dashboard
grid a tier-4 parent gets — calendar leads 2×2 by size/position, chores card,
feed quiet, no `feature` rung — instead of its old bespoke composition (a
full-width feed banner with chores + calendar as peers beneath).

`defaultLayoutKey` in `packages/platform/src/home-layout.ts` now routes the
family profile onto the existing `default_layout_tier_3_4` key. The old
`default_layout_family` array was deleted rather than left dead, per the
file's own "one definition, do not re-declare" rule.

Landed as a single-commit PR (`201e276`), rebased once mid-session after the
branch (cut from before the P-Bucks launch) was found stale against `main` —
`main` had since split `default_layout_tier_3_4` from a new `default_layout_tier_3`
(teens) and moved `rewards.wallet` onto the kid/teen layouts (M4/5c). The rebase
kept all of that intact and only reapplied the family-routing change on top.

## Verification

- `packages/platform` + `apps/api` test suites green, including a new
  regression test (`gives the family pseudo-profile the same tier-4 layout as
a parent`) in `apps/api/src/plugins/home.test.ts`.
- Live-reviewed in a real dev stack (shell + api + all four plugins run from
  the feature branch) — signed off by the user on the family profile.

## Incidental cleanup

- Found and deleted two stray fixture profiles (`seed-parent-1`/`seed-child-1`
  - 3 dependent notifications) that had leaked into the **dev** `familyos`
    database from an earlier rewards review session — harmless (no dev DB
    fixture keyed by them; their FK column is `text`, not `uuid`, so nothing
    else could reference them), but showed up in the profile switcher next to
    the real household.
- Found and stopped a stale, fully-merged `family-os-store-wallet` checkout
  that had been squatting on the standard dev ports (`5173`, `3000`,
  `3011–3014`) since before the P-Bucks launch merged — it's what "dev" was
  actually serving, which is why the branch's change wasn't visible until it
  was stopped and this worktree's own `pnpm dev` took the ports instead.

## Open question, not acted on

`home-layout.ts`'s top-of-file comment still describes the drift bug that
motivated "one definition" in terms of "the tier-3/4 and tier-1/2 right
column" — technically stale since the tier-3 split, but it's about the
_history_ of the bug, not the current shape, so it was left alone.
