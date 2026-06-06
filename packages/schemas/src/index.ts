import { z } from 'zod'

// ─── Profile management ───────────────────────────────────────────────────────

const TierSchema = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)])

export const CreateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  tier: TierSchema,
})

export const UpdateProfileSchema = z
  .object({
    name: z.string().min(1).max(50).optional(),
    tier: TierSchema.optional(),
  })
  .refine((d) => d.name !== undefined || d.tier !== undefined, {
    message: 'At least one field is required',
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
