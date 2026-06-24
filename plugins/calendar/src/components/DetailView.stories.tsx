import type { Meta, StoryObj } from '@storybook/react'
import { DetailView } from './DetailView'
import { STORY_EVENTS, STORY_MEMBERS, STORY_TODAY } from './fixtures'

/* The day/week drill-in agendas — owner-hue spines, full times, all-day spans
   and recurring markers surfaced. */

const meta: Meta<typeof DetailView> = {
  title: 'Calendar/Detail View',
  component: DetailView,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div style={{ background: 'var(--background)', padding: 24 }}>
        <div className="mx-auto" style={{ maxWidth: 760 }}>
          <Story />
        </div>
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof DetailView>

export const Day: Story = {
  args: {
    view: 'day',
    cursor: new Date(2026, 5, 22), // the crowded day
    events: STORY_EVENTS,
    membersById: STORY_MEMBERS,
    today: STORY_TODAY,
  },
}

export const Week: Story = {
  args: {
    view: 'week',
    cursor: new Date(2026, 5, 22),
    events: STORY_EVENTS,
    membersById: STORY_MEMBERS,
    today: STORY_TODAY,
  },
}

export const EmptyDay: Story = {
  args: {
    view: 'day',
    cursor: new Date(2026, 5, 28), // a clear Sunday
    events: STORY_EVENTS,
    membersById: STORY_MEMBERS,
    today: STORY_TODAY,
  },
}
