# Session Log — 2026-06-06 · Dev · family-onboarding (tests)

Continuation of the family-onboarding dev session. Covered all test work.

## What was built

### Unit tests — setup routes (`apps/api/src/plugins/setup.test.ts`)

16 tests across all 4 setup routes:

- `GET /setup/status` — three cases: no profiles (step 1), profiles + onboarding_step (in-progress), profiles with no step (complete)
- `POST /setup/family` — happy path, layout seeding for tier-4 parent, missing-field 400s, 409 when profiles already exist
- `POST /setup/members` — creates profiles + layouts, empty array skip, step mismatch 409; scoped `beforeEach` seeds a parent + `onboarding_step=2`
- `POST /setup/complete` — hashes PIN, removes `onboarding_step`, sets session; non-4-digit 400, non-digit 400, step mismatch 409

`afterAll` restores `seed-parent-1` / `seed-child-1` so auth tests are not left without their fixtures.

### Unit tests — auth changes (`apps/api/src/plugins/auth.test.ts`)

- Renamed existing test: "returns 403 when switching from tier < 4 to tier 4" (was broader wording)
- New test: "allows switching from tier 1 to tier 3 without a PIN" — creates a tier-3 profile inline, asserts 200, cleans up

### E2E spec (`packages/e2e/tests/onboarding.spec.ts`)

Serial 3-test suite:

1. `beforeAll` calls `POST /api/dev/reset` — resets DB to onboarding state
2. Redirects to `/onboarding` from `/` when setup incomplete
3. Full 3-step flow: family name → add E2E Child (Little one tier) → PIN `1234` twice → Finish → `/`
4. No redirect to `/onboarding` after setup complete

### Dev reset endpoint (`apps/api/src/plugins/dev.ts`)

`POST /api/dev/reset` — wipes sessions, widget_layouts, non-family profiles, onboarding-related system_config keys; re-upserts family pseudo-profile. Registered in `server.ts` only when `NODE_ENV !== 'production'`.

### Playwright project dependencies (`packages/e2e/playwright.config.ts`)

`onboarding` project runs first (matches `onboarding.spec.ts`). `chromium` project depends on `onboarding`, ignores that spec. Guarantees other tests start with setup-complete DB state.

## Infrastructure fixes

### Test DB was missing the latest migration

`familyos_test` had the first 3 migrations applied but not `20260605032431_add_widget_layouts_and_dark_mode`. The `widget_layouts` table didn't exist, causing `prisma.widgetLayout.deleteMany()` to throw on first test run.

Fix: `DATABASE_URL=...familyos_test prisma migrate deploy` — then `db:seed` to populate `default_layout_*` system_config rows (required for widget seeding tests).

### Test files ran in parallel and raced on shared DB state

`setup.test.ts`'s `beforeEach` deletes all non-family profiles. `auth.test.ts` depends on `seed-parent-1` / `seed-child-1` existing. Running concurrently caused auth tests to see 404s.

Fix: `pool: 'forks', poolOptions: { forks: { singleFork: true } }` in `apps/api/vitest.config.ts`. Test files now run serially. All 28 tests pass.

## What the next session needs to know

- The test DB (`familyos_test`) is now fully migrated and seeded. Any future migration must be applied to it: `DATABASE_URL=postgresql://familyos:familyos@localhost:5432/familyos_test pnpm --filter @family-os/platform exec prisma migrate deploy`
- `singleFork: true` in vitest config is load-bearing — test files share the same DB and some clean up aggressively (deleting all non-family profiles). Do not revert to concurrent execution without isolating DB state per file.
- E2E tests: `onboarding.spec.ts` resets the DB via `/api/dev/reset` in `beforeAll`. Any test that depends on setup-complete state must either depend on the `onboarding` Playwright project or call the reset + complete the flow itself.
