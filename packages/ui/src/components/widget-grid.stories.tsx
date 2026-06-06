import type { Meta, StoryObj } from '@storybook/react'
import { Rss, CheckSquare, Calendar } from 'lucide-react'
import { WidgetGrid } from './widget-grid'
import { WidgetSlot } from './widget-slot'
import { PlaceholderCard } from './placeholder-card'

// ─── Shared placeholder fixtures ────────────────────────────────────────────

const PLACEHOLDERS = {
  'family-feed.feed': (
    <PlaceholderCard
      moduleName="Family Feed"
      description="Shared updates from everyone at home"
      icon={Rss}
    />
  ),
  'chores.today-summary': (
    <PlaceholderCard
      moduleName="Chores"
      description="Tasks and responsibilities for today"
      icon={CheckSquare}
    />
  ),
  'calendar.today': (
    <PlaceholderCard
      moduleName="Calendar"
      description="Upcoming events and schedule"
      icon={Calendar}
    />
  ),
}

// ─── WidgetGrid meta ─────────────────────────────────────────────────────────

const meta: Meta<typeof WidgetGrid> = {
  title: 'Home Surface/WidgetGrid',
  component: WidgetGrid,
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
type Story = StoryObj<typeof WidgetGrid>

// ─── Narrow viewport — single-column stack ───────────────────────────────────

// ─── ADR 028 — Default layouts ───────────────────────────────────────────────

export const FamilyPseudoProfile: Story = {
  name: 'Family pseudo-profile (unattended tablet)',
  render: () => (
    <WidgetGrid
      layout={[
        { widgetId: 'family-feed.feed', x: 0, y: 0, w: 4, h: 1 },
        { widgetId: 'chores.today-summary', x: 0, y: 1, w: 2, h: 1 },
        { widgetId: 'calendar.today', x: 2, y: 1, w: 2, h: 1 },
      ]}
    >
      {PLACEHOLDERS}
    </WidgetGrid>
  ),
}

export const Tiers12: Story = {
  name: 'Tiers 1–2 (child profiles — chores-first)',
  render: () => (
    <WidgetGrid
      layout={[
        { widgetId: 'chores.today-summary', x: 0, y: 0, w: 2, h: 2 },
        { widgetId: 'family-feed.feed', x: 2, y: 0, w: 2, h: 1 },
        { widgetId: 'calendar.today', x: 2, y: 1, w: 2, h: 1 },
      ]}
    >
      {PLACEHOLDERS}
    </WidgetGrid>
  ),
}

export const Tiers34: Story = {
  name: 'Tiers 3–4 (parent/teen profiles — calendar-first)',
  render: () => (
    <WidgetGrid
      layout={[
        { widgetId: 'calendar.today', x: 0, y: 0, w: 2, h: 2 },
        { widgetId: 'family-feed.feed', x: 2, y: 0, w: 2, h: 1 },
        { widgetId: 'chores.today-summary', x: 2, y: 1, w: 2, h: 1 },
      ]}
    >
      {PLACEHOLDERS}
    </WidgetGrid>
  ),
}

// ─── WidgetSlot standalone ───────────────────────────────────────────────────
