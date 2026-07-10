import { Home } from 'lucide-react'
import { cn } from '../lib/utils'

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
      {icon}
      <span className="text-xs-token font-medium leading-none">{label}</span>
    </button>
  )
}

export function BottomTabBar({ navItems = [], tier, activeRoute, onNavigate }: BottomTabBarProps) {
  const visibleItems = navItems.filter((item) => !item.minTier || item.minTier <= tier)

  return (
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
      {visibleItems.map((item) => (
        <TabItem
          key={item.to}
          icon={item.icon}
          label={item.label}
          active={activeRoute === item.to || activeRoute.startsWith(item.to + '/')}
          onClick={() => onNavigate(item.to)}
        />
      ))}
    </div>
  )
}
