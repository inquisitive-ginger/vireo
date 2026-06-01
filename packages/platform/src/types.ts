export type TierLevel = 1 | 2 | 3 | 4

export type EventName = `${string}.${string}.${string}`

export type BusMessage = { event: EventName; payload: unknown }

export type EventBus = {
  emit(event: EventName, payload: unknown): void
  on(event: EventName, handler: (payload: unknown) => void): () => void
  onAny(handler: (message: BusMessage) => void): () => void
}

export type Profile = {
  id: string
  name: string
  tier: TierLevel
  avatarUrl?: string
}

export type PermissionOverride = {
  id: string
  profileId: string
  action: string
  subject: string
  type: 'grant' | 'revocation'
  grantedBy?: string
}

export const PERMISSION_REGISTRY = {
  'platform.profile.view': {
    label: 'View profiles',
    module: 'platform',
    action: 'view',
    subject: 'platform.Profile',
  },
  'platform.profile.switch': {
    label: 'Switch active profile',
    module: 'platform',
    action: 'switch',
    subject: 'platform.Profile',
  },
  'platform.plugin.view': {
    label: 'Use plugins',
    module: 'platform',
    action: 'view',
    subject: 'platform.Plugin',
  },
} as const

export type PermissionString = keyof typeof PERMISSION_REGISTRY

export type PluginManifest = {
  name: string
  version: string
  remoteEntry: string
  exposes: string[]
  routes: string[]
  schema: string
  events: {
    publishes: EventName[]
    subscribes: EventName[]
  }
  widgets?: unknown[] // typed WidgetManifest added by M1 widget system story (ADR 022)
}
