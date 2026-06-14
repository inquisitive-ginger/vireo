import type { Meta, StoryObj } from '@storybook/react'
import type { ReactNode } from 'react'
import { Rss, CheckSquare, Calendar } from 'lucide-react'
import { WidgetSlot } from './widget-slot'
import { PlaceholderCard } from './placeholder-card'
import { ErrorCard } from './error-card'

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

function MockWidgetContent({ label }: { label: string }) {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '14px 18px',
        gap: 8,
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.1em',
          color: 'var(--accent)',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <span style={{ fontSize: 14, color: 'var(--muted-foreground)' }}>Live widget content</span>
      </div>
    </div>
  )
}

// ─── Three slot states side by side ──────────────────────────────────────────

export const AllStates: Story = {
  name: 'All three states (standard 2×1)',
  render: () => (
    <div style={{ display: 'flex', gap: GAP, flexWrap: 'wrap' }}>
      <div>
        <div
          style={{
            fontSize: 11,
            color: 'var(--muted-foreground)',
            marginBottom: 8,
            fontWeight: 600,
          }}
        >
          Live widget
        </div>
        <Slot w={2} h={1}>
          <WidgetSlot>
            <MockWidgetContent label="Calendar" />
          </WidgetSlot>
        </Slot>
      </div>
      <div>
        <div
          style={{
            fontSize: 11,
            color: 'var(--muted-foreground)',
            marginBottom: 8,
            fontWeight: 600,
          }}
        >
          Not installed (flat)
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
      </div>
      <div>
        <div
          style={{
            fontSize: 11,
            color: 'var(--muted-foreground)',
            marginBottom: 8,
            fontWeight: 600,
          }}
        >
          Failed to load (flat)
        </div>
        <Slot w={2} h={1}>
          <WidgetSlot flat>
            <ErrorCard moduleName="Calendar" onRetry={() => {}} />
          </WidgetSlot>
        </Slot>
      </div>
    </div>
  ),
}

export const Standard: Story = {
  name: 'Standard placeholder (2×1)',
  render: () => (
    <Slot w={2} h={1}>
      <WidgetSlot flat>
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
  name: 'Large placeholder (2×2)',
  render: () => (
    <Slot w={2} h={2}>
      <WidgetSlot flat>
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
  name: 'Banner placeholder (4×1)',
  render: () => (
    <Slot w={4} h={1}>
      <WidgetSlot flat>
        <PlaceholderCard
          moduleName="Family Feed"
          description="Shared updates from everyone at home"
          icon={Rss}
        />
      </WidgetSlot>
    </Slot>
  ),
}

export const ErrorState: Story = {
  name: "Error — couldn't load (2×1)",
  render: () => (
    <Slot w={2} h={1}>
      <WidgetSlot flat>
        <ErrorCard moduleName="Calendar" onRetry={() => {}} />
      </WidgetSlot>
    </Slot>
  ),
}
