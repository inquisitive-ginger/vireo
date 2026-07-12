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
export const EventInputSchema = z
  .object({
    title: z.string().trim().min(1, 'title is required'),
    description: OptionalText,
    location: OptionalText,
    attendeeIds: z.array(UuidSchema).optional().default([]),
    startsAt: IsoDateTimeSchema,
    endsAt: IsoDateTimeSchema.nullish(),
    allDay: z.boolean().optional().default(false),
    recurrence: z.literal('weekly').nullish(),
    recurrenceUntil: IsoDateSchema.nullish(),
    reminderMinutes: z.number().int().min(0).nullish(),
  })
  .refine((d) => !d.endsAt || Date.parse(d.endsAt) >= Date.parse(d.startsAt), {
    message: 'endsAt must not be before startsAt',
    path: ['endsAt'],
  })

export type EventInput = z.infer<typeof EventInputSchema>
