import type { Meta, StoryObj } from '@storybook/react'
import {
  Home,
  Rss,
  ClipboardList,
  Calendar,
  BookOpen,
  Wallet,
  Zap,
  Bell,
  Settings,
  ChevronRight,
} from 'lucide-react'
import { cn } from '../lib/utils'
import { ProfileAvatar } from './profile-avatar'

const meta: Meta = {
  title: 'Shell/NavRail',
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj

// ─── Static mock — no router/auth deps ───────────────────────────────────────

type NavItem = {
  label: string
  icon: React.ReactNode
  active?: boolean
  tier?: number
}

const ALL_ITEMS: NavItem[] = [
  { label: 'Home', icon: <Home size={18} aria-hidden /> },
  { label: 'Family Feed', icon: <Rss size={18} aria-hidden /> },
  { label: 'Chores', icon: <ClipboardList size={18} aria-hidden /> },
  { label: 'Calendar', icon: <Calendar size={18} aria-hidden /> },
  { label: 'School', icon: <BookOpen size={18} aria-hidden />, tier: 2 },
  { label: 'Finance', icon: <Wallet size={18} aria-hidden />, tier: 3 },
  { label: 'Smart Home', icon: <Zap size={18} aria-hidden />, tier: 3 },
]

function MockNavItem({ label, icon, active }: NavItem) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 mx-1 rounded-md text-sm min-h-[48px] cursor-default select-none',
        active
          ? 'bg-primary/20 text-primary font-medium'
          : 'text-muted-foreground hover:bg-primary/10 hover:text-foreground'
      )}
    >
      {icon}
      <span>{label}</span>
    </div>
  )
}

function MockProfileChip({
  name,
  open = false,
  identity,
}: {
  name: string
  open?: boolean
  identity?: string
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 min-h-[56px] mb-1 cursor-default select-none',
        open ? 'bg-primary/15' : ''
      )}
    >
      <ProfileAvatar name={name} size="sm" active identity={identity as never} />
      <span className="text-sm font-medium truncate flex-1">{name}</span>
      <ChevronRight
        size={14}
        className={cn('text-muted-foreground shrink-0', open && 'rotate-90')}
      />
    </div>
  )
}

function MockBell({ count = 0 }: { count?: number }) {
  return (
    <div className="px-1 py-1">
      <div className="flex items-center gap-3 px-3 py-2.5 mx-1 rounded-md text-sm min-h-[48px] text-muted-foreground cursor-default select-none relative w-fit">
        <Bell size={18} aria-hidden />
        {count > 0 && (
          <span
            className="absolute top-2 left-5 min-w-[16px] h-4 rounded-full bg-accent text-accent-foreground text-xs font-semibold flex items-center justify-center px-1"
            aria-label={`${count} unread notifications`}
          >
            {count}
          </span>
        )}
      </div>
    </div>
  )
}

function MockSettings() {
  return (
    <div className="py-2">
      <MockNavItem label="Settings" icon={<Settings size={18} aria-hidden />} />
    </div>
  )
}

// ─── Content area stand-in ────────────────────────────────────────────────────

function ContentArea({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex-1 bg-background p-6 overflow-auto" style={{ minHeight: '100vh' }}>
      {children ?? (
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border"
              style={{
                background: 'var(--card)',
                boxShadow: 'var(--shadow-card)',
                height: 180,
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'flex-start',
                color: 'var(--muted-foreground)',
                fontSize: 12,
                fontFamily: 'var(--font-ui)',
              }}
            >
              Widget slot
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Sidebar shell ────────────────────────────────────────────────────────────

function Sidebar({
  items,
  profile,
  identity,
  bellCount = 0,
  showSettings = false,
}: {
  items: NavItem[]
  profile: string
  identity?: string
  bellCount?: number
  showSettings?: boolean
}) {
  return (
    <aside
      className="w-[220px] shrink-0 h-screen flex flex-col bg-secondary relative"
      style={{ minHeight: '100vh' }}
    >
      <MockProfileChip name={profile} identity={identity} />
      <nav className="flex-1 py-2" aria-label="Main navigation">
        {items.map((item) => (
          <MockNavItem key={item.label} {...item} />
        ))}
      </nav>
      <MockBell count={bellCount} />
      {showSettings && <MockSettings />}
    </aside>
  )
}

function Shell({
  items,
  profile,
  identity,
  bellCount,
  showSettings,
}: {
  items: NavItem[]
  profile: string
  identity?: string
  bellCount?: number
  showSettings?: boolean
}) {
  return (
    <div className="flex" style={{ minHeight: '100vh' }}>
      <Sidebar
        items={items}
        profile={profile}
        identity={identity}
        bellCount={bellCount}
        showSettings={showSettings}
      />
      <ContentArea />
    </div>
  )
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const ParentFullNav: Story = {
  name: 'Parent — full nav (Home active)',
  render: () => (
    <Shell
      profile="Zach"
      identity="terracotta"
      items={ALL_ITEMS.map((item) => ({ ...item, active: item.label === 'Home' }))}
      bellCount={3}
      showSettings
    />
  ),
}

export const ParentFeedActive: Story = {
  name: 'Parent — full nav (Family Feed active)',
  render: () => (
    <Shell
      profile="Zach"
      identity="terracotta"
      items={ALL_ITEMS.map((item) => ({ ...item, active: item.label === 'Family Feed' }))}
      bellCount={0}
      showSettings
    />
  ),
}

export const ParentMidNav: Story = {
  name: 'Parent — full nav (Finance active — mid-list)',
  render: () => (
    <Shell
      profile="Zach"
      identity="terracotta"
      items={ALL_ITEMS.map((item) => ({ ...item, active: item.label === 'Finance' }))}
      bellCount={1}
      showSettings
    />
  ),
}

export const ChildReducedNav: Story = {
  name: 'Child — reduced nav, tier 1–2 (Chores active)',
  render: () => (
    <Shell
      profile="Emmy"
      identity="marigold"
      items={ALL_ITEMS.filter((i) => !i.tier || i.tier <= 1).map((item) => ({
        ...item,
        active: item.label === 'Chores',
      }))}
      bellCount={0}
      showSettings={false}
    />
  ),
}

export const TeenNav: Story = {
  name: 'Teen — tier 2–3 (Calendar active)',
  render: () => (
    <Shell
      profile="Sam"
      identity="sky"
      items={ALL_ITEMS.filter((i) => !i.tier || i.tier <= 2).map((item) => ({
        ...item,
        active: item.label === 'Calendar',
      }))}
      bellCount={2}
      showSettings={false}
    />
  ),
}

export const FamilyProfile: Story = {
  name: 'Family pseudo-profile — tier 1, no settings',
  render: () => (
    <Shell
      profile="Pritchett Family"
      items={ALL_ITEMS.filter((i) => !i.tier).map((item) => ({
        ...item,
        active: item.label === 'Home',
      }))}
      bellCount={0}
      showSettings={false}
    />
  ),
}
