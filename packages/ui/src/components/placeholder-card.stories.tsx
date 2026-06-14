import type { Meta, StoryObj } from '@storybook/react'
import type { ReactNode } from 'react'
import { Rss, CheckSquare, Calendar, BookOpen } from 'lucide-react'
import { PlaceholderCard } from './placeholder-card'
import { WidgetSlot } from './widget-slot'

const meta: Meta<typeof PlaceholderCard> = {
  title: 'Home Surface/PlaceholderCard',
  component: PlaceholderCard,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ background: 'var(--background)', padding: '24px', minHeight: '100vh' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    moduleName: { control: 'text' },
    description: { control: 'text' },
    icon: { control: false },
  },
  args: {
    moduleName: 'Chores',
    description: 'Tasks and responsibilities for today',
    icon: CheckSquare,
  },
}

export default meta
type Story = StoryObj<typeof PlaceholderCard>

// ─── Slot size helpers ────────────────────────────────────────────────────────
// rowHeight: 180, gap: 16
const SLOT_HEIGHT = (h: number) => h * 180 + (h - 1) * 16
const SLOT_WIDTH = (w: number) => w * 253 + (w - 1) * 16

function Slot({ w, h, children }: { w: number; h: number; children: ReactNode }) {
  return <div style={{ width: SLOT_WIDTH(w), height: SLOT_HEIGHT(h) }}>{children}</div>
}

export const Interactive: Story = {
  name: 'Interactive',
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: SLOT_WIDTH(2), height: SLOT_HEIGHT(1) }}>
        <WidgetSlot flat>
          <Story />
        </WidgetSlot>
      </div>
    ),
  ],
}

export const CompactSize: Story = {
  name: 'Compact (1×1)',
  render: () => (
    <Slot w={1} h={1}>
      <WidgetSlot flat>
        <PlaceholderCard moduleName="Notes" description="Quick notes" icon={BookOpen} />
      </WidgetSlot>
    </Slot>
  ),
}

// ─── All sizes at once ────────────────────────────────────────────────────────

export const AllSizes: Story = {
  name: 'All sizes',
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="text-xs font-medium text-[var(--muted-foreground)] mb-1">Banner (4×1)</div>
      <Slot w={4} h={1}>
        <WidgetSlot flat>
          <PlaceholderCard
            moduleName="Family Feed"
            description="Shared updates from everyone at home"
            icon={Rss}
          />
        </WidgetSlot>
      </Slot>
      <div className="text-xs font-medium text-[var(--muted-foreground)] mt-2 mb-1">
        Large (2×2)
      </div>
      <Slot w={2} h={2}>
        <WidgetSlot flat>
          <PlaceholderCard
            moduleName="Chores"
            description="Tasks and responsibilities for today"
            icon={CheckSquare}
          />
        </WidgetSlot>
      </Slot>
      <div className="text-xs font-medium text-[var(--muted-foreground)] mt-2 mb-1">
        Standard (2×1)
      </div>
      <Slot w={2} h={1}>
        <WidgetSlot flat>
          <PlaceholderCard
            moduleName="Calendar"
            description="Upcoming events and schedule"
            icon={Calendar}
          />
        </WidgetSlot>
      </Slot>
      <div className="text-xs font-medium text-[var(--muted-foreground)] mt-2 mb-1">
        Compact (1×1)
      </div>
      <Slot w={1} h={1}>
        <WidgetSlot flat>
          <PlaceholderCard moduleName="Notes" description="Quick notes" icon={BookOpen} />
        </WidgetSlot>
      </Slot>
    </div>
  ),
}
