import { z } from 'zod'

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
