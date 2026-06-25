import type { Meta, StoryObj } from '@storybook/react'
import { AgendaView } from './AgendaView'
import { STORY_EVENTS, STORY_MEMBERS, STORY_TODAY } from './fixtures'

/* The mobile read surface: an "Up next" hero + day-grouped agenda rows. Shown at
   phone width — in the running app it sits inside the mobile shell chrome below
   `md:`. */

const meta: Meta<typeof AgendaView> = {
  title: 'Calendar/Agenda View',
  component: AgendaView,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div style={{ background: 'var(--background)', padding: 16 }}>
        <div className="mx-auto" style={{ maxWidth: 390 }}>
          <Story />
        </div>
      </div>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof AgendaView>

export const Default: Story = {
  args: {
    events: STORY_EVENTS,
    membersById: STORY_MEMBERS,
    now: STORY_TODAY,
    onEditEvent: () => {},
    onAdd: () => {},
  },
}

export const ReadOnly: Story = {
  name: 'Read-only (below tier 4)',
  args: {
    events: STORY_EVENTS,
    membersById: STORY_MEMBERS,
    now: STORY_TODAY,
  },
}

export const Empty: Story = {
  args: {
    events: [],
    membersById: STORY_MEMBERS,
    now: STORY_TODAY,
    onAdd: () => {},
  },
}
