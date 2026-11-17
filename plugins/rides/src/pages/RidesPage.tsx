import { useMemo } from 'react'
import { Loader2 } from 'lucide-react'
import {
  FAMILY_PROFILE_ID,
  useMutation,
  usePermissions,
  useQuery,
  useQueryClient,
} from '@family-os/platform'
import type { Profile } from '@family-os/platform/types'
import { ErrorCard, PageContainer, PageHeader } from '@family-os/ui'
import type { SchoolRun } from '../lib/runs'
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

export function RidesPage() {
  const ability = usePermissions()
  const queryClient = useQueryClient()
  const canEdit = ability.can('manage', 'rides.Run')

  const runsQuery = useQuery<{ runs: SchoolRun[] }>({
    queryKey: ['rides/runs'],
    queryFn: () =>
      fetch('/api/rides/runs').then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<{ runs: SchoolRun[] }>
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

  // The usual week also changes every coming day's mark (D-087), so the
  // calendar's marks refresh with it.
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['rides/runs'] })
    queryClient.invalidateQueries({ queryKey: ['calendar/day-marks'] })
  }
  const onError = (err: Error) => console.error('[rides] change failed', err)

  const setDriver = useMutation({
    mutationFn: ({ run, driverId }: { run: SchoolRun; driverId: string | null }) =>
      send(`/api/rides/runs/${run.id}`, 'PATCH', { driverId }),
    onSuccess: refresh,
    onError,
  })
  const addRun = useMutation({
    mutationFn: ({ kidId, run }: { kidId: string; run: NewRun }) =>
      send('/api/rides/runs', 'POST', { kidId, ...run }),
    onSuccess: refresh,
    onError,
  })
  const removeRun = useMutation({
    mutationFn: (run: SchoolRun) => send(`/api/rides/runs/${run.id}`, 'DELETE'),
    onSuccess: refresh,
    onError,
  })
  const failed = setDriver.isError || addRun.isError || removeRun.isError

  return (
    <PageContainer width="list">
      <PageHeader title="Rides" subtitle="Who usually drives each school run" />
      {runsQuery.isLoading || profilesQuery.isLoading ? (
        <Loader2
          className="mx-auto h-6 w-6 animate-spin text-muted-foreground"
          aria-label="Loading"
        />
      ) : runsQuery.isError || profilesQuery.isError ? (
        <ErrorCard
          moduleName="Rides"
          onRetry={() => {
            runsQuery.refetch()
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
            runs={runsQuery.data?.runs ?? []}
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
