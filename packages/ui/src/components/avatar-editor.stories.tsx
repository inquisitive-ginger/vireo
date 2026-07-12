import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { AvatarEditor } from './avatar-editor'
import { ProfileAvatar } from './profile-avatar'
import { Button } from './button'
import type { OwnerHue } from '../lib/identity'

const meta: Meta<typeof AvatarEditor> = {
  title: 'Platform/AvatarEditor',
  component: AvatarEditor,
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof AvatarEditor>

// ─── Picker → crop → save ─────────────────────────────────────────────────────

export const Interactive: Story = {
  name: 'Pick, crop, save',
  render: () => {
    function Demo() {
      const [saved, setSaved] = useState<string | null>(null)
      const [key, setKey] = useState(0)
      const identity: OwnerHue = 'teal'

      return (
        <div className="flex flex-wrap items-start gap-10 p-8 font-[var(--font-ui)]">
          <div className="rounded-hero border border-border bg-card p-8 shadow-[var(--shadow-card)]">
            <AvatarEditor
              key={key}
              name="Zach Pritchett"
              onCancel={() => setKey((k) => k + 1)}
              onSave={(blob) => setSaved(URL.createObjectURL(blob))}
            />
          </div>

          <div className="rounded-hero border border-border bg-card p-8 shadow-[var(--shadow-card)]">
            <h3 className="text-card-title mb-4">Saved result</h3>
            {saved ? (
              <div className="flex flex-col items-start gap-4">
                <div className="flex items-end gap-5">
                  {(['sm', 'base', 'md', 'lg'] as const).map((s) => (
                    <div key={s} className="flex flex-col items-center gap-2">
                      <ProfileAvatar
                        name="Zach Pritchett"
                        size={s}
                        identity={identity}
                        avatarUrl={saved}
                      />
                      <span className="text-xs-body text-muted-foreground">{s}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs-body max-w-[34ch] text-muted-foreground">
                  512×512 WebP, encoded on the client — the exact payload the server receives. A few
                  tens of KB, not a 4MB phone photo.
                </p>
                <Button variant="outline" size="sm" onClick={() => setKey((k) => k + 1)}>
                  Start over
                </Button>
              </div>
            ) : (
              <p className="text-sm-token max-w-[30ch] text-muted-foreground">
                Choose a photo, crop it, and hit <strong>Save photo</strong>. The result renders
                through the real <code>ProfileAvatar</code>, wearing its identity band.
              </p>
            )}
          </div>
        </div>
      )
    }
    return <Demo />
  },
}
