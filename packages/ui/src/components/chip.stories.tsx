import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Bell, Users } from 'lucide-react'
import { Chip, MemberChip } from './chip'

/* The shared selectable-pill chip + the identity MemberChip. Consumed by the
   chores assignee/reward pickers and the calendar owner/Family/reminder pickers. */

const meta: Meta<typeof Chip> = {
  title: 'Primitives/Chip',
  component: Chip,
  parameters: { layout: 'centered' },
}
export default meta
type Story = StoryObj<typeof Chip>

function MemberPicker() {
  const names = ['Zoe', 'Teddy', 'Hallie', 'Zach']
  const [selected, setSelected] = useState<string[]>(['Zoe'])
  const toggle = (n: string) =>
    setSelected((s) => (s.includes(n) ? s.filter((x) => x !== n) : [...s, n]))
  return (
    <div className="flex flex-wrap gap-2">
      {names.map((n) => (
        <MemberChip key={n} name={n} selected={selected.includes(n)} onClick={() => toggle(n)} />
      ))}
    </div>
  )
}

function TonePicker() {
  const [sel, setSel] = useState('family')
  return (
    <div className="flex flex-wrap gap-2">
      <Chip
        selected={sel === 'family'}
        onClick={() => setSel('family')}
        leading={<Users className="h-3.5 w-3.5" />}
        selectedClassName="border-foreground bg-secondary text-secondary-foreground"
      >
        Family
      </Chip>
      <Chip
        selected={sel === 'reminder'}
        onClick={() => setSel('reminder')}
        leading={sel === 'reminder' ? <Bell className="h-3 w-3" /> : undefined}
        selectedClassName="border-primary bg-primary/10 text-primary"
        idleClassName="text-muted-foreground"
      >
        30 min
      </Chip>
    </div>
  )
}

export const Members: Story = { render: () => <MemberPicker /> }
export const Tones: Story = { render: () => <TonePicker /> }
