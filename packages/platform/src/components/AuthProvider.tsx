import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { createPrismaAbility } from '@casl/prisma'
import type { RawRuleOf } from '@casl/ability'
import type { TierLevel } from '../types'
import type { AppAbility } from '../ability'

export type AuthUser = {
  id: string
  name: string
  tier: TierLevel
  avatarUrl?: string | null
  /** The member's assigned identity colour (ADR 044). */
  identityHue?: string | null
  darkMode?: boolean | null
  /** Effective taskee variant from /auth/me (already resolved against tier). */
  focusMode?: boolean
  pushEnabled?: boolean
  familyName?: string | null
}

type AuthMeResponse = AuthUser & { rules: RawRuleOf<AppAbility>[] }

type AuthContextValue = {
  user: AuthUser
  ability: AppAbility
  invalidate: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

const FAMILY_FALLBACK: AuthUser = { id: '', name: 'Family', tier: 1 }

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider')
  return ctx
}

function AuthLoader({ children, queryClient }: { children: ReactNode; queryClient: QueryClient }) {
  const { data } = useQuery<AuthMeResponse>({
    queryKey: ['api/auth/me'],
    queryFn: () => fetch('/api/auth/me').then((r) => r.json()) as Promise<AuthMeResponse>,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  })

  const user: AuthUser = data
    ? {
        id: data.id,
        name: data.name,
        tier: data.tier,
        avatarUrl: data.avatarUrl,
        identityHue: data.identityHue,
        darkMode: data.darkMode,
        focusMode: data.focusMode,
        pushEnabled: data.pushEnabled ?? false,
        familyName: data.familyName,
      }
    : FAMILY_FALLBACK

  useEffect(() => {
    const root = document.documentElement
    if (user.darkMode === true) root.setAttribute('data-theme', 'dark')
    else if (user.darkMode === false) root.setAttribute('data-theme', 'light')
    else root.removeAttribute('data-theme')
  }, [user.darkMode])

  const ability = useMemo(() => createPrismaAbility<AppAbility>(data?.rules ?? []), [data?.rules])

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['api/auth/me'] })

  return (
    <AuthContext.Provider value={{ user, ability, invalidate }}>{children}</AuthContext.Provider>
  )
}

const defaultQueryClient = new QueryClient()

export function AuthProvider({
  children,
  queryClient = defaultQueryClient,
}: {
  children: ReactNode
  queryClient?: QueryClient
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthLoader queryClient={queryClient}>{children}</AuthLoader>
    </QueryClientProvider>
  )
}
