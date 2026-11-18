import { useEffect, useMemo, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { FAMILY_PROFILE_ID, useAuth, useQuery } from '@family-os/platform'
import type { DayMark, Profile } from '@family-os/platform/types'
import type { EventsResponse, CalendarMember } from '../types'
import { agendaRange, localDateKey } from '../lib/grid'
import { useMarkAction } from '../lib/use-mark-action'
import { WEEK_WINDOW_DAYS } from '../lib/week'
import { UpNextView, type UpNextFraming } from './UpNextView'

/* `calendar.up-next` widget — registered in manifest.json `widgets[]`. Reads the
   forward window from GET /api/calendar/events (CASL scopes the result to the
   profile). The key prefix `['calendar/events']` is shared with CalendarPage so a
   create/edit there invalidates this widget too (ADR 013 prefix-match rule).

   Framing is derived from the active profile, mirroring chores: the family
   pseudo-profile (or a tier-4 parent on the shared tablet) gets the Family framing
   (owner names shown); a member's own profile gets the Mine framing. The shell
   renders `<UpNext />` with no size prop, so the view self-sizes via container
   queries. */
export default function UpNext() {
  const { id, tier } = useAuth()
  const isFamily = id === FAMILY_PROFILE_ID
  const framing: UpNextFraming = isFamily || tier >= 4 ? 'family' : 'mine'

  // A minute clock: the wall tablet keeps Home mounted for days, and the rides
  // line names the next run and acts on today (D-095), so neither may freeze.
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(tick)
  }, [])
  const dayKey = localDateKey(now)
  // One week, not the agenda's 42 days. The widget only ever renders today + 6,
  // so a deeper fetch bought nothing but a "+40 more" line that read as a backlog.
  // A multi-day span that STARTED before today still arrives: the API returns any
  // event overlapping the range, and `buildWeek` keeps the ones still running.
  const range = useMemo(
    () => agendaRange(new Date(`${dayKey}T00:00:00`), WEEK_WINDOW_DAYS),
    [dayKey]
  )

  // Profile-scoped key — changes on profile switch (ADR 013). Prefix shared with
  // CalendarPage: a `['calendar/events']` invalidation refreshes both.
  const { data, isLoading } = useQuery<EventsResponse>({
    queryKey: ['calendar/events', 'widget', id, dayKey],
    queryFn: () =>
      fetch(`/api/calendar/events?from=${range.from}&to=${range.to}`).then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<EventsResponse>
      }),
    staleTime: 60_000,
    retry: 1,
  })

  // Today's marks, for the rides line (D-095). Same key shape and prefix as the
  // page's, so a swap in either place refreshes both (ADR 013), and
  // profile-scoped for the same reason (ADR 066).
  const todayKey = dayKey
  const { data: marks } = useQuery<{ marks: DayMark[] }>({
    queryKey: ['calendar/day-marks', id, { from: todayKey, to: todayKey }],
    queryFn: () =>
      fetch(`/api/calendar/day-marks?from=${todayKey}&to=${todayKey}`).then((r) => {
        if (!r.ok) {
          console.error('[calendar] widget failed to load day marks', r.status)
          throw new Error(String(r.status))
        }
        return r.json() as Promise<{ marks: DayMark[] }>
      }),
    staleTime: 60_000,
    retry: 1,
  })
  const todayMark = marks?.marks.find((m) => m.lines)
  const markAction = useMarkAction()

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
    const map = new Map<string, CalendarMember>()
    for (const p of profiles ?? [])
      map.set(p.id, { name: p.name, identityHue: p.identityHue, avatarUrl: p.avatarUrl })
    return map
  }, [profiles])

  if (isLoading) {
    return (
      <div className="flex size-full items-center justify-center">
        <Loader2 className="size-4 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <UpNextView
      events={data?.events ?? []}
      membersById={membersById}
      now={now}
      framing={framing}
      todayMark={todayMark}
      onMarkAction={(mark, line, action) => markAction.mutate({ mark, line, action })}
      markPending={markAction.isPending}
      markFailed={markAction.isError}
    />
  )
}
