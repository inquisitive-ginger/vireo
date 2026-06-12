import type { Meta, StoryObj } from '@storybook/react'
import { Bell, ClipboardList } from 'lucide-react'
import { Button } from './button'

const meta: Meta = {
  title: 'Foundation/Elevation',
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj

/* Surface layers — how the three background tokens relate.
   --background recedes, --secondary is structural (inset), --card lifts. */
export const SurfaceLayers: Story = {
  render: () => (
    <div style={{ background: 'var(--background)', minHeight: '100vh', padding: 40 }}>
      <div style={{ maxWidth: 640 }}>
        <p
          className="text-base-token"
          style={{ color: 'var(--muted-foreground)', marginBottom: 28 }}
        >
          Three surface layers. <strong>Depth, not lines, creates hierarchy</strong> — content that
          “sits on the table” gets <code>--card</code> + shadow; structural chrome stays flat.
        </p>

        <div className="flex flex-col gap-5">
          {(
            [
              [
                '--background',
                'none',
                'Page background — recedes. The warm table everything sits on.',
              ],
              [
                '--secondary',
                'none',
                'Structural / inset surfaces — sidebar, grouped rows. Flat by design: it is part of the chrome, not content.',
              ],
              [
                '--card',
                'var(--shadow-card)',
                'Content cards — lift above the background. Always paired with --shadow-card and a border.',
              ],
            ] as const
          ).map(([token, shadow, blurb]) => (
            <div key={token} className="flex items-center gap-5">
              <div
                className="rounded-xl border border-border shrink-0"
                style={{ width: 180, height: 80, background: `var(${token})`, boxShadow: shadow }}
              />
              <div>
                <div className="text-card-title" style={{ color: 'var(--foreground)' }}>
                  {token}
                </div>
                <div className="text-sm-token" style={{ color: 'var(--muted-foreground)' }}>
                  {blurb}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
}

/* The two shadow tokens, side by side. */
export const Shadows: Story = {
  render: () => (
    <div style={{ background: 'var(--background)', minHeight: '100vh', padding: 40 }}>
      <div className="flex gap-10 items-start">
        {(
          [
            [
              '--shadow-card',
              'Resting',
              'Cards at rest: widget slots, feed posts, settings sections. Subtle — visible lift, no drama.',
            ],
            [
              '--shadow-raised',
              'Raised',
              'Surfaces above the page: compose forms, trays, drawers, dialogs, toasts, the profile picker.',
            ],
          ] as const
        ).map(([token, name, blurb]) => (
          <div key={token} style={{ width: 280 }}>
            <div
              className="rounded-xl border border-border"
              style={{
                height: 150,
                background: 'var(--card)',
                boxShadow: `var(${token})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <code className="text-sm-token" style={{ color: 'var(--muted-foreground)' }}>
                {token}
              </code>
            </div>
            <div className="text-card-title" style={{ marginTop: 16, color: 'var(--foreground)' }}>
              {name}
            </div>
            <div
              className="text-sm-token"
              style={{ color: 'var(--muted-foreground)', marginTop: 4 }}
            >
              {blurb}
            </div>
          </div>
        ))}
      </div>
      <p
        className="text-sm-token"
        style={{ color: 'var(--muted-foreground)', marginTop: 32, maxWidth: 560 }}
      >
        Light-mode shadows are warm-tinted (<code>oklch(0.35 0.06 50 / …)</code>) — never neutral
        gray, which goes cold against the warm palette. Dark mode deepens to black. Use the tokens;
        never hardcode <code>box-shadow</code>.
      </p>
    </div>
  ),
}

/* Both tokens doing their actual jobs: a resting widget card on the home
   surface with a raised compose-like panel above it. */
export const InContext: Story = {
  render: () => (
    <div style={{ background: 'var(--background)', minHeight: '100vh', padding: 40 }}>
      <div style={{ position: 'relative', width: 560 }}>
        <div
          className="rounded-xl border border-border"
          style={{
            background: 'var(--card)',
            boxShadow: 'var(--shadow-card)',
            padding: '14px 18px',
          }}
        >
          <div className="flex items-center gap-1.5">
            <ClipboardList size={13} style={{ color: 'var(--accent)' }} aria-hidden />
            <span className="text-section-label" style={{ color: 'var(--accent)' }}>
              Chores
            </span>
          </div>
          <p className="text-body" style={{ color: 'var(--card-foreground)', marginTop: 10 }}>
            A resting widget card — <code>--shadow-card</code>.
          </p>
        </div>

        <div
          className="rounded-xl border border-border"
          style={{
            position: 'absolute',
            top: 64,
            left: 48,
            right: -32,
            background: 'var(--card)',
            boxShadow: 'var(--shadow-raised)',
            padding: '16px 18px',
          }}
        >
          <div className="flex items-center gap-2" style={{ marginBottom: 10 }}>
            <Bell size={14} style={{ color: 'var(--accent)' }} aria-hidden />
            <span className="text-card-title" style={{ color: 'var(--card-foreground)' }}>
              A raised panel above the page
            </span>
          </div>
          <p
            className="text-sm-token"
            style={{ color: 'var(--muted-foreground)', marginBottom: 12 }}
          >
            Dialogs, trays, compose forms — <code>--shadow-raised</code>.
          </p>
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost">
              Cancel
            </Button>
            <Button size="sm">Confirm</Button>
          </div>
        </div>
      </div>
    </div>
  ),
}
