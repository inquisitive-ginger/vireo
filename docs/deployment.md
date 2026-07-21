# Deployment — Family OS on a Raspberry Pi 4

> **Status: 🟢 LIVE (2026-07-20) at `https://vireohome.app`.** Parts A + B + C all
> done on a **Pi 3B v1.2 (1 GB RAM)**, not the Pi 4 in the title (memory
> `project-poc-hardware`). Docker Compose (postgres + api + Caddy), GHCR images,
> Cloudflare DNS-01 Let's Encrypt cert, PWA installed. Deviations from the runbook
> below, all intentional: **the API runs via `tsx`, not `node dist`** (imports
> workspace TS at runtime; no `pnpm deploy --prod` stage — the Part B code samples
> below are the original proposal); apex domain (not `family.`); the actual bring-up
> is in `logs/2026-07-20-deploy-golive.md` (+ Part B: `logs/2026-07-19-dev-containerize.md`).
>
> **E3 auto-deploy is LIVE (2026-07-21).** A merge to `main` now deploys itself —
> `release` → `deploy` on a self-hosted runner on the Pi; the manual
> `pull && up -d` is retired. Release wall-clock is **~4m20s** (was ~15 min); the
> Pi-side deploy adds ~6 min, dominated by pulling the 2 GB api image. See
> `logs/2026-07-21-infra-deploy-hardening.md`.
> **Remaining (non-blocking):** Part F offsite backups (most important), Docker
> data-root still on the microSD, and shrinking the api image.

Target: a Pi 4 bolted near the kitchen serves the app to a wall-mounted iPad as
an installable PWA over trusted HTTPS, updated automatically on merge to `main`.

---

## 0. The decision, and why the hardware barely matters

The one principle everything else follows from: **the device never builds the
app.** GitHub Actions (fast x86 cloud runners) builds the bundles; the Pi only
runs Postgres, the compiled API, and a static web server. That's ~5 W of steady
work, which any Pi 4 (4 GB+) handles fine. A Pi 4's slow CPU would only hurt if
it were compiling — it isn't.

Everything runs as **Docker Compose** on the Pi, so the runbook is the same
whatever board you land on. Three containers:

```
                    ┌──────────────── Pi 4 (Docker Compose) ────────────────┐
  iPad ──HTTPS──▶   │  caddy (web)                                          │
  family.example.com│   ├─ serves shell/dist        (static)               │
                    │   ├─ serves plugins/<n>/dist   (static, /plugins/<n>) │
                    │   ├─ reverse_proxy /api,/events → api:3000            │
                    │   └─ TLS via Cloudflare DNS-01 (real cert, LAN IP)    │
                    │  api (Fastify, node dist)  ──▶  postgres:16 (volume)  │
                    └───────────────────────────────────────────────────────┘
```

DNS: an `A` record `family.example.com → <Pi LAN IP>`. DNS-01 proves domain
ownership through Cloudflare's API, so the cert is trusted on iOS **without**
exposing port 80/443 to the internet and without installing a root cert on the
iPad. The name resolves to a private IP; that's fine.

---

## Part A — Make the app production-ready (build this first)

These gaps exist because everything to date has run off `vite preview` +
`tsx watch` behind a Cloudflare quick-tunnel. None of that is a production serve.

### A1. Service-worker cache strategy (the one queued story on the critical path)

`apps/shell/public/sw.js` caches `/` and `/index.html` **cache-first** under a
fixed name `family-os-v1`. Once the PWA is installed, a new deploy will **not
reach the iPad** — it keeps serving the stale `index.html`, and therefore the
stale hashed bundles it points at. Your CI/CD could push all day and the fridge
would never change.

Fix (small): serve `index.html` **network-first** (or stamp the cache name with
the build hash so `activate` evicts the old shell). This is the deferred
**"Service Worker cache strategy (prod)"** story — it is now part of deployment,
not optional.

Note the good news already in `main.tsx:19`: in a **production** build the SW
registers and its `push` handler fires. Web Push was only broken because the
tunnel served the _dev_ build (which tears the SW down). On a real HTTPS prod
build, push works — once A1 lands, both push and updates are reliable.

### A2. Verify plugins serve under a subpath ✅ verified 2026-07-19

**Result: works with the default `base: '/'` — no per-plugin override needed.**
`vite-plugin-federation@1.4.1` resolves exposed/shared chunks **relatively**
against `import.meta.url`, so a `remoteEntry.js` loaded from
`/plugins/<name>/assets/` pulls its chunks from that same dir. Verified static +
HTTP (flat prod tree, all URLs `200` with correct MIME) and in a real browser
against the flat tree with `/api` proxied — all three plugins render. Details in
`logs/2026-07-19-dev-prod-serve.md`. Original analysis below, kept for context.

Plugins build to `dist/{index.html,manifest.json,assets/remoteEntry.js,…}` with
Vite `base` defaulting to `/`. In prod they're served at `/plugins/<name>/`. The
shell already requests `/plugins/<name>/assets/remoteEntry.js`, so relative
chunk imports should resolve — **but this must be verified live.** If any chunk
or the manifest resolves against `/assets/...` instead of
`/plugins/<name>/assets/...`, set a per-plugin prod `base: '/plugins/<name>/'`.
This is the highest-risk item in Part A; nail it with a real browser before
declaring victory.

### A3. Production API run + migrations ✅ scripts done 2026-07-19

**`db:deploy` (`prisma migrate deploy`) added to all four packages.**
`family-feed` had no migrations folder (dev table applied via `db push`) — its
initial migration is now baselined (`20260719120000_init_family_feed`, marked
applied in dev; creates the schema+table fresh on an empty prod DB). The compiled
`node dist/index.js` run happens in the Dockerfile (Part B); the entrypoint below
already calls `db:deploy` per package.

- The API currently starts with `tsx watch` (`apps/api` `dev`). Prod runs the
  compiled output: `pnpm --filter @family-os/api build` → `node dist/index.js`.
- Migrations are split across **four** Prisma schemas, all on the same DB:
  - `packages/platform/prisma/schema.prisma`
  - `plugins/family-feed/prisma/schema.prisma`
  - `plugins/chores/prisma/schema.prisma`
  - `plugins/calendar/prisma/schema.prisma`

  Add a `db:deploy` script (`prisma migrate deploy`) to each of those packages,
  and run all four on container start **before** the API binds. Confirm each
  package has a committed `prisma/migrations/` folder — `migrate deploy` refuses
  to run without one.

### A4. Real secrets

Nothing sensitive lives in the image. On the Pi, a `.env` (git-ignored) holds:

```dotenv
POSTGRES_USER=familyos
POSTGRES_PASSWORD=<openssl rand -hex 24>
POSTGRES_DB=familyos
DATABASE_URL=postgresql://familyos:<same-password>@postgres:5432/familyos
SESSION_SECRET=<openssl rand -hex 32>
VAPID_PUBLIC_KEY=<from web-push generate-vapid-keys>
VAPID_PRIVATE_KEY=<same>
CF_API_TOKEN=<Cloudflare token, Zone:DNS:Edit on your zone>
APP_HOST=family.example.com
```

Generate VAPID once with `npx web-push generate-vapid-keys` and keep them stable
— rotating them invalidates every existing push subscription.

---

## Part B — Containerization (files to add to the repo)

### `apps/api/Dockerfile`

```dockerfile
# Build stage — full monorepo, native to the CI arch
FROM node:22-slim AS build
RUN corepack enable
WORKDIR /repo
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @family-os/plugin-family-feed --filter @family-os/plugin-chores \
        --filter @family-os/plugin-calendar --filter @family-os/api build
RUN pnpm --filter @family-os/api deploy --prod /out   # self-contained node_modules

# Runtime stage
FROM node:22-slim
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=build /out .
COPY apps/api/docker-entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
```

### `apps/api/docker-entrypoint.sh`

```bash
#!/usr/bin/env sh
set -e
for pkg in platform plugin-family-feed plugin-chores plugin-calendar; do
  pnpm --filter "@family-os/$pkg" exec prisma migrate deploy
done
exec node dist/index.js
```

> The exact `prisma migrate deploy` invocation depends on where each schema and
> its generated client land in the `pnpm deploy` output. Verify on first build;
> if the filtered form doesn't resolve, call `prisma migrate deploy --schema
<path>` explicitly per schema. Prisma 7 here uses the pg **driver adapter**
> (`@prisma/adapter-pg`), so there's likely no native query-engine binary to
> arch-match — but confirm `prisma generate` produced an arm64-compatible client
> in the image.

### `apps/shell/Dockerfile` (the `web` image: Caddy + static + TLS)

```dockerfile
FROM node:22-slim AS build
RUN corepack enable
WORKDIR /repo
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @family-os/plugin-family-feed --filter @family-os/plugin-chores \
        --filter @family-os/plugin-calendar build
RUN pnpm --filter @family-os/shell build

# Caddy with the Cloudflare DNS module compiled in
FROM caddy:2-builder AS caddybuild
RUN xcaddy build --with github.com/caddy-dns/cloudflare

FROM caddy:2
COPY --from=caddybuild /usr/bin/caddy /usr/bin/caddy
COPY apps/shell/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /repo/apps/shell/dist /srv
COPY --from=build /repo/plugins/family-feed/dist /srv/plugins/family-feed
COPY --from=build /repo/plugins/chores/dist       /srv/plugins/chores
COPY --from=build /repo/plugins/calendar/dist     /srv/plugins/calendar
```

### `apps/shell/Caddyfile`

```caddy
{$APP_HOST} {
    encode zstd gzip
    tls {
        dns cloudflare {$CF_API_TOKEN}
    }

    @backend path /api/* /events*
    handle @backend {
        reverse_proxy api:3000   # WebSocket upgrade for /events is automatic
    }

    handle {
        root * /srv
        try_files {path} /index.html
        file_server
    }
}
```

### `docker-compose.prod.yml`

```yaml
services:
  postgres:
    image: postgres:16
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U ${POSTGRES_USER}']
      interval: 5s
      timeout: 5s
      retries: 5

  api:
    image: ghcr.io/inquisitive-ginger/family-os-api:${TAG:-latest}
    restart: unless-stopped
    environment:
      DATABASE_URL: ${DATABASE_URL}
      SESSION_SECRET: ${SESSION_SECRET}
      VAPID_PUBLIC_KEY: ${VAPID_PUBLIC_KEY}
      VAPID_PRIVATE_KEY: ${VAPID_PRIVATE_KEY}
    depends_on:
      postgres: { condition: service_healthy }

  web:
    image: ghcr.io/inquisitive-ginger/family-os-web:${TAG:-latest}
    restart: unless-stopped
    ports:
      - '443:443'
      - '80:80'
    environment:
      APP_HOST: ${APP_HOST}
      CF_API_TOKEN: ${CF_API_TOKEN}
    volumes:
      - caddy_data:/data # persists the issued cert across restarts
    depends_on: [api]

volumes:
  postgres_data:
  caddy_data:
```

---

## Part C — Provision the Pi

1. **OS:** flash **Raspberry Pi OS Lite (64-bit)** with Raspberry Pi Imager. In
   the imager's advanced settings, set hostname, enable SSH, and drop your key.
   64-bit is required — the images are `linux/arm64`.
2. **Boot from SSD/USB, not the microSD.** Postgres will wear an SD card out.
   A cheap USB-SSD and Pi OS's USB-boot is the difference between "runs for
   years" and "corrupts in six months."
3. **Static LAN address:** give the Pi a DHCP reservation on your router so its
   IP never moves.
4. **Install Docker:**
   ```bash
   curl -fsSL https://get.docker.com | sh
   sudo usermod -aG docker $USER   # log out/in after
   ```
5. **DNS:** in Cloudflare, add `A  family  <Pi LAN IP>` (grey cloud / DNS-only).
   Create a scoped API token with **Zone → DNS → Edit** on that zone → `CF_API_TOKEN`.
6. **Secrets:** create `/opt/family-os/.env` with the Part A4 values. `chmod 600`.
7. **Compose file:** copy `docker-compose.prod.yml` to `/opt/family-os/`.
8. **First boot:**
   ```bash
   cd /opt/family-os
   docker compose -f docker-compose.prod.yml --env-file .env pull
   docker compose -f docker-compose.prod.yml --env-file .env up -d
   ```
   Watch the cert issue: `docker compose logs -f web`. First request to
   `https://family.example.com` from a LAN device should show a valid lock.

---

## Part D — Install the PWA on the iPad

1. Put the iPad on the same wifi; open Safari → `https://family.example.com`.
   Confirm the padlock (trusted cert — this is what DNS-01 bought you).
2. Share → **Add to Home Screen**. Launch from the home-screen icon (standalone
   mode) — Web Push on iOS only works from the installed PWA, not the Safari tab.
3. In the app, enable notifications; grant when iOS prompts. Verify a
   `push_subscriptions` row lands server-side (`docker compose exec postgres
psql -U familyos -c 'select count(*) from push_subscriptions;'`).
4. Kiosk the fridge display: **Settings → Accessibility → Guided Access** (or a
   dedicated kiosk profile) locks it to the app. Set the iPad to never
   auto-lock, or use a smart plug / Guided Access to keep the screen alive.

> Known pitfall from prior sessions: `db:reset` deletes `push_subscriptions`
> while the phone keeps its browser-local subscription, so the toggle reads ON
> with no server row. Don't `db:reset` the production DB; on the rare time you
> must, re-subscribe from each device afterward.

---

## Part E — CI/CD

### E1. CI on every PR (`.github/workflows/ci.yml`)

Typecheck, lint, test, build. The API suite needs Postgres, so give it a service
container mirroring `.env.test` (`familyos_test`).

```yaml
name: ci
on: pull_request
jobs:
  check:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env: { POSTGRES_USER: familyos, POSTGRES_PASSWORD: familyos, POSTGRES_DB: familyos_test }
        ports: ['5432:5432']
        options: >-
          --health-cmd "pg_isready -U familyos" --health-interval 5s
          --health-timeout 5s --health-retries 5
    env:
      DATABASE_URL: postgresql://familyos:familyos@localhost:5432/familyos_test
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck
      - run: pnpm lint
      - run: |
          for p in platform plugin-family-feed plugin-chores plugin-calendar; do
            pnpm --filter "@family-os/$p" exec prisma migrate deploy
          done
      - run: pnpm test
      - run: pnpm build
```

### E2. Build + publish images on merge (`.github/workflows/release.yml`)

Build `linux/arm64` images with buildx and push to GHCR, tagged with the commit
SHA (immutable → trivial rollback) and `latest`.

```yaml
name: release
on:
  push: { branches: [main] }
permissions: { contents: read, packages: write }
jobs:
  images:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        include:
          - { name: api, dockerfile: apps/api/Dockerfile }
          - { name: web, dockerfile: apps/shell/Dockerfile }
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-qemu-action@v3       # arm64 emulation
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with: { registry: ghcr.io, username: ${{ github.actor }}, password: ${{ secrets.GITHUB_TOKEN }} }
      - uses: docker/build-push-action@v6
        with:
          context: .
          file: ${{ matrix.dockerfile }}
          platforms: linux/arm64
          push: true
          tags: |
            ghcr.io/inquisitive-ginger/family-os-${{ matrix.name }}:${{ github.sha }}
            ghcr.io/inquisitive-ginger/family-os-${{ matrix.name }}:latest
```

> **Done 2026-07-21 (~15 min → ~4m20s).** The **web** image now builds fully
> native: both build stages pin `--platform=$BUILDPLATFORM`, so the Vite build
> runs on the x86 runner (its `dist` is arch-independent) and Caddy is
> cross-compiled by passing `GOOS`/`GOARCH` to `xcaddy`. Only the final stage is
> arm64 and it just `COPY`s files in, so nothing is emulated. The **api** image
> still builds under QEMU — it ships arm64 `node_modules` for `tsx` — plus buildx
> GHA cache (`scope` per image) on both.
>
> **Do not split the api install into `pnpm fetch` + `pnpm install --offline`.**
> It builds, pushes and smoke-tests clean, then fails at boot with
> `Cannot find module '@prisma/client-runtime-utils'` under tsx's resolver. It
> took the API down in production once; see
> `logs/2026-07-21-infra-deploy-hardening.md`.
>
> Remaining: the api image is **2.09 GB** (web is 150 MB), so the Pi re-pulls
> ~2 GB per deploy (~6 min). Splitting `node_modules` off the source layer is the
> next win — but boot-test it against a real DB in CI first.

### E3. Deploy via a self-hosted runner on the Pi ✅ live 2026-07-21

**Shipped as `.github/workflows/deploy.yml`.** The runner is registered on the Pi
as `vireo-pi` (labels `self-hosted, Linux, ARM64, vireo-pi`), installed as a
systemd service so it survives reboot, running as `zach` (in the `docker` group).
To pause deploys:
`sudo systemctl stop actions.runner.inquisitive-ginger-family-os.vireo-pi`.

The shipped job adds `concurrency: { group: deploy, cancel-in-progress: false }`
to the sample below — **keep it**. Two releases finishing close together will
otherwise race the same `.env` and compose stack; queueing them is what made the
first live run safe. The job takes no `actions/checkout` — it only touches
`/opt/family-os`.

The Pi is behind NAT (no inbound), so it _pulls_:

```yaml
name: deploy
on:
  workflow_run: { workflows: [release], types: [completed] }
jobs:
  deploy:
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    runs-on: [self-hosted, linux, ARM64]
    steps:
      - run: |
          cd /opt/family-os
          export TAG=${{ github.event.workflow_run.head_sha }}
          sed -i "s/^TAG=.*/TAG=$TAG/" .env || echo "TAG=$TAG" >> .env
          docker compose -f docker-compose.prod.yml --env-file .env pull
          docker compose -f docker-compose.prod.yml --env-file .env up -d
          docker image prune -f
```

**Rollback** is then one command on the Pi: set `TAG=` to a previous good SHA in
`.env` and `docker compose ... up -d`.

---

## Part F — Ops

- **Backups:** the whole house lives in Postgres (profiles, chores, calendar,
  **and every avatar photo** — ADR 042 stores image bytes in the DB). A nightly
  `pg_dump` to a second disk / cloud bucket is not optional:
  ```bash
  docker compose exec -T postgres pg_dump -U familyos familyos | gzip > /backup/familyos-$(date +%F).sql.gz
  ```
  Put it on a systemd timer or cron. Test a restore once.
- **Logs:** `docker compose logs -f api web`.
- **Health:** `docker compose ps`; add an uptime check hitting
  `https://family.example.com` if you want to be paged.

---

## Sequencing — how to actually roll this out

1. **Dev session: production serve + SW fix (Part A).** The real work. Build
   Caddy-serves-static locally, verify federated plugins load under
   `/plugins/<name>/` (A2), fix the SW (A1), add `db:deploy` scripts (A3). Close
   it with a live review, same as any dev session.
2. **Dev/infra session: containerize (Part B) + CI (E1).** Get green CI and
   images that build.
3. **Provision the Pi (Part C, D).** One-time, manual.
4. **Wire CD (E2, E3).** Self-hosted runner + release/deploy workflows.
5. **Backups + kiosk (Part F, D4).** Before the family actually depends on it.

Everything else in the queue (family-feed tests, validation audit, family-wall
typography, plugin-generator hardening) is real debt but **does not block** the
deploy. The only queued story on the critical path is the SW cache strategy,
folded into step 1.
