import type { ReactNode } from 'react'
import { AuthContext } from './components/AuthProvider'
import { createAbility } from './ability'
import type { Profile } from './types'
import type { AuthUser } from './components/AuthProvider'

export function MockAuthProvider({ profile, children }: { profile: Profile; children: ReactNode }) {
  const ability = createAbility(profile, [])
  const user: AuthUser = { id: profile.id, name: profile.name, tier: profile.tier }
  return (
    <AuthContext.Provider value={{ user, ability, invalidate: () => {} }}>
      {children}
    </AuthContext.Provider>
  )
}
