import { useQuery, useMutation, useQueryClient, useAuth } from '@family-os/platform'
import type { Profile } from '@family-os/platform/types'
import type {
  Reward,
  Redemption,
  PendingPayout,
  RewardInput,
  RedemptionAction,
  StoreData,
} from '../types'

async function jsonFetch<T>(url: string, init?: RequestInit): Promise<T> {
  // Only declare a JSON body when there IS one — Fastify's JSON parser 400s an empty
  // body sent with `Content-Type: application/json`, which a bodyless DELETE would trip.
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

// ─── Reads ──────────────────────────────────────────────────────────────────

export function useCatalog(includeRetired = true) {
  return useQuery({
    queryKey: ['rewards/catalog', includeRetired],
    queryFn: () =>
      jsonFetch<{ rewards: Reward[] }>(
        `/api/rewards/rewards${includeRetired ? '?includeRetired=true' : ''}`
      ).then((r) => r.rewards),
  })
}

/** Held chore payouts awaiting a decision. Shares the `['rewards/payouts']` key
    prefix with the chores board so one invalidation refreshes both (ADR 013). */
export function useQueuePayouts() {
  return useQuery({
    queryKey: ['rewards/payouts', 'queue'],
    queryFn: () =>
      jsonFetch<{ payouts: PendingPayout[] }>('/api/rewards/payouts?status=pending&limit=100').then(
        (r) => r.payouts
      ),
  })
}

/** Use requests the parent can answer (ADR 055) — the only redemption state that is
    the parent's business. */
export function useQueueRedemptions() {
  return useQuery({
    queryKey: ['rewards/redemptions', 'queue'],
    queryFn: () =>
      jsonFetch<{ redemptions: Redemption[] }>(
        '/api/rewards/redemptions?status=use_requested&limit=100'
      ).then((r) => r.redemptions),
  })
}

export function useProfiles() {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: () => jsonFetch<Profile[]>('/api/profiles'),
  })
}

/** The kid store (M4/5): the caller's balance + the whole active catalog scoped to
    them. Profile-scoped so a switch refetches (ADR 013); the widget shares this key so
    a redemption on the page refreshes the home Wallet too. */
export function useStore() {
  const { id } = useAuth()
  return useQuery({
    queryKey: ['rewards/store', id],
    queryFn: () => jsonFetch<StoreData>('/api/rewards/store'),
    enabled: !!id,
    staleTime: 60_000,
  })
}

/** The kid's pocket (ADR 055): `owned` tickets plus any `use_requested` ask in
    flight. Shares the `['rewards/redemptions']` prefix, so a purchase or a parent
    decision refreshes it. */
export function useMyRedemptions() {
  const { id } = useAuth()
  return useQuery({
    queryKey: ['rewards/redemptions', 'mine', id],
    queryFn: () =>
      jsonFetch<{ redemptions: Redemption[] }>(
        '/api/rewards/redemptions?status=owned,use_requested'
      ).then((r) => r.redemptions),
    enabled: !!id,
    staleTime: 60_000,
  })
}

/** Everything the kid has actually torn — used tickets, all time (the memory shelf).
    The P$ analogue to lifetime XP: a kid spends their balance down, but the rewards
    they've used accumulate. Shares the `['rewards/redemptions']` prefix so a tear
    refreshes it. */
export function useEarnedRewards() {
  const { id } = useAuth()
  return useQuery({
    queryKey: ['rewards/redemptions', 'earned', id],
    queryFn: () =>
      jsonFetch<{ redemptions: Redemption[] }>(
        '/api/rewards/redemptions?status=used&limit=100'
      ).then((r) => r.redemptions),
    enabled: !!id,
    staleTime: 60_000,
  })
}

/** Lifetime XP for the wallet's co-display footnote — the same source and key prefix
    as the chores ScorePlate (`['chores/xp']`), so one invalidation refreshes both. XP
    is read over HTTP (no plugin import), the pattern the chores widget already uses to
    read rewards payouts. */
export function useXp(enabled = true) {
  const { id } = useAuth()
  return useQuery({
    queryKey: ['chores/xp', id],
    queryFn: () => jsonFetch<{ totalXp: number }>('/api/chores/xp'),
    enabled: enabled && !!id,
    staleTime: 60_000,
    retry: 1,
  })
}

/** A kid buys a ticket (ADR 055): debits at once, lands `owned` — no parent gate at
    any price. Invalidates the store and wallet so the balance drops everywhere, and
    the redemptions prefix so the pocket gains the ticket. */
export function useRequestRedemption() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (rewardId: string) =>
      jsonFetch<{ redemption: Redemption; balance: number }>('/api/rewards/redemptions', {
        method: 'POST',
        body: JSON.stringify({ rewardId }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rewards/store'] })
      qc.invalidateQueries({ queryKey: ['rewards/wallet'] })
      qc.invalidateQueries({ queryKey: ['rewards/redemptions'] })
    },
  })
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCatalogMutations() {
  const qc = useQueryClient()
  const invalidate = () => qc.invalidateQueries({ queryKey: ['rewards/catalog'] })

  const create = useMutation({
    mutationFn: (input: RewardInput) =>
      jsonFetch<{ reward: Reward }>('/api/rewards/rewards', {
        method: 'POST',
        body: JSON.stringify(input),
      }),
    onSuccess: invalidate,
  })

  const update = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<RewardInput> }) =>
      jsonFetch<{ reward: Reward }>(`/api/rewards/rewards/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(input),
      }),
    onSuccess: invalidate,
  })

  const remove = useMutation({
    mutationFn: (id: string) =>
      jsonFetch<{ deleted?: boolean; retired?: boolean }>(`/api/rewards/rewards/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: invalidate,
  })

  return { create, update, remove }
}

export function useDecidePayout() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      decision,
      note,
    }: {
      id: string
      decision: 'approve' | 'decline'
      note?: string | null
    }) =>
      jsonFetch(`/api/rewards/payouts/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ decision, note }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['rewards/payouts'] }),
  })
}

export function useDecideRedemption() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      action,
      note,
    }: {
      id: string
      action: RedemptionAction
      note?: string | null
    }) =>
      jsonFetch(`/api/rewards/redemptions/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ action, note }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['rewards/redemptions'] }),
  })
}
