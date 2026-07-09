import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { CalendarDays, Repeat } from 'lucide-react'
import { TabBar } from './tab-bar'

const meta: Meta<typeof TabBar> = {
  title: 'Primitives/TabBar',
  component: TabBar,
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof TabBar>

// The calendar's primary tier — Calendar ⇄ Activities, with leading icons and a
// tabpanel wired to the active tab (the intended consumption pattern).
function SurfaceTabs() {
  const [surface, setSurface] = useState('calendar')
  return (
    <div>
      <TabBar
        aria-label="Calendar surface"
        idBase="demo-surface"
        options={[
          { value: 'calendar', label: 'Calendar', icon: CalendarDays },
          { value: 'activities', label: 'Activities', icon: Repeat },
        ]}
        value={surface}
        onChange={setSurface}
      />
      <div
        role="tabpanel"
        aria-labelledby={`demo-surface-tab-${surface}`}
        className="text-body text-muted-foreground pt-4"
      >
        {surface === 'calendar' ? 'The month / week / day time grid.' : 'The Activities lens.'}
      </div>
    </div>
  )
}

// Text-only, two options — the minimal shape.
function PlainTabs() {
  const [tab, setTab] = useState('overview')
  return (
    <TabBar
      aria-label="Section"
      options={[
        { value: 'overview', label: 'Overview' },
        { value: 'activity', label: 'Activity' },
        { value: 'settings', label: 'Settings' },
      ]}
      value={tab}
      onChange={setTab}
    />
  )
}

export const WithIconsAndPanel: Story = {
  name: 'Surface tabs (icons + tabpanel)',
  render: () => <SurfaceTabs />,
}

export const TextOnly: Story = {
  name: 'Text-only tabs',
  render: () => <PlainTabs />,
}
