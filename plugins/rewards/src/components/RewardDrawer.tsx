import { useEffect, useState } from 'react'
import { Button, Drawer, FieldLabel, Input, ProfileAvatar, Switch, resolveHue } from '@family-os/ui'
import type { Profile } from '@family-os/platform/types'
import type { Reward, RewardInput } from '../types'

const COST_PRESETS = [5, 10, 15, 25, 40]

export interface RewardDrawerProps {
  open: boolean
  onClose: () => void
  /** null = create; a reward = edit. */
  editing: Reward | null
  members: Profile[]
  onSubmit: (input: RewardInput) => Promise<unknown>
  submitting: boolean
  error?: string | null
}

/* Create / edit a catalog reward — a right-hand Drawer, mirroring chores'
   CreateTaskDrawer. Each toggle reveals only what it governs: "just some kids"
   opens the face picker, "limit how many" opens the count. */
export function RewardDrawer({
  open,
  onClose,
  editing,
  members,
  onSubmit,
  submitting,
  error,
}: RewardDrawerProps) {
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('🎁')
  const [cost, setCost] = useState('10')
  const [requiresApproval, setRequiresApproval] = useState(false)
  const [limited, setLimited] = useState(false)
  const [audience, setAudience] = useState<string[]>([])
  const [capped, setCapped] = useState(false)
  const [stock, setStock] = useState('1')
  const [localError, setLocalError] = useState<string | null>(null)

  // Re-seed the form whenever the drawer opens or its subject changes.
  useEffect(() => {
    if (!open) return
    setName(editing?.name ?? '')
    setEmoji(editing?.emoji ?? '🎁')
    setCost(String(editing?.cost ?? 10))
    setRequiresApproval(editing?.requiresApproval ?? false)
    setLimited(editing?.audience != null)
    setAudience(editing?.audience ?? [])
    setCapped(editing?.stock != null)
    setStock(String(editing?.stock ?? 1))
    setLocalError(null)
  }, [open, editing])

  function toggleMember(id: string) {
    setAudience((prev) => (prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]))
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const costNum = parseInt(cost, 10)
    if (!name.trim()) return setLocalError('Give the reward a name.')
    if (!emoji.trim()) return setLocalError('Pick an emoji.')
    if (!Number.isInteger(costNum) || costNum < 1) return setLocalError('Cost must be at least 1.')
    if (limited && audience.length === 0)
      return setLocalError('Pick at least one kid, or make it for everyone.')
    setLocalError(null)
    void onSubmit({
      name: name.trim(),
      emoji: emoji.trim(),
      cost: costNum,
      requiresApproval,
      audience: limited ? audience : null,
      stock: capped ? Math.max(0, parseInt(stock, 10) || 0) : null,
    })
  }

  const shownError = localError ?? error

  return (
    <Drawer open={open} onClose={onClose} title={editing ? 'Edit reward' : 'New reward'}>
      <form onSubmit={submit} className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col gap-6">
            <div>
              <FieldLabel htmlFor="reward-name">Name</FieldLabel>
              <Input
                id="reward-name"
                placeholder="Pick the movie"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <div className="w-20">
                <FieldLabel htmlFor="reward-emoji">Emoji</FieldLabel>
                <Input
                  id="reward-emoji"
                  className="text-center text-xl"
                  value={emoji}
                  onChange={(e) => setEmoji(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <FieldLabel htmlFor="reward-cost">Cost (P$)</FieldLabel>
                <Input
                  id="reward-cost"
                  inputMode="numeric"
                  value={cost}
                  onChange={(e) => setCost(e.target.value.replace(/[^0-9]/g, ''))}
                />
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {COST_PRESETS.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setCost(String(v))}
                      className={`rounded-full border px-2.5 py-0.5 text-xs-token ${
                        cost === String(v)
                          ? 'border-transparent bg-primary text-primary-foreground'
                          : 'border-border text-muted-foreground'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <ToggleField
              title="Needs a grown-up's yes"
              hint="Holds the reward in your queue until you approve it"
              checked={requiresApproval}
              onChange={setRequiresApproval}
            />

            <div>
              <ToggleField
                title="Just for some kids"
                hint={limited ? undefined : 'Off — everyone can get it'}
                checked={limited}
                onChange={setLimited}
              />
              {limited && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {members.map((m) => {
                    const on = audience.includes(m.id)
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => toggleMember(m.id)}
                        className={`flex items-center gap-2 rounded-full border py-1 pr-3 pl-1 text-sm-token ${
                          on
                            ? 'border-primary bg-primary/10 text-foreground'
                            : 'border-border text-muted-foreground'
                        }`}
                      >
                        <ProfileAvatar
                          name={m.name}
                          size="sm"
                          avatarUrl={m.avatarUrl}
                          identity={resolveHue(m.name, m.identityHue)}
                        />
                        {m.name}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            <div>
              <ToggleField
                title="Limit how many"
                hint={capped ? undefined : 'Off — unlimited'}
                checked={capped}
                onChange={setCapped}
              />
              {capped && (
                <Input
                  className="mt-3 w-28"
                  inputMode="numeric"
                  value={stock}
                  onChange={(e) => setStock(e.target.value.replace(/[^0-9]/g, ''))}
                />
              )}
            </div>

            {shownError && <p className="text-sm-token text-error">{shownError}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-border p-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {editing ? 'Save reward' : 'Add reward'}
          </Button>
        </div>
      </form>
    </Drawer>
  )
}

function ToggleField({
  title,
  hint,
  checked,
  onChange,
}: {
  title: string
  hint?: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-border px-3 py-2.5">
      <span>
        <span className="block text-sm-token font-semibold text-foreground">{title}</span>
        {hint && <span className="block text-xs-body text-muted-foreground">{hint}</span>}
      </span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  )
}
