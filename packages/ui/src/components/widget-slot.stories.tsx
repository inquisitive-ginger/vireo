import type { Meta, StoryObj } from '@storybook/react'
import type { ReactNode } from 'react'
import { Rss, CheckSquare, Calendar } from 'lucide-react'
import { WidgetSlot } from './widget-slot'
import { PlaceholderCard } from './placeholder-card'

const meta: Meta<typeof WidgetSlot> = {
  title: 'Home Surface/WidgetSlot',
  component: WidgetSlot,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ background: 'var(--background)', padding: '32px', minHeight: '100vh' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof WidgetSlot>

const ROW_H = 180
const GAP = 16
function slotH(h: number) {
  return h * ROW_H + (h - 1) * GAP
}
function slotW(w: number) {
  return w * 253 + (w - 1) * GAP
}

function Slot({ w, h, children }: { w: number; h: number; children: ReactNode }) {
  return <div style={{ width: slotW(w), height: slotH(h) }}>{children}</div>
}

export const Standard: Story = {
  name: 'Standard (2×1)',
  render: () => (
    <Slot w={2} h={1}>
      <WidgetSlot>
        <PlaceholderCard
          moduleName="Calendar"
          description="Upcoming events and schedule"
          icon={Calendar}
        />
      </WidgetSlot>
    </Slot>
  ),
}

export const Large: Story = {
  name: 'Large (2×2)',
  render: () => (
    <Slot w={2} h={2}>
      <WidgetSlot>
        <PlaceholderCard
          moduleName="Chores"
          description="Tasks and responsibilities for today"
          icon={CheckSquare}
        />
      </WidgetSlot>
    </Slot>
  ),
}

export const Banner: Story = {
  name: 'Banner (4×1)',
  render: () => (
    <Slot w={4} h={1}>
      <WidgetSlot>
        <PlaceholderCard
          moduleName="Family Feed"
          description="Shared updates from everyone at home"
          icon={Rss}
        />
      </WidgetSlot>
    </Slot>
  ),
}
