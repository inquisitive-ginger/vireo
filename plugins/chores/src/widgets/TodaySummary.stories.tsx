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

/* One story per unique enumerable variant. Live, the widget self-sizes via
   container queries; here each story passes an explicit `size` to pin the variant.
   Framing (taskee vs family) is the other axis — tiers 1–3 vs tier 4 / the family
   pseudo-profile (which renders identically, so it isn't a separate story). */

/* ── Taskee framing (tiers 1–3) — status-encoded, gold XP ──────────────────── */

export const TaskeeCompact: Story = {
  name: 'Taskee — Compact',
  args: {
    tasks: SAMPLE_TASKEE_TASKS,
    tier: 2,
    isFamily: false,
    size: 'compact',
    lifetimeXp: 235,
    dailyXp: 10,
  },
  parameters: {
    annotation: 'taskee · short/narrow-slot fallback · hero count + progress only',
  },
}

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
      'taskee · wide + short · hero split — count + daily XP left, filled +XP rows right, lifetime coin in header · tap deep-links to /chores',
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
      'taskee · tall · hero count + coin, progress, then the full filled task list with +XP & overdue wash',
  },
}

export const TaskeeAllDone: Story = {
  name: 'Taskee — All done',
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
      'taskee · all tasks cleared · centered 🎉 "All done today" + gold earned-XP pill · lifetime coin retained in header',
  },
}

export const TaskeeEmptyWarm: Story = {
  name: 'Taskee — Empty (tier 1, warm)',
  args: {
    tasks: [],
    tier: 1,
    isFamily: false,
    size: 'standard',
    lifetimeXp: 0,
  },
  parameters: {
    annotation: 'taskee · no tasks · tier-1 warm copy ("All done!") — tier-aware empty tone',
  },
}

export const TaskeeEmptyNeutral: Story = {
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
      'taskee · no tasks · tier-2+ neutral copy ("No tasks today") · no CTA (creation is on the page)',
  },
}

/* ── Taskee Focus framing (focusMode on) — single hero "Next up" + "+N more" ── */

export const FocusCompact: Story = {
  name: 'Focus — Compact',
  args: {
    tasks: SAMPLE_TASKEE_TASKS,
    tier: 1,
    isFamily: false,
    focusMode: true,
    size: 'compact',
    lifetimeXp: 120,
    dailyXp: 10,
  },
  parameters: {
    annotation:
      'focus · short/narrow-slot · "Next up" hero row + "+N more today" + progress — one obvious next action',
  },
}

export const FocusStandard: Story = {
  name: 'Focus — Standard (2×1)',
  args: {
    tasks: SAMPLE_TASKEE_TASKS,
    tier: 1,
    isFamily: false,
    focusMode: true,
    size: 'standard',
    lifetimeXp: 120,
    dailyXp: 10,
  },
  parameters: {
    annotation:
      'focus · wide + short · centered "Next up" hero + "+N more" / daily XP + progress · coin in header · tap deep-links to /chores',
  },
}

export const FocusLarge: Story = {
  name: 'Focus — Large (2×2)',
  args: {
    tasks: SAMPLE_TASKEE_TASKS,
    tier: 1,
    isFamily: false,
    focusMode: true,
    size: 'large',
    lifetimeXp: 120,
    dailyXp: 10,
  },
  parameters: {
    annotation:
      'focus · tall · prominent "Next up" hero + "+N more today", progress anchored at the foot · daily XP in header',
  },
}

export const FocusAllDone: Story = {
  name: 'Focus — All done',
  args: {
    tasks: SAMPLE_TASKEE_TASKS.map((t) => ({
      ...t,
      status: 'completed' as const,
      completedAt: new Date().toISOString(),
    })),
    tier: 1,
    isFamily: false,
    focusMode: true,
    size: 'standard',
    lifetimeXp: 170,
    dailyXp: 50,
  },
  parameters: {
    annotation: 'focus · all cleared · shares the taskee 🎉 "All done today" payoff',
  },
}

/* ── Family framing (tier 4 / family pseudo-profile) — identity rows, no XP ──── */

export const FamilyCompact: Story = {
  name: 'Family — Compact',
  args: {
    tasks: SAMPLE_FAMILY_TASKS,
    tier: 4,
    isFamily: false,
    size: 'compact',
  },
  parameters: {
    annotation:
      'family · short/narrow-slot fallback (e.g. an h=1 mobile slot) · count + progress + overdue · no per-person rows (they need height); tap for detail',
  },
}

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
      'family (tier 4 or the family pseudo-profile) · wide + short · pending hero + "X of Y done" + overdue pill / per-person tiles (identity avatars + labelled chips), urgent-first · no XP',
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
      'family · tall · pending hero + progress, then the full per-person list (every member, urgent-first) · overdue wash + chips · "✓ all done" when a person clears',
  },
}

export const FamilyAllDone: Story = {
  name: 'Family — All done',
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
      'family · all tasks completed · every person shows the green "✓ all done" chip · "N of N done today"',
  },
}
