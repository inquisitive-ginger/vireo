import { useMemo } from 'react'
import { Loader2 } from 'lucide-react'
import { FAMILY_PROFILE_ID, useAuth, useQuery } from '@family-os/platform'
import type { Profile } from '@family-os/platform/types'
import type { EventsResponse } from '../types'
import { agendaRange } from '../lib/grid'
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

  // Stable "now" for the render so the countdown / day labels don't churn.
  const now = useMemo(() => new Date(), [])
  const range = useMemo(() => agendaRange(now), [now])

  // Profile-scoped key — changes on profile switch (ADR 013). Prefix shared with
  // CalendarPage: a `['calendar/events']` invalidation refreshes both.
  const { data, isLoading } = useQuery<EventsResponse>({
    queryKey: ['calendar/events', 'widget', id],
    queryFn: () =>
      fetch(`/api/calendar/events?from=${range.from}&to=${range.to}`).then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<EventsResponse>
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
    const map = new Map<string, string>()
    for (const p of profiles ?? []) map.set(p.id, p.name)
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
    <UpNextView events={data?.events ?? []} membersById={membersById} now={now} framing={framing} />
  )
}
