import { z } from 'zod'
import { IDENTITY_HUES } from './identity'

export {
  IDENTITY_HUES,
  FAMILY_HUE,
  isIdentityHue,
  nextFreeHue,
  type IdentityHue,
  type OwnerHue,
} from './identity'

// ─── Profile management ───────────────────────────────────────────────────────

const TierSchema = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)])

/** A member's identity colour must come from the curated palette (ADR 044) — there is
    no free colour input, which is what keeps a family off neon green. */
export const IdentityHueSchema = z.enum(IDENTITY_HUES)

export const CreateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  tier: TierSchema,
})

export const UpdateProfileSchema = z
  .object({
    name: z.string().min(1).max(50).optional(),
    tier: TierSchema.optional(),
    // Focus-mode override: null clears it (defer to tier default), true/false sets it (ADR 036).
    focusMode: z.boolean().nullable().optional(),
  })
  .refine((d) => d.name !== undefined || d.tier !== undefined || d.focusMode !== undefined, {
    message: 'At least one field is required',
  })

/** Identity hue (ADR 044) — its own route, not a field on PATCH /profiles/:id.
 *
 * PATCH is tier-4 administration; choosing your OWN colour is not administration, so it
 * follows the avatar precedent (ADR 042): a dedicated endpoint with an update-own
 * capability. The value is constrained to the curated palette — there is no free colour
 * input, which is what keeps a family off neon green. Uniqueness cannot be checked here
 * (a schema cannot see the rest of the household); the route returns 409 and the DB
 * carries a unique index behind it. */
export const SetIdentityHueSchema = z.object({
  identityHue: IdentityHueSchema,
})

export const ResetPinSchema = z.object({
  currentPin: z
    .string()
    .regex(/^\d{4}$/)
    .optional(),
  newPin: z.string().regex(/^\d{4}$/, 'New PIN must be exactly 4 digits'),
})

export const CheckPinSchema = z.object({
  pin: z.string().regex(/^\d{4}$/, 'PIN must be exactly 4 digits'),
})

export const FamilyNameUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
})

export type CreateProfileInput = z.infer<typeof CreateProfileSchema>
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>
export type ResetPinInput = z.infer<typeof ResetPinSchema>
export type CheckPinInput = z.infer<typeof CheckPinSchema>
export type FamilyNameUpdateInput = z.infer<typeof FamilyNameUpdateSchema>

// ─── Permission overrides ─────────────────────────────────────────────────────

export const PermissionOverrideCreateSchema = z.object({
  action: z.string().min(1),
  subject: z.string().min(1),
  type: z.enum(['grant', 'revocation']),
})

export type PermissionOverrideCreateInput = z.infer<typeof PermissionOverrideCreateSchema>

// ─── Onboarding ───────────────────────────────────────────────────────────────

// Step 1: first parent + family name
export const FamilySetupSchema = z.object({
  familyName: z.string().min(1, 'Family name is required').max(50),
  parentName: z.string().min(1, 'Your name is required').max(50),
})

// Step 2: additional family members (any tier 1–4)
export const CreateFamilyMembersSchema = z.object({
  profiles: z.array(
    z.object({
      name: z.string().min(1, 'Name is required').max(50),
      tier: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
      // Optional: onboarding auto-assigns a colour and shows it, and the parent may tap
      // to change it before submitting (ADR 044). Absent = let the server assign. The
      // server checks uniqueness either way — a client cannot be trusted to.
      identityHue: IdentityHueSchema.optional(),
    })
  ),
})

// Step 3: family PIN
export const SetPinSchema = z.object({
  pin: z.string().regex(/^\d{4}$/, 'PIN must be exactly 4 digits'),
})

export type FamilySetupInput = z.infer<typeof FamilySetupSchema>
export type CreateFamilyMembersInput = z.infer<typeof CreateFamilyMembersSchema>
export type SetPinInput = z.infer<typeof SetPinSchema>

// ─── Calendar events ──────────────────────────────────────────────────────────

const UuidSchema = z
  .string()
  .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, 'Invalid id')

// Any value `new Date()` can parse — keeps timed, all-day, and offset inputs lenient.
const IsoDateTimeSchema = z.string().refine((s) => !Number.isNaN(Date.parse(s)), 'Invalid datetime')
const IsoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD')

// Optional free-text: blanks collapse to null so the route never stores empty strings.
const OptionalText = z
  .string()
  .nullish()
  .transform((v) => {
    const trimmed = v?.trim()
    return trimmed && trimmed.length > 0 ? trimmed : null
  })

// The create + edit drawer submits the full field set, so one schema covers both.
// Ownership is the `attendeeIds` set (0 = Family · 1 = solo · 2+ = shared); the
// route resolves existence (→ 404) and derives `isActivity`/`ownerId` (ADR 038).
// A 'daily' series (ADR 057) carries its weekday set as day OFFSETS from the
// series start's weekday, mod 7 — never absolute weekdays, which the server
// cannot resolve without a timezone.
export const EventInputSchema = z
  .object({
    title: z.string().trim().min(1, 'title is required'),
    description: OptionalText,
    location: OptionalText,
    attendeeIds: z.array(UuidSchema).optional().default([]),
    startsAt: IsoDateTimeSchema,
    endsAt: IsoDateTimeSchema.nullish(),
    allDay: z.boolean().optional().default(false),
    recurrence: z.enum(['weekly', 'daily']).nullish(),
    recurrenceDayOffsets: z.array(z.number().int().min(0).max(6)).max(7).nullish(),
    recurrenceUntil: IsoDateSchema.nullish(),
    reminderMinutes: z.number().int().min(0).nullish(),
  })
  .refine((d) => !d.endsAt || Date.parse(d.endsAt) >= Date.parse(d.startsAt), {
    message: 'endsAt must not be before startsAt',
    path: ['endsAt'],
  })
  .refine((d) => d.recurrence !== 'daily' || (d.recurrenceDayOffsets?.length ?? 0) > 0, {
    message: 'a daily series needs at least one day',
    path: ['recurrenceDayOffsets'],
  })
  .refine((d) => d.recurrence !== 'daily' || (Boolean(d.endsAt) && !d.allDay), {
    message: 'a daily series is a timed window — endsAt required, allDay false',
    path: ['endsAt'],
  })

export type EventInput = z.infer<typeof EventInputSchema>

// ─── Chores: tasks + routines ─────────────────────────────────────────────────

export const CHORE_ROUTINE_KINDS = ['days', 'ongoing'] as const
export type ChoreRoutineKind = (typeof CHORE_ROUTINE_KINDS)[number]

// The create + edit drawer submits the full field set, so one schema covers both.
// assigneeId null = up for grabs: the task belongs to the household until a member
// claims it. xpReward is never client-set — the server derives it (ADR 056).
const ChoreFieldsSchema = z.object({
  title: z.string().trim().min(1, 'title is required'),
  description: OptionalText,
  assigneeId: UuidSchema.nullable(),
  coinReward: z.number().int().min(0).optional().default(0),
  requiresApproval: z.boolean().optional().default(false),
})

// A blank due date clears it — the pre-Zod route accepted '' as "no due date" and
// the contract keeps it.
export const ChoreTaskInputSchema = ChoreFieldsSchema.extend({
  dueDate: z
    .union([IsoDateSchema, z.literal('')])
    .nullish()
    .transform((v) => (v ? v : null)),
})

// A routine stamps these fields onto each occurrence it materializes. repeatDays are
// absolute local weekdays (Sunday 0) — a date key has an unambiguous weekday, so
// chores needs none of ADR 057's offset encoding.
export const ChoreRoutineInputSchema = ChoreFieldsSchema.extend({
  kind: z.enum(CHORE_ROUTINE_KINDS),
  repeatDays: z.array(z.number().int().min(0).max(6)).max(7).optional().default([]),
}).refine((d) => d.kind !== 'days' || d.repeatDays.length > 0, {
  message: 'a days routine needs at least one day',
  path: ['repeatDays'],
})

export type ChoreTaskInput = z.infer<typeof ChoreTaskInputSchema>
export type ChoreRoutineInput = z.infer<typeof ChoreRoutineInputSchema>

// ─── Bug reports ──────────────────────────────────────────────────────────────

/** The lifecycle a report moves through (ADR 046). `deployed` is the only status the
    reporter is notified about — the rest are visible in-app but not worth a ping. */
export const BUG_REPORT_STATUSES = ['new', 'triaged', 'fixing', 'deployed', 'wont_fix'] as const

export const BugReportStatusSchema = z.enum(BUG_REPORT_STATUSES)

/** What the app captured on the reporter's behalf. Validated but deliberately lenient:
    it is evidence, not a data model, and a capture that fails validation would lose the
    report entirely — so every field past the route is optional and clamped rather than
    rejected. The route is the one thing a fixer cannot work without. */
export const BugReportContextSchema = z.object({
  route: z.string().max(200),
  buildHash: z.string().max(100).nullish(),
  viewport: z.object({ width: z.number().int(), height: z.number().int() }).nullish(),
  userAgent: z.string().max(500).nullish(),
  // Capped server-side too: a page in an error loop could otherwise post megabytes.
  consoleErrors: z.array(z.string().max(1000)).max(10).optional().default([]),
})

export const BugReportCreateSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, 'Tell us what went wrong')
    .max(2000, 'That is longer than we can store — try the short version'),
  context: BugReportContextSchema,
})

export const BugReportUpdateSchema = z
  .object({
    status: BugReportStatusSchema.optional(),
    resolution: z
      .string()
      .max(500)
      .nullish()
      .transform((v) => {
        const trimmed = v?.trim()
        return trimmed && trimmed.length > 0 ? trimmed : null
      }),
  })
  .refine((d) => d.status !== undefined || d.resolution !== undefined, {
    message: 'At least one field is required',
  })

export type BugReportStatus = (typeof BUG_REPORT_STATUSES)[number]
export type BugReportContext = z.infer<typeof BugReportContextSchema>
export type BugReportCreateInput = z.infer<typeof BugReportCreateSchema>
export type BugReportUpdateInput = z.infer<typeof BugReportUpdateSchema>

// ─── Rewards: catalog + redemptions (M4/4, reworked by ADR 055) ───────────────

/** The ticket lifecycle (ADR 055). Buying lands `owned`; `requiresApproval` gates
    USE, not purchase — an approval ticket waits as `use_requested`, and a parent's
    yes (or a non-approval tear) lands `used`. "Not now" returns it to `owned`. */
export const REDEMPTION_STATUSES = ['owned', 'use_requested', 'used'] as const
export type RedemptionStatus = (typeof REDEMPTION_STATUSES)[number]

// Cost stays in tens (ADR 052) — a kid does the subtraction in their head while
// spending, so the ceiling is deliberately low, not a technical limit.
const CostSchema = z.number().int().min(1, 'Cost must be at least 1').max(1000)

export const RewardCreateSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(60),
  emoji: z.string().trim().min(1, 'Pick an emoji').max(16),
  description: OptionalText,
  cost: CostSchema,
  requiresApproval: z.boolean().optional().default(false),
  // null = everyone; a list scopes the reward to specific kids.
  audience: z.array(UuidSchema).nullish(),
  // null = unlimited stock.
  stock: z.number().int().min(0).nullish(),
  active: z.boolean().optional().default(true),
})

export const RewardUpdateSchema = z
  .object({
    name: z.string().trim().min(1).max(60).optional(),
    emoji: z.string().trim().min(1).max(16).optional(),
    description: OptionalText,
    cost: CostSchema.optional(),
    requiresApproval: z.boolean().optional(),
    audience: z.array(UuidSchema).nullish(),
    stock: z.number().int().min(0).nullish(),
    active: z.boolean().optional(),
  })
  .refine((d) => Object.values(d).some((v) => v !== undefined), {
    message: 'At least one field is required',
  })

export const RedemptionCreateSchema = z.object({
  rewardId: UuidSchema,
})

/** A parent's answer to a use request (ADR 055). `yes` tears the ticket — used IS
    fulfilment, there is no hand-off step; `not_now` returns it to `owned` with no
    refund, `note` the optional reason quoted back to the kid verbatim (M4/1 gate). */
export const RedemptionDecideSchema = z.object({
  action: z.enum(['yes', 'not_now']),
  note: OptionalText,
})

export type RewardCreateInput = z.infer<typeof RewardCreateSchema>
export type RewardUpdateInput = z.infer<typeof RewardUpdateSchema>
export type RedemptionCreateInput = z.infer<typeof RedemptionCreateSchema>
export type RedemptionDecideInput = z.infer<typeof RedemptionDecideSchema>
