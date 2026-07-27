import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Star } from 'lucide-react'
import {
  Button,
  CoinAmountField,
  CURRENCY,
  DatePicker,
  Drawer,
  FieldLabel,
  Input,
  MemberChip,
  Switch,
} from '@family-os/ui'
import type { Profile } from '@family-os/platform/types'
import type { ChoreTask } from '../types'
import { REWARDS_UI_ENABLED } from '../lib/flags'
import { xpForCoins } from '../lib/economy'

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

export interface CreateTaskInput {
  title: string
  assigneeId: string
  coinReward: number
  requiresApproval: boolean
  dueDate: string | null
}

// The UI-shaped form (assigneeId is null until picked); a non-null assignee is
// required. Validated by a zodResolver, matching the shell's form standard.
const TaskFormSchema = z
  .object({
    title: z.string().trim().min(1),
    assigneeId: z.string().nullable(),
    coinReward: z.number(),
    requiresApproval: z.boolean(),
    dueDate: z.string(),
  })
  .refine((v) => v.assigneeId !== null, { path: ['assigneeId'], message: 'Pick someone' })
type TaskForm = z.input<typeof TaskFormSchema>

export interface CreateTaskDrawerProps {
  open: boolean
  onClose: () => void
  members: Profile[]
  /** Prefill the assignee (per-person "+ add" entry point). Ignored in edit mode. */
  prefillAssigneeId?: string | null
  /** When set, the drawer opens in edit mode: fields prefilled from this task,
      header "Edit task", CTA "Save changes". Absent → create mode. */
  editingTask?: ChoreTask | null
  onSubmit: (input: CreateTaskInput) => Promise<void> | void
}

/* The single create/edit surface (design §3) — a right Drawer (Radix Dialog).
   Create mode = blank (or assignee-prefilled); edit mode prefills from
   `editingTask` and swaps the header + CTA copy. Remove is a row-level action
   (settings → profiles pattern), not in this footer. Form state is React Hook
   Form + zodResolver (the shell's standard); controls use the shared
   Input/FieldLabel/Button, the shared MemberChip assignee picker, and the Pays
   amount is the shared CoinAmountField (same anatomy as a reward's Cost). */
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
    },
  })

  // Reset the form each time the drawer opens: prefill from the task in edit mode,
  // otherwise blank with any prefilled assignee.
  useEffect(() => {
    if (!open) return
    reset({
      title: editingTask?.title ?? '',
      assigneeId: editingTask?.assigneeId ?? prefillAssigneeId ?? null,
      coinReward: editingTask?.coinReward ?? DEFAULT_COINS,
      requiresApproval: editingTask?.requiresApproval ?? false,
      dueDate: editingTask?.dueDate ?? '',
    })
  }, [open, prefillAssigneeId, editingTask, reset])

  const title = watch('title')
  const coinReward = watch('coinReward')
  const canSubmit = title.trim().length > 0 && Boolean(watch('assigneeId'))

  const submit = handleSubmit(async (values) => {
    // The refine guarantees a non-null assignee by the time we submit.
    await onSubmit({
      title: values.title.trim(),
      assigneeId: values.assigneeId as string,
      coinReward: values.coinReward,
      // A free chore has nothing to hold; the server also enforces this.
      requiresApproval: values.coinReward > 0 && values.requiresApproval,
      dueDate: values.dueDate || null,
    })
  })

  return (
    <Drawer open={open} onClose={onClose} title={isEdit ? 'Edit task' : 'New task'}>
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
                  </div>
                )}
              />
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
          </div>
        </div>

        <div className="flex flex-col gap-2.5 border-t border-border p-6">
          <Button type="submit" className="w-full" disabled={!canSubmit || isSubmitting}>
            {isEdit
              ? isSubmitting
                ? 'Saving…'
                : 'Save changes'
              : isSubmitting
                ? 'Assigning…'
                : 'Assign task'}
          </Button>
        </div>
      </form>
    </Drawer>
  )
}
