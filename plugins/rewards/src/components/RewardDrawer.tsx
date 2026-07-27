import { useEffect, useState } from 'react'
import {
  Button,
  CoinAmountField,
  CURRENCY,
  Drawer,
  EmojiPicker,
  FieldLabel,
  Input,
  MemberChip,
  Switch,
} from '@family-os/ui'
import { ChevronDown } from 'lucide-react'
import type { Profile } from '@family-os/platform/types'
import type { Reward, RewardInput } from '../types'
import { REWARD_EMOJI_GROUPS } from '../lib/reward-emojis'

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
  const [description, setDescription] = useState('')
  const [emoji, setEmoji] = useState('🎁')
  const [cost, setCost] = useState('10')
  const [requiresApproval, setRequiresApproval] = useState(false)
  const [limited, setLimited] = useState(false)
  const [audience, setAudience] = useState<string[]>([])
  const [capped, setCapped] = useState(false)
  const [stock, setStock] = useState('1')
  const [pickerOpen, setPickerOpen] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  // Re-seed the form whenever the drawer opens or its subject changes.
  useEffect(() => {
    if (!open) return
    setName(editing?.name ?? '')
    setDescription(editing?.description ?? '')
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
      description: description.trim() || null,
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

            <div>
              <FieldLabel htmlFor="reward-description">What they get</FieldLabel>
              <Input
                id="reward-description"
                placeholder="Friday night is yours — you pick the movie."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <p className="text-xs-body mt-1.5 text-muted-foreground">
                One line, on the ticket and the confirm.
              </p>
            </div>

            <div>
              <FieldLabel>Emoji</FieldLabel>
              <button
                type="button"
                aria-expanded={pickerOpen}
                onClick={() => setPickerOpen((o) => !o)}
                className="flex w-full items-center gap-3 rounded-lg border border-border px-3 py-2 text-left hover:bg-muted"
              >
                <span className="grid size-11 place-items-center rounded-lg bg-secondary text-2xl">
                  {emoji || '🎁'}
                </span>
                <span className="text-sm-token flex-1 text-muted-foreground">
                  {pickerOpen ? 'Pick one below' : 'Choose an emoji'}
                </span>
                <ChevronDown
                  className={`size-4 text-muted-foreground transition-transform ${pickerOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {pickerOpen && (
                <div className="mt-2 rounded-lg border border-border p-3">
                  <EmojiPicker
                    groups={REWARD_EMOJI_GROUPS}
                    selected={emoji}
                    onSelect={(e) => {
                      setEmoji(e)
                      setPickerOpen(false)
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <FieldLabel htmlFor="reward-cost">Cost ({CURRENCY.code})</FieldLabel>
              <CoinAmountField
                id="reward-cost"
                value={cost}
                onChange={setCost}
                presets={COST_PRESETS}
              />
            </div>

            {/* ADR 055: the gate moved from the register to the tear — approval
                holds USE, never purchase. */}
            <ToggleField
              title="Needs a parent's yes"
              hint="They'll ask before using it — buying is always allowed"
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
                  {members.map((m) => (
                    <MemberChip
                      key={m.id}
                      name={m.name}
                      hue={m.identityHue}
                      selected={audience.includes(m.id)}
                      onClick={() => toggleMember(m.id)}
                    />
                  ))}
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
