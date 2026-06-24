import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Settings, ChevronRight } from 'lucide-react'
import { FAMILY_PROFILE_ID, useAuth } from '@family-os/platform'
import { cn, ProfileAvatar } from '@family-os/ui'
import { ProfileGrid } from './ProfileGrid'
import { NotificationBell } from './NotificationBell'

export type PluginNavItem = {
  to: string
  icon: React.ReactNode
  label: string
  minTier?: 1 | 2 | 3 | 4
}

export function Sidebar({ pluginNavItems = [] }: { pluginNavItems?: PluginNavItem[] }) {
  const { tier } = useAuth()
  const visiblePluginItems = pluginNavItems.filter((item) => !item.minTier || item.minTier <= tier)
  return (
    <aside className="hidden md:flex w-[220px] shrink-0 h-screen flex-col bg-secondary relative">
      <ProfileChip />
      <nav className="flex-1 py-2" aria-label="Main navigation">
        <NavItem to="/" icon={<Home size={18} aria-hidden />} label="Home" end />
        {visiblePluginItems.map((item) => (
          <NavItem key={item.to} to={item.to} icon={item.icon} label={item.label} />
        ))}
      </nav>
      <NotificationBell className="px-1 py-1" />
      <SettingsNavItem />
    </aside>
  )
}

function ProfileChip() {
  const { id, name, familyName } = useAuth()
  const [gridOpen, setGridOpen] = useState(false)
  const displayName = id === FAMILY_PROFILE_ID ? (familyName ?? name) : name

  return (
    <>
      <button
        onClick={() => setGridOpen((v) => !v)}
        className={cn(
          'flex items-center gap-3 px-4 py-3 min-h-[56px] w-full text-left mb-1 cursor-pointer',
          'transition-colors duration-[var(--duration-fast)]',
          gridOpen ? 'bg-primary/15' : 'hover:bg-primary/10'
        )}
        aria-expanded={gridOpen}
        aria-haspopup="listbox"
      >
        <ProfileAvatar name={displayName} size="sm" active />
        <span className="text-sm font-medium truncate flex-1">{displayName}</span>
        <ChevronRight
          size={14}
          className={cn(
            'text-muted-foreground shrink-0 transition-transform duration-[var(--duration-normal)]',
            gridOpen && 'rotate-90'
          )}
        />
      </button>
      <ProfileGrid open={gridOpen} onClose={() => setGridOpen(false)} />
    </>
  )
}

function SettingsNavItem() {
  const { tier } = useAuth()
  if (tier < 2) return null
  return (
    <div className="py-2">
      <NavItem to="/settings" icon={<Settings size={18} aria-hidden />} label="Settings" />
    </div>
  )
}

function NavItem({
  to,
  icon,
  label,
  end,
}: {
  to: string
  icon: React.ReactNode
  label: string
  end?: boolean
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'relative overflow-hidden flex items-center gap-3 px-3 py-2.5 mx-1 rounded-md text-sm transition-colors min-h-[48px]',
          isActive
            ? 'bg-primary/15 text-primary font-medium'
            : 'text-muted-foreground hover:bg-primary/8 hover:text-foreground'
        )
      }
    >
      {({ isActive }: { isActive: boolean }) => (
        <>
          {isActive && (
            <span aria-hidden className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary" />
          )}
          {icon}
          <span>{label}</span>
        </>
      )}
    </NavLink>
  )
}
