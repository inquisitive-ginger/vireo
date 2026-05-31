import type { Profile, TierLevel } from '@family-os/platform'

export function createProfile(tier: TierLevel, overrides?: Partial<Profile>): Profile {
  return {
    id: `test-profile-tier-${tier}`,
    name: `Test User Tier ${tier}`,
    tier,
    ...overrides,
  }
}

export const profileTier1 = createProfile(1)
export const profileTier2 = createProfile(2)
export const profileTier3 = createProfile(3)
export const profileTier4 = createProfile(4)
