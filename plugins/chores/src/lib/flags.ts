/* The earn UI (the chores "Pays" picker and the coin on a row) was held behind this flag
   until a kid had somewhere to see and spend P-Bucks. M4/5 shipped the store + wallet and
   registered the rewards plugin, so the loop is whole and the flag now DEFAULTS ON — this
   is the prod flip. Set `VITE_REWARDS_UI=false` to force it off (an isolated chores demo);
   `.env` is gitignored, so a code default is the only flip that reaches the prod build. */
export const REWARDS_UI_ENABLED = import.meta.env.VITE_REWARDS_UI !== 'false'

/** Whether to render the coin for a chore: only when a reward exists AND the
    earn UI is live. Belt-and-suspenders — the picker is flagged, so a fresh task
    can't be given a reward while off, but a legacy row could still carry one. */
export const showCoinReward = (coinReward: number): boolean => REWARDS_UI_ENABLED && coinReward > 0
