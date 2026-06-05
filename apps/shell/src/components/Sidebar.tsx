import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Settings, ChevronRight } from 'lucide-react'
import { useAuth } from '@family-os/platform'
import { cn, ProfileAvatar } from '@family-os/ui'
import { ProfileGrid } from './ProfileGrid'

export function Sidebar() {
  return (
    <aside className="w-[220px] shrink-0 h-screen flex flex-col border-r border-border bg-background relative">
      <ProfileChip />
      <nav className="flex-1 py-2" aria-label="Main navigation">
        <NavItem to="/" icon={<Home size={18} aria-hidden />} label="Home" end />
      </nav>
      <SettingsNavItem />
    </aside>
  )
}

function ProfileChip() {
  const { id, name, familyName } = useAuth()
  const [gridOpen, setGridOpen] = useState(false)
  const displayName = id === 'family' ? (familyName ?? name) : name

  return (
    <>
      <button
        onClick={() => setGridOpen((v) => !v)}
        className={cn(
          'flex items-center gap-3 px-4 py-3 min-h-[56px] border-b border-border w-full text-left',
          'transition-colors duration-[var(--duration-fast)]',
          gridOpen ? 'bg-secondary' : 'hover:bg-muted'
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
    <div className="border-t border-border py-2">
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
          'flex items-center gap-3 px-3 py-2.5 mx-1 rounded-md text-sm transition-colors min-h-[48px]',
          isActive
            ? 'bg-accent text-accent-foreground font-medium'
            : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
        )
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  )
}
