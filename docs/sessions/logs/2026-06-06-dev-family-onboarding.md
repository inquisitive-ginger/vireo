# Session Log — 2026-06-06 · Dev · family-onboarding

## What was built

### Onboarding flow (`apps/shell/src/pages/Onboarding.tsx`)

3-step centered card (Frame B):

- **Step 1** — family name + first parent. React Hook Form + Zod via `@family-os/schemas`. Validates client-side; POST `/api/setup/family` creates the tier-4 parent and stores `family_name` in `system_config`.
- **Step 2** — add family members (any tier 1–4). Local state list; `ProfileAvatar` + `Badge` per row; `ghost-destructive` icon button for removal. Skip allowed — POST `/api/setup/members` with empty array.
- **Step 3** — dot-box PIN entry. 4 `<div>` boxes backed by a `sr-only` hidden `<input type="tel">`. Two-pass (enter → confirm), mismatch shakes state for 900ms. Raw `<input>` intentional — not a visible form field, so shadcn `Input` wrapper would add styling that's entirely overridden.

### API (`apps/api/src/plugins/setup.ts`)

- `GET /setup/status` → `{ needsSetup, currentStep }`. Determines step from profile count + `onboarding_step` system_config key. Registered in `server.ts` before `authPlugin`.
- `POST /setup/family` — creates tier-4 parent, stores `family_name`, seeds widget layout from `default_layout_tier_3_4`, sets `onboarding_step=2`.
- `POST /setup/members` — creates 0-N profiles with tier-appropriate layouts, sets `onboarding_step=3`.
- `POST /setup/complete` — bcrypt-hashes PIN into `family_pin_hash`, deletes `onboarding_step`, sets session to first parent.

### Schemas (`packages/schemas`)

New workspace package. `FamilySetupSchema`, `CreateFamilyMembersSchema`, `SetPinSchema`. Zod v4 aligned across all packages (`packages/schemas`, `apps/shell`, `@hookform/resolvers@5`).

### UI primitives (`packages/ui`)

- `Input` — styled `<input>` with `error` prop (destructive ring)
- `Label` — wraps `@radix-ui/react-label` (correct `htmlFor` association, disabled peer state)
- `Badge` — CVA with `default / secondary / outline / muted / success / destructive` variants
- `Button` — extended with `ghost-destructive` variant (muted icon → red hover, no background)
- `ProfileAvatar` — deterministic hue from name, `outline` active ring, `sm/md/lg` sizes
- `form-primitives.stories.tsx` — field anatomy, input states, badge variants, button variants, composed profile form
- `profile-avatar.stories.tsx` — interactive, ring states, sizes, initials, picker, hue stability
- `Sidebar.tsx` `ProfileChip` updated to use `ProfileAvatar`

### Route guard (`apps/shell/src/components/RequireSetup.tsx`)

Wraps all app routes. Redirects to `/onboarding` when `needsSetup: true` or when the status fetch fails (non-ok response throws → `isError` also redirects). Prevents silent pass-through on missing API routes.

### Dev tooling

- `db:reset` script in `@family-os/platform` and root — wipes profiles/sessions/layouts, preserves `default_layout_*` keys, re-seeds family pseudo-profile.
- Husky + lint-staged: `prettier --write` runs on all staged `ts/tsx/js/json/css/md` files before every commit.

### Auth change

PIN gate narrowed: was `target.tier > request.profile.tier` (any upward switch). Now `target.tier === 4 && request.profile.tier < 4` — PIN only required to enter tier 4.

## Decisions made

- **`@family-os/schemas` as shared package** — Zod schemas consumed by both API (route validation) and shell (form validation). Avoids duplication and keeps validation logic co-located with types.
- **Zod v4 everywhere** — Aligned `packages/schemas` and `apps/shell` to zod v4 to avoid type incompatibility at the `z.infer` boundary across packages.
- **Raw `<input>` for PIN keyboard capture** — `Input` component is for visible labeled fields. The PIN dot-box widget's keyboard input is an internal accessibility mechanism and intentionally has no visual presence.
- **`ghost-destructive` Button variant** — "muted icon that goes red on hover" is common enough in list rows to warrant a named variant rather than inline className overrides.
- **Radix/shadcn clarification recorded** — Radix is the headless engine; shadcn is the styled distribution layer. Project chose shadcn (ADR 012). `Label` is the first component that adds a new Radix dep beyond `@radix-ui/react-slot`.

## Open questions

None blocking profile-management.

## What the next session needs to know

- `packages/schemas` is the authoritative home for shared Zod schemas. Add new schemas here when a form needs to be validated on both client and server.
- `db:reset` from root (`pnpm db:reset`) is the dev reset path — no need to re-run `db:seed` after reset as `default_layout_*` keys are preserved.
- Widget layouts look visually similar across tiers because all widgets render as `PlaceholderCard`. The underlying layout data is correctly differentiated — this will be obvious once real widget UIs ship.
- PIN gate is now tier-4-only. Switching between tiers 1–3 is free.
