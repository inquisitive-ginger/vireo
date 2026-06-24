import type { Meta, StoryObj } from '@storybook/react'
import { layoutMonth } from '../lib/grid'
import { MonthGrid } from './MonthGrid'
import { STORY_EVENTS, STORY_MEMBERS, STORY_TODAY } from './fixtures'

/* The hero glanceable month grid against a representative June 2026 family month
   — color-by-owner pills, split-fill shared events, neutral Family events,
   multi-day span bars, today circle, dim past days, and +N more density. */

const meta: Meta<typeof MonthGrid> = {
  title: 'Calendar/Month Grid',
  component: MonthGrid,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ background: 'var(--background)', padding: 24, minHeight: '100vh' }}>
        <div className="mx-auto" style={{ width: 1060 }}>
          <Story />
        </div>
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof MonthGrid>

export const MonthView: Story = {
  args: {
    weeks: layoutMonth(STORY_EVENTS, 2026, 5),
    membersById: STORY_MEMBERS,
    today: STORY_TODAY,
    onDrillDay: (date) => console.log('drill', date.toDateString()),
  },
}

export const EmptyMonth: Story = {
  args: {
    weeks: layoutMonth([], 2026, 5),
    membersById: STORY_MEMBERS,
    today: STORY_TODAY,
    onDrillDay: () => {},
  },
}
