/* Client mirrors of the API serializers (apps/api/src/plugins/rewards.ts). */

export interface Reward {
  id: string
  name: string
  emoji: string
  description: string | null
  cost: number
  requiresApproval: boolean
  /** null = everyone; a list scopes the reward to specific kids. */
  audience: string[] | null
  /** null = unlimited. */
  stock: number | null
  active: boolean
}

export type RedemptionStatus = 'owned' | 'use_requested' | 'used'

export interface Redemption {
  id: string
  rewardId: string
  profileId: string
  cost: number
  status: RedemptionStatus
  purchasedAt: string
  useRequestedAt: string | null
  usedAt: string | null
  decidedBy: string | null
  decidedAt: string | null
  decidedNote: string | null
  /** Present on the queue/history list — the reward for rendering without a second fetch. */
  reward?: {
    id: string
    name: string
    emoji: string
    description: string | null
    requiresApproval: boolean
  }
}

/** A held chore payout (M4/3b), surfaced in the queue beside redemptions. */
export interface PendingPayout {
  id: string
  profileId: string
  amount: number
  reason: string
  sourceType: string
  sourceId: string
  status: 'pending' | 'approved' | 'declined' | 'voided'
  decidedBy: string | null
  decidedNote: string | null
  decidedAt: string | null
  createdAt: string
}

export interface RewardInput {
  name: string
  emoji: string
  description?: string | null
  cost: number
  requiresApproval: boolean
  audience?: string[] | null
  stock?: number | null
  active?: boolean
}

export type RedemptionAction = 'yes' | 'not_now'

/** A parent's bonus (M4/7). `grantId` is minted client-side per attempt, so a
    retried submit replays instead of paying twice. */
export interface GrantInput {
  profileId: string
  amount: number
  reason: string
  grantId: string
}

/** One row of GET /rewards/balances — the tier-4 Wallets tab's glance. */
export interface WalletBalance {
  profileId: string
  balance: number
}

/** One ledger move (ADR 047) as GET /rewards/wallet serializes it. `reason` is
    already human text ("Emptied the dishwasher", "Bought 🍦 Ice cream run"). */
export interface LedgerEntry {
  id: string
  delta: number
  reason: string
  sourceType: string
  sourceId: string | null
  createdBy: string | null
  createdAt: string
}

/** One GET /rewards/wallet page — the balance plus the entries that explain it. */
export interface WalletPage {
  profileId: string
  balance: number
  entries: LedgerEntry[]
  nextCursor: string | null
}

/** GET /rewards/store — the kid's balance plus the whole active catalog scoped to them
    (never pre-filtered by affordability; distance is a client rendering decision). */
export interface StoreData {
  profileId: string
  balance: number
  rewards: Reward[]
}

// ─── Punch cards (M4/6, ADR 049 · choice rework 2026-07-31) ──────────────────

/** A prize option resolved to its face — the sheet, the finish line, the parent row. */
export interface PrizeOption {
  id: string
  name: string
  emoji: string
  description: string | null
  cost: number
  requiresApproval: boolean
  active: boolean
}

export interface PunchTemplate {
  id: string
  name: string
  glyph: string
  goal: number
  payoutKind: 'coins' | 'reward'
  payoutCoins: number | null
  payoutOptionIds: string[]
  /** The option faces, resolved server-side. */
  payoutOptions: PrizeOption[] | null
  /** null = everyone (tiers 1–3). */
  audience: string[] | null
  active: boolean
}

export interface PunchCardData {
  id: string
  templateId: string
  profileId: string
  count: number
  chosenRewardId: string | null
  chosenReward: PrizeOption | null
  completedAt: string | null
  prizeClaimedAt: string | null
  createdAt: string
  lastPunchedAt: string | null
  template: PunchTemplate
}

/** Completed cards rolled up per (template, profile) — the finished-cards shelf. */
export interface FinishedCards {
  templateId: string
  profileId: string
  name: string
  glyph: string
  count: number
  lastFinishedAt: string | null
  prizeName: string | null
  prizeCoins: number | null
}

export interface PunchTemplateInput {
  name: string
  glyph: string
  goal: number
  payoutKind: 'coins' | 'reward'
  payoutCoins?: number | null
  payoutOptionIds?: string[] | null
  audience?: string[] | null
  active?: boolean
}
