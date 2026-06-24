import type { Meta, StoryObj } from '@storybook/react'
import type { Profile } from '@family-os/platform/types'
import { CreateEventDrawer } from './CreateEventDrawer'
import { STORY_MEMBERS } from './fixtures'

/* The reused create / edit drawer (design §2): owner multi-select + Family,
   inline Multiple-days / All-day / Repeat-weekly modifiers, reminder presets,
   and (edit mode) an in-drawer Remove. */

const members: Profile[] = [...STORY_MEMBERS].map(
  ([id, name]) => ({ id, name, tier: 2 }) as Profile
)

const meta: Meta<typeof CreateEventDrawer> = {
  title: 'Calendar/Create Event Drawer',
  component: CreateEventDrawer,
  parameters: { layout: 'fullscreen' },
  args: {
    open: true,
    members,
    onClose: () => {},
    onSubmit: () => {},
  },
}

export default meta
type Story = StoryObj<typeof CreateEventDrawer>

export const Create: Story = {
  args: { prefillDate: new Date(2026, 5, 23) },
}

export const Edit: Story = {
  args: {
    onRemove: () => {},
    editingEvent: {
      id: 'e1',
      seriesId: 'e1',
      occurrenceDate: null,
      isOccurrence: false,
      title: 'Dentist',
      description: null,
      attendeeIds: ['p3', 'p4'],
      ownerId: null,
      createdBy: 'p1',
      startsAt: new Date(2026, 5, 23, 10, 0).toISOString(),
      endsAt: new Date(2026, 5, 23, 11, 0).toISOString(),
      allDay: false,
      location: 'Dr. Lee',
      recurrence: null,
      recurrenceUntil: null,
      isActivity: false,
      status: 'confirmed',
      source: 'manual',
      reminderMinutes: 30,
      createdAt: '',
      updatedAt: '',
    },
  },
}

export const EditRecurring: Story = {
  args: {
    onRemove: () => {},
    editingEvent: {
      id: 'e2',
      seriesId: 'e2',
      occurrenceDate: '2026-06-23',
      isOccurrence: true,
      title: 'Gymnastics',
      description: null,
      attendeeIds: ['p3'],
      ownerId: 'p3',
      createdBy: 'p1',
      startsAt: new Date(2026, 5, 23, 16, 0).toISOString(),
      endsAt: new Date(2026, 5, 23, 17, 0).toISOString(),
      allDay: false,
      location: 'Flips Gym',
      recurrence: 'weekly',
      recurrenceUntil: '2026-08-25',
      isActivity: true,
      status: 'confirmed',
      source: 'manual',
      reminderMinutes: 30,
      createdAt: '',
      updatedAt: '',
    },
  },
}
