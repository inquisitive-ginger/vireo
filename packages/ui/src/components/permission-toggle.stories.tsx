import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { PermissionToggleItem } from './permission-toggle-item'
import { PermissionToggleList } from './permission-toggle-list'

// ─── PermissionToggleItem ─────────────────────────────────────────────────────

const meta: Meta<typeof PermissionToggleItem> = {
  title: 'Platform/PermissionToggle',
  component: PermissionToggleItem,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="rounded-2xl border border-border overflow-hidden max-w-sm">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    label: { control: 'text' },
    inBaseline: { control: 'boolean' },
    override: { control: 'select', options: [null, 'grant', 'revocation'] },
    disabled: { control: 'boolean' },
    isLast: { control: 'boolean' },
  },
  args: {
    id: 'platform.profile.view',
    label: 'View profiles',
    inBaseline: true,
    override: null,
    isLast: true,
    onToggle: () => {},
  },
}
export default meta
type ItemStory = StoryObj<typeof PermissionToggleItem>

export const Interactive: ItemStory = {
  name: 'Interactive',
}

export const ActiveBaseline: ItemStory = {
  name: 'Active — tier baseline',
  args: {
    id: 'platform.profile.view',
    label: 'View profiles',
    inBaseline: true,
    override: null,
    isLast: true,
    onToggle: (_key: string) => {},
  },
}

export const Revoked: ItemStory = {
  name: 'Revoked — below baseline',
  args: {
    id: 'platform.plugin.view',
    label: 'Use plugins',
    inBaseline: true,
    override: 'revocation',
    isLast: true,
    onToggle: (_key: string) => {},
  },
}

export const Inactive: ItemStory = {
  name: 'Inactive — not in baseline',
  args: {
    id: 'platform.profile.switch',
    label: 'Switch active profile',
    inBaseline: false,
    override: null,
    isLast: true,
    onToggle: (_key: string) => {},
  },
}

export const Granted: ItemStory = {
  name: 'Granted — above baseline',
  args: {
    id: 'platform.profile.switch',
    label: 'Switch active profile',
    inBaseline: false,
    override: 'grant',
    isLast: true,
    onToggle: (_key: string) => {},
  },
}

export const Disabled: ItemStory = {
  name: 'Disabled',
  args: {
    id: 'platform.profile.view',
    label: 'View profiles',
    inBaseline: true,
    override: null,
    disabled: true,
    isLast: true,
    onToggle: (_key: string) => {},
  },
}

// ─── PermissionToggleList ─────────────────────────────────────────────────────

export const List: StoryObj = {
  name: 'PermissionToggleList — all states (interactive)',
  render: function Render() {
    const [items, setItems] = useState([
      {
        key: 'platform.profile.view',
        label: 'View profiles',
        inBaseline: true,
        override: null as 'grant' | 'revocation' | null,
      },
      {
        key: 'platform.profile.switch',
        label: 'Switch active profile',
        inBaseline: false,
        override: 'grant' as const,
      },
      {
        key: 'platform.plugin.view',
        label: 'Use plugins',
        inBaseline: true,
        override: 'revocation' as const,
      },
    ])

    function handleToggle(key: string) {
      setItems((prev) =>
        prev.map((item) => {
          if (item.key !== key) return item
          if (item.inBaseline) {
            return { ...item, override: item.override === 'revocation' ? null : 'revocation' }
          }
          return { ...item, override: item.override === 'grant' ? null : 'grant' }
        })
      )
    }

    return (
      <div className="rounded-2xl border border-border overflow-hidden max-w-sm">
        <PermissionToggleList items={items} onToggle={handleToggle} />
      </div>
    )
  },
}
