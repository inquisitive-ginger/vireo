import type { Meta, StoryObj } from '@storybook/react'
import { PageHeader } from './page-header'
import { Button } from './button'

const meta: Meta<typeof PageHeader> = {
  title: 'Platform/PageHeader',
  component: PageHeader,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof PageHeader>

export const TitleOnly: Story = {
  args: { title: 'Settings' },
}

export const WithEyebrowAndAction: Story = {
  name: 'Eyebrow + action (Family Feed)',
  args: {
    title: 'Family Feed',
    eyebrow: 'The family bulletin',
    action: <Button>Add post</Button>,
  },
}

export const WithSubtitleAndAction: Story = {
  name: 'Subtitle + action (Chores)',
  args: {
    title: 'Chores',
    subtitle: '4 pending · 3 overdue · 1 done',
    action: <Button>Add task</Button>,
  },
}
