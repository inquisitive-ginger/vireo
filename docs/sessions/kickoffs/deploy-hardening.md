# Kickoff — Deployment hardening (SSD data-root · E3 auto-deploy · faster builds)

**Type:** infra/tooling · **Depends on:** none (the app is live)

## Pre-session reads

- `CLAUDE.md` (status: **🟢 LIVE at `https://vireohome.app`**)
- `docs/deployment.md` — Parts C, E2, E3, F (the runbook; note the shipped files
  differ from the Part B samples — API runs via `tsx`)
- `docs/sessions/logs/2026-07-20-deploy-golive.md` — how it was actually brought up
- `docs/sessions/logs/2026-07-19-dev-containerize.md` — the image/CI design
- Memory `project-poc-hardware` — the Pi, and the SSD-not-used gap

## Environment (already set up)

- App is **live** on a **Pi 3B v1.2** at `vireohome.app`, LAN IP **192.168.0.31**
  (Ethernet). SSH from the Mac is **key-based with passwordless sudo**:
  `ssh zach@vireo-pi.local`.
- Docker **29.6.2**, Compose v5. Stack in **`/opt/family-os/`**
  (`docker-compose.prod.yml` + `.env`, `TAG=latest`). Pi is logged into **GHCR**
  (`read:packages` PAT). Images: `ghcr.io/inquisitive-ginger/family-os-{api,web}`.
- CI/CD today: `ci.yml` (PR) + `release.yml` (push→main, arm64 buildx→GHCR).
  **No auto-deploy** — shipping is merge → wait for `release.yml` → manual
  `cd /opt/family-os && docker compose -f docker-compose.prod.yml --env-file .env pull && … up -d`.

## Scope — three items, one session

### 1. Move Docker's data onto the SSD (do this first, carefully — live data)

The compose uses **named volumes** (`postgres_data`, `caddy_data`) → they live
under `/var/lib/docker` on the **microSD**, not the `/mnt/data` SSD. The household
DB now has **real data** (onboarding was done live), so **preserve it**:

- Preferred: set Docker's data-root to the SSD.
  `sudo systemctl stop docker`, `sudo rsync -aP /var/lib/docker/ /mnt/data/docker/`,
  write `/etc/docker/daemon.json` `{ "data-root": "/mnt/data/docker" }`,
  `sudo systemctl start docker`, verify `docker info | grep "Docker Root Dir"` and
  that `postgres_data` still has the data (app loads, profiles intact).
- Confirm the SSD is mounted at boot (fstab entry exists) **before** pointing Docker
  at it, or Docker starts against an unmounted path.
- AC: `docker info` root dir = `/mnt/data/docker`; app still live with existing
  data; old `/var/lib/docker` reclaimed after verifying.

### 2. E3 — self-hosted runner + auto-deploy

- Register a **self-hosted `linux/ARM64` runner** on the Pi (repo → Settings →
  Actions → Runners → New), install as a **service** (`svc.sh install && start`)
  so it survives reboot. `zach` is in the `docker` group already.
- Add **`.github/workflows/deploy.yml`** per `docs/deployment.md` E3
  (`on: workflow_run: { workflows: [release], types: [completed] }`,
  `if: conclusion == 'success'`, `runs-on: [self-hosted, linux, ARM64]`), doing the
  `cd /opt/family-os && … pull && up -d && docker image prune -f`. Pin `TAG` to the
  release SHA for immutable deploys/rollback.
- AC: a merge to `main` auto-deploys to the Pi with no manual step; rollback is
  setting `TAG` to a prior SHA.

### 3. Faster arm64 image builds

`release.yml` is ~15 min: QEMU-emulated full `pnpm install` + Vite build, **twice**,
**no cache**. Options (pick by effort/impact):

- **buildx cache** (`cache-from`/`cache-to`, GHA or registry) — easy, big win,
  do this regardless.
- **Native JS build → thin arm64 runtime** — cleanest for the **web** image (build
  `dist` on native x86, `COPY` into the Caddy image; no emulated Vite). Trickier for
  the **api** image, which ships source for `tsx` — consider it separately or leave.
- **arm64 hosted runners** — if available on the plan, drops emulation entirely.
- AC: release wall-clock materially down (target < ~6 min); images still run on the Pi.

## Constraints

- **Docker as written** (ADR-level decision this session) — 1 GB Pi 3B; don't
  re-architect to native. Tune, don't replace.
- Item 1 touches **live household data** — back it up first if Part F isn't done yet
  (`docker compose exec -T postgres pg_dump …` to a file off the Pi).
- Don't break the live site for more than a brief restart.

## Required outputs

- Working auto-deploy (verify with a trivial no-op merge), Docker on the SSD, faster
  release build.
- Session log `docs/sessions/logs/YYYY-MM-DD-infra-deploy-hardening.md`.
- Update `docs/deployment.md` status + `CLAUDE.md` + queue; **delete this kickoff**.
