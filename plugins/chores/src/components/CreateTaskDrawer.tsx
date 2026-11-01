import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Star } from 'lucide-react'
import {
  Button,
  Chip,
  CoinAmountField,
  CURRENCY,
  DatePicker,
  Drawer,
  FAMILY_HUE,
  FieldLabel,
  Input,
  MemberChip,
  SegmentedControl,
  Switch,
  bucks,
  identityToken,
} from '@family-os/ui'
import type { Profile } from '@family-os/platform/types'
import type { ChoreTask, RoutineKind } from '../types'
import { REWARDS_UI_ENABLED } from '../lib/flags'
import { xpForCoins } from '../lib/economy'
import { DAY_LETTERS, DAY_NAMES, daySetSummary } from '../lib/routines'

// The paying tiers (ADR 052, ladder blessed as 1/2/5/10 by ADR 056): 0 is expressed
// as "no tier selected" (the default — chores still opt IN to paying). Balances stay
// in tens — whole P-Bucks, no cents. XP is derived from the tier (ADR 056), so this
// is the drawer's one reward control.
const COIN_PRESETS = [1, 2, 5, 10]
const DEFAULT_COINS = 0

// The due date is persisted as `YYYY-MM-DD`; the shared DatePicker works in Date,
// so convert at the field boundary (local components, no UTC day-shift).
const pad = (n: number) => String(n).padStart(2, '0')
const toDateKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const fromDateKey = (key: string) => {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

// The form's "Anyone" selection — submitted as assigneeId null (up for grabs). A
// sentinel rather than null so "nothing picked yet" stays distinguishable.
const ANYONE = '__anyone__'

export type RepeatsMode = 'once' | RoutineKind

export interface CreateTaskInput {
  title: string
  /** Null = up for grabs. */
  assigneeId: string | null
  coinReward: number
  requiresApproval: boolean
  dueDate: string | null
  repeats: RepeatsMode
  repeatDays: number[]
}

// The UI-shaped form (assigneeId is null until picked; ANYONE is a real pick).
// Validated by a zodResolver, matching the shell's form standard.
const TaskFormSchema = z
  .object({
    title: z.string().trim().min(1),
    assigneeId: z.string().nullable(),
    coinReward: z.number(),
    requiresApproval: z.boolean(),
    dueDate: z.string(),
    repeats: z.enum(['once', 'days', 'ongoing']),
    repeatDays: z.array(z.number()),
  })
  .refine((v) => v.assigneeId !== null, { path: ['assigneeId'], message: 'Pick someone' })
  .refine((v) => v.repeats !== 'days' || v.repeatDays.length > 0, {
    path: ['repeatDays'],
    message: 'Pick at least one day',
  })
type TaskForm = z.input<typeof TaskFormSchema>

export interface CreateTaskDrawerProps {
  open: boolean
  onClose: () => void
  members: Profile[]
  /** Prefill the assignee (per-lane "+ add" entry point): a member id, or null for
      the up-for-grabs lane (prefills Anyone). Undefined = no prefill. Ignored in
      edit mode. */
  prefillAssigneeId?: string | null
  /** When set, the drawer opens in edit mode: fields prefilled from this task,
      header "Edit task", CTA "Save changes". A routine-spawned task prefills its
      rule; edits apply to the routine (series-level, ADR 038's contract). */
  editingTask?: ChoreTask | null
  onSubmit: (input: CreateTaskInput) => Promise<void> | void
}

/* The single create/edit surface (design §3) — a right Drawer (Radix Dialog).
   Create mode = blank (or assignee-prefilled); edit mode prefills from
   `editingTask` and swaps the header + CTA copy. Remove is a row-level action
   (settings → profiles pattern), not in this footer. Form state is React Hook
   Form + zodResolver (the shell's standard); controls use the shared
   Input/FieldLabel/Button, the shared MemberChip assignee picker, and the Pays
   amount is the shared CoinAmountField (same anatomy as a reward's Cost).

   Repeats (recurring-chores session, gate D1): a three-way control — Once keeps
   the due date; On days swaps it for the weekday chips (each occurrence derives
   its own date); Ongoing has no dates at all. A quiet summary line states the
   semantics and the weekly price (ADR 052 — the cost is decided here, so it is
   stated here). */
export function CreateTaskDrawer({
  open,
  onClose,
  members,
  prefillAssigneeId,
  editingTask,
  onSubmit,
}: CreateTaskDrawerProps) {
  const isEdit = Boolean(editingTask)

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<TaskForm>({
    resolver: zodResolver(TaskFormSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      assigneeId: null,
      coinReward: DEFAULT_COINS,
      requiresApproval: false,
      dueDate: '',
      repeats: 'once',
      repeatDays: [],
    },
  })

  // Reset the form each time the drawer opens: prefill from the task in edit mode
  // (an unassigned task reads back as Anyone, a routine task as its rule),
  // otherwise blank with any prefilled assignee.
  useEffect(() => {
    if (!open) return
    reset({
      title: editingTask?.title ?? '',
      assigneeId: editingTask
        ? (editingTask.assigneeId ?? ANYONE)
        : prefillAssigneeId === null
          ? ANYONE
          : (prefillAssigneeId ?? null),
      coinReward: editingTask?.coinReward ?? DEFAULT_COINS,
      requiresApproval: editingTask?.requiresApproval ?? false,
      dueDate: editingTask?.routine ? '' : (editingTask?.dueDate ?? ''),
      repeats: editingTask?.routine?.kind ?? 'once',
      repeatDays: editingTask?.routine?.repeatDays ?? [],
    })
  }, [open, prefillAssigneeId, editingTask, reset])

  const title = watch('title')
  const coinReward = watch('coinReward')
  const repeats = watch('repeats')
  const repeatDays = watch('repeatDays')
  const canSubmit =
    title.trim().length > 0 &&
    Boolean(watch('assigneeId')) &&
    (repeats !== 'days' || repeatDays.length > 0)

  const submit = handleSubmit(async (values) => {
    // The refine guarantees a non-null assignee by the time we submit.
    await onSubmit({
      title: values.title.trim(),
      assigneeId: values.assigneeId === ANYONE ? null : (values.assigneeId as string),
      coinReward: values.coinReward,
      // A free chore has nothing to hold; the server also enforces this.
      requiresApproval: values.coinReward > 0 && values.requiresApproval,
      dueDate: values.repeats === 'once' ? values.dueDate || null : null,
      repeats: values.repeats,
      repeatDays: values.repeats === 'days' ? values.repeatDays : [],
    })
  })

  return (
    <Drawer open={open} onClose={onClose} title={isEdit ? 'Edit task' : 'Add task'}>
      <form onSubmit={submit} className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col gap-6">
            <div>
              <FieldLabel htmlFor="chore-title">Task title</FieldLabel>
              <Input id="chore-title" placeholder="What needs doing?" {...register('title')} />
            </div>

            <div>
              <FieldLabel>Assign to</FieldLabel>
              <Controller
                control={control}
                name="assigneeId"
                render={({ field }) => (
                  <div className="flex flex-wrap gap-2">
                    {members.map((m) => (
                      <MemberChip
                        key={m.id}
                        name={m.name}
                        hue={m.identityHue}
                        selected={field.value === m.id}
                        onClick={() => field.onChange(m.id)}
                      />
                    ))}
                    {/* Up for grabs — household-toned (Hearth, ADR 041), never a
                        member hue: unowned work belongs to everyone. */}
                    <Chip
                      selected={field.value === ANYONE}
                      onClick={() => field.onChange(ANYONE)}
                      leading={
                        <span
                          className="size-2 shrink-0 rounded-full"
                          style={{ background: identityToken(FAMILY_HUE) }}
                        />
                      }
                      selectedStyle={{
                        borderColor: identityToken(FAMILY_HUE),
                        background: identityToken(FAMILY_HUE, 'tint'),
                        color: identityToken(FAMILY_HUE, 'ink'),
                      }}
                    >
                      Anyone
                    </Chip>
                  </div>
                )}
              />
            </div>

            <div>
              <FieldLabel>Repeats</FieldLabel>
              <Controller
                control={control}
                name="repeats"
                render={({ field }) => (
                  <SegmentedControl
                    aria-label="Repeats"
                    className="w-full [&>button]:flex-1"
                    options={[
                      { value: 'once', label: 'Once' },
                      { value: 'days', label: 'On days' },
                      { value: 'ongoing', label: 'Ongoing' },
                    ]}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              {repeats === 'days' && (
                <div className="mt-3">
                  <Controller
                    control={control}
                    name="repeatDays"
                    render={({ field }) => (
                      <div className="flex flex-wrap gap-1.5">
                        {DAY_LETTERS.map((letter, day) => (
                          <DayChip
                            key={day}
                            label={letter}
                            day={day}
                            selected={field.value.includes(day)}
                            onClick={() =>
                              field.onChange(
                                field.value.includes(day)
                                  ? field.value.filter((d: number) => d !== day)
                                  : [...field.value, day]
                              )
                            }
                          />
                        ))}
                      </div>
                    )}
                  />
                </div>
              )}

              {repeats !== 'once' && (
                <p className="text-sm-token mt-2 text-muted-foreground">
                  {repeatsSummary(repeats, repeatDays, coinReward)}
                </p>
              )}
            </div>

            {/* The earn UI is held behind a flag until the wallet + store ship (see lib/flags). */}
            {REWARDS_UI_ENABLED && (
              <div>
                <FieldLabel htmlFor="chore-pays">Pays ({CURRENCY.code})</FieldLabel>
                {/* Chores opt IN to paying (ADR 052): 0 is the default. Most chores earn a
                    score only; a parent ticks the few that pay when setting them up. The
                    shared field works in digit strings (the input's medium) — empty is
                    free, converted at the field boundary like the DatePicker's dates. */}
                <Controller
                  control={control}
                  name="coinReward"
                  render={({ field }) => (
                    <CoinAmountField
                      id="chore-pays"
                      value={field.value === 0 ? '' : String(field.value)}
                      onChange={(s) => field.onChange(s === '' ? 0 : parseInt(s, 10))}
                      presets={COIN_PRESETS}
                      placeholder="0"
                    />
                  )}
                />

                {/* XP is derived from the tier (ADR 056) — stated here, at the one
                    place pricing is decided, so the mapping is taught rather than
                    configured. Quiet star per ADR 051: a score, not a reward. */}
                <p className="text-sm-token mt-2 flex items-center gap-1 text-muted-foreground">
                  <Star size={12} strokeWidth={2.5} aria-hidden />
                  Scores {xpForCoins(coinReward)} XP
                </p>

                {/* Only a paying chore has a payout to hold (M4/3b). The toggle
                    appears once a tier is picked; the parent opts the few big ones in. */}
                {coinReward > 0 && (
                  <Controller
                    control={control}
                    name="requiresApproval"
                    render={({ field }) => (
                      <label
                        htmlFor="chore-approval"
                        className="mt-3 flex cursor-pointer items-center justify-between gap-3 rounded-card border border-border bg-card px-3 py-2.5"
                      >
                        <span className="min-w-0">
                          <span className="text-sm-token block font-semibold text-foreground">
                            Hold the payout for my OK
                          </span>
                          <span className="text-xs-body block text-muted-foreground">
                            Pays out only after you check it's done.
                          </span>
                        </span>
                        <Switch
                          id="chore-approval"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          aria-label="Hold the payout for my approval"
                        />
                      </label>
                    )}
                  />
                )}
              </div>
            )}

            {/* A repeating chore derives each occurrence's date from its rule; only a
                one-shot has a due date to pick. */}
            {repeats === 'once' && (
              <div>
                <FieldLabel htmlFor="chore-due" optional>
                  Due date
                </FieldLabel>
                {/* The shared themed picker (ADR 037) — one component, calendar + chores. */}
                <Controller
                  control={control}
                  name="dueDate"
                  render={({ field }) => (
                    <DatePicker
                      id="chore-due"
                      value={field.value ? fromDateKey(field.value) : undefined}
                      onChange={(d) => field.onChange(d ? toDateKey(d) : '')}
                      placeholder="No due date"
                    />
                  )}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2.5 border-t border-border p-6">
          <Button type="submit" className="w-full" disabled={!canSubmit || isSubmitting}>
            {isEdit
              ? isSubmitting
                ? 'Saving…'
                : 'Save changes'
              : isSubmitting
                ? repeats === 'once'
                  ? 'Assigning…'
                  : 'Starting…'
                : repeats === 'once'
                  ? 'Assign task'
                  : 'Start routine'}
          </Button>
        </div>
      </form>
    </Drawer>
  )
}

/* The quiet semantics line under the Repeats control — states what the rule means
   and what it costs a week, at the one place both are decided (ADR 057's form
   precedent; ADR 052's pricing stance). */
function repeatsSummary(repeats: RepeatsMode, days: number[], coins: number): string {
  if (repeats === 'ongoing') {
    const base = "Comes back after it's done — at most once a day"
    return coins > 0 ? `${base} · pays ${bucks(coins)} each time` : base
  }
  const lead = daySetSummary(days)
  if (coins > 0 && days.length > 0) {
    return `${lead} · pays ${bucks(coins)} each time ≈ ${bucks(coins * days.length)} a week`
  }
  return lead
}

// A weekday chip for the day set — primary-toned like the calendar's (a selection,
// not a collectible). The visible letter is one character, so the accessible name
// carries the full day.
function DayChip({
  label,
  day,
  selected,
  onClick,
}: {
  label: string
  day: number
  selected: boolean
  onClick: () => void
}) {
  return (
    <Chip
      selected={selected}
      onClick={onClick}
      selectedClassName="border-primary bg-primary/10 text-primary"
      idleClassName="text-muted-foreground"
    >
      <span aria-hidden>{label}</span>
      <span className="sr-only">{DAY_NAMES[day]}</span>
    </Chip>
  )
}
