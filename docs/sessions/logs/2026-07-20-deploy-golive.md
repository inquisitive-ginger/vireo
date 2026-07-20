# 2026-07-20 — Deploy: Part C go-live + day-picker prod fix

**The app is live.** `https://vireohome.app` serves Family OS from the Pi 3B over
a real Let's Encrypt cert, installed as a PWA on the fridge iPad and a phone.
This log covers Part C (provision + bring-up) and the first prod bug found + fixed
during go-live. Mostly-manual infra done over SSH from the Mac; not a code PR
except the fix (PR #43).

---

## Part C — provisioned the Pi and brought the stack up

- **Access:** key-based SSH from the Mac (`ssh-copy-id`), passwordless sudo (Pi OS
  default). The Pi is on **Ethernet** now — `192.168.0.31` (set a DHCP reservation).
- **Docker** installed via `get.docker.com` (29.6.2), user added to `docker` group.
- **`/opt/family-os/`** holds `docker-compose.prod.yml` + `.env` (chmod 600).
  Secrets generated on the box (`openssl` for Postgres pw + `SESSION_SECRET`), a
  fresh **VAPID** pair generated on the Mac (Pi has no Node) and transferred.
- **Domain/DNS:** `vireohome.app` moved to Cloudflare (apex, not a `family.`
  subdomain — `APP_HOST=vireohome.app`). A scoped **Zone:DNS:Edit** token drives
  Caddy's DNS-01. Created the apex **A record → 192.168.0.31, DNS-only** via the
  CF API. **Gotcha:** a leftover proxied **parking A record** (Namecheap
  `162.255.119.42`, imported when the zone was added) co-existed at the apex and
  caused **522s** — deleted it; only the DNS-only record remains.
- **GHCR:** images are **private** (the api image ships source for the tsx
  runtime), so the Pi `docker login ghcr.io` with a `read:packages` PAT before it
  can pull.
- **Bring-up:** `docker compose pull && up -d`. Postgres healthy → api entrypoint
  ran `migrate deploy` across all four schemas on the fresh DB → `tsx` booted →
  **Caddy obtained the `vireohome.app` cert via DNS-01 in ~9s**. Verified end-to-end:
  `/` and `/api/auth/me` → 200, cert `CN=vireohome.app` issued by Let's Encrypt.
- **PWA:** installed via Safari Share → Add to Home Screen (no install prompt on
  iOS — it's manual, and the Share button is top-toolbar on iPad). Fresh prod DB
  ⇒ first launch is the **family onboarding flow**. iPad initially showed **1002**
  (stale cached proxied answer) — cleared by flushing its DNS (Airplane toggle).

## The day-picker prod bug (PR #43)

First real prod bug, visible only on the deployed build: the calendar date-picker
rendered **unstyled** (cramped/overlapping day grid). Root cause is systemic —
`packages/ui/src/components/calendar.tsx` imported `react-day-picker/style.css` +
`./calendar.css` as **JS side-effects inside `@family-os/ui`**, so in the federated
build those split into the `ui` shared-chunk CSS (`ui-*.css`) that the plugin
runtime **never links**. Tailwind _utility_ classes survive (shell `@source` scan
→ main CSS); real imported stylesheets don't → the `.rdp-*` rules built into an
orphaned, unloaded file. This is ADR 035's third-party-CSS gap, made concrete.

**Fix:** move both `@import`s into `packages/ui/src/styles.css` (rdp base first,
override second), which the shell and Storybook both fold into their always-loaded
global stylesheet. Verified the `.rdp-*` rules now land in the linked main CSS
instead of the orphaned chunk; ui typecheck + 167 tests green. Deployed via the
full path (PR #43 → CI → merge → `release.yml` rebuild → manual `pull && up -d` on
the Pi) and confirmed live: the served `index-*.css` contains `.rdp-day`, picker
renders correctly on the iPad. Rule banked as memory `project-federation-thirdparty-css`.

## Notables

- **Deploy briefly 502s** the API (~40s) on every recreate — the entrypoint reruns
  the migrate sweep + `tsx` startup before binding. Fine for a home box; a startup
  healthcheck would smooth it.
- **arm64 release builds are slow** (~15 min) — QEMU emulation of the full
  monorepo install + Vite build, no layer cache, two images. See "Open / next".
- **No auto-deploy yet** — E3 (self-hosted runner) isn't set up, so shipping a fix
  is: merge → wait for `release.yml` → manual `pull && up -d` on the Pi.

## Open / next

- **E3 — self-hosted runner + `deploy.yml`** so merges auto-deploy (retires the
  manual pull).
- **Part F — offsite backups**: nightly `pg_dump` off the Pi (the whole household
  lives in that one Postgres volume — currently **no backup**). This is the most
  important follow-up.
- **Speed up CI images**: build JS natively → copy into a thin arm64 runtime,
  and/or add buildx cache, and/or use arm64 hosted runners.
- **family-feed still has zero tests** (queued).
