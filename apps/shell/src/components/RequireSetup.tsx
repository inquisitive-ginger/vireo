import { useQuery } from '@tanstack/react-query'
import { Navigate, Outlet } from 'react-router-dom'

type SetupStatus = { needsSetup: boolean; currentStep: 1 | 2 | 3 | null }

export function RequireSetup() {
  const { data, isPending, isError } = useQuery<SetupStatus>({
    queryKey: ['api/setup/status'],
    queryFn: () =>
      fetch('/api/setup/status').then((r) => {
        if (!r.ok) throw new Error('setup status unavailable')
        return r.json()
      }),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  })

  if (isPending) return null
  if (isError || data?.needsSetup) return <Navigate to="/onboarding" replace />
  return <Outlet />
}
