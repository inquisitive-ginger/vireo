import type { Meta, StoryObj } from '@storybook/react'
import { ComposeForm } from './compose-form'

const meta: Meta<typeof ComposeForm> = {
  title: 'Family Feed/ComposeForm',
  component: ComposeForm,
  parameters: { layout: 'padded' },
  args: {
    onSubmit: () => {},
    onCancel: () => {},
    authorName: 'Alice',
  },
}

export default meta
type Story = StoryObj<typeof ComposeForm>

export const Empty: Story = {}

export const Filled: Story = {
  args: {
    defaultValue:
      'Had a great time at the park today — kids absolutely loved the new playground equipment!',
  },
}

// onSubmit never resolves — click "Post" to see the Posting… / disabled state
export const Submitting: Story = {
  args: {
    defaultValue: 'Pizza night tonight, voting on toppings in the group chat.',
    onSubmit: () => new Promise(() => {}),
  },
}
