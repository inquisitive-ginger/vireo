import { NavLink } from 'react-router-dom'
import { Home, Settings } from 'lucide-react'
import { useAuth } from '@family-os/platform'
import { cn } from '@/lib/utils'
import { DevProfileSelector } from './DevProfileSelector'

export function Sidebar() {
  return (
    <aside className="w-[220px] shrink-0 h-screen flex flex-col border-r border-border bg-background">
      <ProfileChip />
      <nav className="flex-1 py-2" aria-label="Main navigation">
        <NavItem to="/" icon={<Home size={18} aria-hidden />} label="Home" end />
      </nav>
      <div className="border-t border-border">
        <NavItem to="/settings" icon={<Settings size={18} aria-hidden />} label="Settings" />
      </div>
      <DevProfileSelector />
    </aside>
  )
}

function ProfileChip() {
  const { name } = useAuth()
  const initial = name.charAt(0).toUpperCase()
  return (
    <div className="flex items-center gap-2 px-4 min-h-[48px] border-b border-border">
      <div
        className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold shrink-0"
        aria-hidden
      >
        {initial}
      </div>
      <span className="text-sm font-medium truncate">{name}</span>
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
          'flex items-center gap-3 px-4 min-h-[48px] w-full text-sm transition-colors',
          isActive
            ? 'bg-accent text-accent-foreground font-medium'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
        )
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  )
}
