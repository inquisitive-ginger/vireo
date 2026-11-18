import { useMemo } from 'react'
import { Loader2 } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  FAMILY_PROFILE_ID,
  useMutation,
  usePermissions,
  useQuery,
  useQueryClient,
} from '@family-os/platform'
import type { Profile } from '@family-os/platform/types'
import { Button, ErrorCard, PageContainer, PageHeader } from '@family-os/ui'
import { dateInWeek, type WeekRun } from '../lib/runs'
import { RidesWeek, type NewRun } from './RidesWeek'

function send(url: string, method: string, body?: unknown) {
  return fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  }).then((r) => {
    if (!r.ok) throw new Error(String(r.status))
  })
}

function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/* The week editor (D-097): no nav item, opened from "Set the week" in a day's
   runs. Changes hold from the opened week on. */
export function RidesPage() {
  const ability = usePermissions()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const on = params.get('on') ?? todayKey()
  const canEdit = ability.can('manage', 'rides.Run')

  const weekQuery = useQuery<{ runs: WeekRun[] }>({
    queryKey: ['rides/week', on],
    queryFn: () =>
      fetch(`/api/rides/week?on=${on}`).then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<{ runs: WeekRun[] }>
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

  const { kids, drivers } = useMemo(() => {
    const people = (profilesQuery.data ?? []).filter((p) => p.id !== FAMILY_PROFILE_ID)
    return {
      kids: people.filter((p) => p.tier < 4),
      drivers: people.filter((p) => p.tier === 4),
    }
  }, [profilesQuery.data])

  // The week shapes every coming day's mark (D-087), so the calendar's marks
  // refresh with it.
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['rides/week'] })
    queryClient.invalidateQueries({ queryKey: ['calendar/day-marks'] })
  }
  const onError = (err: Error) => console.error('[rides] change failed', err)

  const setDriver = useMutation({
    mutationFn: ({ run, driverId }: { run: WeekRun; driverId: string }) =>
      send(`/api/rides/runs/${run.id}/driver`, 'POST', { driverId, from: on }),
    onSuccess: refresh,
    onError,
  })
  const addRun = useMutation({
    mutationFn: ({ kidId, run }: { kidId: string; run: NewRun }) =>
      send('/api/rides/runs', 'POST', { kidId, ...run, from: on }),
    onSuccess: refresh,
    onError,
  })
  const removeRun = useMutation({
    mutationFn: (run: WeekRun) => send(`/api/rides/runs/${run.id}?from=${on}`, 'DELETE'),
    onSuccess: refresh,
    onError,
  })
  const failed = setDriver.isError || addRun.isError || removeRun.isError
  const monday = new Date(`${dateInWeek(on, 1)}T12:00:00`)

  return (
    <PageContainer width="list">
      <PageHeader
        title="School runs"
        subtitle={`Week of ${monday.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}. Changes hold from this week on.`}
        action={
          <Button
            size="sm"
            onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/calendar'))}
          >
            Done
          </Button>
        }
      />
      {weekQuery.isLoading || profilesQuery.isLoading ? (
        <Loader2
          className="mx-auto h-6 w-6 animate-spin text-muted-foreground"
          aria-label="Loading"
        />
      ) : weekQuery.isError || profilesQuery.isError ? (
        <ErrorCard
          moduleName="Rides"
          onRetry={() => {
            weekQuery.refetch()
            profilesQuery.refetch()
          }}
        />
      ) : (
        <>
          {failed && (
            <p role="alert" className="mb-3 text-sm-token text-error">
              That change didn't save. Try again.
            </p>
          )}
          <RidesWeek
            runs={weekQuery.data?.runs ?? []}
            kids={kids}
            drivers={drivers}
            canEdit={canEdit}
            onDriver={(run, driverId) => setDriver.mutate({ run, driverId })}
            onAdd={(kidId, run) => addRun.mutate({ kidId, run })}
            onRemove={(run) => removeRun.mutate(run)}
          />
        </>
      )}
    </PageContainer>
  )
}
