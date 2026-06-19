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

   Lifetime XP is local/optimistic — seeded from completed tasks exactly as in
   TaskeeView / ScorePlate (design §2; the XP Award story swaps this for the
   persisted balance). No call to GET /api/chores/xp: that route is built in the
   XP Award session, not here.

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

  if (isLoading) {
    return (
      <div className="flex size-full items-center justify-center">
        <Loader2 className="size-4 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const tasks = data?.tasks ?? []

  // Local/optimistic lifetime XP — seeded from already-completed tasks (ScorePlate
  // pattern). Widget is read-only so the XP never grows here; the score plate on
  // the full page is the flight target.
  const lifetimeXp = tasks
    .filter((t) => t.status === 'completed')
    .reduce((sum, t) => sum + t.xpReward, 0)

  return (
    <TodaySummaryView
      tasks={tasks}
      tier={tier}
      isFamily={isFamily}
      size={size}
      lifetimeXp={lifetimeXp}
    />
  )
}
