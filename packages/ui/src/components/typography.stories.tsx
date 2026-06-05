import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta = {
  title: 'Foundation/Typography',
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj

// ─── Token specimens ──────────────────────────────────────────────────────────

export const Tokens: Story = {
  name: 'Heading tokens',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 48,
        padding: 40,
        maxWidth: 640,
        fontFamily: 'var(--font-ui)',
      }}
    >
      {/* page-title */}
      <div>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--muted-foreground)',
            marginBottom: 12,
          }}
        >
          page-title
        </div>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: 'var(--foreground)',
            margin: 0,
          }}
        >
          Settings
        </h1>
        <div
          style={{
            marginTop: 10,
            fontSize: 12,
            color: 'var(--muted-foreground)',
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            columnGap: 24,
            rowGap: 4,
          }}
        >
          <span>font</span>
          <span>DM Sans</span>
          <span>size</span>
          <span>22px (text-2xl)</span>
          <span>weight</span>
          <span>600 (font-semibold)</span>
          <span>tracking</span>
          <span>−0.02em (tracking-tight)</span>
          <span>usage</span>
          <span>Page-level h1 — one per route</span>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)' }} />

      {/* section-label */}
      <div>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--muted-foreground)',
            marginBottom: 12,
          }}
        >
          section-label
        </div>
        <h2
          style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--muted-foreground)',
            margin: 0,
          }}
        >
          Profiles
        </h2>
        <div
          style={{
            marginTop: 10,
            fontSize: 12,
            color: 'var(--muted-foreground)',
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            columnGap: 24,
            rowGap: 4,
          }}
        >
          <span>font</span>
          <span>DM Sans</span>
          <span>size</span>
          <span>11px (text-[11px])</span>
          <span>weight</span>
          <span>700 (font-bold)</span>
          <span>tracking</span>
          <span>0.1em (tracking-[0.1em])</span>
          <span>case</span>
          <span>uppercase</span>
          <span>color</span>
          <span>muted-foreground</span>
          <span>usage</span>
          <span>SettingsSection header — grouped content labels</span>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)' }} />

      {/* Contrast specimen */}
      <div>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--muted-foreground)',
            marginBottom: 16,
          }}
        >
          In context — page-title vs section-label
        </div>
        <div
          style={{
            border: '1px solid var(--border)',
            borderRadius: 12,
            overflow: 'hidden',
            background: 'var(--background)',
          }}
        >
          <div style={{ padding: '24px 24px 16px' }}>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: '-0.02em',
                color: 'var(--foreground)',
                margin: 0,
              }}
            >
              Settings
            </h1>
          </div>
          <div
            style={{
              borderTop: '1px solid var(--border)',
              padding: '12px 24px',
              background: 'var(--background)',
            }}
          >
            <h2
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--muted-foreground)',
                margin: 0,
              }}
            >
              Profiles
            </h2>
          </div>
          <div style={{ padding: '12px 24px', color: 'var(--muted-foreground)', fontSize: 13 }}>
            list items would appear here…
          </div>
        </div>
      </div>
    </div>
  ),
}

// ─── Scale reference ──────────────────────────────────────────────────────────

export const ScaleReference: Story = {
  name: 'Type scale — all UI sizes',
  render: () => {
    const sizes: { label: string; px: number; usage: string }[] = [
      { label: 'xs', px: 10, usage: 'badges, footnotes' },
      { label: 'section-label', px: 11, usage: 'SettingsSection headings' },
      { label: 'xs+', px: 12, usage: 'captions, helper text' },
      { label: 'sm', px: 13, usage: 'dialog body, secondary' },
      { label: 'base', px: 14, usage: 'default body, nav links' },
      { label: 'list-name', px: 15, usage: 'ProfileListItem name' },
      { label: 'page-title', px: 22, usage: 'page h1 (font-semibold)' },
    ]
    return (
      <div
        style={{
          padding: 40,
          maxWidth: 560,
          fontFamily: 'var(--font-ui)',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {sizes.map(({ label, px, usage }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
            <span
              style={{
                width: 80,
                fontSize: 10,
                color: 'var(--muted-foreground)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                flexShrink: 0,
              }}
            >
              {label}
            </span>
            <span style={{ fontSize: px, color: 'var(--foreground)', flexShrink: 0 }}>
              Family OS
            </span>
            <span style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>
              {px}px · {usage}
            </span>
          </div>
        ))}
      </div>
    )
  },
}
