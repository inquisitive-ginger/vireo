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
  cn,
} from '@family-os/ui'
import type { Profile } from '@family-os/platform/types'
import { MEAL_KINDS, type MealKind, type PlannedMeal } from '../types'

export interface MealDrawerInput {
  title: string
  sides: string | null
  tryBite: string | null
  needs: string | null
  recipeUrl: string | null
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
  // Blank is valid — the field is optional. A non-blank value has to be a
  // http(s) link or the form never submits: the same rule the route enforces,
  // said here so a bad paste is caught before a round trip.
  recipeUrl: z.string().refine((v) => {
    if (v.trim().length === 0) return true
    try {
      const { protocol } = new URL(v.trim())
      return protocol === 'http:' || protocol === 'https:'
    } catch {
      return false
    }
  }, 'That doesn’t look like a link — paste the web address.'),
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

/* The single plan/edit surface — KIND-FIRST (iPad review, 2026-08-13, amending
   the M5/1 title-first order, which was designed around cooking): "How's it
   happening?" leads and the form reshapes per kind. Cooking keeps the full
   menu-card grammar (title → sides → try bite → needs → owner); takeout is
   "Where from?" + an optional owner (ownerless = "we're ordering in", covered);
   leftovers is "What's on deck?" + a cook; going out is "Where to?" alone.
   Unused fields submit null — the schema is unchanged. The cooking title and
   try-bite helpers are STANDING lines, not placeholders — a placeholder dies at
   the first keystroke and the phrasing lesson is the feature. No P$ (2026-08-13):
   a paid dinner is a chore in the chores module, not a meals concern. */
const KIND_COPY: Record<
  MealKind,
  { title: string; placeholder: string; owner?: string; ownerNull?: string }
> = {
  cooked: {
    title: "What's for dinner?",
    placeholder: 'Rigatoni',
    owner: "Who's got it?",
    ownerNull: 'Nobody yet',
  },
  takeout: {
    title: 'Where from?',
    placeholder: "Luigi's",
    owner: "Who's ordering?",
    ownerNull: 'Nobody in particular',
  },
  leftovers: {
    title: "What's on deck?",
    placeholder: 'Taco leftovers',
    owner: "Who's reheating?",
    ownerNull: 'Nobody yet',
  },
  out: { title: 'Where to?', placeholder: "Luigi's" },
}

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
    formState: { errors, isSubmitting },
  } = useForm<MealForm>({
    resolver: zodResolver(MealFormSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      sides: '',
      tryBite: '',
      needs: '',
      recipeUrl: '',
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
      recipeUrl: editingMeal?.recipeUrl ?? '',
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
    // Fields the chosen kind doesn't show submit null — switching kinds after
    // typing must not smuggle a cooking plate onto a restaurant.
    const cooking = values.kind === 'cooked'
    await onSubmit({
      title: values.title.trim(),
      sides: cooking ? clean(values.sides) : null,
      tryBite: cooking ? clean(values.tryBite) : null,
      needs: cooking ? clean(values.needs) : null,
      recipeUrl: cooking ? clean(values.recipeUrl) : null,
      kind: values.kind,
      ownerId: values.kind === 'out' ? null : values.ownerId,
    })
  })

  const copy = KIND_COPY[kind]

  return (
    <Drawer open={open} onClose={onClose} title={isEdit ? `Edit ${dayLabel}` : `Plan ${dayLabel}`}>
      <form onSubmit={submit} className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col gap-6">
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

            <div>
              <FieldLabel htmlFor="meal-title">{copy.title}</FieldLabel>
              <Input id="meal-title" placeholder={copy.placeholder} {...register('title')} />
              {kind === 'cooked' && (
                <p className="text-sm-token mt-2 text-muted-foreground">
                  The headline — name it like you'd say it to the kids.
                </p>
              )}
            </div>

            {kind === 'cooked' && (
              <>
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

                {/* Cooking only (gate, 2026-09-03): needs is the store trip, the
                    recipe is the stove, and both are the planner's homework
                    rather than the kid-facing menu card — so it lands after
                    needs and before the owner ask. */}
                <div>
                  <FieldLabel htmlFor="meal-recipe-url" optional>
                    Recipe link
                  </FieldLabel>
                  <Input
                    id="meal-recipe-url"
                    type="url"
                    inputMode="url"
                    placeholder="https://…"
                    aria-invalid={errors.recipeUrl ? true : undefined}
                    {...register('recipeUrl')}
                  />
                  <p
                    className={cn(
                      'text-sm-token mt-2',
                      errors.recipeUrl ? 'text-destructive' : 'text-muted-foreground'
                    )}
                  >
                    {errors.recipeUrl?.message ??
                      'Where you’re cooking from — one tap at the stove.'}
                  </p>
                </div>
              </>
            )}

            {copy.owner && (
              <div>
                <FieldLabel optional={kind === 'takeout'}>{copy.owner}</FieldLabel>
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
                      {/* Ownerless is a first-class pick — a hollow dashed dot,
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
                        {copy.ownerNull}
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
