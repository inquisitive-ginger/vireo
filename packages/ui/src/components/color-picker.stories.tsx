import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ColorPicker, isPaletteFull } from './color-picker'
import { ProfileListItem } from './profile-list-item'
import { Spine } from './spine'
import { ProfileAvatar } from './profile-avatar'
import { IDENTITY_HUES, identityToken, resolveHue, type IdentityHue } from '../lib/identity'

const meta = {
  title: 'Identity/ColorPicker',
  component: ColorPicker,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ColorPicker>

export default meta
type Story = StoryObj<typeof meta>

/* The palette, on the two layers that actually render it. Quoting a hue at `base` and
   shipping it at `tint` is how the fill layer got broken in the first place (ADR 041's
   lesson, ADR 044's bug): judge a colour on the layer that renders it. */
export const Palette: Story = {
  args: { value: 'teal', onChange: () => {} },
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs-token font-semibold text-muted-foreground uppercase">
          base — spines, markers, the picker swatch
        </p>
        <div className="flex flex-wrap gap-3">
          {IDENTITY_HUES.map((hue) => (
            <div key={hue} className="flex flex-col items-center gap-1">
              <div className="size-11 rounded-lg" style={{ background: identityToken(hue) }} />
              <span className="text-xs-token text-muted-foreground">{hue}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs-token font-semibold text-muted-foreground uppercase">
          tint + ink — calendar chips, avatar fills. The layer colour does the most work on.
        </p>
        <div className="flex flex-wrap gap-2">
          {IDENTITY_HUES.map((hue) => (
            <span
              key={hue}
              className="rounded-md px-2 py-1 text-xs-token font-semibold"
              style={{
                background: identityToken(hue, 'tint'),
                color: identityToken(hue, 'ink'),
              }}
            >
              {hue}
            </span>
          ))}
        </div>
      </div>
    </div>
  ),
}

/** The picker as Settings uses it: taken colours show WHO holds them, because taking a
    colour in a family is really a trade. */
export const WithTakenColors: Story = {
  args: { value: 'marigold', onChange: () => {} },
  render: function Render() {
    const [hue, setHue] = useState<IdentityHue>('marigold')
    const takenBy = { terracotta: 'Zach', teal: 'Hallie', sage: 'Teddy', sky: 'Zoë' }
    return (
      <div className="flex max-w-md flex-col gap-3">
        <ColorPicker value={hue} onChange={setHue} takenBy={takenBy} />
        <p className="text-sm-token text-muted-foreground">
          Nora is <strong>{hue}</strong>. Four colours are spoken for.
        </p>
      </div>
    )
  },
}

/** The ninth member. The palette is a hard cap on household size, and a duplicate hue is
    worse than none — so this state has to be SAID, not papered over. */
export const PaletteFull: Story = {
  args: { onChange: () => {} },
  render: function Render() {
    const takenBy = Object.fromEntries(
      IDENTITY_HUES.map((h, i) => [
        h,
        ['Zach', 'Hallie', 'Teddy', 'Zoë', 'Sam', 'Ivy', 'Otis', 'Wren'][i]!,
      ])
    )
    return (
      <div className="flex max-w-md flex-col gap-3">
        <ColorPicker value={null} onChange={() => {}} takenBy={takenBy} />
        {isPaletteFull(takenBy) && (
          <p
            className="rounded-card border px-3 py-2 text-sm-token"
            style={{
              background: 'color-mix(in oklch, var(--error) 7%, var(--card))',
              borderColor: 'color-mix(in oklch, var(--error) 22%, var(--border))',
            }}
          >
            <strong>Every colour is taken.</strong>{' '}
            <span className="text-muted-foreground">Free one up to add another member.</span>
          </p>
        )}
      </div>
    )
  },
}

/** The legend (ADR 042) — the one surface pairing a face, a name and a hue, and so the
    one place the hue→person code can be learned. Which makes it where a colour is traded. */
export const InTheMemberList: Story = {
  args: { onChange: () => {} },
  render: function Render() {
    const [members, setMembers] = useState([
      { id: '1', name: 'Zach', tier: 4 as const, hue: 'terracotta' },
      { id: '2', name: 'Hallie', tier: 4 as const, hue: 'teal' },
      { id: '3', name: 'Zoë', tier: 3 as const, hue: 'sky' },
      { id: '4', name: 'Teddy', tier: 2 as const, hue: 'sage' },
    ])
    const [editing, setEditing] = useState('4')
    const takenBy = Object.fromEntries(members.map((m) => [m.hue, m.name]))

    return (
      <div className="flex max-w-2xl flex-col gap-4">
        <div className="overflow-hidden rounded-card border border-border bg-card">
          {members.map((m, i) => (
            <ProfileListItem
              key={m.id}
              name={m.name}
              tier={m.tier}
              hue={m.hue}
              isLast={i === members.length - 1}
              onEdit={() => setEditing(m.id)}
            />
          ))}
        </div>
        <div className="flex flex-col gap-2 rounded-card border border-border bg-card p-4">
          <p className="text-xs-token font-semibold text-muted-foreground uppercase">
            {members.find((m) => m.id === editing)?.name} — colour
          </p>
          <ColorPicker
            value={members.find((m) => m.id === editing)?.hue}
            takenBy={takenBy}
            onChange={(hue) =>
              setMembers((prev) => prev.map((m) => (m.id === editing ? { ...m, hue } : m)))
            }
          />
        </div>
      </div>
    )
  },
}

/** The second channel (ADR 044). Eight nameable hues do not survive red-green
    colour-blindness, so the month chip stopped being a coloured pill and nothing else. */
export const TheSecondChannel: Story = {
  args: { onChange: () => {} },
  render: () => {
    const events: Array<[string, string, string]> = [
      ['Zach', 'terracotta', 'Dentist'],
      ['Hallie', 'teal', 'Swim'],
      ['Teddy', 'sage', 'Karate'],
      ['Zoë', 'sky', 'Piano'],
    ]
    return (
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <p className="text-xs-token font-semibold text-muted-foreground uppercase">
            Colour only — what shipped
          </p>
          <div className="flex flex-wrap gap-1.5">
            {events.map(([, hue, title]) => (
              <span
                key={title}
                className="rounded-md px-1.5 py-0.5 text-xs-token font-semibold"
                style={{
                  background: identityToken(hue as IdentityHue, 'tint'),
                  color: identityToken(hue as IdentityHue, 'ink'),
                }}
              >
                {title}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs-token font-semibold text-muted-foreground uppercase">
            + the owner’s initial — survives a deuteranope
          </p>
          <div className="flex flex-wrap gap-1.5">
            {events.map(([name, hue, title]) => (
              <span
                key={title}
                className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs-token font-semibold"
                style={{
                  background: identityToken(hue as IdentityHue, 'tint'),
                  color: identityToken(hue as IdentityHue, 'ink'),
                }}
              >
                <span className="font-extrabold opacity-70">{name[0]}</span>
                {title}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {events.map(([name, hue]) => (
            <div key={name} className="flex items-center gap-2">
              <Spine color={identityToken(resolveHue(name, hue))} className="h-8" />
              <ProfileAvatar name={name} size="sm" identity={resolveHue(name, hue)} />
              <span className="text-sm-token">{name}</span>
            </div>
          ))}
        </div>
      </div>
    )
  },
}
