import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { FAMILY_PROFILE_ID, useAuth } from '@family-os/platform'
import { Toast, BottomTabBar } from '@family-os/ui'
import type { TabBarItem } from '@family-os/ui'
import { Sidebar } from '@/components/Sidebar'
import type { PluginNavItem } from '@/components/Sidebar'
import { ProfileGrid } from '@/components/ProfileGrid'
import { MobileBrandTopBar } from '@/components/MobileBrandTopBar'

export function App({ pluginNavItems = [] }: { pluginNavItems?: PluginNavItem[] }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { id, name, tier, avatarUrl } = useAuth()
  const [profileGridOpen, setProfileGridOpen] = useState(false)

  const tabBarItems: TabBarItem[] = pluginNavItems.map((item) => ({
    to: item.to,
    icon: item.icon,
    label: item.label,
    minTier: item.minTier,
  }))

  return (
    <>
      <div className="flex h-dvh w-screen overflow-hidden">
        <Sidebar pluginNavItems={pluginNavItems} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <MobileBrandTopBar
            name={name}
            avatarUrl={avatarUrl}
            isFamily={id === FAMILY_PROFILE_ID}
            profileOpen={profileGridOpen}
            onProfileClick={() => setProfileGridOpen((v) => !v)}
          />
          <main className="flex-1 overflow-auto pb-[calc(var(--spacing-tab-bar)+env(safe-area-inset-bottom))] md:pb-0">
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
        className="fixed top-[calc(var(--spacing-top-bar)+env(safe-area-inset-top))] left-0 right-0"
      />
      <Toast />
    </>
  )
}
