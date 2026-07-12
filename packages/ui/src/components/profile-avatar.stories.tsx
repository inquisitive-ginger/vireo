import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ProfileAvatar } from './profile-avatar'
import { Spine } from './spine'
import { identityToken } from '../lib/identity'
import { samplePortrait } from '../lib/story-fixtures'

const PHOTO = samplePortrait('teal')
const PHOTO_WARM = samplePortrait('warm')

const meta: Meta<typeof ProfileAvatar> = {
  title: 'Platform/ProfileAvatar',
  component: ProfileAvatar,
  parameters: { layout: 'centered' },
  argTypes: {
    name: { control: 'text' },
    size: { control: 'radio', options: ['sm', 'base', 'md', 'lg'] },
    active: { control: 'boolean' },
    avatarUrl: { control: 'text' },
    identity: {
      control: 'select',
      options: [undefined, 'terracotta', 'marigold', 'sage', 'teal', 'sky', 'plum', 'family'],
    },
  },
  args: {
    name: 'Alex Johnson',
    size: 'md',
    active: false,
  },
}

export default meta
type Story = StoryObj<typeof ProfileAvatar>

// ─── Interactive (controls panel) ────────────────────────────────────────────

export const Interactive: Story = {}

// ─── Ring states ──────────────────────────────────────────────────────────────

export const RingStates: Story = {
  name: 'Ring states — active vs inactive',
  parameters: { layout: 'centered' },
  render: () => (
    <div style={{ display: 'flex', gap: 32, alignItems: 'center', padding: 24 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <ProfileAvatar name="Alex Johnson" size="md" active />
        <span
          style={{ fontSize: 12, color: 'var(--muted-foreground)', fontFamily: 'var(--font-ui)' }}
        >
          active
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <ProfileAvatar name="Sam" size="md" />
        <span
          style={{ fontSize: 12, color: 'var(--muted-foreground)', fontFamily: 'var(--font-ui)' }}
        >
          inactive
        </span>
      </div>
    </div>
  ),
}

// ─── All sizes ────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  name: 'All sizes',
  render: () => (
    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-end', padding: 24 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div
          key={size}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}
        >
          <ProfileAvatar name="Alex Johnson" size={size} active />
          <span
            style={{ fontSize: 12, color: 'var(--muted-foreground)', fontFamily: 'var(--font-ui)' }}
          >
            {size}
          </span>
        </div>
      ))}
    </div>
  ),
}

// ─── Initials variants ────────────────────────────────────────────────────────

export const InitialsVariants: Story = {
  name: 'Initials — name format variations',
  render: () => {
    const names = [
      { name: 'Alex', label: 'Single name → 1 initial' },
      { name: 'Alex Johnson', label: 'Two names → 2 initials' },
      { name: 'Maria Elena Garcia', label: 'Three names → 2 initials (first two)' },
      { name: 'T', label: 'Single letter' },
    ]
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          padding: 24,
          fontFamily: 'var(--font-ui)',
        }}
      >
        {names.map(({ name, label }) => (
          <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <ProfileAvatar name={name} size="md" />
            <div>
              <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--foreground)' }}>{name}</p>
              <p style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 2 }}>
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>
    )
  },
}

// ─── Profile picker preview ───────────────────────────────────────────────────

export const ProfilePicker: Story = {
  name: 'Profile picker — interactive',
  render: () => {
    // Inline state via a wrapper component
    function Picker() {
      const [active, setActive] = useState(0)
      const profiles = ['Alex Johnson', 'Jordan', 'Sam Lee', 'Mia']

      return (
        <div style={{ display: 'flex', gap: 28, padding: 32, fontFamily: 'var(--font-ui)' }}>
          {profiles.map((name, i) => (
            <button
              key={name}
              onClick={() => setActive(i)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <ProfileAvatar name={name} size="lg" active={active === i} />
              <span
                style={{
                  fontSize: 13,
                  color: active === i ? 'var(--foreground)' : 'var(--muted-foreground)',
                  fontWeight: active === i ? 500 : 400,
                }}
              >
                {name.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      )
    }
    return <Picker />
  },
}

// ─── Photos (ADR 042) ─────────────────────────────────────────────────────────

export const Photos: Story = {
  name: 'Photos — a face, not an identity token',
  parameters: { layout: 'padded' },
  render: () => (
    <div className="max-w-[640px] p-6 font-[var(--font-ui)]">
      <p className="text-prose-sm mb-6 text-muted-foreground">
        A photo <strong>fills the circle</strong> — the avatar wears no hue ring. The identity
        colour is carried by the chrome <strong>beside</strong> the avatar (the{' '}
        <code>ItemCard</code> spine, an identity wash), so a photograph never competes with the
        identity system. The tinted-initials fill stays underneath as the no-photo fallback.
      </p>

      <p className="text-section-label mb-3 text-muted-foreground">Every size</p>
      <div className="mb-8 flex items-end gap-6">
        {(['sm', 'base', 'md', 'lg'] as const).map((size) => (
          <div key={size} className="flex flex-col items-center gap-2">
            <ProfileAvatar
              name="Zach Pritchett"
              size={size}
              identity="teal"
              avatarUrl={PHOTO_WARM}
            />
            <span className="text-xs-body text-muted-foreground">{size}</span>
          </div>
        ))}
      </div>

      <p className="text-section-label mb-3 text-muted-foreground">
        The rule — a row with several people owes a hue element; the avatar is not one
      </p>
      <div className="mb-8 flex flex-col gap-2">
        {[
          { name: 'Dana Pritchett', hue: 'terracotta' as const, photo: PHOTO },
          { name: 'Zach Pritchett', hue: 'teal' as const, photo: PHOTO_WARM },
          { name: 'Robin Pritchett', hue: 'sage' as const, photo: undefined },
        ].map((m) => (
          <div
            key={m.name}
            className="flex items-center gap-3 rounded-card bg-card px-3 py-2 shadow-[var(--shadow-card)]"
          >
            <Spine color={identityToken(m.hue, 'base')} className="h-10" />
            <ProfileAvatar name={m.name} size="base" identity={m.hue} avatarUrl={m.photo} />
            <span className="text-sm-token">{m.name.split(' ')[0]}</span>
          </div>
        ))}
      </div>

      <p className="text-section-label mb-3 text-muted-foreground">
        Mid-adoption — initials still wear the tint
      </p>
      <div className="flex items-end gap-6">
        <ProfileAvatar name="Dana Pritchett" size="md" identity="terracotta" avatarUrl={PHOTO} />
        <ProfileAvatar name="Robin Pritchett" size="md" identity="sage" />
        <ProfileAvatar name="Sam Pritchett" size="md" identity="plum" />
        <ProfileAvatar
          name="Family"
          size="md"
          identity="family"
          avatarUrl={samplePortrait('group')}
        />
      </div>
    </div>
  ),
}

// ─── Color palette (hue stability) ───────────────────────────────────────────

export const ColorPalette: Story = {
  name: 'Hue stability — same name = same color',
  render: () => {
    const names = ['Alex Johnson', 'Sam', 'Jordan Lee', 'Mia', 'Parent', 'Oliver', 'Zoe', 'Liam']
    return (
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          padding: 24,
          maxWidth: 400,
          fontFamily: 'var(--font-ui)',
        }}
      >
        {names.map((name) => (
          <div
            key={name}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
          >
            <ProfileAvatar name={name} size="sm" />
            <span style={{ fontSize: 10, color: 'var(--muted-foreground)' }}>
              {name.split(' ')[0]}
            </span>
          </div>
        ))}
      </div>
    )
  },
}
