export type {
  TierLevel,
  EventName,
  BusMessage,
  EventBus,
  Profile,
  PermissionOverride,
  PermissionString,
  RegistryEntry,
  PluginManifest,
  NotifyPayload,
  NotifyVariant,
  NotificationRecord,
} from './types'

export { PERMISSION_REGISTRY, resolveFocusMode } from './types'

export type { AppAbility } from './ability'
export { createAbility } from './ability'

export type { AuthUser } from './components/AuthProvider'
export { AuthProvider, AuthContext } from './components/AuthProvider'
export { TierGate } from './components/TierGate'
export { PermissionGate } from './components/PermissionGate'

export { useAuth } from './hooks/useAuth'
export { useTier } from './hooks/useTier'
export { usePermissions } from './hooks/usePermissions'
export { useEventBus } from './hooks/useEventBus'
export { useNotify } from './hooks/useNotify'
export { usePushSubscription } from './hooks/usePushSubscription'
export type { PushSubscriptionState } from './hooks/usePushSubscription'

export { MockAuthProvider } from './testing'

// Re-export TanStack Query via the singleton so plugins share the shell's
// QueryClient (ADR 013 — server/plugin data is TanStack Query, per-plugin).
export { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// QueryClient + Provider from the same singleton path — plugin tests wrap with the
// identical instance the hooks resolve against (no second react-query copy).
export { QueryClient, QueryClientProvider } from '@tanstack/react-query'
