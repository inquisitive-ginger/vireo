import type { Meta, StoryObj } from '@storybook/react'
import { IDENTITY_HUES, identityToken } from '../lib/identity'
import { ProfileAvatar } from './profile-avatar'

const meta: Meta = {
  title: 'Foundation/Color',
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj

type SwatchItem = {
  token: string
  fgToken?: string
  role: string
}

const CORE: SwatchItem[] = [
  { token: '--background', role: 'Page surface — warm off-white / warm clay (dark)' },
  { token: '--foreground', fgToken: '--background', role: 'Primary text' },
  {
    token: '--primary',
    fgToken: '--primary-foreground',
    role: 'Terracotta — actions, active states',
  },
  {
    token: '--secondary',
    fgToken: '--secondary-foreground',
    role: 'Inset / structural surfaces — sidebar background, grouped settings rows',
  },
  {
    token: '--card',
    fgToken: '--card-foreground',
    role: 'Content cards — lifts above background (see Foundation/Elevation)',
  },
  { token: '--muted', fgToken: '--muted-foreground', role: 'Subtle backgrounds' },
  { token: '--muted-foreground', role: 'Subdued labels, timestamps' },
  {
    token: '--accent',
    fgToken: '--accent-foreground',
    role: 'Sage-teal — module identity only (widget headers, feed markers, notification badges)',
  },
  { token: '--border', role: 'Borders and input outlines' },
  { token: '--ring', role: 'Focus ring — matches primary' },
]

const STATUS: SwatchItem[] = [
  { token: '--info', fgToken: '--info-foreground', role: 'Informational banners and badges' },
  { token: '--success', fgToken: '--success-foreground', role: 'Completion, confirmed states' },
  { token: '--warning', fgToken: '--warning-foreground', role: 'Attention needed, soft alerts' },
  { token: '--error', fgToken: '--error-foreground', role: 'Failures, validation errors' },
]

function SwatchRow({ token, fgToken, role }: SwatchItem) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '56px 220px 1fr',
        alignItems: 'center',
        gap: 16,
        padding: '10px 0',
        borderBottom: '1px solid var(--border)',
        fontFamily: 'var(--font-ui)',
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 10,
          background: `var(${token})`,
          border: '1px solid color-mix(in oklch, var(--border) 60%, transparent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {fgToken && (
          <span style={{ fontSize: 13, fontWeight: 700, color: `var(${fgToken})` }}>Aa</span>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <code style={{ fontSize: 11, fontWeight: 600, color: 'var(--foreground)' }}>{token}</code>
        {fgToken && (
          <code style={{ fontSize: 10, color: 'var(--muted-foreground)' }}>{fgToken}</code>
        )}
      </div>
      <span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{role}</span>
    </div>
  )
}

export const CoreTokens: Story = {
  name: 'Core semantic tokens',
  render: () => (
    <div style={{ maxWidth: 680 }}>
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
        Core — use the theme toggle to verify dark mode
      </p>
      {CORE.map((s) => (
        <SwatchRow key={s.token} {...s} />
      ))}
    </div>
  ),
}

export const StatusTokens: Story = {
  name: 'Status tokens',
  render: () => (
    <div style={{ maxWidth: 680 }}>
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
        Semantic status — each has a paired -foreground token
      </p>
      {STATUS.map((s) => (
        <SwatchRow key={s.token} {...s} />
      ))}
      <p
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 11,
          color: 'var(--muted-foreground)',
          marginTop: 16,
          lineHeight: 1.5,
        }}
      >
        <code>--destructive</code> aliases <code>--error</code> for shadcn compatibility. Use{' '}
        <code>--error</code> in all new code.
      </p>
    </div>
  ),
}

const IDENTITY_ROLES: Record<(typeof IDENTITY_HUES)[number], string> = {
  terracotta: 'Identity hue 1 — harmonized with --primary',
  marigold: 'Identity hue 2',
  sage: 'Identity hue 3',
  teal: 'Identity hue 4 — harmonized with --accent',
  sky: 'Identity hue 5',
  plum: 'Identity hue 6',
}

function IdentityRow({ hue }: { hue: (typeof IDENTITY_HUES)[number] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '56px 220px 1fr 40px',
        alignItems: 'center',
        gap: 16,
        padding: '10px 0',
        borderBottom: '1px solid var(--border)',
        fontFamily: 'var(--font-ui)',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: 48,
          height: 48,
          borderRadius: 10,
          overflow: 'hidden',
          background: identityToken(hue, 'tint'),
          border: '1px solid color-mix(in oklch, var(--border) 60%, transparent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 6,
            background: identityToken(hue, 'base'),
          }}
        />
        <span style={{ fontSize: 13, fontWeight: 700, color: identityToken(hue, 'ink') }}>Aa</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <code style={{ fontSize: 11, fontWeight: 600, color: 'var(--foreground)' }}>
          --identity-{hue}
        </code>
        <code style={{ fontSize: 10, color: 'var(--muted-foreground)' }}>
          --identity-{hue}-tint · -ink
        </code>
      </div>
      <span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{IDENTITY_ROLES[hue]}</span>
      <ProfileAvatar name="Ab Cd" identity={hue} size="base" />
    </div>
  )
}

export const IdentityTokens: Story = {
  name: 'Member identity tokens',
  render: () => (
    <div style={{ maxWidth: 680 }}>
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
        Member identity — base (spine) · tint (fill) · ink (initials) — use the theme toggle to
        verify dark mode
      </p>
      {IDENTITY_HUES.map((hue) => (
        <IdentityRow key={hue} hue={hue} />
      ))}
      <p
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 11,
          color: 'var(--muted-foreground)',
          marginTop: 16,
          lineHeight: 1.5,
        }}
      >
        Each family member keeps one hue everywhere — avatars, feed spines, calendar chips.
        Assignment is a name hash today (collisions possible); explicit per-profile assignment is
        the planned evolution. Use <code>getIdentityHue</code> / <code>identityToken</code> /{' '}
        <code>identityColor</code> from <code>@family-os/ui</code> — never invent member colors. See
        ADR 030.
      </p>
    </div>
  ),
}
