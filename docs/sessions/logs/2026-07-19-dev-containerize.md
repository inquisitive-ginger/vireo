# 2026-07-19 — Dev: Containerize (deployment Part B + CI/CD)

**Branch:** `dev/platform-containerize` → PR #42, squash-merged to `main`
(`4ff0442`). **Scope:** `docs/deployment.md` **Part B** (the two images the Pi
pulls) + **E1/E2** CI/CD. Picks up after Part A (prod-servable, A2 verified).

---

## What was built

- **`apps/api/Dockerfile`** + **`docker-entrypoint.sh`** — the API image.
- **`apps/shell/Dockerfile`** + **`Caddyfile`** — the web image (shell + plugins
  served flat by Caddy, `/api` reverse-proxied, Cloudflare DNS-01 TLS).
- **`docker-compose.prod.yml`** — postgres + api + web.
- **`.dockerignore`**, **`.github/workflows/ci.yml`** (E1), **`release.yml`** (E2).

## Key decisions

### API runs via `tsx`, not `node dist/index.js` (user-gated)

The runbook assumed a `tsc` build. It doesn't work: the API imports workspace
**TypeScript source** at runtime everywhere — `@family-os/platform/server`,
`/types`, `@family-os/schemas`, each `@family-os/plugin-*/db` — and `tsc` only
compiles `apps/api/src`, leaving those as unrunnable `.ts` in `node_modules`.
The committed Prisma clients use the **driver adapter** (pure JS, no native
engine → arch-independent), so there's no compile need on that front either.
Chosen runtime: run `tsx src/index.ts` in the container (same as dev, zero
bundler risk). The entrypoint runs `prisma migrate deploy` across all four
schemas before binding. Alternatives (bundle with tsup; add per-plugin server
builds) rejected as riskier / more invasive for a LAN appliance.

## Two real bugs CI/local builds caught (both would have bitten prod)

1. **`pnpm-workspace.yaml` `allowBuilds`** had `@prisma/engines`/`prisma` left as
   the literal placeholder `"set this to true or false"`, so **any** clean
   install failed with `ERR_PNPM_IGNORED_BUILDS` (Docker build failed here; CI
   would have too). Prisma needs its engines for `migrate deploy`. Set to `true`.
2. **Only `packages/platform/src/generated` was gitignored** — the three plugins
   commit their generated Prisma clients; platform didn't. On a clean CI checkout
   (and the `release.yml` Docker build) platform's client is absent →
   `@family-os/platform` typecheck fails with "Cannot find module
   './generated/prisma'". Un-ignored + committed it, matching the plugin
   convention (eslint already ignores `**/src/generated/**`). My local API image
   only worked because `COPY . .` grabbed the local gitignored copy.

## Verification

- **API image** — built locally and smoke-tested against a throwaway empty
  Postgres: migrations created all four schemas fresh (`platform`=8 tables,
  `family_feed`=1, `chores`=2, `calendar`=4 — the family-feed **baseline creates
  fresh on an empty DB**), `tsx` booted, `/api/auth/me` → 200.
- **Web image** — the shell/plugin build stages build; the stock `xcaddy` Caddy
  compile couldn't finish locally (this machine's network blocks Go's module
  proxy — `unexpected EOF` on `storage.googleapis.com`). Not a code defect;
  deferred to CI.
- **CI (ci.yml, first-ever run)** — caught bug #2, fixed, then **green**:
  typecheck, lint, migrate+seed `familyos_test`, full test suite, build all pass
  on a clean checkout.
- **release.yml** — triggered on merge; building both arm64 images (buildx +
  QEMU) → GHCR. In progress at close; **confirm GHCR has `family-os-api` +
  `family-os-web` before Part C.**

## Gotchas

- GitHub Actions sat **"waiting for a runner" ~14 min** on the first run (private
  repo — looked like an Actions billing/minutes gate; it eventually picked up).
- **arm64 under QEMU is slow** (emulated Vite build) — the runbook's noted
  optimization (build JS natively, copy into a thin arm64 runtime) is the fix if
  it drags, not day one.

## Open / next

- **Confirm the arm64 images published** to GHCR (validate release.yml succeeded —
  this is the web image's real build check).
- **Part C — provision the Pi**: install Docker, write `/opt/family-os/.env` (A4
  secrets: Postgres creds, `SESSION_SECRET`, VAPID, `CF_API_TOKEN`, `APP_HOST`),
  Cloudflare `A` record + scoped token, `docker compose ... up -d`. Then **E3**
  (self-hosted runner on the Pi for pull-based deploys) needs a runner registered.
- **family-feed still has zero tests** (queued) — unrelated.
