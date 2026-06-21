import type { Meta, StoryObj } from '@storybook/react'
import { CreateTaskDrawer } from './CreateTaskDrawer'
import { SAMPLE_MEMBERS, SAMPLE_FAMILY_TASKS } from '../sample-tasks'

const meta: Meta<typeof CreateTaskDrawer> = {
  title: 'Chores/Create Task Drawer',
  component: CreateTaskDrawer,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof CreateTaskDrawer>

export const Create: Story = {
  name: 'Create — blank',
  args: {
    open: true,
    members: SAMPLE_MEMBERS,
    onClose: () => {},
    onSubmit: () => {},
  },
}

export const PrefilledAssignee: Story = {
  name: 'Create — per-person prefill',
  args: {
    open: true,
    members: SAMPLE_MEMBERS,
    prefillAssigneeId: 'm-zach',
    onClose: () => {},
    onSubmit: () => {},
  },
}

export const Edit: Story = {
  name: 'Edit — prefilled from task',
  args: {
    open: true,
    members: SAMPLE_MEMBERS,
    // "Mow the lawn" — Emma, due in 2 days, 25 XP — exercises every prefilled field.
    editingTask: SAMPLE_FAMILY_TASKS.find((t) => t.id === 'f5'),
    onClose: () => {},
    onSubmit: () => {},
  },
}
