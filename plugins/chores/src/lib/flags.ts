/* Earning is built ahead of the surfaces that spend it (the wallet + store are later
   M4 stories), so the earn UI is held behind a flag until the loop is whole — a kid
   should not be able to earn P-Bucks with nowhere to see or spend it. This gates only the
   two chores surfaces (the "Pays" picker and the coin on a row); the XP re-strike ships
   unconditionally, and the backend ledger stays dormant because nothing sets a
   coinReward while the picker is hidden.

   Off by default (prod). On in local dev via `plugins/chores/.env.local`
   (`VITE_REWARDS_UI=true`), which is gitignored so it never reaches a prod build.
   Flip this on for prod when the store + wallet land. */
export const REWARDS_UI_ENABLED = import.meta.env.VITE_REWARDS_UI === 'true'

/** Whether to render the coin for a chore: only when a reward exists AND the
    earn UI is live. Belt-and-suspenders — the picker is flagged, so a fresh task
    can't be given a reward while off, but a legacy row could still carry one. */
export const showCoinReward = (coinReward: number): boolean => REWARDS_UI_ENABLED && coinReward > 0
