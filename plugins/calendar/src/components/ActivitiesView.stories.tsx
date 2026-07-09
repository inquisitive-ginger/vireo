import type { Meta, StoryObj } from '@storybook/react'
import { ActivitiesView } from './ActivitiesView'
import { STORY_ACTIVITIES, STORY_MEMBERS, STORY_TODAY } from './fixtures'

/* The Activities lens (story #5) — standing weekly commitments grouped by owner,
   with a [Roster · Seasons] sub-switch. In the running app it's the "Activities"
   tier of the tablet calendar surface (design.md §4). */

const meta: Meta<typeof ActivitiesView> = {
  title: 'Calendar/Activities View',
  component: ActivitiesView,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ background: 'var(--background)', padding: 24, minHeight: '100vh' }}>
        <div className="mx-auto" style={{ maxWidth: 860 }}>
          <Story />
        </div>
      </div>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof ActivitiesView>

export const Default: Story = {
  name: 'Roster + Seasons (tier 4)',
  args: {
    activities: STORY_ACTIVITIES,
    membersById: STORY_MEMBERS,
    now: STORY_TODAY,
    canManage: true,
    onAdd: () => {},
    onEdit: () => {},
    onRemove: () => {},
  },
}

export const ReadOnly: Story = {
  name: 'Read-only (below tier 4)',
  args: {
    activities: STORY_ACTIVITIES,
    membersById: STORY_MEMBERS,
    now: STORY_TODAY,
    canManage: false,
  },
}

export const Empty: Story = {
  args: {
    activities: [],
    membersById: STORY_MEMBERS,
    now: STORY_TODAY,
    canManage: true,
    onAdd: () => {},
  },
}
