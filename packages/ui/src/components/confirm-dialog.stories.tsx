import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ConfirmDialog } from './confirm-dialog'
import { Button } from './button'

const meta: Meta<typeof ConfirmDialog> = {
  title: 'Primitives/Dialog',
  component: ConfirmDialog,
  parameters: { layout: 'centered' },
  argTypes: {
    open: { control: 'boolean' },
    title: { control: 'text' },
    description: { control: 'text' },
    confirmLabel: { control: 'text' },
    isPending: { control: 'boolean' },
  },
  args: {
    open: true,
    title: 'Remove Jordan?',
    description:
      'Their home screen, preferences, and all module data including chores and schedules will be permanently deleted.',
    confirmLabel: 'Remove',
    isPending: false,
    onConfirm: () => {},
    onCancel: () => {},
  },
}
export default meta
type Story = StoryObj<typeof ConfirmDialog>

// ─── Playground — always open, all controls live ─────────────────────────────

export const Playground: Story = {
  name: 'Playground — always open',
}

// ─── Interactive trigger ──────────────────────────────────────────────────────

export const Interactive: Story = {
  name: 'Interactive — trigger + close',
  render: () => {
    function Demo() {
      const [open, setOpen] = useState(false)
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
            padding: 32,
          }}
        >
          <Button onClick={() => setOpen(true)}>Remove Jordan</Button>
          <ConfirmDialog
            open={open}
            title="Remove Jordan?"
            description="Their home screen, preferences, and all module data including chores and schedules will be permanently deleted."
            confirmLabel="Remove"
            onConfirm={() => setOpen(false)}
            onCancel={() => setOpen(false)}
          />
        </div>
      )
    }
    return <Demo />
  },
}

// ─── Pending state ────────────────────────────────────────────────────────────

export const Pending: Story = {
  name: 'isPending — buttons disabled',
  render: () => (
    <ConfirmDialog
      open={true}
      title="Remove Jordan?"
      description="Their home screen, preferences, and all module data including chores and schedules will be permanently deleted."
      confirmLabel="Remove"
      onConfirm={() => {}}
      onCancel={() => {}}
      isPending={true}
    />
  ),
}

// ─── Custom labels ────────────────────────────────────────────────────────────

export const CustomLabels: Story = {
  name: 'Custom title / label — generic reuse',
  render: () => {
    function Demo() {
      const [open, setOpen] = useState(false)
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
            padding: 32,
          }}
        >
          <Button variant="outline" onClick={() => setOpen(true)}>
            Reset permissions
          </Button>
          <ConfirmDialog
            open={open}
            title="Reset permission overrides?"
            description="All custom permission overrides for this profile will be cleared. Default tier permissions will apply."
            confirmLabel="Reset"
            onConfirm={() => setOpen(false)}
            onCancel={() => setOpen(false)}
          />
        </div>
      )
    }
    return <Demo />
  },
}

// ─── Backdrop dismiss ─────────────────────────────────────────────────────────

export const BackdropDismiss: Story = {
  name: 'Backdrop click dismisses',
  render: () => {
    function Demo() {
      const [open, setOpen] = useState(true)
      const [dismissed, setDismissed] = useState(false)
      return (
        <div style={{ padding: 32, fontFamily: 'var(--font-ui)' }}>
          {dismissed ? (
            <div
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}
            >
              <p style={{ fontSize: 14, color: 'var(--muted-foreground)' }}>
                Dismissed via backdrop click
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setOpen(true)
                  setDismissed(false)
                }}
              >
                Reopen
              </Button>
            </div>
          ) : (
            <p style={{ fontSize: 14, color: 'var(--muted-foreground)' }}>
              Click outside the dialog to dismiss
            </p>
          )}
          <ConfirmDialog
            open={open}
            title="Remove Jordan?"
            description="Their home screen, preferences, and all module data including chores and schedules will be permanently deleted."
            confirmLabel="Remove"
            onConfirm={() => setOpen(false)}
            onCancel={() => {
              setOpen(false)
              setDismissed(true)
            }}
          />
        </div>
      )
    }
    return <Demo />
  },
}
