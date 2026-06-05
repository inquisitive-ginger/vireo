import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@family-os/platform'

export function RequireTier4() {
  const { tier } = useAuth()
  if (tier < 4) return <Navigate to="/" replace />
  return <Outlet />
}
