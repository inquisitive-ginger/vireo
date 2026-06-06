import type { Meta, StoryObj } from '@storybook/react'
import { CheckCircle2, CalendarDays, Package } from 'lucide-react'
import { Button } from './button'

const meta: Meta = {
  title: 'Primitives/EmptyState',
  parameters: { layout: 'centered' },
}
export default meta
type Story = StoryObj

// ─── Shared container ─────────────────────────────────────────────────────────

function EmptyCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        padding: 48,
        border: '1px solid var(--border)',
        borderRadius: 16,
        background: 'var(--background)',
        maxWidth: 400,
        textAlign: 'center',
      }}
    >
      {children}
    </div>
  )
}

// ─── Anatomy ─────────────────────────────────────────────────────────────────
// Full pattern: icon → heading (display-lg) → body (body) → CTA

export const Anatomy: Story = {
  name: 'Anatomy — full pattern',
  render: () => (
    <EmptyCard>
      <CheckCircle2 size={40} style={{ color: 'var(--muted-foreground)', opacity: 0.4 }} />
      <h2 className="text-display-lg" style={{ color: 'var(--foreground)', margin: 0 }}>
        All done!
      </h2>
      <p className="text-body" style={{ color: 'var(--muted-foreground)', margin: 0 }}>
        Nothing left for today. Tasks will appear here when assigned.
      </p>
      <div style={{ marginTop: 8 }}>
        <Button variant="outline" size="sm">
          View completed
        </Button>
      </div>
    </EmptyCard>
  ),
}

// ─── Variants — which parts are optional ──────────────────────────────────────

export const Variants: Story = {
  name: 'Variants — heading · +body · +CTA',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        maxWidth: 400,
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
            marginBottom: 10,
          }}
        >
          Icon + heading only
        </p>
        <EmptyCard>
          <CheckCircle2 size={36} style={{ color: 'var(--muted-foreground)', opacity: 0.4 }} />
          <h2 className="text-display-lg" style={{ color: 'var(--foreground)', margin: 0 }}>
            All done!
          </h2>
        </EmptyCard>
      </div>

      <div>
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--muted-foreground)',
            marginBottom: 10,
          }}
        >
          Icon + heading + body
        </p>
        <EmptyCard>
          <CalendarDays size={36} style={{ color: 'var(--muted-foreground)', opacity: 0.4 }} />
          <h2 className="text-display-lg" style={{ color: 'var(--foreground)', margin: 0 }}>
            No events today
          </h2>
          <p className="text-body" style={{ color: 'var(--muted-foreground)', margin: 0 }}>
            Your schedule is clear.
          </p>
        </EmptyCard>
      </div>

      <div>
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--muted-foreground)',
            marginBottom: 10,
          }}
        >
          Icon + heading + body + CTA
        </p>
        <EmptyCard>
          <Package size={36} style={{ color: 'var(--muted-foreground)', opacity: 0.4 }} />
          <h2 className="text-display-lg" style={{ color: 'var(--foreground)', margin: 0 }}>
            No plugins installed
          </h2>
          <p className="text-body" style={{ color: 'var(--muted-foreground)', margin: 0 }}>
            Browse the marketplace to add modules for your family.
          </p>
          <div style={{ marginTop: 8 }}>
            <Button size="sm">Browse marketplace</Button>
          </div>
        </EmptyCard>
      </div>
    </div>
  ),
}

// ─── Tier-appropriate copy ────────────────────────────────────────────────────
// Tier 1: simple, positive vocabulary. Tier 2+: full context with optional action.

export const TierCopy: Story = {
  name: 'Tier-appropriate copy',
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: 32,
        flexWrap: 'wrap',
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
            marginBottom: 10,
          }}
        >
          Tier 1 — simple, positive
        </p>
        <EmptyCard>
          <CheckCircle2 size={36} style={{ color: 'var(--muted-foreground)', opacity: 0.4 }} />
          <h2 className="text-display-lg" style={{ color: 'var(--foreground)', margin: 0 }}>
            You're all done!
          </h2>
          <p className="text-body" style={{ color: 'var(--muted-foreground)', margin: 0 }}>
            Great job today.
          </p>
        </EmptyCard>
      </div>

      <div>
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--muted-foreground)',
            marginBottom: 10,
          }}
        >
          Tier 2+ — context + optional action
        </p>
        <EmptyCard>
          <CheckCircle2 size={36} style={{ color: 'var(--muted-foreground)', opacity: 0.4 }} />
          <h2 className="text-display-lg" style={{ color: 'var(--foreground)', margin: 0 }}>
            No tasks assigned
          </h2>
          <p className="text-body" style={{ color: 'var(--muted-foreground)', margin: 0 }}>
            Tasks will appear here once a parent assigns them.
          </p>
        </EmptyCard>
      </div>
    </div>
  ),
}
