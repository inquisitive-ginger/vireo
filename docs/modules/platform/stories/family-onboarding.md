# Story: Family Onboarding

**Module:** platform
**Status:** ⬜ Not Started

## User story
As a first-time parent, I can complete a guided setup flow to create family profiles and set a family PIN so the system is ready for the family to use.

## Scope
**In:**
- First-run detection: no non-family profiles exist → redirect any route to `/onboarding` before rendering the shell
- Step 1: create at least one tier-4 profile (name, initials avatar)
- Step 2: optionally add child profiles (name, tier selection 1–3)
- Step 3: set 4-digit family PIN stored hashed in `system_config` as `family_pin_hash` per ADR 021
- On completion: session switches to the first created parent profile, redirect to `/`
- Onboarding state persists across page refresh — flow can be resumed mid-step
- React Hook Form + Zod for all form state and validation; `packages/schemas` scaffolded with profile creation and PIN schemas shared between client and server Fastify route validation
- `db:reset` script (`pnpm db:reset`): drops and re-seeds the platform schema to zero state — all non-family profiles deleted, `system_config` cleared, `widget_layouts` cleared — leaving only the family pseudo-profile seed
- `ProfileAvatar` component (initials fallback, avatar ring states) exported from `packages/ui` with Storybook stories

**Out:** Avatar image file upload (initials fallback only in M1); permission override configuration during onboarding; email or external account linking; rate limiting on PIN attempts (deferred)

## Acceptance criteria
1. A fresh install (no non-family profiles) redirects any route to `/onboarding` before rendering the shell
2. A parent profile can be created with a name; an initials-based avatar renders correctly in the profile chip
3. One or more child profiles can be added with a name and tier (1–3)
4. The PIN step accepts a 4-digit PIN and stores it hashed in `system_config` with key `family_pin_hash`
5. The PIN step cannot be skipped — completing onboarding requires a PIN to be set
6. On completion the session is active as the first created parent profile and `/` renders the home screen
7. Navigating away mid-flow and returning to `/onboarding` resumes at the last completed step
8. After onboarding is complete, `/onboarding` redirects to `/`
9. Form fields show inline validation errors (name required, PIN must be exactly 4 digits) before the server is hit
10. Running `pnpm db:reset` returns the system to zero state: only the family pseudo-profile exists, no PIN is set, navigating to `/` redirects to `/onboarding`
11. `ProfileAvatar` is exported from `packages/ui` with Storybook stories covering initials fallback and ring states

## Dependencies
- none

## Notes
The family pseudo-profile (`id = 'family'`, tier 1) is already seeded from M0 — `db:reset` must re-seed it, not delete it entirely. First-run detection queries `profiles` for any row that is not the family pseudo-profile.
