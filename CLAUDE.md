# Family OS — Master Context

> **Working title.** "Family OS" is provisional — use consistently
> throughout until renamed, then find-replace globally.

A locally-hosted, plugin-native platform for family organization —
chores, scheduling, finance, smart home, and more. Designed to grow
with the family that runs it. See [`docs/vision.md`](docs/vision.md).

---

## Milestone Numbering

> **Note:** Session logs prior to 2026-05-30 use pre-audit milestone numbering (old M1=Chores, M2=Calendar, M3=Smart Home, M7=Marketplace). The roadmap was restructured on 2026-05-30 to introduce M1 Platform Shell and renumber all subsequent milestones. `docs/roadmap.md` is authoritative — treat it as the source of truth over any milestone number found in session logs.

---

## Current Status

- **Milestone:** M2 — Chores (dev in progress — 2 of 5 stories done)
- **Active stories:** None (Completion Flow ✅ closed)
- **Last session:** 2026-06-18 — Architecture: Plugin Styling (ADR 035). Settled the plugin styling standard (raised in PR #20 review). **Option 1:** first-party plugins are styled **utility-first like the shell** — the shell's `styles.css` gains `@source "../../../plugins/*/src/**/*.{ts,tsx}"` so plugin utility classes emit (plugins are JS-only federated remotes rendered against the shell's single stylesheet; their utilities were silently no-op'ing — the `grid`/`place-items-center` completion-circle bug). Brings the shell to **parity with Storybook**, which already scanned plugins. **Third-party plugins → deferred Option 2** (per-plugin utilities-only Tailwind build with the remote) when community distribution is scoped — named in ADR 035, not built. **Reconciliation done now** (user opted in; kickoff had it as a fast-follow): migrated chore-engine (9 components) + family-feed (5) from inline `var(--token)` chrome to utilities at exact visual parity — dynamic identity/gold/animation values + `container-type: size` stay inline. `CLAUDE.md` + `design-system.md` updated. Verified: canary `h-64` emits with the `@source` and not without; typecheck + lint + both plugin builds green; live review confirmed parity. No backend change. **Keep shell + Storybook `@source` in sync.** Open: `turbo gen plugin` bug; Option 2 ADR owed (community plugins).
- **Next session:** M2 Dev: XP Award + Parent Notification

> Update this section at the end of every session.

---

## Workspace Map

| Path                       | What it is                                |
| -------------------------- | ----------------------------------------- |
| `docs/vision.md`           | The why — stable, rarely changes          |
| `docs/architecture.md`     | How pieces fit — living doc               |
| `docs/design-system.md`    | Visual language and component conventions |
| `docs/decisions/`          | ADRs — settled decisions                  |
| `docs/modules/[name]/`     | Per-module spec + progress board          |
| `docs/sessions/queue.md`   | What to run next — the session queue      |
| `docs/sessions/kickoffs/`  | Pre-loaded kickoff doc per queued session |
| `docs/sessions/templates/` | Recipes for writing kickoff docs          |
| `docs/sessions/logs/`      | Session output artifacts                  |
| `docs/roadmap.md`          | Milestones and delivery status            |

---

## Rules Every Session Follows

1. **Read this file first**
2. **Open the kickoff doc** (`docs/sessions/kickoffs/`) for this session — it has the pre-loaded context, constraints, and scope. If no kickoff exists (ad-hoc session), write a minimal one before touching code.
3. **Check `docs/decisions/` before proposing changes to settled questions**
4. **Do not re-litigate ADRs** — if a decision needs revisiting, flag
   it in your session note; don't just override it
5. **Commit an output artifact + session note before closing**
6. **Delete the kickoff doc** for this session after closing (it becomes the session log)
7. **Planning sessions must update `docs/sessions/queue.md`** before closing — add a kickoff stub for any new sessions queued

---

## Formats

### Kickoff Docs (`docs/sessions/kickoffs/[session-name].md`)

Written before the session opens. Contains: pre-session reads, scope statement,
ACs or decisions to make, constraints coming in, implementation notes (if dev),
and the required outputs checklist. Deleted after the session closes (its content
lives in the session log). Template recipes are in `docs/sessions/templates/`.

### Session Notes

Committed to `docs/sessions/logs/YYYY-MM-DD-[type]-[story].md`:

- What was decided
- What was built or produced
- What was sent back and why (if anything)
- Open questions raised
- What the next session needs to know

### ADRs (`docs/decisions/NNN-title.md`)

- **Status** — Decided | Superseded
- **Decision** — what was chosen
- **Why** — rationale
- **Alternatives considered**
- **Do not revisit unless** — what would justify reopening

### Story Progress (`docs/modules/[name]/progress.md`)

Statuses: ⬜ Not Started · 🔄 In Progress · ✅ Done · 🔙 Sent Back

---

## Conventions

**Module names:** kebab-case (`chore-engine`, `calendar`, `finance`)
**Event names:** `module.noun.verb` (`chores.task.completed`)
**Commits:** `[module/story] what changed`
**Sessions:** scoped to one story — not "backend for chores module"
but "backend for chores/task-completion story"

---

## Standing Engineering Conventions

> Cross-cutting decisions that bind **every** dev session, regardless of the
> story. Kickoffs list story-specific ADRs; these are the always-on ones a cold
> session must not miss. Check your work against this list before closing.

- **Server / plugin data → TanStack Query** (ADR 013). Never raw `fetch` + `useState`.
  Plugins import `useQuery` / `useMutation` / `useQueryClient` / `useInfiniteQuery`
  from `@family-os/platform` (the singleton path that shares the shell's
  `QueryClient`). Profile-scope query keys; invalidate on mutation. Share a key
  **prefix** across a module's page and its widget (e.g. `['chores/tasks']` +
  `['chores/tasks', 'widget']`) so one invalidation refreshes both.
- **UI → `@family-os/ui` (shadcn/Radix) components + design tokens** (ADR 012,
  `design-system.md`). Use `Button`/`Badge`/`Input`/`Label`/etc. and typography
  token utilities — never raw px font sizes, hardcoded colors, or reimplemented
  primitives. **Plugins are styled utility-first, same as the shell** (ADR 035):
  the shell's Tailwind `@source`-scans `plugins/*/src`, so `className` utilities,
  `hover:`/`focus:` variants, and container queries all emit — no per-plugin CSS
  setup. Colors/fonts still go through tokens (`bg-primary`, `var(--token)`), never
  hardcoded values. (First-party only; third-party plugin CSS is a future Option-2
  per-plugin build — see ADR 035.)
- **Member colors → identity palette helpers** (`identityColor`, ADR 030) — never
  invent hues.
- **Permissions → CASL namespaced subjects + `PERMISSION_REGISTRY`** (ADR 018).
- **Events → `module.noun.verb`**; **widgets → manifest + Query cache invalidation** (ADR 022).
- **New plugin → mirror the `family-feed` structure** (db export, prisma config,
  federation singletons, manifest); register in `plugins.json`, `load-plugin.ts`,
  `federation.d.ts`, and the shell `ICON_MAP`.

---

## Session Templates

`docs/sessions/templates/` — one file per type:
`product` · `design` · `architecture` · `development` · `qa` · `audit`

Templates are recipes for writing kickoff docs, not docs to fill out live.
All six types now exist.
