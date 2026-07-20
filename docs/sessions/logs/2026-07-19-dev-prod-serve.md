# 2026-07-19 — Dev: Production Serve (deployment Part A)

**Branch:** `dev/platform-prod-serve` → merged to `main` (`06d98fa`).
**Scope:** the repo-side remainder of `docs/deployment.md` **Part A**. A1 (SW
cache) shipped earlier today, so this session was **A2** (verify federated
plugins serve under a subpath) + **A3** (production API migrations). Arch-
independent work — done in the repo, not on the Pi.

---

## What was decided / found

### A2 — federated plugins under `/plugins/<name>/`: **works, no `base` override needed**

The runbook flagged this as Part A's highest-risk item: plugins build with Vite
`base` defaulting to `/`, but are served at `/plugins/<name>/` in prod. The
worry was that `remoteEntry.js` would reference its exposed/shared chunks as
absolute `/assets/...` (→ resolves against the shell root, 404) instead of
`/plugins/<name>/assets/...`.

Verified it three ways, escalating to a real browser:

1. **Static** — the built `remoteEntry.js` references exposed chunks
   **relatively** (`"./__federation_expose_Plugin-*.js"`) resolved against
   **`import.meta.url`**. `vite-plugin-federation@1.4.1` uses relative
   resolution, so a remoteEntry loaded from `/plugins/chores/assets/` pulls its
   chunks from the same dir. No absolute `/assets/` references.
2. **HTTP** — built shell + 3 plugins, assembled the flat prod tree (shell at
   `/`, plugins under `/plugins/<name>/`), probed every URL the browser fetches:
   `remoteEntry.js`, the exposed chunk, a shared chunk, `manifest.json` — all
   `200` with `application/javascript`/`application/json`; a bogus asset `404`s.
3. **Real browser** (live review, signed off) — served the flat tree through a
   throwaway static+proxy server (`/api`→ API on :3000, dev DB) and loaded it in
   a browser. All three plugins (Chores, Calendar, Family Feed) and the home
   widgets render with live data.

**Conclusion:** plugins can keep the default `base: '/'`. No code change for A2 —
it was a verification task, and the verification passed. This is the exact prod
shape Caddy will serve on the Pi.

### A3a — `db:deploy` scripts

Prod DB setup runs `prisma migrate deploy` across all four schemas on container
start, but no package had the script. Added `"db:deploy": "prisma migrate
deploy"` to `platform`, `family-feed`, `chores`, `calendar`.

### A3b — family-feed baseline migration

`family-feed` had **no `prisma/migrations/` folder at all** — its single
`family_feed.posts` table was applied to the dev DB via `prisma db push`, never
migrated, so `_prisma_migrations` had no row for it and `migrate deploy` would
refuse to run. Baselined it the standard way:

- Generated the init SQL: `prisma migrate diff --from-empty --to-schema
prisma/schema.prisma --script` → `CREATE SCHEMA family_feed` + `CREATE TABLE
posts` (mirrors the chores/calendar init format).
- Committed as `20260719120000_init_family_feed/` + `migration_lock.toml`.
- Marked applied in dev (`prisma migrate resolve --applied …`) since the table
  already exists there. On an **empty prod DB**, `migrate deploy` runs it and
  creates the schema+table fresh. `migrate status` → clean.

---

## Notables / gotchas

- **Prisma 7 renamed the diff flag**: `--to-schema-datamodel` was removed → use
  `--to-schema`. The old form silently emits an empty file if stderr is hidden.
- **Multi-schema Prisma**: app tables live in named PG schemas
  (`platform`/`family_feed`/`chores`/`calendar`); only `_prisma_migrations` is in
  `public`. Query the named schema, not `public`, when checking table existence.
- **`prisma.config.ts` supplies the datasource URL** — the `schema.prisma`
  `datasource` blocks have no `url` line; the CLI loads config and reads
  `DATABASE_URL`.
- **API mounts under `/api`** — a direct `GET /auth/me` 404s; the route is
  `/api/auth/me`. The prod-serve proxy forwards the path verbatim, which matches.

---

## Deployment hardware note

The POC box is a **Pi 3 Model B v1.2** (1 GB RAM), not the Pi 4 the runbook is
titled for — set up this session: boots Raspberry Pi OS Lite 64-bit from a
microSD (`vireo-pi`), data on a repurposed 256 GB SATA SSD (ext4, `/mnt/data`,
via USB 2.0). Earlier undervoltage (`get_throttled=0x50000`) and Wi-Fi jitter
were the hardware fixes (PSU/hub + Ethernet), now done. Decision for Part B:
**Docker as written, tune later** (accept 1 GB is tight; add swap/native only if
it thrashes). See memory `project-poc-hardware`.

---

## Open / next

- **A4 secrets** — on-Pi `.env` (Postgres creds, `SESSION_SECRET`, VAPID, CF
  token). Part C, not repo work.
- **Part B — containerize** (`apps/api/Dockerfile`, `apps/shell/Dockerfile` +
  `Caddyfile`, `docker-compose.prod.yml`) **+ E1 CI**. This is the next session on
  the deployment path and the prerequisite to actually running on the Pi — there
  are no images yet.
- **family-feed still has zero tests** (queued test addendum) — unrelated to this
  session but adjacent; the baseline migration doesn't touch it.
