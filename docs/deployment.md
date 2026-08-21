# Deployment — Family OS on a Raspberry Pi 4

> **Status: 🟢 LIVE at `https://vireohome.app` — on a Pi 5 (4 GB) since
> 2026-08-16** (LAN IP 192.168.0.42; migrated after the 3B's USB power budget
> killed the SSD twice — see `logs/2026-08-16-infra-offsite-backups.md`; SSD in
> an Insignia NS-PC25HDE USB 3 enclosure, memory `project-poc-hardware`).
> Originally brought up 2026-07-20 on a **Pi 3B v1.2 (1 GB RAM)**, not the Pi 4
> in the title. Docker Compose (postgres + api + Caddy), GHCR images,
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
> **Storage roots moved to the SSD (2026-07-20)** — both `data-root` and
> containerd's `root`; see Part C9.
> **Remote access is LIVE (2026-07-28)** — Tailscale subnet route, family devices
> reach the app from anywhere, no public listener. See Part G.
> **Offsite backups LIVE (2026-08-16)** — nightly restic → R2, restore-tested;
> see Part F.
> **Remaining (non-blocking):** shrinking the api image.

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

### A1. Service-worker cache strategy ✅ shipped 2026-07-19

**The cache name is stamped with the build hash**, so `activate` evicts the old
shell on every deploy — an installed PWA no longer serves a stale `index.html`.
On a real HTTPS prod build the SW registers and push fires (`main.tsx:19`), so
both updates and push are reliable. Details in
`logs/2026-07-19-dev-sw-cache-strategy.md`.

### A2. Verify plugins serve under a subpath ✅ verified 2026-07-19

**Result: works with the default `base: '/'` — no per-plugin override needed.**
`vite-plugin-federation@1.4.1` resolves exposed/shared chunks **relatively**
against `import.meta.url`, so a `remoteEntry.js` loaded from
`/plugins/<name>/assets/` pulls its chunks from that same dir. Verified static +
HTTP (flat prod tree, all URLs `200` with correct MIME) and in a real browser
against the flat tree with `/api` proxied — all five plugins render. Details in
`logs/2026-07-19-dev-prod-serve.md`.

### A3. Production API run + migrations ✅ scripts done 2026-07-19

**`db:deploy` (`prisma migrate deploy`) added to all six packages.**
`family-feed` had no migrations folder (dev table applied via `db push`) — its
initial migration is now baselined (`20260719120000_init_family_feed`, marked
applied in dev; creates the schema+table fresh on an empty prod DB). The compiled
`node dist/index.js` run happens in the Dockerfile (Part B); the entrypoint below
already calls `db:deploy` per package.

Migrations are split across **six** Prisma schemas, all on the same DB:

- `packages/platform/prisma/schema.prisma`
- `plugins/family-feed/prisma/schema.prisma`
- `plugins/chores/prisma/schema.prisma`
- `plugins/calendar/prisma/schema.prisma`
- `plugins/rewards/prisma/schema.prisma`
- `plugins/meals/prisma/schema.prisma`

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
2. **Get the write churn off the microSD.** Postgres and a 2 GB image pulled on
   every deploy will wear a card out. Boot from USB if the board supports it; on
   a 3B whose USB-boot OTP bit is unverified, boot from the card and move both
   storage roots to the SSD instead — see Part C9.
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
9. **Storage roots onto the SSD** (done 2026-07-20 on the live box, if you boot
   from the card). **There are two roots, and moving only the first moves almost
   nothing:**

   | What                         | Lives in              | Set by                               | Size here |
   | ---------------------------- | --------------------- | ------------------------------------ | --------- |
   | Volumes + container metadata | `/var/lib/docker`     | `data-root` in `daemon.json`         | ~48 MB    |
   | Image content + snapshots    | `/var/lib/containerd` | `root =` in `containerd/config.toml` | ~2.8 GB   |

   Docker 29 uses the **containerd image store** (`Storage Driver: overlayfs`),
   so the layers — the bulk, and the part every release rewrites — are not under
   `data-root` at all.

   > **Do not `du /var/lib/docker` while Docker is running.** Live container
   > rootfs are mounted under `/var/lib/docker/rootfs/overlayfs/`, so `du` walks
   > into the mounts and reports the image size against the wrong directory. Stop
   > Docker first, or you will "confirm" a move that didn't happen.

   ```bash
   docker image prune -af                       # copy less; stale tags accumulate
   cd /opt/family-os
   docker compose -f docker-compose.prod.yml --env-file .env down
   sudo systemctl stop docker docker.socket containerd

   sudo rsync -aHAX --numeric-ids /var/lib/docker/ /mnt/data/docker/
   sudo rsync -aHAX --numeric-ids /var/lib/containerd/ /mnt/data/containerd/

   printf '{\n  "data-root": "/mnt/data/docker"\n}\n' | sudo tee /etc/docker/daemon.json
   sudo sed -i 's|^#root = "/var/lib/containerd"|root = "/mnt/data/containerd"|' \
     /etc/containerd/config.toml

   # Without this, an unmounted SSD gives Docker an empty data-root, Postgres
   # initialises a blank database, and the stack comes up looking healthy with
   # the household gone.
   for u in docker containerd; do
     sudo mkdir -p /etc/systemd/system/$u.service.d
     printf '[Unit]\nRequiresMountsFor=/mnt/data\n' \
       | sudo tee /etc/systemd/system/$u.service.d/ssd-mount.conf
   done
   sudo systemctl daemon-reload && sudo systemctl start containerd docker
   ```

   `-H` and `-X` are not optional (hardlinked layers, xattrs). Verify with
   `docker info | grep 'Docker Root Dir'`, then **reboot** and re-check before
   deleting `/var/lib/docker` and `/var/lib/containerd` — until then, rollback is
   just removing the two config edits.

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

### A deploy does not reach the fridge iPad until the PWA is quit

The service worker is network-first for navigations, so any online page load
picks up a new build. **An installed iOS PWA in standalone mode does not perform
one** — switching back to it resumes the existing page, and standalone mode has
no reload control. So a green `deploy` run and an unchanged iPad are the normal,
expected state, not a broken pipeline.

Quit the app from the app switcher and reopen it. That issues a real navigation
→ fresh `index.html` → the new content-hashed bundles, and the rebuilt `sw.js`
(its cache name carries the shell's content hash) reinstalls and purges the old
cache.

**Check the server before touching the device.** Compare the entry script in
`curl -s https://vireohome.app/ | grep assets/` against the hash in the bug
report's Build field, and grep the deployed chunk for markup only the new code
has. If the server is right, the device is stale — first diagnosed 2026-07-25
chasing auto-bug #70's fix, which had in fact deployed 20 minutes earlier.

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
          for p in platform plugin-family-feed plugin-chores plugin-calendar plugin-rewards plugin-meals; do
            pnpm --filter "@family-os/$p" exec prisma migrate deploy
          done
          pnpm --filter @family-os/platform exec prisma db seed
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
      - run: echo "${{ secrets.GITHUB_TOKEN }}" | docker login ghcr.io -u ${{ github.actor }} --password-stdin
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

- **Backups (LIVE 2026-08-16):** nightly restic → Cloudflare R2, encrypted,
  restore-tested. The whole house lives in Postgres (profiles, chores, calendar,
  **and every avatar photo** — ADR 042 stores image bytes in the DB).
  - `familyos-backup.timer` (03:30, `Persistent=true`) →
    `/opt/family-os/backup/backup.sh`: `pg_dump | restic backup --stdin`,
    then `forget --keep-daily 14 --keep-weekly 8 --prune`.
  - Creds + repo in `/opt/family-os/backup/restic.env` (0600). R2 quirks: the
    S3 access key ID is the API **token's ID**, the secret is the 64-hex value
    shown once at creation. Encryption password also lives in the user's
    password manager — without it the backups are unreadable.
  - On failure, `OnFailure=` posts to the family feed via unauthenticated LAN
    `POST /api/family-feed/posts` (authored "Family", visible on the fridge).
  - **Restore:** `restic dump latest /familyos.sql | docker exec -i
family-os-postgres-1 psql -U familyos -d <target-db>` — verified
    2026-08-16 into a scratch DB, counts matched prod.
- **Logs:** `docker compose logs -f api web`.
- **Health:** `docker compose ps`; external paging is live via the watchdog below.
- **SSD watchdog + self-heal (LIVE 2026-08-20)** — after the enclosure's UAS
  firmware hung mid-write, aborted the ext4 journal, and took the Pi's whole
  xHCI USB controller down with it (only a reboot recovers a dead controller;
  see `logs/2026-08-20-infra-ssd-outage-selfheal.md`):
  - **UAS disabled** for the Insignia enclosure: `usb-storage.quirks=6655:a580:u`
    in `/boot/firmware/cmdline.txt` — the standard fix for this hang; costs a
    little sequential I/O.
  - **fstab `x-systemd.device-timeout` raised 10s → 60s** — the drive can take
    > 10s to enumerate at boot, and the old timeout left `/mnt/data` unmounted
    > (and Docker down, by the `RequiresMountsFor=` guard) on an otherwise
    > healthy boot.
  - **`vireo-watchdog.timer`** (1 min) → `/usr/local/sbin/vireo-watchdog.sh`:
    healthy = `/mnt/data` mounted **read-write** + `/api/plugins` 200 through
    Caddy. When healthy it pings the Healthchecks.io dead-man URL in
    `/etc/vireo-healthcheck-url` (0600) — a quiet box pages Zach externally.
    When unhealthy: if the disk is on the bus, remount + restart services +
    `compose up -d`; if the disk is gone (or recovery fails), reboot — stamped
    in `/var/lib` so a genuinely dead drive degrades to one reboot per 2h, not
    a boot storm. Logs to syslog as `vireo-watchdog`.
  - The durable fix is **off USB entirely**: NVMe HAT on the Pi 5's PCIe port —
    queued.

---

## Part G — Access from outside the house (Tailscale)

**Live 2026-07-28.** Family devices reach `https://vireohome.app` from anywhere.
The Pi gained no publicly reachable listener in the process. Why this
architecture: `docs/decisions/060-family-profile-network-boundary.md` +
`logs/2026-07-28-infra-remote-access.md`.

### The shape

```
public DNS (unchanged):  vireohome.app  A  192.168.0.42   ← RFC 1918, unroutable
router (unchanged):      no port forwarding

at home:   device ──LAN──────────────────────────────▶ Pi:443
away:      device ──WireGuard──▶ tailnet ──/32 route──▶ Pi:443
fridge:    no Tailscale client at all, pure LAN
```

The Pi advertises **only `192.168.0.42/32`**, not the whole `/24`. A tailnet
device gets a route to the app and to nothing else on the home network.

**The fridge iPad is NOT enrolled** — it stays pure LAN.

### Setup on the Pi

```bash
curl -fsSL https://tailscale.com/install.sh | sudo sh

printf 'net.ipv4.ip_forward = 1\nnet.ipv6.conf.all.forwarding = 1\n' \
  | sudo tee /etc/sysctl.d/99-tailscale.conf
sudo sysctl -p /etc/sysctl.d/99-tailscale.conf

sudo tailscale up --advertise-routes=192.168.0.42/32 --accept-dns=false \
  --hostname=vireo-pi
```

`--accept-dns=false` leaves the Pi's own resolver alone; MagicDNS buys a server
nothing and Caddy's DNS-01 renewals depend on that resolver.

Then, in the [admin console](https://login.tailscale.com/admin/machines), on
`vireo-pi` — **both are required and neither has a CLI equivalent**:

1. **Edit route settings → approve `192.168.0.42/32`.** Advertising is a request;
   until it is approved, `tailscale status --json` reports `PrimaryRoutes: null`
   and remote access silently does not work.
2. **Disable key expiry.** Node keys default to a 180-day life. On expiry the Pi
   drops off the tailnet and remote access dies with no warning and no failure
   anyone will connect to a calendar entry made six months earlier. Re-auth has
   to happen **on the box**, so this is the one setting whose absence turns into
   an outage you debug from scratch.

### Setup per family device

Install the Tailscale client, sign in, accept the invite. That is the whole
enrolment — no per-device config, no profile, no URL change.

`--accept-routes` is on by default on iOS, iPadOS and macOS. On a Linux client it
is **not**; that client needs `sudo tailscale up --accept-routes` or it will
resolve `vireohome.app` to `192.168.0.42` and route it out its own default gateway.

### Verifying it

The two halves are one test, run on a phone with **cellular data, wifi off**:

- **Tailscale OFF** → `https://vireohome.app` must **fail to load**. This is the
  real check that nothing is publicly exposed. (Probing your public IP from a
  machine on your own LAN does not prove it — most routers don't hairpin, so a
  forwarded port can still read as closed.)
- **Tailscale ON** → the app loads with a valid padlock and works normally.

On the Pi, `PrimaryRoutes` populating is the signal the route went live:

```bash
tailscale status --json | grep -A2 PrimaryRoutes
```

**A lost phone signed into the tailnet is a full-access device** — removing it
in the admin console is the only revocation that exists.

---

## Sequencing — the order this rolled out (all executed, 2026-07-19 → 2026-08-16)

Kept as the order to follow on a rebuild: production serve + SW (Part A) →
containerize + CI (Part B, E1) → provision the Pi (Part C, D) → CD (E2, E3) →
backups + kiosk (Part F, D4).
