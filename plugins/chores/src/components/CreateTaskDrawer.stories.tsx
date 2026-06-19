import type { Meta, StoryObj } from '@storybook/react'
import { CreateTaskDrawer } from './CreateTaskDrawer'
import { SAMPLE_MEMBERS } from '../sample-tasks'

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
