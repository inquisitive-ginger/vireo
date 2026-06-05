import type { Meta, StoryObj } from '@storybook/react'
import type { ReactNode } from 'react'
import { Rss, CheckSquare, Calendar, BookOpen } from 'lucide-react'
import { PlaceholderCard } from './placeholder-card'

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
}

export default meta
type Story = StoryObj<typeof PlaceholderCard>

// ─── Slot size helpers ────────────────────────────────────────────────────────
// rowHeight: 180, gap: 16
const SLOT_HEIGHT = (h: number) => h * 180 + (h - 1) * 16
const SLOT_WIDTH  = (w: number) => w * 253 + (w - 1) * 16

function Slot({ w, h, children }: { w: number; h: number; children: ReactNode }) {
  return (
    <div style={{ width: SLOT_WIDTH(w), height: SLOT_HEIGHT(h) }}>
      {children}
    </div>
  )
}

// ─── Reserved modules ─────────────────────────────────────────────────────────

export const FamilyFeedBanner: Story = {
  name: 'Family Feed — banner (4×1)',
  render: () => (
    <Slot w={4} h={1}>
      <PlaceholderCard
        moduleName="Family Feed"
        description="Shared updates from everyone at home"
        icon={Rss}
      />
    </Slot>
  ),
}

export const FamilyFeedStandard: Story = {
  name: 'Family Feed — standard (2×1)',
  render: () => (
    <Slot w={2} h={1}>
      <PlaceholderCard
        moduleName="Family Feed"
        description="Shared updates from everyone at home"
        icon={Rss}
      />
    </Slot>
  ),
}

export const ChoresLarge: Story = {
  name: 'Chores — large (2×2)',
  render: () => (
    <Slot w={2} h={2}>
      <PlaceholderCard
        moduleName="Chores"
        description="Tasks and responsibilities for today"
        icon={CheckSquare}
      />
    </Slot>
  ),
}

export const ChoresStandard: Story = {
  name: 'Chores — standard (2×1)',
  render: () => (
    <Slot w={2} h={1}>
      <PlaceholderCard
        moduleName="Chores"
        description="Tasks and responsibilities for today"
        icon={CheckSquare}
      />
    </Slot>
  ),
}

export const CalendarLarge: Story = {
  name: 'Calendar — large (2×2)',
  render: () => (
    <Slot w={2} h={2}>
      <PlaceholderCard
        moduleName="Calendar"
        description="Upcoming events and schedule"
        icon={Calendar}
      />
    </Slot>
  ),
}

export const CalendarStandard: Story = {
  name: 'Calendar — standard (2×1)',
  render: () => (
    <Slot w={2} h={1}>
      <PlaceholderCard
        moduleName="Calendar"
        description="Upcoming events and schedule"
        icon={Calendar}
      />
    </Slot>
  ),
}

export const CompactSize: Story = {
  name: 'Compact (1×1)',
  render: () => (
    <Slot w={1} h={1}>
      <PlaceholderCard
        moduleName="Notes"
        description="Quick notes"
        icon={BookOpen}
      />
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
        <PlaceholderCard moduleName="Family Feed" description="Shared updates from everyone at home" icon={Rss} />
      </Slot>
      <div className="text-xs font-medium text-[var(--muted-foreground)] mt-2 mb-1">Large (2×2)</div>
      <Slot w={2} h={2}>
        <PlaceholderCard moduleName="Chores" description="Tasks and responsibilities for today" icon={CheckSquare} />
      </Slot>
      <div className="text-xs font-medium text-[var(--muted-foreground)] mt-2 mb-1">Standard (2×1)</div>
      <Slot w={2} h={1}>
        <PlaceholderCard moduleName="Calendar" description="Upcoming events and schedule" icon={Calendar} />
      </Slot>
      <div className="text-xs font-medium text-[var(--muted-foreground)] mt-2 mb-1">Compact (1×1)</div>
      <Slot w={1} h={1}>
        <PlaceholderCard moduleName="Notes" description="Quick notes" icon={BookOpen} />
      </Slot>
    </div>
  ),
}
