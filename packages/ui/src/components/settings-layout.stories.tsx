import type { Meta, StoryObj } from '@storybook/react'
import { SettingsLayout, SettingsSection } from './settings-layout'
import { Button } from './button'
import { Plus } from 'lucide-react'

const meta: Meta<typeof SettingsLayout> = {
  title: 'Platform/SettingsLayout',
  component: SettingsLayout,
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj<typeof SettingsLayout>

// ─── Full page structure ──────────────────────────────────────────────────────

export const Default: Story = {
  name: 'Full page structure',
  render: () => (
    <SettingsLayout>
      <SettingsSection
        title="Profiles"
        action={
          <Button size="sm" variant="outline">
            <Plus className="size-3.5" /> Add
          </Button>
        }
      >
        <div className="px-6 py-5 text-sm text-muted-foreground">
          Profile list items appear here
        </div>
      </SettingsSection>

      <SettingsSection title="Security">
        <div className="px-6 py-5 text-sm text-muted-foreground">PIN reset row appears here</div>
      </SettingsSection>

      <SettingsSection title="Display">
        <div className="px-6 py-5 text-sm text-muted-foreground">
          Appearance toggle appears here
        </div>
      </SettingsSection>
    </SettingsLayout>
  ),
}

// ─── Section anatomy ──────────────────────────────────────────────────────────

export const SectionAnatomy: Story = {
  name: 'SettingsSection — header variants',
  render: () => (
    <div style={{ padding: 32, maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 24 }}>
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
          Title only
        </p>
        <SettingsSection title="Security">
          <div className="px-6 py-5 text-sm text-muted-foreground">Content area</div>
        </SettingsSection>
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
          Title + action
        </p>
        <SettingsSection
          title="Profiles"
          action={
            <Button size="sm" variant="outline">
              <Plus className="size-3.5" /> Add
            </Button>
          }
        >
          <div className="px-6 py-5 text-sm text-muted-foreground">Content area</div>
        </SettingsSection>
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
          Multiple children (dividers via ProfileListItem isLast)
        </p>
        <SettingsSection title="Profiles">
          {['Alex', 'Jordan', 'Sam'].map((name, i, arr) => (
            <div
              key={name}
              style={{
                padding: '16px 24px',
                borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : undefined,
                fontSize: 14,
                color: 'var(--foreground)',
              }}
            >
              {name}
            </div>
          ))}
        </SettingsSection>
      </div>
    </div>
  ),
}

// ─── Typography specimen ──────────────────────────────────────────────────────

export const PageTitle: Story = {
  name: 'page-title token — h1 prominence',
  render: () => (
    <SettingsLayout>
      <SettingsSection title="Example section">
        <div className="px-6 py-4 text-sm text-muted-foreground">
          The h1 above uses{' '}
          <code className="text-xs bg-muted px-1 py-0.5 rounded">
            text-2xl font-semibold tracking-tight
          </code>{' '}
          — distinct from the{' '}
          <code className="text-xs bg-muted px-1 py-0.5 rounded">section-label</code> token used in
          section headers.
        </div>
      </SettingsSection>
    </SettingsLayout>
  ),
}
