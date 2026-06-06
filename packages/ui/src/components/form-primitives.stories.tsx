import type { Meta, StoryObj } from '@storybook/react'
import { CircleAlert, Trash2 } from 'lucide-react'
import { Input } from './input'
import { Label } from './label'
import { Badge } from './badge'
import { Button } from './button'

const meta: Meta = {
  title: 'Primitives/Form',
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj
type InputStory = StoryObj<typeof Input>
type ButtonStory = StoryObj<typeof Button>
type BadgeStory = StoryObj<typeof Badge>

// ─── Interactive playgrounds ──────────────────────────────────────────────────

export const InputInteractive: InputStory = {
  name: 'Input — interactive',
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    type: { control: 'select', options: ['text', 'password', 'email', 'number'] },
  },
  args: {
    placeholder: 'Enter value',
    disabled: false,
    error: false,
    type: 'text',
  },
  render: (args) => (
    <div style={{ width: 300, padding: 32 }}>
      <Input {...args} />
    </div>
  ),
}

export const ButtonInteractive: ButtonStory = {
  name: 'Button — interactive',
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline', 'ghost', 'ghost-destructive'],
    },
    size: { control: 'select', options: ['sm', 'default', 'lg', 'icon'] },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    variant: 'default',
    size: 'default',
    disabled: false,
    children: 'Button',
  },
  render: (args) => (
    <div style={{ padding: 32 }}>
      <Button {...args} />
    </div>
  ),
}

export const BadgeInteractive: BadgeStory = {
  name: 'Badge — interactive',
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline', 'muted', 'success', 'destructive'],
    },
    children: { control: 'text' },
  },
  args: {
    variant: 'default',
    children: 'Label',
  },
  render: (args) => (
    <div style={{ padding: 32 }}>
      <Badge {...args} />
    </div>
  ),
}

// ─── Field anatomy ────────────────────────────────────────────────────────────
// Shows the Label → Input → error hint stack that every real form field uses.

export const FieldAnatomy: Story = {
  name: 'Field anatomy',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, width: 360, padding: 32 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Label htmlFor="name-ok">Your name</Label>
        <Input id="name-ok" placeholder="Alex Johnson" defaultValue="Alex Johnson" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Label htmlFor="name-empty">Your name</Label>
        <Input id="name-empty" placeholder="Alex Johnson" error />
        <p
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 12,
            color: 'var(--destructive)',
            margin: 0,
          }}
        >
          <CircleAlert size={12} />
          Name is required
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Label htmlFor="name-disabled">Your name</Label>
        <Input id="name-disabled" placeholder="Alex Johnson" disabled defaultValue="Read only" />
      </div>
    </div>
  ),
}

// ─── Input variants ───────────────────────────────────────────────────────────

export const InputVariants: Story = {
  name: 'Input — states',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 300, padding: 32 }}>
      <Input placeholder="Default" />
      <Input placeholder="With value" defaultValue="Filled value" />
      <Input placeholder="Error state" error />
      <Input placeholder="Disabled" disabled />
      <Input type="password" placeholder="Password" defaultValue="secret123" />
      <Input type="number" placeholder="0" />
    </div>
  ),
}

// ─── Badge variants ───────────────────────────────────────────────────────────

export const BadgeVariants: Story = {
  name: 'Badge — all variants',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 32 }}>
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="muted">Muted</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="destructive">Destructive</Badge>
    </div>
  ),
}

// ─── Button variants ─────────────────────────────────────────────────────────

export const ButtonVariants: Story = {
  name: 'Button — all variants',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Button size="sm">Small</Button>
        <Button size="lg">Large</Button>
        <Button size="icon" variant="outline" aria-label="icon">
          <Trash2 size={16} />
        </Button>
        <Button size="icon" variant="ghost-destructive" aria-label="delete">
          <Trash2 size={16} />
        </Button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Button disabled>Disabled</Button>
        <Button variant="outline" disabled>
          Disabled outline
        </Button>
      </div>
    </div>
  ),
}

// ─── Composed form ────────────────────────────────────────────────────────────

export const ComposedForm: Story = {
  name: 'Composed — profile form',
  render: () => (
    <div
      style={{
        width: 400,
        padding: 32,
        borderRadius: 16,
        border: '1px solid var(--border)',
        background: 'var(--secondary)',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        fontFamily: 'var(--font-ui)',
      }}
    >
      <div>
        <h2 style={{ fontSize: 18, margin: 0, color: 'var(--foreground)' }}>Add family member</h2>
        <p style={{ fontSize: 13, color: 'var(--muted-foreground)', marginTop: 4 }}>
          They can be added or changed any time.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Label htmlFor="member-name">Name</Label>
        <Input id="member-name" placeholder="e.g. Jordan" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Label>Role</Label>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['Parent', 'Teen', 'Older kid', 'Little one'] as const).map((label, i) => (
            <Badge
              key={label}
              variant={i === 0 ? 'default' : 'outline'}
              style={{ cursor: 'pointer', flex: 1, justifyContent: 'center', padding: '6px 0' }}
            >
              {label}
            </Badge>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Button variant="ghost" size="sm">
          Cancel
        </Button>
        <Button size="sm">Add member</Button>
      </div>
    </div>
  ),
}
