import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta = {
  title: 'Foundation/Motion',
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj

const DURATIONS = [
  {
    token: '--duration-fast',
    value: '100ms',
    label: 'Micro-interactions — icon swap, toggle state change',
    cls: 'motion-fast',
  },
  {
    token: '--duration-normal',
    value: '200ms',
    label: 'UI responses — menu open, hover, button press',
    cls: 'motion-normal',
  },
  {
    token: '--duration-slow',
    value: '300ms',
    label: 'Page-level — panel slide, drawer, modal enter',
    cls: 'motion-slow',
  },
]

const EASINGS = [
  {
    token: '--ease-out',
    value: 'cubic-bezier(0, 0, 0.2, 1)',
    label: 'Entrances — starts fast, decelerates in',
    cls: 'ease-out-demo',
  },
  {
    token: '--ease-in',
    value: 'cubic-bezier(0.4, 0, 1, 1)',
    label: 'Exits — starts slow, accelerates out',
    cls: 'ease-in-demo',
  },
  {
    token: '--ease-in-out',
    value: 'cubic-bezier(0.4, 0, 0.2, 1)',
    label: 'State transitions — slow start, slow end',
    cls: 'ease-in-out-demo',
  },
]

export const DurationTokens: Story = {
  name: 'Duration tokens',
  render: () => (
    <>
      <style>{`
        @keyframes motion-slide {
          0%, 100% { transform: translateX(0); }
          50%       { transform: translateX(220px); }
        }
        .motion-fast   { animation: motion-slide var(--duration-fast)   var(--ease-in-out) infinite; }
        .motion-normal { animation: motion-slide var(--duration-normal) var(--ease-in-out) infinite; }
        .motion-slow   { animation: motion-slide var(--duration-slow)   var(--ease-in-out) infinite; }
      `}</style>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          maxWidth: 640,
          fontFamily: 'var(--font-ui)',
        }}
      >
        {DURATIONS.map(({ token, value, label, cls }, i) => (
          <div
            key={token}
            style={{
              display: 'grid',
              gridTemplateColumns: '180px 1fr',
              gap: 32,
              alignItems: 'center',
              padding: '20px 0',
              borderBottom: i < DURATIONS.length - 1 ? '1px solid var(--border)' : 'none',
            }}
          >
            <div>
              <code
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--foreground)',
                  display: 'block',
                }}
              >
                {token}
              </code>
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: 'var(--primary)',
                  display: 'block',
                  lineHeight: 1.1,
                  marginTop: 2,
                }}
              >
                {value}
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: 'var(--muted-foreground)',
                  display: 'block',
                  marginTop: 4,
                  lineHeight: 1.4,
                }}
              >
                {label}
              </span>
            </div>
            <div
              style={{ position: 'relative', height: 40, display: 'flex', alignItems: 'center' }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  height: 1,
                  background: 'var(--border)',
                }}
              />
              <div
                className={cls}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: 'var(--primary)',
                  position: 'relative',
                  zIndex: 1,
                  flexShrink: 0,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  ),
}

export const EasingTokens: Story = {
  name: 'Easing tokens',
  render: () => (
    <>
      <style>{`
        @keyframes easing-demo {
          0%   { transform: translateX(0); }
          100% { transform: translateX(220px); }
        }
        .ease-out-demo    { animation: easing-demo 800ms var(--ease-out)    infinite alternate; }
        .ease-in-demo     { animation: easing-demo 800ms var(--ease-in)     infinite alternate; }
        .ease-in-out-demo { animation: easing-demo 800ms var(--ease-in-out) infinite alternate; }
      `}</style>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          maxWidth: 640,
          fontFamily: 'var(--font-ui)',
        }}
      >
        {EASINGS.map(({ token, value, label, cls }, i) => (
          <div
            key={token}
            style={{
              display: 'grid',
              gridTemplateColumns: '180px 1fr',
              gap: 32,
              alignItems: 'center',
              padding: '20px 0',
              borderBottom: i < EASINGS.length - 1 ? '1px solid var(--border)' : 'none',
            }}
          >
            <div>
              <code
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--foreground)',
                  display: 'block',
                }}
              >
                {token}
              </code>
              <code
                style={{
                  fontSize: 10,
                  color: 'var(--muted-foreground)',
                  display: 'block',
                  marginTop: 2,
                  lineHeight: 1.4,
                }}
              >
                {value}
              </code>
              <span
                style={{
                  fontSize: 11,
                  color: 'var(--muted-foreground)',
                  display: 'block',
                  marginTop: 4,
                  lineHeight: 1.4,
                }}
              >
                {label}
              </span>
            </div>
            <div
              style={{ position: 'relative', height: 40, display: 'flex', alignItems: 'center' }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  height: 1,
                  background: 'var(--border)',
                }}
              />
              <div
                className={cls}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: 'var(--accent)',
                  position: 'relative',
                  zIndex: 1,
                  flexShrink: 0,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <p
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 11,
          color: 'var(--muted-foreground)',
          marginTop: 16,
        }}
      >
        All three run at 800ms — same duration, different acceleration curve.
      </p>
    </>
  ),
}
