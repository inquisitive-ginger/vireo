import type { Meta, StoryObj } from '@storybook/react'
import { MobileCanvas, mobileViewport, phoneGlobals } from './MobileCanvas'

/* Demonstrates the reusable mobile canvas: real `MobileBrandTopBar` + nav-only
   `BottomTabBar` around arbitrary story content, sized to a phone so the
   `md:hidden` chrome renders and the page scrolls like a device. */

const meta: Meta<typeof MobileCanvas> = {
  title: 'Platform/Mobile Canvas',
  component: MobileCanvas,
  parameters: { ...mobileViewport },
  globals: phoneGlobals,
}
export default meta
type Story = StoryObj<typeof MobileCanvas>

export const Default: Story = {
  render: () => (
    <MobileCanvas>
      <div className="px-4 py-6">
        <h1 className="text-page-title text-foreground">Page content</h1>
        <p className="mt-2 text-body text-muted-foreground">
          Anything rendered here sits between the real top bar and the bottom tab bar, at phone
          width. Scroll to see the chrome hold its edges.
        </p>
        <div className="mt-4 flex flex-col gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)]"
            >
              Row {i + 1}
            </div>
          ))}
        </div>
      </div>
    </MobileCanvas>
  ),
}

export const WithBellBadge: Story = {
  name: 'With bell badge',
  render: () => (
    <MobileCanvas unreadCount={3} maxSeverity="warning">
      <div className="px-4 py-6 text-body text-muted-foreground">
        The top-bar bell reflects seeded notification state.
      </div>
    </MobileCanvas>
  ),
}
