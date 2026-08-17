import type { Meta, StoryObj } from '@storybook/react'
import { Rss, ClipboardList, Calendar, Gift, Utensils } from 'lucide-react'
import { BottomTabBar } from './bottom-tab-bar'
import type { TabBarItem } from './bottom-tab-bar'

/**
 * Mobile bottom navigation (ADR 033 / ADR 034). Nav-only: a hard-coded Home tab
 * followed by tier-filtered plugin tabs. The profile switcher and notification
 * bell live in the mobile brand top bar (ADR 034), not here. Hidden at `md:` and
 * up, where the sidebar takes over. Applies `env(safe-area-inset-bottom)` for
 * home-indicator clearance.
 */
const PLUGIN_ITEMS: TabBarItem[] = [
  { to: '/feed', icon: <Rss size={20} aria-hidden />, label: 'Feed', minTier: 1 },
  { to: '/chores', icon: <ClipboardList size={20} aria-hidden />, label: 'Chores', minTier: 1 },
  { to: '/calendar', icon: <Calendar size={20} aria-hidden />, label: 'Calendar', minTier: 1 },
]

const meta: Meta<typeof BottomTabBar> = {
  title: 'Platform/BottomTabBar',
  component: BottomTabBar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    navItems: PLUGIN_ITEMS,
    tier: 4,
    activeRoute: '/',
    onNavigate: () => {},
  },
  decorators: [
    (Story) => (
      <div className="relative bg-background" style={{ height: 120 }}>
        <Story />
      </div>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof BottomTabBar>

export const HomeActive: Story = {
  name: 'Home tab active',
  args: { activeRoute: '/' },
}

export const FeedActive: Story = {
  name: 'Feed tab active',
  args: { activeRoute: '/feed' },
}

export const TierFiltered: Story = {
  name: 'Tier 1 — items with minTier > 1 hidden',
  args: {
    tier: 1,
    navItems: [
      { to: '/feed', icon: <Rss size={20} aria-hidden />, label: 'Feed', minTier: 1 },
      { to: '/chores', icon: <ClipboardList size={20} aria-hidden />, label: 'Chores', minTier: 2 },
      { to: '/calendar', icon: <Calendar size={20} aria-hidden />, label: 'Calendar', minTier: 3 },
    ],
    activeRoute: '/feed',
  },
}

export const Overflow: Story = {
  name: 'Overflow — five-tab cap with a More sheet',
  args: {
    navItems: [
      { to: '/calendar', icon: <Calendar size={20} aria-hidden />, label: 'Calendar', minTier: 1 },
      { to: '/chores', icon: <ClipboardList size={20} aria-hidden />, label: 'Chores', minTier: 1 },
      { to: '/meals', icon: <Utensils size={20} aria-hidden />, label: 'Meals', minTier: 1 },
      { to: '/rewards', icon: <Gift size={20} aria-hidden />, label: 'Rewards', minTier: 1 },
      { to: '/family-feed', icon: <Rss size={20} aria-hidden />, label: 'Feed', minTier: 1 },
    ],
    activeRoute: '/meals',
  },
}

/** The bar in a realistic mobile viewport, pinned to the bottom above content. */
export const InMobileFrame: Story = {
  name: 'In a mobile viewport',
  decorators: [
    (Story) => (
      <div
        className="relative bg-background overflow-hidden mx-auto border border-border rounded-[28px]"
        style={{ width: 375, height: 560, boxShadow: 'var(--shadow-raised)' }}
      >
        <div className="px-5 pt-6">
          <p className="text-section-label" style={{ color: 'var(--accent)', marginBottom: 4 }}>
            The family bulletin
          </p>
          <h1 className="text-page-title" style={{ color: 'var(--foreground)' }}>
            Family Feed
          </h1>
        </div>
        <Story />
      </div>
    ),
  ],
  args: { activeRoute: '/feed' },
}
