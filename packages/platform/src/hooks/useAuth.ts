import { useAuthContext, type AuthUser } from '../components/AuthProvider'

export function useAuth(): AuthUser {
  return useAuthContext().user
}
