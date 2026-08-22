import { useState } from 'react'
import { Ellipsis, Home } from 'lucide-react'
import { cn } from '../lib/utils'
import { Sheet } from './sheet'

export type TabBarItem = {
  to: string
  icon: React.ReactNode
  label: string
  minTier?: 1 | 2 | 3 | 4
}

export type BottomTabBarProps = {
  navItems?: TabBarItem[]
  tier: number
  activeRoute: string
  onNavigate: (to: string) => void
}

const MAX_TABS = 5

function TabItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  active?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex-1 flex flex-col items-center justify-center gap-0.5 min-h-tab-bar cursor-pointer transition-colors duration-[var(--duration-fast)]',
        active ? 'text-primary' : 'text-muted-foreground'
      )}
    >
      <span
        className={cn(
          'grid h-6 place-items-center rounded-full px-4 transition-colors duration-[var(--duration-fast)]',
          active && 'bg-primary/13'
        )}
      >
        {icon}
      </span>
      <span className={cn('text-xs-token leading-none', active ? 'font-semibold' : 'font-medium')}>
        {label}
      </span>
    </button>
  )
}

export function BottomTabBar({ navItems = [], tier, activeRoute, onNavigate }: BottomTabBarProps) {
  const [moreOpen, setMoreOpen] = useState(false)
  const visibleItems = navItems.filter((item) => !item.minTier || item.minTier <= tier)
  const overflows = visibleItems.length + 1 > MAX_TABS
  const barItems = overflows ? visibleItems.slice(0, MAX_TABS - 2) : visibleItems
  const moreItems = overflows ? visibleItems.slice(MAX_TABS - 2) : []
  const isActive = (item: TabBarItem) =>
    activeRoute === item.to || activeRoute.startsWith(item.to + '/')

  return (
    <>
      <div
        className="fixed bottom-0 left-0 right-0 flex md:hidden bg-secondary border-t border-border z-40"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        data-testid="bottom-tab-bar"
      >
        <TabItem
          icon={<Home size={20} aria-hidden />}
          label="Home"
          active={activeRoute === '/'}
          onClick={() => onNavigate('/')}
        />
        {barItems.map((item) => (
          <TabItem
            key={item.to}
            icon={item.icon}
            label={item.label}
            active={isActive(item)}
            onClick={() => onNavigate(item.to)}
          />
        ))}
        {overflows && (
          <TabItem
            icon={<Ellipsis size={20} aria-hidden />}
            label="More"
            active={moreItems.some(isActive)}
            onClick={() => setMoreOpen(true)}
          />
        )}
      </div>
      {overflows && (
        <Sheet open={moreOpen} onClose={() => setMoreOpen(false)} title="More">
          <div className="flex flex-col px-3 pb-4 pt-1">
            {moreItems.map((item) => (
              <button
                key={item.to}
                type="button"
                onClick={() => {
                  setMoreOpen(false)
                  onNavigate(item.to)
                }}
                aria-current={isActive(item) ? 'page' : undefined}
                className={cn(
                  'flex min-h-touch items-center gap-3 rounded-card px-3 text-left transition-colors duration-[var(--duration-fast)]',
                  isActive(item) ? 'bg-primary/13 text-primary' : 'text-foreground'
                )}
              >
                {item.icon}
                <span className="text-sm-token font-semibold">{item.label}</span>
              </button>
            ))}
          </div>
        </Sheet>
      )}
    </>
  )
}
