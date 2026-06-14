import type { Meta, StoryObj } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MockAuthProvider } from '@family-os/platform'
import { Rss, ClipboardList, Calendar, BookOpen, Wallet, Zap } from 'lucide-react'
import { Sidebar, type PluginNavItem } from './Sidebar'
import type { Profile } from '@family-os/platform'

// ─── All planned module nav items (injected as the shell's plugin-nav will eventually do) ──

const ALL_MODULE_ITEMS: PluginNavItem[] = [
  { to: '/family-feed', icon: <Rss size={18} aria-hidden />, label: 'Family Feed', minTier: 1 },
  { to: '/chores', icon: <ClipboardList size={18} aria-hidden />, label: 'Chores', minTier: 1 },
  { to: '/calendar', icon: <Calendar size={18} aria-hidden />, label: 'Calendar', minTier: 1 },
  { to: '/school', icon: <BookOpen size={18} aria-hidden />, label: 'School', minTier: 2 },
  { to: '/finance', icon: <Wallet size={18} aria-hidden />, label: 'Finance', minTier: 3 },
  { to: '/smart-home', icon: <Zap size={18} aria-hidden />, label: 'Smart Home', minTier: 3 },
]

// ─── Fixture profiles ──────────────────────────────────────────────────────────

const PROFILES = {
  parent: { id: 'zach', name: 'Zach', tier: 4 } satisfies Profile,
  child: { id: 'emmy', name: 'Emmy', tier: 2 } satisfies Profile,
  family: { id: 'family', name: 'Pritchett Family', tier: 1 } satisfies Profile,
}

const SIBLING_PROFILES = [
  { id: 'sarah', name: 'Sarah', tier: 4 },
  { id: 'emmy', name: 'Emmy', tier: 2 },
  { id: 'sam', name: 'Sam', tier: 3 },
]

// ─── Provider wrapper ──────────────────────────────────────────────────────────

function makeQueryClient(unreadCount = 0, maxSeverity: string | null = null) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } })
  qc.setQueryData(['notifications/unread'], { unreadCount, maxSeverity })
  qc.setQueryData(['notifications'], [])
  qc.setQueryData(['api/profiles'], SIBLING_PROFILES)
  return qc
}

function Shell({
  profile,
  activeRoute = '/',
  pluginNavItems = ALL_MODULE_ITEMS,
  unreadCount = 0,
  maxSeverity = null,
}: {
  profile: Profile
  activeRoute?: string
  pluginNavItems?: PluginNavItem[]
  unreadCount?: number
  maxSeverity?: string | null
}) {
  const qc = makeQueryClient(unreadCount, maxSeverity)
  return (
    <QueryClientProvider client={qc}>
      <MockAuthProvider profile={profile}>
        <MemoryRouter initialEntries={[activeRoute]}>
          <div className="flex h-screen w-screen overflow-hidden">
            <Sidebar pluginNavItems={pluginNavItems} />
            <main className="flex-1 overflow-auto bg-background" />
          </div>
        </MemoryRouter>
      </MockAuthProvider>
    </QueryClientProvider>
  )
}

// ─── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Platform/Sidebar',
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj

// ─── Stories ──────────────────────────────────────────────────────────────────

// Full nav, active at the top — main showcase
export const FullNav: Story = {
  name: 'Full nav — Home active',
  render: () => (
    <Shell profile={PROFILES.parent} activeRoute="/" unreadCount={3} maxSeverity="warning" />
  ),
}

// Active item mid-list — tests whether the pill reads in context
export const ActiveMidList: Story = {
  name: 'Full nav — active mid-list (Finance)',
  render: () => (
    <Shell profile={PROFILES.parent} activeRoute="/finance" unreadCount={1} maxSeverity="info" />
  ),
}

// Tier filtering in action — Finance and Smart Home hidden
export const ChildFiltered: Story = {
  name: 'Child (tier 2) — tier-filtered nav',
  render: () => <Shell profile={PROFILES.child} activeRoute="/chores" />,
}

// Minimal chrome — no bell, no settings, tier-1 items only
export const FamilyProfile: Story = {
  name: 'Family pseudo-profile — minimal chrome',
  render: () => (
    <Shell
      profile={PROFILES.family}
      activeRoute="/"
      pluginNavItems={ALL_MODULE_ITEMS.filter((i) => !i.minTier || i.minTier <= 1)}
    />
  ),
}
