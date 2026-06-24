import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Star } from 'lucide-react'
import { Button, Chip, DatePicker, Drawer, FieldLabel, Input, MemberChip } from '@family-os/ui'
import type { Profile } from '@family-os/platform/types'
import type { ChoreTask } from '../types'
import { GOLD, GOLD_INK, GOLD_TINT } from '../lib/gold'

const XP_PRESETS = [5, 10, 15, 20, 25]
const DEFAULT_XP = 10

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
  xpReward: number
  dueDate: string | null
}

// The UI-shaped form (assigneeId is null until picked); a non-null assignee is
// required. Validated by a zodResolver, matching the shell's form standard.
const TaskFormSchema = z
  .object({
    title: z.string().trim().min(1),
    assigneeId: z.string().nullable(),
    xpReward: z.number(),
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
   Input/FieldLabel/Button, the shared MemberChip assignee picker, and the reward
   presets compose the shared Chip (gold "treasure" tone). */
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
    defaultValues: { title: '', assigneeId: null, xpReward: DEFAULT_XP, dueDate: '' },
  })

  // Reset the form each time the drawer opens: prefill from the task in edit mode,
  // otherwise blank with any prefilled assignee.
  useEffect(() => {
    if (!open) return
    reset({
      title: editingTask?.title ?? '',
      assigneeId: editingTask?.assigneeId ?? prefillAssigneeId ?? null,
      xpReward: editingTask?.xpReward ?? DEFAULT_XP,
      dueDate: editingTask?.dueDate ?? '',
    })
  }, [open, prefillAssigneeId, editingTask, reset])

  const title = watch('title')
  const canSubmit = title.trim().length > 0 && Boolean(watch('assigneeId'))

  const submit = handleSubmit(async (values) => {
    // The refine guarantees a non-null assignee by the time we submit.
    await onSubmit({
      title: values.title.trim(),
      assigneeId: values.assigneeId as string,
      xpReward: values.xpReward,
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
                        selected={field.value === m.id}
                        onClick={() => field.onChange(m.id)}
                      />
                    ))}
                  </div>
                )}
              />
            </div>

            <div>
              <FieldLabel>Reward</FieldLabel>
              <Controller
                control={control}
                name="xpReward"
                render={({ field }) => (
                  <div className="flex flex-wrap items-center gap-2">
                    {XP_PRESETS.map((v) => (
                      <XpChip
                        key={v}
                        value={v}
                        selected={field.value === v}
                        onClick={() => field.onChange(v)}
                      />
                    ))}
                    <span className="text-section-label ml-0.5" style={{ color: GOLD_INK }}>
                      XP
                    </span>
                  </div>
                )}
              />
            </div>

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

// A reward preset on the shared Chip — gold "treasure" fill when selected (gold
// isn't in the token set, so the colors come inline from lib/gold).
function XpChip({
  value,
  selected,
  onClick,
}: {
  value: number
  selected: boolean
  onClick: () => void
}) {
  return (
    <Chip
      selected={selected}
      onClick={onClick}
      leading={selected ? <Star size={12} fill={GOLD} style={{ color: GOLD }} /> : undefined}
      selectedStyle={{ borderColor: GOLD, background: GOLD_TINT, color: GOLD_INK }}
      selectedClassName="font-bold"
      idleClassName="font-medium text-muted-foreground"
      className="min-w-[44px] justify-center gap-1 px-3"
    >
      {value}
    </Chip>
  )
}
