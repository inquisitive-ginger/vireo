import { useMemo, useState } from 'react'
import { Loader2 } from 'lucide-react'
import {
  FAMILY_PROFILE_ID,
  useAuth,
  useMutation,
  useQuery,
  useQueryClient,
} from '@family-os/platform'
import type { Profile } from '@family-os/platform/types'
import { ConfirmDialog, ErrorCard } from '@family-os/ui'
import type { MealMember, PlanResponse, PlannedMeal } from '../types'
import { toDateKey, weekDays, weekRangeLabel, weekStart } from '../lib/dates'
import { DINNER_DONE_HOUR, daysNeedingCook } from '../lib/meals'
import { MealDrawer, type MealDrawerInput } from '../components/MealDrawer'
import { MealsPageView, type WeekDay } from './MealsPageView'

export function MealsPage() {
  const { id, tier } = useAuth()
  const queryClient = useQueryClient()
  const [offset, setOffset] = useState(0)
  const [drawer, setDrawer] = useState<{ open: boolean; day: WeekDay | null }>({
    open: false,
    day: null,
  })
  // Set → the remove-confirm dialog is open for this meal (RowActions only
  // reports intent; the host confirms — the chores pattern).
  const [removeTarget, setRemoveTarget] = useState<PlannedMeal | null>(null)

  const canManage = tier >= 4
  const canClaim = tier >= 3 && id !== FAMILY_PROFILE_ID

  const now = new Date()
  const start = weekStart(now, offset)
  const days = weekDays(start)
  const fromKey = toDateKey(days[0])
  const toKey = toDateKey(days[6])

  // Profile-scoped key + the week's from-key; prefix shared with the widget
  // (['meals/plan']) so a plan/claim in either place refreshes both (ADR 013).
  const planQuery = useQuery<PlanResponse>({
    queryKey: ['meals/plan', id, fromKey],
    queryFn: () =>
      fetch(`/api/meals/plan?from=${fromKey}&to=${toKey}`).then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<PlanResponse>
      }),
    retry: 1,
  })

  const profilesQuery = useQuery<Profile[]>({
    queryKey: ['api/profiles'],
    queryFn: () =>
      fetch('/api/profiles').then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<Profile[]>
      }),
    staleTime: 300_000,
    retry: 1,
  })

  const members = useMemo(
    () => (profilesQuery.data ?? []).filter((m) => m.id !== FAMILY_PROFILE_ID),
    [profilesQuery.data]
  )
  const membersById = useMemo(() => {
    const map = new Map<string, MealMember>()
    for (const p of members)
      map.set(p.id, { name: p.name, identityHue: p.identityHue, avatarUrl: p.avatarUrl })
    return map
  }, [members])

  const mealsByDate = useMemo(() => {
    const map = new Map<string, PlannedMeal>()
    for (const meal of planQuery.data?.meals ?? []) map.set(meal.date, meal)
    return map
  }, [planQuery.data])

  const weekModel: WeekDay[] = days.map((date) => {
    const key = toDateKey(date)
    return { key, date, meal: mealsByDate.get(key) ?? null }
  })

  // Shares its key prefix with the calendar's day-mark query (ADR 013) — a
  // claim/plan/remove here has to invalidate BOTH: `meals/plan` refreshes this
  // page and the Tonight widget, `calendar/day-marks` is what makes the month
  // grid + agenda mark itself update without a reload (M5/4 AC6).
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['meals/plan'] })
    queryClient.invalidateQueries({ queryKey: ['calendar/day-marks'] })
  }

  const saveMeal = useMutation({
    mutationFn: ({ day, input }: { day: WeekDay; input: MealDrawerInput }) => {
      const editing = day.meal
      const url = editing ? `/api/meals/plan/${editing.id}` : '/api/meals/plan'
      return fetch(url, {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: day.key,
          notes: editing?.notes ?? null,
          ...input,
        }),
      }).then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<PlannedMeal>
      })
    },
    onSuccess: () => {
      void invalidate()
      setDrawer({ open: false, day: null })
    },
  })

  const claimMeal = useMutation({
    mutationFn: (meal: PlannedMeal) =>
      fetch(`/api/meals/plan/${meal.id}/claim`, { method: 'POST' }).then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<PlannedMeal>
      }),
    onSuccess: () => void invalidate(),
  })

  const removeMeal = useMutation({
    mutationFn: (meal: PlannedMeal) =>
      fetch(`/api/meals/plan/${meal.id}`, { method: 'DELETE' }).then((r) => {
        if (!r.ok) throw new Error(String(r.status))
      }),
    onSuccess: () => {
      void invalidate()
      setRemoveTarget(null)
    },
  })

  if (planQuery.isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (planQuery.isError) {
    return (
      <div className="p-6">
        <ErrorCard moduleName="Meals" onRetry={() => void planQuery.refetch()} />
      </div>
    )
  }

  const drawerDay = drawer.day
  const dayLabel = drawerDay
    ? drawerDay.date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      })
    : ''

  return (
    <>
      <MealsPageView
        days={weekModel}
        membersById={membersById}
        todayKey={toDateKey(now)}
        dinnerDone={now.getHours() >= DINNER_DONE_HOUR}
        weekTitle={weekRangeLabel(start)}
        needCount={
          offset < 0 ? null : daysNeedingCook(days, mealsByDate, offset === 0 ? now : days[0])
        }
        canManage={canManage}
        canClaim={canClaim}
        onPrevWeek={() => setOffset((o) => o - 1)}
        onNextWeek={() => setOffset((o) => o + 1)}
        onThisWeek={() => setOffset(0)}
        onPlan={(day) => setDrawer({ open: true, day })}
        onEdit={(day) => setDrawer({ open: true, day })}
        onClaim={(meal) => claimMeal.mutate(meal)}
        onRemove={(meal) => setRemoveTarget(meal)}
      />
      {removeTarget && (
        <ConfirmDialog
          open
          title={`Remove “${removeTarget.title}”?`}
          description="It comes off the week's plan. This can't be undone."
          confirmLabel="Remove"
          onConfirm={() => removeMeal.mutate(removeTarget)}
          onCancel={() => setRemoveTarget(null)}
          isPending={removeMeal.isPending}
        />
      )}
      <MealDrawer
        open={drawer.open}
        onClose={() => setDrawer({ open: false, day: null })}
        members={members}
        dayLabel={dayLabel}
        editingMeal={drawerDay?.meal ?? null}
        onSubmit={async (input) => {
          if (!drawerDay) return
          await saveMeal.mutateAsync({ day: drawerDay, input })
        }}
      />
    </>
  )
}
