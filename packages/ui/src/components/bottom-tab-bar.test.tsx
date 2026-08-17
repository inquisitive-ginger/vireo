import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Home } from 'lucide-react'
import { BottomTabBar } from './bottom-tab-bar'
import type { TabBarItem } from './bottom-tab-bar'

const FEED_ITEM: TabBarItem = {
  to: '/feed',
  icon: <span data-testid="icon-feed" />,
  label: 'Feed',
  minTier: 1,
}

const CHORES_ITEM: TabBarItem = {
  to: '/chores',
  icon: <span data-testid="icon-chores" />,
  label: 'Chores',
  minTier: 2,
}

const PARENT_ONLY_ITEM: TabBarItem = {
  to: '/settings',
  icon: <span data-testid="icon-settings" />,
  label: 'Settings',
  minTier: 3,
}

const BASE_PROPS = {
  activeRoute: '/',
  onNavigate: vi.fn(),
}

describe('BottomTabBar', () => {
  it('always renders the Home tab', () => {
    render(<BottomTabBar {...BASE_PROPS} tier={1} navItems={[]} />)
    expect(screen.getByText('Home')).toBeInTheDocument()
  })

  it('is nav-only — renders no profile tab (profile lives in the brand top bar, ADR 034)', () => {
    render(<BottomTabBar {...BASE_PROPS} tier={1} navItems={[]} />)
    expect(screen.queryByRole('button', { name: 'Profile' })).not.toBeInTheDocument()
  })

  it('shows items whose minTier is at or below the current tier', () => {
    render(
      <BottomTabBar
        {...BASE_PROPS}
        tier={2}
        navItems={[FEED_ITEM, CHORES_ITEM, PARENT_ONLY_ITEM]}
      />
    )
    expect(screen.getByText('Feed')).toBeInTheDocument()
    expect(screen.getByText('Chores')).toBeInTheDocument()
    expect(screen.queryByText('Settings')).not.toBeInTheDocument()
  })

  it('hides items whose minTier exceeds the current tier', () => {
    render(<BottomTabBar {...BASE_PROPS} tier={1} navItems={[FEED_ITEM, CHORES_ITEM]} />)
    expect(screen.getByText('Feed')).toBeInTheDocument()
    expect(screen.queryByText('Chores')).not.toBeInTheDocument()
  })

  it('shows items with no minTier restriction at all tier levels', () => {
    const noTierItem: TabBarItem = {
      to: '/open',
      icon: <Home size={20} />,
      label: 'Open',
    }
    render(<BottomTabBar {...BASE_PROPS} tier={1} navItems={[noTierItem]} />)
    expect(screen.getByText('Open')).toBeInTheDocument()
  })

  it('marks the active tab with aria-current="page"', () => {
    render(<BottomTabBar {...BASE_PROPS} activeRoute="/feed" tier={1} navItems={[FEED_ITEM]} />)
    const feedBtn = screen.getByText('Feed').closest('button')
    expect(feedBtn).toHaveAttribute('aria-current', 'page')
    const homeBtn = screen.getByText('Home').closest('button')
    expect(homeBtn).not.toHaveAttribute('aria-current')
  })

  it('applies text-primary class to the active tab and text-muted-foreground to inactive', () => {
    render(<BottomTabBar {...BASE_PROPS} activeRoute="/" tier={1} navItems={[FEED_ITEM]} />)
    const homeBtn = screen.getByText('Home').closest('button')
    expect(homeBtn?.className).toContain('text-primary')
    const feedBtn = screen.getByText('Feed').closest('button')
    expect(feedBtn?.className).toContain('text-muted-foreground')
  })

  it('calls onNavigate with the correct route when a tab is clicked', () => {
    const onNavigate = vi.fn()
    render(<BottomTabBar {...BASE_PROPS} onNavigate={onNavigate} tier={1} navItems={[FEED_ITEM]} />)
    fireEvent.click(screen.getByText('Feed'))
    expect(onNavigate).toHaveBeenCalledWith('/feed')
  })

  it('calls onNavigate("/") when Home tab is clicked', () => {
    const onNavigate = vi.fn()
    render(<BottomTabBar {...BASE_PROPS} onNavigate={onNavigate} tier={1} navItems={[]} />)
    fireEvent.click(screen.getByText('Home'))
    expect(onNavigate).toHaveBeenCalledWith('/')
  })

  const FIVE_ITEMS: TabBarItem[] = ['Calendar', 'Chores', 'Meals', 'Rewards', 'Feed'].map(
    (label) => ({
      to: `/${label.toLowerCase()}`,
      icon: <span data-testid={`icon-${label.toLowerCase()}`} />,
      label,
      minTier: 1,
    })
  )

  it('caps the bar at five tabs and folds the rest under More', () => {
    render(<BottomTabBar {...BASE_PROPS} tier={4} navItems={FIVE_ITEMS} />)
    const bar = screen.getByTestId('bottom-tab-bar')
    expect(bar.querySelectorAll('button')).toHaveLength(5)
    expect(screen.getByText('More')).toBeInTheDocument()
    expect(screen.queryByText('Rewards')).not.toBeInTheDocument()
    expect(screen.queryByText('Feed')).not.toBeInTheDocument()
  })

  it('renders no More tab when Home plus items fit within five', () => {
    render(<BottomTabBar {...BASE_PROPS} tier={4} navItems={FIVE_ITEMS.slice(0, 4)} />)
    expect(screen.queryByText('More')).not.toBeInTheDocument()
    expect(screen.getByText('Rewards')).toBeInTheDocument()
  })

  it('applies the tier filter before the cap', () => {
    const items = FIVE_ITEMS.map((item, i) => (i === 4 ? { ...item, minTier: 3 as const } : item))
    render(<BottomTabBar {...BASE_PROPS} tier={1} navItems={items} />)
    expect(screen.queryByText('More')).not.toBeInTheDocument()
    expect(screen.getByText('Rewards')).toBeInTheDocument()
  })

  it('More opens a sheet whose items navigate and close it', () => {
    const onNavigate = vi.fn()
    render(<BottomTabBar {...BASE_PROPS} onNavigate={onNavigate} tier={4} navItems={FIVE_ITEMS} />)
    fireEvent.click(screen.getByText('More'))
    fireEvent.click(screen.getByText('Rewards'))
    expect(onNavigate).toHaveBeenCalledWith('/rewards')
    expect(screen.queryByText('Feed')).not.toBeInTheDocument()
  })

  it('marks the More tab active when an overflowed route is active', () => {
    render(<BottomTabBar {...BASE_PROPS} activeRoute="/rewards" tier={4} navItems={FIVE_ITEMS} />)
    const moreBtn = screen.getByText('More').closest('button')
    expect(moreBtn).toHaveAttribute('aria-current', 'page')
  })
})
