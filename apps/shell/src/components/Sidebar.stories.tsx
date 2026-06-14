import type { Meta, StoryObj } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MockAuthProvider } from '@family-os/platform'
import { Rss, ClipboardList, Calendar, BookOpen, Wallet, Zap, Home } from 'lucide-react'
import { Sidebar, type PluginNavItem } from './Sidebar'
import { cn } from '@family-os/ui'
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

// ─── Nav item active/hover style playground ────────────────────────────────────

type PreviewItem = { icon: React.ReactNode; label: string; active?: boolean; hovered?: boolean }

const PREVIEW_ITEMS: PreviewItem[] = [
  { icon: <Home size={18} aria-hidden />, label: 'Home', active: true },
  { icon: <Rss size={18} aria-hidden />, label: 'Family Feed', hovered: true },
  { icon: <ClipboardList size={18} aria-hidden />, label: 'Chores' },
  { icon: <Calendar size={18} aria-hidden />, label: 'Calendar' },
]

function StateBadge({ label }: { label: string }) {
  return (
    <span className="ml-auto text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wide shrink-0">
      {label}
    </span>
  )
}

function PreviewPanel({
  label,
  note,
  children,
}: {
  label: string
  note: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-xs font-semibold text-foreground uppercase tracking-wide">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{note}</p>
      </div>
      <div className="w-[220px] bg-secondary rounded-lg py-2">{children}</div>
    </div>
  )
}

function ItemCurrent({ icon, label, active, hovered }: PreviewItem) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 mx-1 rounded-md text-sm min-h-[48px]',
        active
          ? 'bg-primary/20 text-primary font-medium'
          : hovered
            ? 'bg-primary/10 text-foreground'
            : 'text-muted-foreground'
      )}
    >
      {icon}
      <span>{label}</span>
      {active && <StateBadge label="active" />}
      {hovered && <StateBadge label="hover" />}
    </div>
  )
}

function ItemAccentBar({ icon, label, active, hovered }: PreviewItem) {
  return (
    <div
      className={cn(
        'relative overflow-hidden flex items-center gap-3 px-3 py-2.5 mx-1 rounded-md text-sm min-h-[48px]',
        active
          ? 'bg-primary/15 text-primary font-medium'
          : hovered
            ? 'bg-primary/8 text-foreground'
            : 'text-muted-foreground'
      )}
    >
      {active && <span aria-hidden className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary" />}
      {icon}
      <span>{label}</span>
      {active && <StateBadge label="active" />}
      {hovered && <StateBadge label="hover" />}
    </div>
  )
}

function ItemSolidPill({ icon, label, active, hovered }: PreviewItem) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 mx-1 rounded-md text-sm min-h-[48px]',
        active
          ? 'bg-primary text-primary-foreground font-medium'
          : hovered
            ? 'bg-primary/12 text-foreground'
            : 'text-muted-foreground'
      )}
    >
      {icon}
      <span>{label}</span>
      {active && <StateBadge label="active" />}
      {hovered && <StateBadge label="hover" />}
    </div>
  )
}

function ItemTextOnly({ icon, label, active, hovered }: PreviewItem) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 mx-1 rounded-md text-sm min-h-[48px]',
        active
          ? 'text-primary font-semibold'
          : hovered
            ? 'bg-primary/8 text-foreground'
            : 'text-muted-foreground'
      )}
    >
      {icon}
      <span>{label}</span>
      {active && <StateBadge label="active" />}
      {hovered && <StateBadge label="hover" />}
    </div>
  )
}

export const NavStylePlayground: Story = {
  name: 'UX playground — nav active state variants',
  render: () => (
    <div className="min-h-screen bg-background p-10 flex flex-col gap-8">
      <div>
        <h2 className="text-base font-semibold text-foreground">Nav active state options</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Active and hover states shown inline. "Family Feed" has forced hover styles applied.
        </p>
      </div>
      <div className="flex flex-wrap gap-10">
        <PreviewPanel label="Current" note="active bg-primary/20 · hover bg-primary/10">
          {PREVIEW_ITEMS.map((item) => (
            <ItemCurrent key={item.label} {...item} />
          ))}
        </PreviewPanel>

        <PreviewPanel
          label="A — Left accent bar"
          note="active abs-span bg-primary + bg-primary/15 · hover bg-primary/8"
        >
          {PREVIEW_ITEMS.map((item) => (
            <ItemAccentBar key={item.label} {...item} />
          ))}
        </PreviewPanel>

        <PreviewPanel label="B — Solid pill" note="active bg-primary · hover bg-primary/12">
          {PREVIEW_ITEMS.map((item) => (
            <ItemSolidPill key={item.label} {...item} />
          ))}
        </PreviewPanel>

        <PreviewPanel
          label="C — Text only"
          note="active text-primary font-semibold · hover bg-primary/8"
        >
          {PREVIEW_ITEMS.map((item) => (
            <ItemTextOnly key={item.label} {...item} />
          ))}
        </PreviewPanel>
      </div>
    </div>
  ),
}
