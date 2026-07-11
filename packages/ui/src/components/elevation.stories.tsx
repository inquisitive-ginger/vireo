import type { Meta, StoryObj } from '@storybook/react'
import { CalendarDays, ClipboardList } from 'lucide-react'
import { Button } from './button'
import { WidgetSlot, type WidgetProminence } from './widget-slot'
import { WidgetHeader } from './widget-header'

const meta: Meta = {
  title: 'Foundation/Elevation',
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: 'var(--font-ui)',
        fontSize: 11,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'var(--muted-foreground)',
        marginBottom: 8,
      }}
    >
      {children}
    </p>
  )
}

function Footnote({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: 'var(--font-ui)',
        fontSize: 11,
        color: 'var(--muted-foreground)',
        marginTop: 16,
        lineHeight: 1.5,
      }}
    >
      {children}
    </p>
  )
}

type SurfaceItem = {
  token: string
  shadow?: string
  role: string
}

const SURFACES: SurfaceItem[] = [
  { token: '--background', role: 'Page background — recedes. The warm table everything sits on' },
  {
    token: '--secondary',
    role: 'Structural / inset surfaces — sidebar, grouped rows. Flat by design',
  },
  {
    token: '--card',
    shadow: '--shadow-card',
    role: 'Content cards — lift above the background, always with shadow + border',
  },
]

const SHADOWS: SurfaceItem[] = [
  {
    token: '--shadow-card',
    shadow: '--shadow-card',
    role: 'Resting — widget slots, feed posts, settings sections',
  },
  {
    token: '--shadow-raised',
    shadow: '--shadow-raised',
    role: 'Raised — compose forms, trays, drawers, dialogs, toasts, profile picker',
  },
]

function SurfaceRow({ token, shadow, role, chipBg }: SurfaceItem & { chipBg?: string }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '56px 220px 1fr',
        alignItems: 'center',
        gap: 16,
        padding: '12px 0',
        borderBottom: '1px solid var(--border)',
        fontFamily: 'var(--font-ui)',
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 10,
          background: chipBg ?? `var(${token})`,
          border: '1px solid color-mix(in oklch, var(--border) 60%, transparent)',
          boxShadow: shadow ? `var(${shadow})` : undefined,
          flexShrink: 0,
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <code style={{ fontSize: 11, fontWeight: 600, color: 'var(--foreground)' }}>{token}</code>
        {shadow && shadow !== token && (
          <code style={{ fontSize: 10, color: 'var(--muted-foreground)' }}>{shadow}</code>
        )}
      </div>
      <span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{role}</span>
    </div>
  )
}

export const SurfaceLayers: Story = {
  name: 'Surface layers',
  render: () => (
    <div style={{ maxWidth: 680 }}>
      <SectionLabel>
        Surface layers — depth, not lines, creates hierarchy — use the theme toggle to verify dark
        mode
      </SectionLabel>
      {SURFACES.map((s) => (
        <SurfaceRow key={s.token} {...s} />
      ))}
      <Footnote>
        Content that “sits on the table” gets <code>--card</code> + <code>--shadow-card</code> +
        border. Structural chrome (sidebar, nav, inset rows, placeholder cards) is never elevated.
      </Footnote>
    </div>
  ),
}

export const ShadowTokens: Story = {
  name: 'Shadow tokens',
  render: () => (
    <div style={{ maxWidth: 680 }}>
      <SectionLabel>Two levels only — resting and raised</SectionLabel>
      {SHADOWS.map((s) => (
        <SurfaceRow key={s.token} {...s} chipBg="var(--card)" />
      ))}
      <Footnote>
        Light-mode shadows are warm-tinted (<code>oklch(0.35 0.06 50 / …)</code>) — never neutral
        gray, which goes cold against the warm palette. Dark mode deepens to black. Use the tokens;
        never hardcode <code>box-shadow</code>.
      </Footnote>
    </div>
  ),
}

/* Identical content in every rung — the ONLY thing that changes is the
   WidgetSlot chrome, so elevation (not the content) is what marks prominence. */
function LadderSample() {
  return (
    <div className="flex size-full flex-col p-4">
      <WidgetHeader icon={CalendarDays} label="Calendar" />
      <div className="mt-3">
        <div className="text-metric tabular-nums text-foreground">4:45</div>
        <div className="text-sm-token text-muted-foreground">Vision Therapy · Teddy</div>
      </div>
    </div>
  )
}

const RUNGS: { rung: WidgetProminence; chrome: string }[] = [
  { rung: 'feature', chrome: '--shadow-raised · rounded-hero · no border' },
  { rung: 'card', chrome: '--shadow-card · soft hairline' },
  { rung: 'quiet', chrome: '--secondary tint · no shadow' },
]

export const WidgetProminenceLadder: Story = {
  name: 'Widget prominence ladder',
  render: () => (
    <div style={{ maxWidth: 820 }}>
      <SectionLabel>
        Widget prominence — one feature per home surface, re-ranked per profile
      </SectionLabel>
      <div className="flex flex-wrap gap-4">
        {RUNGS.map(({ rung, chrome }) => (
          <div key={rung} style={{ width: 236 }}>
            <div className="mb-2 flex items-baseline gap-2">
              <span className="text-xs-token font-bold uppercase tracking-wide text-foreground">
                {rung}
              </span>
              <code style={{ fontSize: 10, color: 'var(--muted-foreground)' }}>{chrome}</code>
            </div>
            <div style={{ height: 148 }}>
              <WidgetSlot prominence={rung}>
                <LadderSample />
              </WidgetSlot>
            </div>
          </div>
        ))}
      </div>
      <Footnote>
        The home surface ranks exactly one widget <strong>feature</strong> and re-ranks per profile
        — parent → Calendar, kid → Chores, family → Feed banner. The rung is a composition of the
        two shadow tokens above plus a recessed tint: elevation carries the hierarchy, not the
        numeral or a coloured border. Prominence is <code>WidgetSlot</code>’s{' '}
        <code>prominence</code> prop (derived on read from layout composition). See design-system.md
        §Widget prominence · ADR 039.
      </Footnote>
    </div>
  ),
}

export const InContext: Story = {
  name: 'In context',
  render: () => (
    <div style={{ maxWidth: 680 }}>
      <SectionLabel>Both tokens at work — resting widget card, raised panel above it</SectionLabel>
      <div
        style={{
          position: 'relative',
          background: 'var(--background)',
          borderRadius: 12,
          padding: 32,
          paddingBottom: 120,
          border: '1px solid var(--border)',
        }}
      >
        <div
          className="rounded-xl border border-border"
          style={{
            background: 'var(--card)',
            boxShadow: 'var(--shadow-card)',
            padding: '14px 18px',
            maxWidth: 480,
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
            top: 88,
            left: 80,
            width: 440,
            background: 'var(--card)',
            boxShadow: 'var(--shadow-raised)',
            padding: '16px 18px',
          }}
        >
          <span className="text-card-title" style={{ color: 'var(--card-foreground)' }}>
            A raised panel above the page
          </span>
          <p
            className="text-sm-token"
            style={{ color: 'var(--muted-foreground)', margin: '6px 0 12px' }}
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
      <Footnote>
        The raised panel overlaps the resting card the way a dialog overlaps the home surface — the
        stronger shadow is what separates the two planes.
      </Footnote>
    </div>
  ),
}
