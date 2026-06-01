import type { AppAbility } from '../ability'
import { useAuthContext } from '../components/AuthProvider'

export function usePermissions(): AppAbility {
  return useAuthContext().ability
}
