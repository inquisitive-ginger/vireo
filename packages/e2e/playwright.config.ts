import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'html' : 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      // Runs first: resets DB to onboarding state, completes the flow,
      // leaving DB in "setup complete" state for all subsequent tests.
      name: 'onboarding',
      testMatch: /onboarding\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 },
      },
    },
    {
      name: 'chromium',
      dependencies: ['onboarding'],
      testIgnore: /onboarding\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 },
      },
    },
  ],
  webServer: [
    {
      // API server — DATABASE_URL is set to familyos_test via --env-file in the e2e
      // script. tsx's own --env-file flag won't override it (Node --env-file semantics).
      // Local dev with reuseExistingServer=true reuses whatever server is on :3000.
      command: 'pnpm --filter @family-os/api dev',
      url: 'http://localhost:3000/api/health',
      reuseExistingServer: !process.env.CI,
    },
    {
      // Plugin preview server — requires a prior `pnpm --filter @family-os/plugin-demo-plugin build`
      // CI: run build before `pnpm e2e`. Local dev: keep `vite preview` running on port 3010.
      command: 'pnpm --filter @family-os/plugin-demo-plugin preview',
      url: 'http://localhost:3010',
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'pnpm --filter @family-os/shell dev',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
    },
  ],
})
