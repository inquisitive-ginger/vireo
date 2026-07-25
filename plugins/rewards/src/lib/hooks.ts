import { useQuery, useMutation, useQueryClient } from '@family-os/platform'
import type { Profile } from '@family-os/platform/types'
import type { Reward, Redemption, PendingPayout, RewardInput, RedemptionAction } from '../types'

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

/** Redemptions the parent can act on: `pending` (decide) and `granted` (fulfil). */
export function useQueueRedemptions() {
  return useQuery({
    queryKey: ['rewards/redemptions', 'queue'],
    queryFn: () =>
      jsonFetch<{ redemptions: Redemption[] }>(
        '/api/rewards/redemptions?status=pending,granted&limit=100'
      ).then((r) => r.redemptions),
  })
}

export function useProfiles() {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: () => jsonFetch<Profile[]>('/api/profiles'),
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
