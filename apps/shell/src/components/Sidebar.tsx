import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Settings, ChevronRight } from 'lucide-react'
import { FAMILY_PROFILE_ID, useAuth } from '@family-os/platform'
import { cn, FAMILY_HUE, ProfileAvatar, resolveHue } from '@family-os/ui'
import { ProfileGrid } from './ProfileGrid'
import { NotificationBell } from './NotificationBell'

export type PluginNavItem = {
  to: string
  icon: React.ReactNode
  label: string
  minTier?: 1 | 2 | 3 | 4
}

// ADR 031 (amended, sidebar-refresh session): the sidebar recedes on `--background`
// — no colored wall — with a hairline `border-r` seam and an inset `border-t` above
// the utility group. It folds responsively: a slim label-under-icon rail
// (`w-sidebar-rail`) below `xl`, expanding to the full label-beside rail (`w-sidebar`)
// at `xl`+. `--primary` still owns active; the old `--secondary` surface is reused as
// the transient hover wash.
export function Sidebar({ pluginNavItems = [] }: { pluginNavItems?: PluginNavItem[] }) {
  const { tier } = useAuth()
  const visiblePluginItems = pluginNavItems.filter((item) => !item.minTier || item.minTier <= tier)
  return (
    <aside className="hidden md:flex w-sidebar-rail xl:w-sidebar shrink-0 h-screen flex-col bg-background border-r border-border/60 relative transition-[width] duration-[var(--duration-normal)]">
      <ProfileChip />
      <nav
        className="flex-1 min-h-0 overflow-y-auto px-2 xl:px-3 pt-1 space-y-1"
        aria-label="Main navigation"
      >
        <NavItem to="/" icon={<Home size={18} aria-hidden />} label="Home" end />
        {visiblePluginItems.map((item) => (
          <NavItem key={item.to} to={item.to} icon={item.icon} label={item.label} />
        ))}
      </nav>
      {/* Utility group. Bell + settings are tier-2+, but reporting a problem is not
          (ADR 046) — so the group now renders for every tier and `NotificationBell`
          itself degrades to the report control below tier 2. It always has at least
          one item, so the top divider is no longer conditional. */}
      <div className="mx-2 xl:mx-3 pt-2 pb-2 space-y-1 border-t border-border/60">
        <NotificationBell fold />
        <SettingsNavItem />
      </div>
    </aside>
  )
}

function ProfileChip() {
  const { id, name, familyName, avatarUrl, identityHue } = useAuth()
  const [gridOpen, setGridOpen] = useState(false)
  const displayName = id === FAMILY_PROFILE_ID ? (familyName ?? name) : name

  return (
    <div className="relative px-2 xl:px-3 pt-2 pb-1">
      <button
        onClick={() => setGridOpen((v) => !v)}
        className={cn(
          'flex flex-col xl:flex-row items-center justify-center xl:justify-start gap-1 xl:gap-3',
          'w-full py-2 xl:py-3 xl:px-3 min-h-touch xl:min-h-14 rounded-panel text-left cursor-pointer',
          // Elevated above the nav: a --card chip (ADR 039 ladder) so the profile
          // reads as a header control, not a fourth nav item.
          'border bg-card transition-all duration-[var(--duration-fast)]',
          gridOpen
            ? 'border-border shadow-[var(--shadow-raised)]'
            : 'border-border/60 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-raised)]'
        )}
        aria-expanded={gridOpen}
        aria-haspopup="listbox"
        aria-label={`${displayName} — switch profile`}
      >
        <ProfileAvatar
          name={displayName}
          avatarUrl={avatarUrl ?? undefined}
          identity={id === FAMILY_PROFILE_ID ? FAMILY_HUE : resolveHue(displayName, identityHue)}
          size="sm"
          active
        />
        <span className="hidden xl:block text-sm font-medium truncate flex-1">{displayName}</span>
        <ChevronRight
          size={14}
          className={cn(
            'hidden xl:block text-muted-foreground shrink-0 transition-transform duration-[var(--duration-normal)]',
            gridOpen && 'rotate-90'
          )}
          aria-hidden
        />
      </button>
      {/* Open just below the chip (top-full auto-adjusts to the chip's slim/expanded
          height). At xl the trigger is a full-width chip, so match the menu to its
          box (left-3/right-3 align both edges). In the slim rail the trigger is only
          an avatar, so fall back to a fixed w-64 that overhangs content. */}
      <ProfileGrid
        open={gridOpen}
        onClose={() => setGridOpen(false)}
        className="top-full mt-1 left-2 right-auto w-64 xl:left-3 xl:right-3 xl:w-auto rounded-panel overflow-hidden border border-border"
      />
    </div>
  )
}

function SettingsNavItem() {
  const { tier } = useAuth()
  if (tier < 2) return null
  return <NavItem to="/settings" icon={<Settings size={18} aria-hidden />} label="Settings" />
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
      aria-label={label}
      className={({ isActive }) =>
        cn(
          'flex flex-col xl:flex-row items-center justify-center xl:justify-start gap-1 xl:gap-3',
          'py-2 xl:py-2.5 xl:px-3 min-h-touch rounded-panel text-center xl:text-left',
          'transition-colors duration-[var(--duration-fast)]',
          // ADR 031 (amended): `--primary` tint owns active on the seamless rail;
          // the old `--secondary` surface is now the hover wash. No left-bar.
          isActive
            ? 'bg-primary/10 text-primary font-medium'
            : 'text-muted-foreground hover:bg-secondary/70 hover:text-foreground'
        )
      }
    >
      {icon}
      <span className="text-xs-body xl:text-sm leading-tight xl:leading-normal">{label}</span>
    </NavLink>
  )
}
