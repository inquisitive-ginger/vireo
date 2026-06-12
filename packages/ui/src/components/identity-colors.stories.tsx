import type { Meta, StoryObj } from '@storybook/react'
import { IDENTITY_HUES, identityToken } from '../lib/identity'
import { ProfileAvatar } from './profile-avatar'

const meta: Meta = {
  title: 'Foundation/Identity Colors',
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj

export const Palette: Story = {
  render: () => (
    <div className="flex flex-col gap-6" style={{ maxWidth: 560 }}>
      <p className="text-base-token" style={{ color: 'var(--muted-foreground)' }}>
        Six fixed hues harmonized with Terracotta &amp; Teal. Each family member maps to one hue and
        keeps it everywhere — avatars, feed spines, calendar chips. Layers: base (spines, markers),
        tint (avatar fill), ink (text on tint).
      </p>
      {IDENTITY_HUES.map((hue) => (
        <div key={hue} className="flex items-center gap-4">
          <span className="text-section-label w-24" style={{ color: 'var(--muted-foreground)' }}>
            {hue}
          </span>
          <div className="flex gap-2">
            {(['base', 'tint', 'ink'] as const).map((layer) => (
              <div
                key={layer}
                title={`${hue} ${layer}`}
                className="rounded-lg border border-border"
                style={{ width: 56, height: 40, background: identityToken(hue, layer) }}
              />
            ))}
          </div>
          <ProfileAvatar name="Ab Cd" identity={hue} size="base" />
        </div>
      ))}
    </div>
  ),
}
