import type { Meta, StoryObj } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'
import { TodaySummaryView } from './TodaySummaryView'
import { SAMPLE_TASKEE_TASKS, SAMPLE_FAMILY_TASKS } from '../sample-tasks'
import { StoryAnnotation } from '../story-annotation'

/* Widget slot dimensions from the design-system grid spec:
   compact 1×1 ≈ 253×180px · standard 2×1 ≈ 522×180px · large 2×2 ≈ 522×376px */
const SLOT_SIZE: Record<'compact' | 'standard' | 'large', { width: number; height: number }> = {
  compact: { width: 253, height: 180 },
  standard: { width: 522, height: 180 },
  large: { width: 522, height: 376 },
}

const meta: Meta<typeof TodaySummaryView> = {
  title: 'Chores/Today Widget',
  component: TodaySummaryView,
  parameters: { layout: 'centered' },
  decorators: [
    (Story, ctx) => {
      const size: 'compact' | 'standard' | 'large' = ctx.args.size ?? 'standard'
      const { width, height } = SLOT_SIZE[size]
      return (
        // TodaySummaryView wraps its tile in a react-router <Link> (tap-through
        // to /chores) — a Router context is required for it to render.
        <MemoryRouter>
          <div style={{ width, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <StoryAnnotation>{ctx.parameters.annotation}</StoryAnnotation>
            {/* Mimic the live WidgetSlot chrome: card bg + border + shadow */}
            <div
              style={{
                width,
                height,
                background: 'var(--card)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-card)',
                borderRadius: 16,
                overflow: 'hidden',
              }}
            >
              <Story />
            </div>
          </div>
        </MemoryRouter>
      )
    },
  ],
}

export default meta
type Story = StoryObj<typeof TodaySummaryView>

/* Taskee framing (tiers 1–3) is the more common path — the widget is seeded on
   every tier-1-2 default layout as `large`. Standard and compact also ship per spec. */

export const TaskeeStandard: Story = {
  name: 'Taskee — Standard (2×1)',
  args: {
    tasks: SAMPLE_TASKEE_TASKS,
    tier: 2,
    isFamily: false,
    size: 'standard',
    lifetimeXp: 235,
    dailyXp: 10,
  },
  parameters: {
    annotation:
      'taskee · 2×1 · hero split — count + daily XP left, filled +XP rows right, lifetime coin in header · tap deep-links to /chores (no mutation here)',
  },
}

export const TaskeeLarge: Story = {
  name: 'Taskee — Large (2×2)',
  args: {
    tasks: SAMPLE_TASKEE_TASKS,
    tier: 2,
    isFamily: false,
    size: 'large',
    lifetimeXp: 235,
    dailyXp: 10,
  },
  parameters: {
    annotation:
      'taskee · 2×2 · hero count + coin, progress, then full filled task list with +XP & overdue wash',
  },
}

export const TaskeeCompact: Story = {
  name: 'Taskee — Compact (1×1)',
  args: {
    tasks: SAMPLE_TASKEE_TASKS,
    tier: 2,
    isFamily: false,
    size: 'compact',
    lifetimeXp: 235,
    dailyXp: 10,
  },
  parameters: {
    annotation: 'taskee · 1×1 · hero count + progress — nice-to-have compact variant per spec',
  },
}

export const TaskeeAllDone: Story = {
  name: 'Taskee — All done today',
  args: {
    tasks: SAMPLE_TASKEE_TASKS.map((t) => ({
      ...t,
      status: 'completed' as const,
      completedAt: new Date().toISOString(),
    })),
    tier: 2,
    isFamily: false,
    size: 'standard',
    lifetimeXp: 285,
    dailyXp: 50,
  },
  parameters: {
    annotation:
      'taskee · all tasks cleared · centered "🎉 All done today" with the lifetime coin retained in the header',
  },
}

export const TaskeeEmptyTier1: Story = {
  name: 'Taskee — Empty (tier 1, warm)',
  args: {
    tasks: [],
    tier: 1,
    isFamily: false,
    size: 'standard',
    lifetimeXp: 0,
  },
  parameters: {
    annotation:
      'tier 1 · empty state · warm encouraging copy ("All done!") · compact variant (fits 180px slot)',
  },
}

export const TaskeeEmptyTier2: Story = {
  name: 'Taskee — Empty (tier 2+, neutral)',
  args: {
    tasks: [],
    tier: 2,
    isFamily: false,
    size: 'standard',
    lifetimeXp: 0,
  },
  parameters: {
    annotation:
      'tier 2+ · empty state · neutral functional copy ("No tasks today") · no CTA in widget (task creation is on the page)',
  },
}

/* Family framing (tier 4 / family pseudo-profile) — per-person rows, no XP. */

export const FamilyStandard: Story = {
  name: 'Family — Standard (2×1)',
  args: {
    tasks: SAMPLE_FAMILY_TASKS,
    tier: 4,
    isFamily: false,
    size: 'standard',
  },
  parameters: {
    annotation:
      'family framing (tier 4) · 2×1 · "X of Y done today" headline · overdue pill · up to 2 per-person rows with identity avatars + labelled count chips · no XP',
  },
}

export const FamilyLarge: Story = {
  name: 'Family — Large (2×2)',
  args: {
    tasks: SAMPLE_FAMILY_TASKS,
    tier: 4,
    isFamily: false,
    size: 'large',
  },
  parameters: {
    annotation:
      'family framing (tier 4) · 2×2 · full per-person list · overdue wash + error chips · identity avatars · "✓ all done" chip when a person clears their list',
  },
}

export const FamilyDashboard: Story = {
  name: 'Family — Dashboard pseudo-profile',
  args: {
    tasks: SAMPLE_FAMILY_TASKS,
    tier: 1,
    isFamily: true,
    size: 'standard',
  },
  parameters: {
    annotation:
      'family pseudo-profile (isFamily=true, tier 1) — still shows family framing; unattended tablet slot for the whole household',
  },
}

export const FamilyAllDone: Story = {
  name: 'Family — All done state',
  args: {
    tasks: SAMPLE_FAMILY_TASKS.map((t) => ({
      ...t,
      status: 'completed' as const,
      completedAt: new Date().toISOString(),
    })),
    tier: 4,
    isFamily: false,
    size: 'large',
  },
  parameters: {
    annotation:
      'family large · all tasks completed · every person shows "✓ all done" chip (green) · "N of N done today" headline',
  },
}
