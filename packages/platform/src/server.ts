// Server-side platform API — type exports only for M0
// createEventBusPlugin added by event-bus story
// createAbility added by auth-and-profiles story
import type { EventName } from './types'

export type { Profile, PermissionOverride, PermissionString, TierLevel } from './types'

export type EventBus = {
  emit(event: EventName, payload: unknown): void
  on(event: EventName, handler: (payload: unknown) => void): void
}
