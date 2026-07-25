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

export type RedemptionStatus = 'pending' | 'granted' | 'declined' | 'fulfilled'

export interface Redemption {
  id: string
  rewardId: string
  profileId: string
  cost: number
  status: RedemptionStatus
  requestedAt: string
  decidedBy: string | null
  decidedAt: string | null
  decidedNote: string | null
  /** Present on the queue/history list — the reward for rendering without a second fetch. */
  reward?: { id: string; name: string; emoji: string; description: string | null }
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

export type RedemptionAction = 'grant' | 'decline' | 'fulfil'
