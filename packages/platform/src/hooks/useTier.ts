import type { TierLevel } from '../types'
import { useAuthContext } from '../components/AuthProvider'

export function useTier(): TierLevel {
  return useAuthContext().user.tier
}
