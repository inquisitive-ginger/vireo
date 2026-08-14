import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Button,
  Chip,
  Drawer,
  FieldLabel,
  Input,
  MemberChip,
  SegmentedControl,
} from '@family-os/ui'
import type { Profile } from '@family-os/platform/types'
import { MEAL_KINDS, type MealKind, type PlannedMeal } from '../types'

export interface MealDrawerInput {
  title: string
  sides: string | null
  tryBite: string | null
  needs: string | null
  kind: MealKind
  ownerId: string | null
}

// The UI-shaped form. ownerId null is a REAL pick — "nobody yet" submits an
// unclaimed dinner (spec.md: unclaimed is first-class), so no sentinel needed.
const MealFormSchema = z.object({
  title: z.string().trim().min(1),
  sides: z.string(),
  tryBite: z.string(),
  needs: z.string(),
  kind: z.enum(MEAL_KINDS),
  ownerId: z.string().nullable(),
})
type MealForm = z.input<typeof MealFormSchema>

export interface MealDrawerProps {
  open: boolean
  onClose: () => void
  members: Profile[]
  /** The day being planned — "Thursday, Aug 13" in the header. */
  dayLabel: string
  /** Edit mode: prefill from this meal, swap header + CTA copy. */
  editingMeal?: PlannedMeal | null
  onSubmit: (input: MealDrawerInput) => Promise<void> | void
}

/* The single plan/edit surface (design.md §M5/2) — field order is the menu-card
   grammar taught structurally: title → sides → try bite → needs → kind → owner.
   The title and try-bite helpers are STANDING lines, not placeholders — a
   placeholder dies at the first keystroke and the phrasing lesson is the feature.
   No P$ here (live review, 2026-08-13): a paid dinner is a chore in the chores
   module, not a meals concern. */
export function MealDrawer({
  open,
  onClose,
  members,
  dayLabel,
  editingMeal,
  onSubmit,
}: MealDrawerProps) {
  const isEdit = Boolean(editingMeal)

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<MealForm>({
    resolver: zodResolver(MealFormSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      sides: '',
      tryBite: '',
      needs: '',
      kind: 'cooked',
      ownerId: null,
    },
  })

  useEffect(() => {
    if (!open) return
    reset({
      title: editingMeal?.title ?? '',
      sides: editingMeal?.sides ?? '',
      tryBite: editingMeal?.tryBite ?? '',
      needs: editingMeal?.needs ?? '',
      kind: editingMeal?.kind ?? 'cooked',
      ownerId: editingMeal?.ownerId ?? null,
    })
  }, [open, editingMeal, reset])

  const canSubmit = watch('title').trim().length > 0
  const kind = watch('kind')

  const submit = handleSubmit(async (values) => {
    const clean = (s: string) => {
      const trimmed = s.trim()
      return trimmed.length > 0 ? trimmed : null
    }
    await onSubmit({
      title: values.title.trim(),
      sides: clean(values.sides),
      tryBite: clean(values.tryBite),
      needs: clean(values.needs),
      kind: values.kind,
      // Going out needs no planner and no attribution — the whole family goes.
      ownerId: values.kind === 'out' ? null : values.ownerId,
    })
  })

  return (
    <Drawer open={open} onClose={onClose} title={isEdit ? `Edit ${dayLabel}` : `Plan ${dayLabel}`}>
      <form onSubmit={submit} className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col gap-6">
            <div>
              <FieldLabel htmlFor="meal-title">What's for dinner?</FieldLabel>
              <Input id="meal-title" placeholder="Rigatoni" {...register('title')} />
              <p className="text-sm-token mt-2 text-muted-foreground">
                The headline — name it like you'd say it to the kids.
              </p>
            </div>

            <div>
              <FieldLabel htmlFor="meal-sides" optional>
                Sides
              </FieldLabel>
              <Input
                id="meal-sides"
                placeholder="roasted veggies, garlic bread"
                {...register('sides')}
              />
            </div>

            <div>
              <FieldLabel htmlFor="meal-try-bite" optional>
                Try bite
              </FieldLabel>
              <Input id="meal-try-bite" placeholder="the veggies" {...register('tryBite')} />
              <p className="text-sm-token mt-2 text-muted-foreground">
                One small thing to try — it punches their card.
              </p>
            </div>

            <div>
              <FieldLabel htmlFor="meal-needs" optional>
                Needs
              </FieldLabel>
              <Input
                id="meal-needs"
                placeholder="chicken thighs, broccoli"
                {...register('needs')}
              />
              <p className="text-sm-token mt-2 text-muted-foreground">
                What it needs from the store — one tap to the grocery list, once that ships.
              </p>
            </div>

            <div>
              <FieldLabel>How's it happening?</FieldLabel>
              <Controller
                control={control}
                name="kind"
                render={({ field }) => (
                  <SegmentedControl
                    aria-label="How dinner happens"
                    className="w-full [&>button]:flex-1"
                    options={[
                      { value: 'cooked', label: 'Cooking' },
                      { value: 'takeout', label: 'Takeout' },
                      { value: 'leftovers', label: 'Leftovers' },
                      { value: 'out', label: 'Going out' },
                    ]}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>

            {kind !== 'out' && (
              <div>
                <FieldLabel>Who's got it?</FieldLabel>
                <Controller
                  control={control}
                  name="ownerId"
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
                      {/* Unclaimed is a first-class pick — a hollow dashed dot,
                        identity's absence, matching the row spine's grammar.
                        Selected goes dashed-border + muted fill: absence has no
                        hue to fill with, but it still owes a MemberChip-weight
                        selected state. */}
                      <Chip
                        selected={field.value === null}
                        onClick={() => field.onChange(null)}
                        selectedClassName="border-dashed border-muted-foreground bg-muted text-foreground"
                        leading={
                          <span className="size-2 shrink-0 rounded-full border border-dashed border-muted-foreground" />
                        }
                      >
                        Nobody yet
                      </Chip>
                    </div>
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
                ? 'Planning…'
                : 'Plan it'}
          </Button>
        </div>
      </form>
    </Drawer>
  )
}
