import { Loader2 } from 'lucide-react'
import { useAuth, useQuery } from '@family-os/platform'
import type { TasksResponse } from '../types'
import { TodaySummaryView, type WidgetSize } from './TodaySummaryView'

const FAMILY_PROFILE_ID = 'family'

/* `chores.today-summary` widget — registered in manifest.json `widgets[]`.
   Reads from GET /api/chores/tasks (same endpoint as the page; CASL filtering
   scopes the result to the profile automatically). The key prefix `['chores/tasks']`
   is shared with the ChoresPage so a task completion on the page invalidates this
   widget too (ADR 013 prefix-match rule).

   Lifetime XP comes from the persisted balance (GET /api/chores/xp, shipped in XP
   Award #23) — same source as the page's ScorePlate, profile-scoped so a switch
   refetches. Only taskees have a score; the family/admin framing carries no XP, so
   the query is disabled there. Daily XP is the sum of today's completed-task
   rewards (the "+N today" header signal — read-only, never grows here).

   Size comes from the `size` prop set by the shell's WidgetGrid — compact, standard
   or large (manifest supportedSizes). The whole tile is a deep-link to /chores
   (read-only MVP; inline-complete is 1.5). */
interface TodaySummaryProps {
  /** Injected by WidgetGrid from the layout record. Defaults to 'standard'. */
  size?: WidgetSize
}

export default function TodaySummary({ size = 'standard' }: TodaySummaryProps) {
  const { id, tier } = useAuth()
  const isFamily = id === FAMILY_PROFILE_ID
  const usesFamilyFraming = isFamily || tier >= 4

  // Profile-scoped key — changes on profile switch, triggers a refetch (ADR 013).
  // Prefix shared with ChoresPage: ['chores/tasks'] invalidation refreshes both.
  const { data, isLoading } = useQuery<TasksResponse>({
    queryKey: ['chores/tasks', 'widget', id],
    queryFn: () =>
      fetch('/api/chores/tasks').then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<TasksResponse>
      }),
    staleTime: 60_000,
    retry: 1,
  })

  // Persisted lifetime XP — taskee framing only. Key prefix shared with the page's
  // ScorePlate query (['chores/xp']) so a completion's invalidation refreshes both.
  const { data: xp } = useQuery<{ totalXp: number }>({
    queryKey: ['chores/xp', id],
    queryFn: () =>
      fetch('/api/chores/xp').then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<{ totalXp: number }>
      }),
    enabled: !usesFamilyFraming,
    staleTime: 60_000,
    retry: 1,
  })

  if (isLoading) {
    return (
      <div className="flex size-full items-center justify-center">
        <Loader2 className="size-4 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const tasks = data?.tasks ?? []

  // Daily XP — sum of today's completed-task rewards (the widget's working set is
  // "today"). Read-only: the score never grows here; the page ScorePlate is the
  // flight target. Falls back to the completed-task sum for lifetime until the XP
  // query resolves so the coin is never blank.
  const dailyXp = tasks
    .filter((t) => t.status === 'completed')
    .reduce((sum, t) => sum + t.xpReward, 0)
  const lifetimeXp = xp?.totalXp ?? dailyXp

  return (
    <TodaySummaryView
      tasks={tasks}
      tier={tier}
      isFamily={isFamily}
      size={size}
      lifetimeXp={lifetimeXp}
      dailyXp={dailyXp}
    />
  )
}
