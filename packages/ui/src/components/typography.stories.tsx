import type { Meta, StoryObj } from '@storybook/react'
import { CheckCircle2 } from 'lucide-react'

const meta: Meta = {
  title: 'Foundation/Typography',
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj

// ─── Scale reference ──────────────────────────────────────────────────────────

type Token = {
  name: string
  utility: string
  px: number
  weight: number
  lh: number
  tracking: string
  lora?: true
  note: string
}

const TOKENS: Token[] = [
  {
    name: 'xs',
    utility: 'text-xs-token',
    px: 10,
    weight: 600,
    lh: 1.4,
    tracking: '0',
    note: 'badges, footnotes',
  },
  {
    name: 'section-label',
    utility: 'text-section-label',
    px: 11,
    weight: 700,
    lh: 1.4,
    tracking: '0.1em',
    note: 'uppercase group headers',
  },
  {
    name: 'sm',
    utility: 'text-sm-token',
    px: 13,
    weight: 400,
    lh: 1.5,
    tracking: '0',
    note: 'secondary body, captions, hints',
  },
  {
    name: 'base',
    utility: 'text-base-token',
    px: 14,
    weight: 400,
    lh: 1.5,
    tracking: '0',
    note: 'nav labels, form labels',
  },
  {
    name: 'card-title',
    utility: 'text-card-title',
    px: 16,
    weight: 600,
    lh: 1.3,
    tracking: '0',
    note: 'widget headers, list items, dialog titles',
  },
  {
    name: 'body',
    utility: 'text-body',
    px: 18,
    weight: 400,
    lh: 1.6,
    tracking: '0',
    note: 'widget content, button text',
  },
  {
    name: 'heading',
    utility: 'text-heading',
    px: 20,
    weight: 600,
    lh: 1.2,
    tracking: '-0.01em',
    note: 'multi-step views, drawers',
  },
  {
    name: 'page-title',
    utility: 'text-page-title',
    px: 26,
    weight: 600,
    lh: 1.2,
    tracking: '-0.02em',
    lora: true,
    note: 'page h1 — one per route',
  },
  {
    name: 'display-lg',
    utility: 'text-display-lg',
    px: 29,
    weight: 600,
    lh: 1.2,
    tracking: '-0.01em',
    lora: true,
    note: 'empty/error state headings',
  },
  {
    name: 'metric',
    utility: 'text-metric',
    px: 32,
    weight: 700,
    lh: 1.0,
    tracking: '-0.01em',
    note: 'widget key numbers',
  },
  {
    name: 'display-xl',
    utility: 'text-display-xl',
    px: 36,
    weight: 400,
    lh: 1.15,
    tracking: '-0.01em',
    lora: true,
    note: 'greeting, hero moments',
  },
]

export const Scale: Story = {
  name: 'Scale — all tokens',
  render: () => (
    <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column' }}>
      {TOKENS.map((t, i) => (
        <div
          key={t.name}
          style={{
            display: 'grid',
            gridTemplateColumns: '140px 1fr 240px',
            alignItems: 'baseline',
            gap: 20,
            padding: '14px 0',
            borderBottom: i < TOKENS.length - 1 ? '1px solid var(--border)' : 'none',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--foreground)',
                fontFamily: 'var(--font-ui)',
              }}
            >
              {t.name}
            </span>
            {t.lora && (
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--accent)',
                  fontFamily: 'var(--font-ui)',
                }}
              >
                Lora
              </span>
            )}
          </div>

          <span
            className={t.utility}
            style={{
              color: t.name === 'section-label' ? 'var(--muted-foreground)' : 'var(--foreground)',
            }}
          >
            Family OS
          </span>

          <div
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 11,
              color: 'var(--muted-foreground)',
              lineHeight: 1.5,
            }}
          >
            <code
              style={{
                fontSize: 10,
                background: 'var(--muted)',
                padding: '1px 5px',
                borderRadius: 4,
              }}
            >
              {t.utility}
            </code>
            <br />
            {t.px}px · {t.weight} · {t.lh}
            <br />
            {t.note}
          </div>
        </div>
      ))}
    </div>
  ),
}

// ─── Specimens ────────────────────────────────────────────────────────────────

export const PageTitleSpecimen: Story = {
  name: 'page-title — in context',
  render: () => (
    <div style={{ maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Settings */}
      <div
        style={{
          border: '1px solid var(--border)',
          borderRadius: 16,
          overflow: 'hidden',
          background: 'var(--background)',
        }}
      >
        <div style={{ padding: '20px 24px 16px' }}>
          <h1 className="text-page-title">Settings</h1>
        </div>
        <div style={{ borderTop: '1px solid var(--border)', padding: '12px 24px' }}>
          <h2 className="text-section-label">Profiles</h2>
        </div>
        <div
          style={{
            padding: '14px 24px',
            fontFamily: 'var(--font-ui)',
            fontSize: 13,
            color: 'var(--muted-foreground)',
          }}
        >
          profile rows…
        </div>
      </div>
    </div>
  ),
}

export const EmptyStateSpecimen: Story = {
  name: 'display-lg — empty state',
  render: () => (
    <div
      style={{
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: 40,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        background: 'var(--background)',
        maxWidth: 400,
      }}
    >
      <CheckCircle2 size={32} style={{ color: 'var(--muted-foreground)', opacity: 0.4 }} />
      <h2
        className="text-display-lg"
        style={{ color: 'var(--foreground)', margin: 0, textAlign: 'center' }}
      >
        All done!
      </h2>
      <p
        className="text-body"
        style={{ color: 'var(--muted-foreground)', margin: 0, textAlign: 'center' }}
      >
        Nothing left for today.
      </p>
    </div>
  ),
}

export const GreetingSpecimen: Story = {
  name: 'display-xl — greeting',
  render: () => (
    <div style={{ padding: 40, background: 'var(--background)' }}>
      <p className="text-display-xl" style={{ color: 'var(--foreground)', margin: 0 }}>
        Good morning, Zach
      </p>
    </div>
  ),
}
