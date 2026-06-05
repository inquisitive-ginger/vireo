import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@family-os/platform'

export function RequireTier2() {
  const { tier } = useAuth()
  if (tier < 2) return <Navigate to="/" replace />
  return <Outlet />
}
