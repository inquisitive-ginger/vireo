import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@family-os/platform'
import { Toast, BottomTabBar, ProfileAvatar } from '@family-os/ui'
import type { TabBarItem } from '@family-os/ui'
import { Sidebar } from '@/components/Sidebar'
import type { PluginNavItem } from '@/components/Sidebar'
import { ProfileGrid } from '@/components/ProfileGrid'
import { NotificationBell } from '@/components/NotificationBell'

export function App({ pluginNavItems = [] }: { pluginNavItems?: PluginNavItem[] }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { name, tier } = useAuth()
  const [profileGridOpen, setProfileGridOpen] = useState(false)

  const tabBarItems: TabBarItem[] = pluginNavItems.map((item) => ({
    to: item.to,
    icon: item.icon,
    label: item.label,
    minTier: item.minTier,
  }))

  return (
    <>
      <div className="flex h-screen w-screen overflow-hidden">
        <Sidebar pluginNavItems={pluginNavItems} />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile brand top bar (ADR 034) — avatar · Family OS · bell */}
          <header
            className="grid grid-cols-[1fr_auto_1fr] items-center md:hidden px-3 min-h-[52px] bg-secondary border-b border-border shrink-0"
            style={{ paddingTop: 'env(safe-area-inset-top)' }}
          >
            <button
              type="button"
              onClick={() => setProfileGridOpen((v) => !v)}
              aria-label="Profile and settings"
              aria-expanded={profileGridOpen}
              className="justify-self-start rounded-full cursor-pointer"
            >
              <ProfileAvatar name={name} size="sm" active={profileGridOpen} />
            </button>
            <span className="justify-self-center text-[15px] font-semibold tracking-tight text-foreground">
              Family OS
            </span>
            <NotificationBell className="justify-self-end" compact />
          </header>
          <main className="flex-1 overflow-auto pb-[calc(56px+env(safe-area-inset-bottom))] md:pb-0">
            <Outlet />
          </main>
        </div>
      </div>
      <BottomTabBar
        navItems={tabBarItems}
        tier={tier}
        activeRoute={pathname}
        onNavigate={navigate}
      />
      <ProfileGrid
        open={profileGridOpen}
        onClose={() => setProfileGridOpen(false)}
        onNavigate={(to) => {
          navigate(to)
          setProfileGridOpen(false)
        }}
        className="fixed top-[calc(52px+env(safe-area-inset-top))] left-0 right-0"
      />
      <Toast />
    </>
  )
}
