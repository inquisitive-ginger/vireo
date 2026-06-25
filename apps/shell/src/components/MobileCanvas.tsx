import { useState, type ReactNode } from 'react'
import { CalendarDays, CheckSquare } from 'lucide-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MockAuthProvider } from '@family-os/platform'
import type { Profile } from '@family-os/platform'
import { BottomTabBar } from '@family-os/ui'
import type { TabBarItem } from '@family-os/ui'
import { MobileBrandTopBar } from './MobileBrandTopBar'

/* A reusable Storybook canvas that renders story content inside the REAL mobile
   shell chrome (ADR 034): the `MobileBrandTopBar` (top) and the nav-only
   `BottomTabBar` (bottom), with the providers those components need. Pair it with
   `mobileViewport` (below) so the canvas renders at a phone width — the chrome is
   `md:hidden`, so it only appears below 768px, and the page then scrolls like a
   real device instead of stretching across a desktop-width canvas.

   Usage:
     const meta = { parameters: { ...mobileViewport }, globals: phoneGlobals }
     export const Surface = { render: () => <MobileCanvas><MySurface /></MobileCanvas> } */

const DEFAULT_PROFILE: Profile = { id: 'zach', name: 'Zach', tier: 4 }

const DEFAULT_NAV: TabBarItem[] = [
  { to: '/chores', icon: <CheckSquare size={20} aria-hidden />, label: 'Chores', minTier: 1 },
  { to: '/calendar', icon: <CalendarDays size={20} aria-hidden />, label: 'Calendar', minTier: 1 },
]

export interface MobileCanvasProps {
  children: ReactNode
  /** The signed-in profile the chrome reflects (avatar, tier). Defaults to a tier-4 parent. */
  profile?: Profile
  /** Which tab reads as active. Defaults to the Calendar tab. */
  activeRoute?: string
  /** Plugin nav tabs beside Home. Defaults to Chores + Calendar. */
  navItems?: TabBarItem[]
  /** Seed the bell badge (top bar). */
  unreadCount?: number
  maxSeverity?: 'success' | 'info' | 'warning' | 'error' | null
}

export function MobileCanvas({
  children,
  profile = DEFAULT_PROFILE,
  activeRoute = '/calendar',
  navItems = DEFAULT_NAV,
  unreadCount = 0,
  maxSeverity = null,
}: MobileCanvasProps) {
  // Seed the notification queries the bell reads so the chrome renders a real
  // (quiet, or badged) state without hitting the network.
  const [qc] = useState(() => {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false, staleTime: Infinity } },
    })
    client.setQueryData(['notifications/unread'], { unreadCount, maxSeverity })
    client.setQueryData(['notifications'], [])
    return client
  })
  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <QueryClientProvider client={qc}>
      <MockAuthProvider profile={profile}>
        <div className="flex h-dvh flex-col overflow-hidden bg-background">
          <MobileBrandTopBar
            name={profile.name}
            profileOpen={profileOpen}
            onProfileClick={() => setProfileOpen((v) => !v)}
          />
          <main className="flex-1 overflow-auto pb-[calc(56px+env(safe-area-inset-bottom))]">
            {children}
          </main>
          {/* Real nav-only bottom bar — `fixed`, pins to the viewport bottom. */}
          <BottomTabBar
            navItems={navItems}
            tier={profile.tier}
            activeRoute={activeRoute}
            onNavigate={() => {}}
          />
        </div>
      </MockAuthProvider>
    </QueryClientProvider>
  )
}

/* Per-story parameters + globals that size the preview to a phone. Spread
   `mobileViewport` into a story's `parameters` and set `globals: phoneGlobals` so
   it opens at phone width by default (the viewport tool can still switch it). */
export const PHONE_VIEWPORT = {
  phone: { name: 'Phone (390×844)', styles: { width: '390px', height: '844px' } },
}

export const mobileViewport = {
  viewport: { options: PHONE_VIEWPORT },
  layout: 'fullscreen' as const,
}

export const phoneGlobals = { viewport: { value: 'phone', isRotated: false } }
