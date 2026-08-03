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
  SegmentedControl,
  Switch,
  bucks,
} from '@family-os/ui'
import { ChevronDown } from 'lucide-react'
import type { Profile } from '@family-os/platform/types'
import type { PunchTemplate, PunchTemplateInput, Reward } from '../types'
import { PUNCH_EMOJI_GROUPS } from '../lib/punch-emojis'

const COIN_PRESETS = [5, 10, 15, 25]
const GOAL_PRESETS = [5, 10, 15, 20]

export interface PunchTemplateDrawerProps {
  open: boolean
  onClose: () => void
  /** null = create; a template = edit. */
  editing: PunchTemplate | null
  members: Profile[]
  /** The active catalog — what a finish line can promise. */
  rewards: Reward[]
  onSubmit: (input: PunchTemplateInput) => Promise<unknown>
  submitting: boolean
  error?: string | null
}

/* Create / edit a punch-card template — the RewardDrawer's sibling: the catalog is
   what P-Bucks buys, a card is how effort becomes those things, so both are stocked
   from the same tab (M4/6 gate). The payout is a fork, never a pair: coins OR a
   choice of catalog rewards — the parent curates the options, the kid names the
   one they're working for (choice rework 2026-07-31). */
export function PunchTemplateDrawer({
  open,
  onClose,
  editing,
  members,
  rewards,
  onSubmit,
  submitting,
  error,
}: PunchTemplateDrawerProps) {
  const [name, setName] = useState('')
  const [glyph, setGlyph] = useState('⭐')
  const [goal, setGoal] = useState('10')
  const [payoutKind, setPayoutKind] = useState<'coins' | 'reward'>('coins')
  const [coins, setCoins] = useState('10')
  const [optionIds, setOptionIds] = useState<string[]>([])
  const [limited, setLimited] = useState(false)
  const [audience, setAudience] = useState<string[]>([])
  const [pickerOpen, setPickerOpen] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setName(editing?.name ?? '')
    setGlyph(editing?.glyph ?? '⭐')
    setGoal(String(editing?.goal ?? 10))
    setPayoutKind(editing?.payoutKind ?? 'coins')
    setCoins(String(editing?.payoutCoins ?? 10))
    setOptionIds(editing?.payoutOptionIds ?? [])
    setLimited(editing?.audience != null)
    setAudience(editing?.audience ?? [])
    setPickerOpen(false)
    setLocalError(null)
  }, [open, editing])

  function toggleMember(id: string) {
    setAudience((prev) => (prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]))
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const goalNum = parseInt(goal, 10)
    const coinsNum = parseInt(coins, 10)
    if (!name.trim()) return setLocalError('Give the card a name.')
    if (!Number.isInteger(goalNum) || goalNum < 2 || goalNum > 30)
      return setLocalError('Punches must be between 2 and 30.')
    if (payoutKind === 'coins' && (!Number.isInteger(coinsNum) || coinsNum < 1))
      return setLocalError(`The payout must be at least 1 ${CURRENCY.code}.`)
    if (payoutKind === 'reward' && optionIds.length === 0)
      return setLocalError('Pick at least one prize option.')
    if (limited && audience.length === 0)
      return setLocalError('Pick at least one kid, or make it for everyone.')
    setLocalError(null)
    void onSubmit({
      name: name.trim(),
      glyph: glyph.trim(),
      goal: goalNum,
      payoutKind,
      payoutCoins: payoutKind === 'coins' ? coinsNum : null,
      payoutOptionIds: payoutKind === 'reward' ? optionIds : null,
      audience: limited ? audience : null,
    })
  }

  const shownError = localError ?? error

  return (
    <Drawer open={open} onClose={onClose} title={editing ? 'Edit punch card' : 'New punch card'}>
      <form onSubmit={submit} className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col gap-6">
            <div>
              <FieldLabel htmlFor="punch-name">Name</FieldLabel>
              <Input
                id="punch-name"
                placeholder="Try bites"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
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
                  {glyph || '⭐'}
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
                    groups={PUNCH_EMOJI_GROUPS}
                    selected={glyph}
                    onSelect={(e) => {
                      setGlyph(e)
                      setPickerOpen(false)
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <FieldLabel htmlFor="punch-goal">Punches to fill it</FieldLabel>
              <div className="flex items-center gap-2">
                <Input
                  id="punch-goal"
                  className="w-20"
                  inputMode="numeric"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value.replace(/[^0-9]/g, ''))}
                />
                <div className="flex gap-1.5">
                  {GOAL_PRESETS.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGoal(String(g))}
                      className={`text-sm-token rounded-full border px-3 py-1.5 font-semibold ${
                        goal === String(g)
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <FieldLabel>A full card earns</FieldLabel>
              <SegmentedControl<'coins' | 'reward'>
                aria-label="Payout"
                className="mb-3"
                value={payoutKind}
                onChange={setPayoutKind}
                options={[
                  { value: 'coins', label: CURRENCY.short },
                  { value: 'reward', label: 'A reward' },
                ]}
              />
              {payoutKind === 'coins' ? (
                <CoinAmountField
                  id="punch-coins"
                  value={coins}
                  onChange={setCoins}
                  presets={COIN_PRESETS}
                />
              ) : rewards.length === 0 ? (
                <p className="text-sm-token text-muted-foreground">
                  The catalog is empty — add a reward first, or pay {CURRENCY.short}.
                </p>
              ) : (
                <div>
                  <p className="text-xs-body mb-2 text-muted-foreground">
                    Pick the options — they choose the one they want.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {rewards.map((r) => {
                      const on = optionIds.includes(r.id)
                      return (
                        <button
                          key={r.id}
                          type="button"
                          aria-pressed={on}
                          onClick={() =>
                            setOptionIds((prev) =>
                              on ? prev.filter((id) => id !== r.id) : [...prev, r.id]
                            )
                          }
                          className={`text-sm-token inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-semibold ${
                            on
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border text-foreground hover:bg-muted'
                          }`}
                        >
                          <span aria-hidden>{r.emoji}</span>
                          {r.name}
                          <span
                            className={on ? 'text-primary-foreground/80' : 'text-muted-foreground'}
                          >
                            {bucks(r.cost)}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            <div>
              <ToggleField
                title="Just for some kids"
                hint={limited ? undefined : 'Off — everyone gets a card'}
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

            {shownError && <p className="text-sm-token text-error">{shownError}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-border p-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {editing ? 'Save card' : 'Add card'}
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
