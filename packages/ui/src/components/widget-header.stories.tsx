import type { Meta, StoryObj } from '@storybook/react'
import { CalendarDays, CheckSquare, MessagesSquare } from 'lucide-react'
import { WidgetHeader } from './widget-header'

const meta: Meta<typeof WidgetHeader> = {
  title: 'Primitives/WidgetHeader',
  component: WidgetHeader,
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof WidgetHeader>

export const Plain: Story = {
  name: 'Icon + label',
  render: () => <WidgetHeader icon={MessagesSquare} label="Family Feed" />,
}

export const WithTrailing: Story = {
  name: 'Trailing slot',
  render: () => (
    <WidgetHeader
      icon={CheckSquare}
      label="Chores"
      trailing={<span className="text-xs-token text-muted-foreground">3 overdue</span>}
    />
  ),
}

export const Calendar: Story = {
  render: () => <WidgetHeader icon={CalendarDays} label="Calendar" />,
}
