import { Loader2 } from 'lucide-react'
import { FAMILY_PROFILE_ID, useAuth, useQuery } from '@family-os/platform'
import type { PendingPayout, TasksResponse } from '../types'
import { isToday } from '../lib/dates'
import { REWARDS_UI_ENABLED } from '../lib/flags'
import { indexPayouts } from '../lib/payouts'
import { TodaySummaryView, type WidgetSize } from './TodaySummaryView'

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
  /** Optional explicit density override. Normally omitted — the view self-sizes to
      its rendered box via CSS container queries (the content-widget standard;
      mirrors family-feed). */
  size?: WidgetSize
}

export default function TodaySummary({ size }: TodaySummaryProps) {
  const { id, tier, focusMode } = useAuth()
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

  // The payout outcome for each completed paying chore (M4/3b). Without it the widget
  // renders a completed row's `coinReward` raw, so a HELD payout and a DECLINED one both
  // read as banked — the row says a kid has money that is waiting on a parent, or that
  // a parent already refused. Key prefix `['rewards/payouts']` is shared with the page,
  // so a decision there refreshes this widget. Taskee framing only: the family/admin
  // dashboard shows other people's rows and decides nothing here.
  const { data: payoutData } = useQuery<{ payouts: PendingPayout[] }>({
    queryKey: ['rewards/payouts', id, 'widget'],
    queryFn: () =>
      fetch('/api/rewards/payouts?status=pending,approved,declined&limit=100').then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<{ payouts: PendingPayout[] }>
      }),
    enabled: REWARDS_UI_ENABLED && !usesFamilyFraming,
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

  // Daily XP — sum of TODAY's completed-task rewards only (auto-bug #73: this used
  // to sum every completed task ever, so XP and "done today" kept accumulating
  // across days once completions piled up with no daily reset). Read-only: the
  // score never grows here; the page ScorePlate is the flight target.
  const dailyXp = tasks
    .filter((t) => t.status === 'completed' && isToday(t.completedAt))
    .reduce((sum, t) => sum + t.xpReward, 0)
  // Falls back to the all-time completed-task sum until the XP query resolves so
  // the lifetime coin is never blank — unlike `dailyXp`, this one is deliberately
  // not date-scoped.
  const lifetimeXp =
    xp?.totalXp ??
    tasks.filter((t) => t.status === 'completed').reduce((sum, t) => sum + t.xpReward, 0)

  return (
    <TodaySummaryView
      tasks={tasks}
      tier={tier}
      isFamily={isFamily}
      size={size}
      lifetimeXp={lifetimeXp}
      dailyXp={dailyXp}
      focusMode={focusMode}
      payoutIndex={indexPayouts(payoutData?.payouts ?? [])}
    />
  )
}
