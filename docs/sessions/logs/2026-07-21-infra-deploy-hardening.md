# 2026-07-21 — Infra: Deploy hardening (E3 auto-deploy + faster builds)

**Type:** infra/tooling · **PRs:** #45 (auto-deploy + faster builds), #46 (revert
the api install split) · **Scope taken:** kickoff items 2 and 3. Item 1 (Docker
data-root → SSD) was **not** done — it is durability, not deploy time.

## What shipped

**Merging to `main` now deploys itself.** Before: merge → wait ~15 min for
`release.yml` → SSH to the Pi → `pull && up -d` by hand, whenever you got to it.
Now the chain is merge → `release` → `deploy`, no human step.

- **`.github/workflows/deploy.yml`** — `workflow_run` after a successful
  `release`, `runs-on: [self-hosted, linux, ARM64]`. It pins `TAG` in
  `/opt/family-os/.env` to the release SHA, `pull`s, `up -d`s, prunes. No
  `actions/checkout` — the job only touches `/opt/family-os`.
- **A self-hosted runner is registered on the Pi** — name `vireo-pi`, labels
  `self-hosted, Linux, ARM64, vireo-pi`, installed as a systemd service
  (`enabled` → survives reboot), running as `zach` (already in `docker`).
- **`release.yml`** — buildx GHA cache (`scope` per image), run concurrency, a
  `workflow_dispatch` trigger, and `latest` now only moves on `main`.
- **The web image builds fully native.** Both build stages pin
  `--platform=$BUILDPLATFORM`, so they run on the x86 runner with **no QEMU**:
  the Vite `dist` is arch-independent and Caddy is cross-compiled
  (`GOOS/GOARCH` into `xcaddy`). Only the final stage is arm64 and it just
  `COPY`s files in — nothing is emulated.

**Timings.** Release wall-clock **~15 min → 4m20s** (web 2m42s, api 4m20s, in
parallel). A no-op rebuild with a warm cache is **~40s**. Deploy adds ~6 min on
the Pi, so merge → live is now ~10 min unattended.

## What broke, and the actual failure

**The first auto-deploy took the API down in production.** PR #45 also split the
install in both images into `pnpm fetch` (lockfile only, so the slow emulated
download caches) + `pnpm install --offline`. The api image built, pushed, passed
a smoke test on the Pi (`tsx --version`, `prisma --version` both fine), deployed
— and then failed to boot:

```
Error: Cannot find module '@prisma/client-runtime-utils'
Require stack:
- /repo/packages/platform/src/generated/prisma/runtime/client.js
- /repo/packages/platform/src/db.ts
- /repo/apps/api/src/index.ts
```

Migrations ran clean across all four schemas first; the failure is purely at
runtime. `@prisma/client-runtime-utils` is a transitive dep of `@prisma/client`
that the **committed generated clients** require — and those live in workspace
**source**, not `node_modules`, so they resolve by walking up the real workspace
path.

**The forensics are worth keeping, because every structural check said the two
images were the same.** Against a known-good image, the broken one had: the same
`.pnpm` virtual-store hash for `@prisma/client`, the same
`packages/platform/node_modules/@prisma` contents, the same hoisted
`node_modules/.pnpm/node_modules/@prisma/client-runtime-utils`, the same (empty)
root `node_modules/@prisma`. A synthetic `require.resolve` from the generated
dir **fails in both** — because the real resolution goes through **tsx's**
resolver (`resolveTsPaths` is in the stack), not plain Node. So the difference
is in how tsx's resolver walks a `fetch`+`--offline` tree, not in a missing
package, and no static comparison of the two trees can show it.

Reverted the split in **both** images (#46). The web image never showed the
symptom — it only uses `node_modules` at build time and throws it away — but the
split bought it almost nothing (its install is native and fast; the speedup is
the `$BUILDPLATFORM` change), so carrying a pattern that had just shipped a
subtly-broken tree onto the surface that produces the app bundle was not a trade
worth making.

**Rollback worked exactly as designed** and is the one good thing about the
outage: set `TAG` to a prior SHA, `up -d`. Service was restored in one command
to `f10064d`, which kept the drawer fix. Ironically the mechanism that saved it
had shipped ten minutes earlier.

## Gotchas

- **Two deploys fired on the first merge, and neither was spurious.** The
  earlier `f10064d` (drawer fix) was still building under the _old slow_
  Dockerfiles and finished at 02:47:35 — **after** `deploy.yml` landed on main —
  so it auto-deployed, then the merge's own release finished at 02:49:11 and
  queued a second. `concurrency: { group: deploy, cancel-in-progress: false }`
  made them run **sequentially instead of racing** the same `.env` and compose
  stack. Keep that setting; a deploy queue must not cancel or interleave.
- **GitHub Actions cache does not flow branch → main.** The branch dispatch
  builds warmed a cache `main` could not read, so the first main release was
  cold (~6 min) despite two green branch builds. Steady state is on `main`'s own
  cache.
- **`pnpm fetch` needs `pnpm-workspace.yaml`, not just the lockfile** — that is
  where `allowBuilds` lives, and without it the esbuild/prisma postinstalls are
  skipped, so the arm64 esbuild binary `tsx` needs never lands. (Moot now that
  the split is reverted, but it cost a debugging pass.)
- **A build smoke test is not a boot test.** `tsx --version` and
  `prisma --version` both passed on the broken image. What would have caught it
  is booting the container against a database, which is what production did.

## Still open

- **The api image is 2.09 GB** (web is 150 MB) and is the whole reason the
  Pi-side deploy takes ~6 min — it ships the full monorepo plus dev deps for
  `tsx`. Every source change rebuilds the `pnpm install` layer, so the Pi
  re-downloads ~2 GB per deploy. Splitting `node_modules` off the source layer
  (`COPY` manifests → install → `COPY` source) is the obvious next win, but it
  is the same class of change that just broke, so it needs a **boot test against
  a real DB in CI** before it goes near the Pi.
- **Kickoff item 1 — Docker data-root on the SSD — not done.** `/var/lib/docker`
  is still on the microSD (`/dev/mmcblk0p2`, 13% of 117G used). Space is not the
  issue; SD wear is.
- **Part F offsite backups** remains the most important follow-up. Nothing about
  this session changed that the household lives in one un-backed-up volume.

## Next session needs to know

Deploying is now merge-and-walk-away, and rollback is `TAG=<prior sha>` +
`up -d` on the Pi. If a deploy ever needs to be skipped, the runner is a service
on the Pi (`sudo systemctl stop actions.runner.inquisitive-ginger-family-os.vireo-pi`).
