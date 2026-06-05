import type { Meta, StoryObj } from '@storybook/react'
import { ProfileListItem } from './profile-list-item'

const meta: Meta<typeof ProfileListItem> = {
  title: 'Platform/ProfileListItem',
  component: ProfileListItem,
  parameters: { layout: 'padded' },
  argTypes: {
    tier: { control: 'radio', options: [1, 2, 3, 4] },
    isLast: { control: 'boolean' },
  },
  args: {
    name: 'Alex Johnson',
    tier: 4,
    isLast: false,
  },
}
export default meta
type Story = StoryObj<typeof ProfileListItem>

// ─── Interactive ──────────────────────────────────────────────────────────────

export const Interactive: Story = {
  args: {
    onEdit: () => {},
    onRemove: () => {},
  },
}

// ─── All tiers ────────────────────────────────────────────────────────────────

export const AllTiers: Story = {
  name: 'All tier chips',
  render: () => (
    <div
      style={{
        border: '1px solid var(--border)',
        borderRadius: 16,
        overflow: 'hidden',
        maxWidth: 560,
      }}
    >
      {(
        [
          { name: 'Morgan', tier: 4 as const },
          { name: 'Riley', tier: 3 as const },
          { name: 'Cameron', tier: 2 as const },
          { name: 'Avery', tier: 1 as const },
        ] as const
      ).map((p, i, arr) => (
        <ProfileListItem
          key={p.name}
          name={p.name}
          tier={p.tier}
          isLast={i === arr.length - 1}
          onEdit={() => {}}
          onRemove={() => {}}
        />
      ))}
    </div>
  ),
}

// ─── Action states ────────────────────────────────────────────────────────────

export const ActionStates: Story = {
  name: 'Action states — edit / remove / none',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        maxWidth: 560,
        fontFamily: 'var(--font-ui)',
      }}
    >
      <div>
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--muted-foreground)',
            marginBottom: 8,
          }}
        >
          Both actions
        </p>
        <div style={{ border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
          <ProfileListItem name="Alex" tier={4} isLast onEdit={() => {}} onRemove={() => {}} />
        </div>
      </div>

      <div>
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--muted-foreground)',
            marginBottom: 8,
          }}
        >
          Edit only
        </p>
        <div style={{ border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
          <ProfileListItem name="Alex" tier={4} isLast onEdit={() => {}} />
        </div>
      </div>

      <div>
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--muted-foreground)',
            marginBottom: 8,
          }}
        >
          Read-only (no actions)
        </p>
        <div style={{ border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
          <ProfileListItem name="Alex" tier={4} isLast />
        </div>
      </div>
    </div>
  ),
}

// ─── Divider behavior ─────────────────────────────────────────────────────────

export const DividerBehavior: Story = {
  name: 'isLast — divider suppression',
  render: () => (
    <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', fontFamily: 'var(--font-ui)' }}>
      <div>
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--muted-foreground)',
            marginBottom: 8,
          }}
        >
          isLast=false (divider shown)
        </p>
        <div
          style={{
            border: '1px solid var(--border)',
            borderRadius: 16,
            overflow: 'hidden',
            width: 320,
          }}
        >
          <ProfileListItem
            name="Alex"
            tier={4}
            isLast={false}
            onEdit={() => {}}
            onRemove={() => {}}
          />
          <ProfileListItem name="Jordan" tier={2} isLast onEdit={() => {}} onRemove={() => {}} />
        </div>
      </div>
    </div>
  ),
}
