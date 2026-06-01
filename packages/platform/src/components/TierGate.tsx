import type { ReactNode } from 'react'
import type { TierLevel } from '../types'
import { useAuthContext } from './AuthProvider'

type Props = {
  min: TierLevel
  fallback?: ReactNode
  children: ReactNode
}

export function TierGate({ min, fallback = null, children }: Props) {
  const { user } = useAuthContext()
  return user.tier >= min ? <>{children}</> : <>{fallback}</>
}
