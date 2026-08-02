import { useAuth, useMutation, useQuery, useQueryClient } from '@family-os/platform'

/* Punch cards on the chores surface (M4/6 rework): earn lives with doing, so the
   kid punches HERE while the outputs — earned tickets, stubs, finished chips —
   stay in rewards' My stuff. chores reads /api/rewards/punch-cards over HTTP and
   imports nothing from the rewards plugin (ADR 048's boundary; the wallet's XP
   footnote established the read). The query keys are shared verbatim with the
   rewards surfaces — one QueryClient spans the plugins (ADR 013), so a parent's
   undo over there refreshes this tab too. */

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
  payoutOptions: PrizeOption[] | null
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
  template: PunchTemplate
}

export type PunchPayout =
  | { kind: 'coins'; coins: number; balance: number; fallback?: boolean }
  | { kind: 'reward'; redemptionId: string; rewardId: string; emoji: string; name: string }

export interface PunchResponse {
  card: PunchCardData
  completed: boolean
  payout: PunchPayout | null
  prizePending: boolean
}

async function jsonFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      ...(init?.body != null ? { 'Content-Type': 'application/json' } : {}),
      ...(init?.headers ?? {}),
    },
  })
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: unknown } | null
    const message = typeof body?.error === 'string' ? body.error : `Request failed (${res.status})`
    throw new Error(message)
  }
  return res.json() as Promise<T>
}

/** The kid's cards — open ones plus any finished card still waiting on its prize
    pick. The read materializes missing cards server-side. */
export function usePunchCards() {
  const { id } = useAuth()
  return useQuery({
    queryKey: ['rewards/cards', 'mine', id],
    queryFn: () =>
      jsonFetch<{ cards: PunchCardData[] }>('/api/rewards/punch-cards').then((r) => r.cards),
    enabled: !!id,
    staleTime: 60_000,
  })
}

/** The stamp (ADR 049): instant, no confirm. A completion moves money or mints a
    ticket, so it refreshes the wallet, store and redemptions prefixes too. */
export function usePunch() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (cardId: string) =>
      jsonFetch<PunchResponse>(`/api/rewards/punch-cards/${cardId}/punch`, { method: 'POST' }),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['rewards/cards'] })
      if (data.completed) {
        qc.invalidateQueries({ queryKey: ['rewards/wallet'] })
        qc.invalidateQueries({ queryKey: ['rewards/store'] })
        qc.invalidateQueries({ queryKey: ['rewards/redemptions'] })
      }
    },
  })
}

/** Names the prize on an open card (just the pointer, changeable) — or claims it
    on a full one, which mints and so refreshes the money surfaces. */
export function useChoosePrize() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ cardId, rewardId }: { cardId: string; rewardId: string | null }) =>
      jsonFetch<{ card: PunchCardData; payout: PunchPayout | null }>(
        `/api/rewards/punch-cards/${cardId}/prize`,
        { method: 'POST', body: JSON.stringify({ rewardId }) }
      ),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['rewards/cards'] })
      if (data.payout) {
        qc.invalidateQueries({ queryKey: ['rewards/wallet'] })
        qc.invalidateQueries({ queryKey: ['rewards/store'] })
        qc.invalidateQueries({ queryKey: ['rewards/redemptions'] })
      }
    },
  })
}
