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
