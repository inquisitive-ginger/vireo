// XP is derived from the P-Bucks tier — one value set at assignment (ADR 056).
// The base keeps a free chore worth showing up for; the slope keeps "more P$ ⇒
// more XP" with no inversions. Tuning either is an open household re-pricing
// (ADR 052), never a silent re-basing.
export const XP_BASE = 5
export const XP_PER_COIN = 10

export const xpForCoins = (coinReward: number) => XP_BASE + coinReward * XP_PER_COIN
