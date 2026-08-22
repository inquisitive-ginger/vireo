import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MockAuthProvider } from '@family-os/platform'
import type { Profile } from '@family-os/platform'
import { MobileBrandTopBar } from './MobileBrandTopBar'

// ─── Fixture profiles ──────────────────────────────────────────────────────────

const PROFILES = {
  parent: { id: 'zach', name: 'Zach', tier: 4 } satisfies Profile,
  child: { id: 'emmy', name: 'Emmy', tier: 2 } satisfies Profile,
}

// ─── Provider wrapper ──────────────────────────────────────────────────────────

function makeQueryClient(unreadCount = 0, maxSeverity: string | null = null) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } })
  qc.setQueryData(['notifications/unread'], { unreadCount, maxSeverity })
  qc.setQueryData(['notifications'], [])
  return qc
}

function TopBarFrame({
  profile,
  unreadCount = 0,
  maxSeverity = null,
  defaultProfileOpen = false,
}: {
  profile: Profile
  unreadCount?: number
  maxSeverity?: string | null
  defaultProfileOpen?: boolean
}) {
  const qc = makeQueryClient(unreadCount, maxSeverity)
  const [profileOpen, setProfileOpen] = useState(defaultProfileOpen)
  return (
    <QueryClientProvider client={qc}>
      <MockAuthProvider profile={profile}>
        <div style={{ width: 375 }}>
          <MobileBrandTopBar
            name={profile.name}
            profileOpen={profileOpen}
            onProfileClick={() => setProfileOpen((v) => !v)}
          />
        </div>
      </MockAuthProvider>
    </QueryClientProvider>
  )
}

// ─── Meta ──────────────────────────────────────────────────────────────────────

/**
 * Mobile brand top bar (ADR 034). Three-slot header: profile avatar (left) ·
 * "Vireo" wordmark (center) · notification bell (right). Visible only on
 * mobile (`md:hidden`). Hidden at `md:` and up where the sidebar takes over.
 */
const meta: Meta = {
  title: 'Platform/MobileBrandTopBar',
  parameters: { layout: 'centered' },
}
export default meta
type Story = StoryObj

// ─── Stories ──────────────────────────────────────────────────────────────────

// Default quiet state — no badge, profile closed
export const Quiet: Story = {
  name: 'Default — no notifications',
  render: () => <TopBarFrame profile={PROFILES.parent} />,
}

// Bell badge visible — the most common ambient state on mobile
export const WithInfoBadge: Story = {
  name: 'Bell badge — info severity',
  render: () => <TopBarFrame profile={PROFILES.parent} unreadCount={2} maxSeverity="info" />,
}

export const WithWarningBadge: Story = {
  name: 'Bell badge — warning severity',
  render: () => <TopBarFrame profile={PROFILES.parent} unreadCount={5} maxSeverity="warning" />,
}

// Avatar active state — shows the ring/highlight when profile grid is open
export const ProfileOpen: Story = {
  name: 'Profile open — avatar active state',
  render: () => <TopBarFrame profile={PROFILES.parent} defaultProfileOpen />,
}

// Profile open + badge — both active simultaneously
export const ProfileOpenWithBadge: Story = {
  name: 'Profile open + bell badge',
  render: () => (
    <TopBarFrame
      profile={PROFILES.parent}
      unreadCount={3}
      maxSeverity="warning"
      defaultProfileOpen
    />
  ),
}

// Tier 2 child — bell still renders (minTier for bell is 2)
export const ChildProfile: Story = {
  name: 'Child profile (tier 2)',
  render: () => <TopBarFrame profile={PROFILES.child} unreadCount={1} maxSeverity="info" />,
}
