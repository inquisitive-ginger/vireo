import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Settings, ChevronRight } from 'lucide-react'
import { useAuth } from '@family-os/platform'
import { cn, ProfileAvatar, BellBadge, NotificationTray } from '@family-os/ui'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ProfileGrid } from './ProfileGrid'
import type { NotificationEntry } from '@family-os/ui'

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
    <aside className="w-[220px] shrink-0 h-screen flex flex-col bg-secondary relative">
      <ProfileChip />
      <nav className="flex-1 py-2" aria-label="Main navigation">
        <NavItem to="/" icon={<Home size={18} aria-hidden />} label="Home" end />
        {visiblePluginItems.map((item) => (
          <NavItem key={item.to} to={item.to} icon={item.icon} label={item.label} />
        ))}
      </nav>
      <NotificationBell />
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
          'flex items-center gap-3 px-4 py-3 min-h-[56px] w-full text-left mb-1',
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

type UnreadData = {
  unreadCount: number
  maxSeverity: 'success' | 'info' | 'warning' | 'error' | null
}

function NotificationBell() {
  const { tier } = useAuth()
  const queryClient = useQueryClient()
  const [trayOpen, setTrayOpen] = useState(false)

  const { data: unread } = useQuery<UnreadData>({
    queryKey: ['notifications/unread'],
    queryFn: () => fetch('/api/notifications/unread').then((r) => r.json()) as Promise<UnreadData>,
    enabled: tier >= 2,
    staleTime: 30_000,
  })

  const { data: notifications = [], isFetching } = useQuery<NotificationEntry[]>({
    queryKey: ['notifications'],
    queryFn: () =>
      fetch('/api/notifications').then((r) => r.json()) as Promise<NotificationEntry[]>,
    enabled: trayOpen && tier >= 2,
    staleTime: 0,
  })

  useEffect(() => {
    if (tier < 2) return
    function onNotify() {
      queryClient.invalidateQueries({ queryKey: ['notifications/unread'] })
    }
    window.addEventListener('platform:notification', onNotify)
    return () => window.removeEventListener('platform:notification', onNotify)
  }, [tier, queryClient])

  function openTray() {
    setTrayOpen(true)
  }

  function closeTray() {
    setTrayOpen(false)
    // Mark all read on close — user has reviewed the list
    fetch('/api/notifications/read', { method: 'POST', credentials: 'include' })
      .then(() => queryClient.invalidateQueries({ queryKey: ['notifications/unread'] }))
      .catch(() => {
        // Badge will re-sync on next open
      })
  }

  async function handleDeleteNotification(id: string) {
    // Optimistic: remove from list immediately
    queryClient.setQueryData<NotificationEntry[]>(
      ['notifications'],
      (prev) => prev?.filter((n) => n.id !== id) ?? []
    )
    await fetch(`/api/notifications/${id}`, { method: 'DELETE', credentials: 'include' })
    queryClient.invalidateQueries({ queryKey: ['notifications/unread'] })
  }

  async function handleClearAll() {
    // Optimistic: empty the list immediately
    queryClient.setQueryData<NotificationEntry[]>(['notifications'], [])
    await fetch('/api/notifications', { method: 'DELETE', credentials: 'include' })
    queryClient.invalidateQueries({ queryKey: ['notifications/unread'] })
  }

  if (tier < 2) return null

  return (
    <div className="px-1 py-1">
      <BellBadge
        count={unread?.unreadCount ?? 0}
        maxSeverity={unread?.maxSeverity ?? null}
        onClick={openTray}
      />
      <NotificationTray
        open={trayOpen}
        onClose={closeTray}
        notifications={notifications}
        onDeleteNotification={handleDeleteNotification}
        onClearAll={handleClearAll}
        loading={isFetching}
      />
    </div>
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
          'flex items-center gap-3 px-3 py-2.5 mx-1 rounded-md text-sm transition-colors min-h-[48px]',
          isActive
            ? 'bg-primary/20 text-primary font-medium'
            : 'text-muted-foreground hover:bg-primary/10 hover:text-foreground'
        )
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  )
}
