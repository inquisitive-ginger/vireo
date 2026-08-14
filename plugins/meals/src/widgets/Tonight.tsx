import { Loader2 } from 'lucide-react'
import {
  FAMILY_PROFILE_ID,
  useAuth,
  useMutation,
  useQuery,
  useQueryClient,
} from '@family-os/platform'
import type { Profile } from '@family-os/platform/types'
import { useMemo } from 'react'
import type { MealMember, PlanResponse, PlannedMeal, WidgetSize } from '../types'
import { toDateKey } from '../lib/dates'
import { TonightView } from './TonightView'

/* `meals.tonight` widget — registered in manifest.json `widgets[]`. Reads the
   current week (the large size's strip needs all seven days; tonight is derived
   client-side from the local date). Key prefix `['meals/plan']` is shared with
   MealsPage so a plan or claim in either place refreshes both (ADR 013). */
interface TonightProps {
  /** Optional explicit density override — Storybook/tests only; the shell omits
      it and the view self-sizes via container queries. */
  size?: WidgetSize
}

export default function Tonight({ size }: TonightProps) {
  const { id, tier } = useAuth()
  const queryClient = useQueryClient()

  // Rolling window, not the calendar week — the NEXT UP lookahead runs three
  // days past today and must not go blank at a week boundary.
  const now = new Date()
  const fromKey = toDateKey(now)
  const toKey = toDateKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3))

  const { data, isLoading } = useQuery<PlanResponse>({
    queryKey: ['meals/plan', 'widget', id, fromKey],
    queryFn: () =>
      fetch(`/api/meals/plan?from=${fromKey}&to=${toKey}`).then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<PlanResponse>
      }),
    staleTime: 60_000,
    retry: 1,
  })

  const { data: profiles } = useQuery<Profile[]>({
    queryKey: ['api/profiles'],
    queryFn: () =>
      fetch('/api/profiles').then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<Profile[]>
      }),
    staleTime: 300_000,
    retry: 1,
  })

  const membersById = useMemo(() => {
    const map = new Map<string, MealMember>()
    for (const p of profiles ?? [])
      map.set(p.id, { name: p.name, identityHue: p.identityHue, avatarUrl: p.avatarUrl })
    return map
  }, [profiles])

  const claimMeal = useMutation({
    mutationFn: (meal: PlannedMeal) =>
      fetch(`/api/meals/plan/${meal.id}/claim`, { method: 'POST' }).then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<PlannedMeal>
      }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['meals/plan'] }),
  })

  if (isLoading) {
    return (
      <div className="flex size-full items-center justify-center">
        <Loader2 className="size-4 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <TonightView
      meals={data?.meals ?? []}
      membersById={membersById}
      now={now}
      viewerId={id === FAMILY_PROFILE_ID ? null : id}
      canClaim={tier >= 3 && id !== FAMILY_PROFILE_ID}
      canPlan={tier >= 4}
      onClaim={(meal) => claimMeal.mutate(meal)}
      size={size}
    />
  )
}
