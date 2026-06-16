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
})
