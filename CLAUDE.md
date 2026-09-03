# Family OS — Master Context

A locally-hosted, plugin-native platform for family organization — chores,
scheduling, finance, smart home, and more. See [`docs/vision.md`](docs/vision.md).
("Family OS" is a provisional working title — use it consistently until renamed.)

**This file is an index, not a record.** It carries only what a cold session needs
before it reads anything else, and it is size-capped — see
[Keeping this file small](#keeping-this-file-small).

---

## Current Status

> **At most six one-line bullets.** Update at the end of every session. If a
> session's detail doesn't fit on one line it belongs in the session log.

- **Milestone:** M4.5 — Companion (M4.5/3 next); **M5/3 + M5/4 done 2026-08-23,
  PRs #124/#125** — the 16:00 dinner nudge and calendar day marks (ADR 050/066).
- **Active stories:** **M5/6 is PR #127, design gate closed 2026-08-23** — per-store
  lists, rework above the data layer. Beacon due at the December visit.
- **Deployment:** 🟢 live at `https://vireohome.app` — Pi 5 (192.168.0.42, pinned
  in NetworkManager 2026-09-02; eth0 `88:a2:9e:d4:e7:33`, router reservation still
  owed); auto-deploy + Tailscale + restic→R2 + watchdog intact. Runbook Part F/G.
- **Last session:** 2026-09-02 — auto-bug #128 (PR #130): the calendar chrome's "Add
  event" passed a null date prefill, so it always said today; it now seeds the day
  on screen. `logs/2026-09-02-dev-calendar-add-event-date.md`.
- **What's next and everything outstanding:** `docs/sessions/queue.md` — the one
  index. M4.5/3 or the M5/6 design gate next; NVMe HAT is an upgrade, not a rescue.
- **Owed in-app:** report `2b882a8c` (#128) is `triaged` and owed the `deployed`
  flip — needs a tier-4 PIN session, so only Zach can do it. Check the table.

---

## Workspace Map

| Path                       | What it is                                |
| -------------------------- | ----------------------------------------- |
| `docs/vision.md`           | The why — stable, rarely changes          |
| `docs/architecture.md`     | How pieces fit — living doc               |
| `docs/design-system.md`    | Visual language and component conventions |
| `docs/decisions/`          | ADRs — settled decisions                  |
| `docs/modules/[name]/`     | Per-module spec + progress board          |
| `docs/roadmap.md`          | Milestones and delivery status            |
| `docs/deployment.md`       | The Pi / Compose / Caddy / CI-CD runbook  |
| `docs/fix-it-playbook.md`  | Fixing a reported bug end to end          |
| `docs/sessions/queue.md`   | What to run next — the session queue      |
| `docs/sessions/kickoffs/`  | Pre-loaded kickoff doc per queued session |
| `docs/sessions/templates/` | Recipes for writing kickoff docs          |
| `docs/sessions/logs/`      | Session output artifacts                  |

---

## Rules Every Session Follows

1. **Read this file first.**
2. **Open the kickoff doc** (`docs/sessions/kickoffs/`) — it has the pre-loaded
   context, constraints, and scope. No kickoff (ad-hoc session)? Write a minimal
   one before touching code.
3. **Check `docs/decisions/` before proposing changes to settled questions.**
4. **Do not re-litigate ADRs** — flag it in the session note; don't override.
5. **Commit an output artifact + session note before closing.**
6. **Delete the kickoff doc** after closing — it becomes the session log.
7. **Planning sessions update `docs/sessions/queue.md`** before closing.
8. **Closeout writes go to the right file** — detail to the log, next steps to the
   queue, and only the six-bullet Current Status above to this file.

---

## Formats

- **Kickoff** (`docs/sessions/kickoffs/[name].md`) — pre-session reads, scope, ACs
  or decisions to make, constraints, implementation notes, required outputs.
  Written before the session, deleted after.
- **Session note** (`docs/sessions/logs/YYYY-MM-DD-[type]-[story].md`) — what was
  decided, what was built, what was sent back and why, open questions, what the
  next session needs to know. This is where session detail lives.
- **ADR** (`docs/decisions/NNN-title.md`) — Status (Decided | Superseded),
  Decision, Why, Alternatives considered, Do not revisit unless.
- **Story progress** (`docs/modules/[name]/progress.md`) — ⬜ Not Started ·
  🔄 In Progress · ✅ Done · 🔙 Sent Back.
- **Queue entries** — 2–3 lines plus a log pointer. Never paste a summary.

---

## Conventions

**Module names:** kebab-case (`chore-engine`, `calendar`, `finance`)
**Event names:** `module.noun.verb` (`chores.task.completed`)
**Commits:** `[module/story] what changed`
**Sessions:** scoped to one story — "backend for chores/task-completion", not
"backend for chores"
**Milestones:** renumbered 2026-05-30 and again 2026-07-21; `docs/roadmap.md`
outranks any milestone number found in an older doc or log.

---

## Standing Engineering Conventions

> The always-on rules, regardless of story. Kickoffs list story-specific ADRs.
> Check your work against this list before closing.

- **Server / plugin data → TanStack Query** (ADR 013), never raw `fetch` +
  `useState`. Plugins import the hooks from `@family-os/platform` (the singleton
  that shares the shell's `QueryClient`). Profile-scope keys; invalidate on
  mutation; share a key **prefix** between a module's page and its widget so one
  invalidation refreshes both.
- **UI → `@family-os/ui` components + design tokens** (ADR 012,
  `design-system.md`). Plugins are styled utility-first like the shell (ADR 035) —
  the shell `@source`-scans `plugins/*/src`. Never raw px sizes, hardcoded colours,
  or reimplemented primitives.
- **A member's colour is assigned, not derived** (ADR 044). Use
  `resolveHue(name, profile.identityHue)`; the hue is persisted, unique, and on
  every payload carrying a person — `nextFreeHue` returning `null` means say the
  palette is full, never double a colour. Watch the silent failure: rebuilding a
  profile as an object literal and dropping `identityHue` passes every grep and
  still hashes. Full rules: `design-system.md` §"Member identity palette".
- **Colour is the primary identity channel, not the only one** (ADR 044). Hue-only
  separation owes a second channel, and judge a colour on the layer that renders
  it — quoted at `base`, painted at `tint`. Identity tokens live in **three**
  theme blocks; grep all three. See design-system.md §"Member identity palette".
- **The spine carries the identity; the avatar carries the face** (ADR 042). An
  avatar can hold a photograph, so it is not a colour signal — never delete a row's
  spine because it has an avatar. Any surface showing more than one person at once
  owes a hue element of its own.
- **Identity takes the edge; status takes the field** (ADR 043). On a multi-person
  row the spine is the identity hue in every state and status goes to the field
  (wash, badge, red meta, dim + strikethrough, check). On a single-person surface
  the spine encodes status. See `design-system.md` §"Status vs identity colour".
- **Never hand-roll a row or a page frame.** `ItemCard` owns the row skeleton and
  its affordances (`onActivate`, `RowActions`, `MemberGroupHeader`); pages compose
  `PageContainer width="prose|list|wide|full"` and padding is not a prop. A list is
  not prose.
- **A widget list fits its slot, it does not crop** — `useFitRows` (whole rows +
  `+N more`). It is height-based, so it needs a height-constrained flex child; a
  document-scrolled page clamps by count instead.
- **Render design explorations inside the real components**, not only against each
  other — an exploration that compares only its own options cannot see redundancy
  with what already exists.
- **No blind `catch {}` on a path a family member can reach.** A swallowed error is
  invisible in a house with no devtools and costs a round trip through a real
  person with a real phone. Catch to recover, never to hide: `console.error` the
  reason even when the recovery is correct (ADR 046's ring buffer is only worth
  what reaches it), and surface it in the UI where a user is waiting on the outcome.
- **Permissions → CASL namespaced subjects + `PERMISSION_REGISTRY`** (ADR 018).
- **Events → `module.noun.verb`** (kebab-case segments, enforced by the bus);
  **widgets → manifest + Query cache invalidation** (ADR 022).
- **New plugin → mirror the `family-feed` structure** (db export, prisma config,
  federation singletons, manifest); register it in `plugins.json`,
  `load-plugin.ts`, `federation.d.ts`, the shell `ICON_MAP`, **and `Home.tsx`
  `WIDGET_META`** — a widget silently drops without that fifth one.

---

## Session Templates

`docs/sessions/templates/` — `product` · `design` · `architecture` ·
`development` · `qa` · `audit`. Recipes for writing kickoff docs, not forms to
fill out live.

---

## Keeping this file small

**Budget: 200 lines and 12 KB.** `scripts/check-context-budget.sh` enforces it —
it runs in CI on every PR and as a `PostToolUse` hook after any edit here, and it
fails the change rather than warning.

Every session pays for this file before it reads anything else, so it holds
pointers and standing rules only. When something doesn't fit, move it — never
raise the cap:

| Content                    | Home                     |
| -------------------------- | ------------------------ |
| What happened in a session | `docs/sessions/logs/`    |
| What's next, what's owed   | `docs/sessions/queue.md` |
| Why something is settled   | `docs/decisions/`        |
| How to run or deploy       | `docs/deployment.md`     |
| Visual language            | `docs/design-system.md`  |

Adding a rule here means retiring or absorbing one. If the Standing Engineering
Conventions can't be read in a minute, they aren't standing conventions.
