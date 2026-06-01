import type { ReactNode } from 'react'
import { useAuthContext } from './AuthProvider'

type Props = {
  action: string
  subject: string
  fallback?: ReactNode
  children: ReactNode
}

export function PermissionGate({ action, subject, fallback = null, children }: Props) {
  const { ability } = useAuthContext()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ability.can(action as any, subject as any) ? <>{children}</> : <>{fallback}</>
}
