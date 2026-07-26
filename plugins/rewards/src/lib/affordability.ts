import type { Reward } from '../types'

/* The one place the "how close am I" arithmetic lives, so the store, the wallet widget
   and the redeem sheet can't disagree about what a kid can get. Pure — no fetching, no
   React — which is also what makes it cheap to test. */

/** "Almost there" = within this many P-Bucks of affordable. */
export const ALMOST_WINDOW = 10

export const gapFor = (reward: Reward, balance: number): number =>
  Math.max(0, reward.cost - balance)

/** Store shelves, keyed to the three real states. Sorted cheapest-first within each. */
export function storeShelves(rewards: Reward[], balance: number) {
  const sorted = [...rewards].sort((a, b) => a.cost - b.cost)
  return {
    afford: sorted.filter((r) => gapFor(r, balance) === 0),
    almost: sorted.filter((r) => {
      const g = gapFor(r, balance)
      return g > 0 && g <= ALMOST_WINDOW
    }),
    big: sorted.filter((r) => gapFor(r, balance) > ALMOST_WINDOW),
  }
}

/** The wallet's adaptive-line inputs: everything affordable now, and the nearest thing
    that isn't yet (the next goal to point a near-empty wallet at). */
export function walletReach(rewards: Reward[], balance: number) {
  const sorted = [...rewards].sort((a, b) => a.cost - b.cost)
  return {
    affordable: sorted.filter((r) => r.cost <= balance),
    nextUp: sorted.find((r) => r.cost > balance),
  }
}

export type RedeemMode = 'spend' | 'ask' | 'nudge'

/** What tapping a reward should offer. Post-ADR 055 both affordable modes reach the
    same buy confirm (buying never asks — approval gates USE, in the pocket); `ask`
    survives so the store can still say "you'll ask a parent when you use it". */
export function redeemMode(reward: Reward, balance: number): RedeemMode {
  if (gapFor(reward, balance) > 0) return 'nudge'
  return reward.requiresApproval ? 'ask' : 'spend'
}
