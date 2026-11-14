# Vireo — Master Context

A locally-hosted, plugin-native platform for family organization — chores,
scheduling, finance, smart home, and more. See [`docs/idea.md`](docs/idea.md).

**This file is an index, not a record.** It carries only what a cold session needs
before it reads anything else, and it is size-capped — see
[Keeping this file small](#keeping-this-file-small).

---

## Process (Throughline)

Built through short numbered sessions. Zach operates and approves. Config and the
loop contract: `.claude/process.json`. Where things stand: `/status`.

Read first, every session: `docs/idea.md`, `docs/roadmap.md`, `docs/decisions.md`
(locked; never contradict one, reopen only when Zach asks and log the reversal as a
new entry), `docs/brief.md`, `docs/reference/README.md`.

Loop: `/session-start <n>` → decide: options on a board · build: implement the cited
decisions, walkthrough, acceptance board · verify: checklist board → `/lock-in`
(which replans and refreshes status). Reported problems: `/triage` routes the open
`auto-bug` issues into the roadmap.

- Features are `F-###` (`idea.md`), decisions `D-###` (`decisions.md`; D-001–D-074
  are the ADRs, same numbers). Build sessions cite the D-IDs they implement.
- Tests protect decisions: every machine-observable acceptance check and every
  testable rule in a decision gets an automated test whose name cites its IDs
  (`D-002 … [F-001]`, or the report for a fix: `#152 …`). No lock or merge on a
  failing suite. Look, feel and wording stay human calls on the board.
- `docs/sessions/NN-*.md`: one file per session. `docs/artifacts/`: source of every
  board and the dashboard; `_kit/` holds the board runtime. Before 2026-11-14:
  `docs/sessions/logs/` and `docs/history/`.
- Locked results go to their source of truth per `lockRouting`. Don't hard-code
  copy in components.
- Accessibility is a requirement: WCAG 2.2 AA contrast, semantic HTML,
  keyboard-usable.
- Commits: the kit's messages for process commits; `[module/sNN] what changed` for
  code inside a session.

---

## Workspace Map

| Path                      | What it is                                         |
| ------------------------- | -------------------------------------------------- |
| `docs/idea.md`            | Problem, users, features (F-###), non-goals        |
| `docs/roadmap.md`         | Sessions, fixes, enhancements                      |
| `docs/decisions.md`       | Every decision (D-###); the ADRs are the records   |
| `docs/architecture.md`    | How pieces fit — living doc                        |
| `docs/design-system.md`   | Visual language and component conventions          |
| `docs/modules/[name]/`    | Per-module spec and assets                         |
| `docs/deployment.md`      | The Pi / Compose / Caddy / CI-CD runbook           |
| `docs/fix-it-playbook.md` | The bug-report bridge: setup, outages, what's owed |

---

## Conventions

**Module names:** kebab-case (`chore-engine`, `calendar`, `finance`)
**Event names:** `module.noun.verb` (`chores.task.completed`)
**Milestones** (before 2026-11-14) were renumbered twice;
`docs/history/roadmap-milestones.md` outranks a milestone number in an older doc or log.

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
- **Never hand-roll a row, a page frame, or a page title.** `ItemCard` owns the row
  skeleton and its affordances (`onActivate`, `RowActions`, `MemberGroupHeader`);
  pages compose `PageContainer width="prose|list|wide|full"` and padding is not a
  prop. A list is not prose. The frame insets and budgets for nothing it cannot
  see; `PageHeader` owns the title, its lead and its nav strip, and `SectionLabel`
  the space around a group label (ADR 074). `scripts/check-spacing.sh` enforces the
  token layer in CI — raw type, raw radii, bracket spacing that derives from neither.
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

## Keeping this file small

**Budget: 200 lines and 12 KB.** `scripts/check-context-budget.sh` enforces it —
it runs in CI on every PR and as a `PostToolUse` hook after any edit here, and it
fails the change rather than warning.

Every session pays for this file before it reads anything else, so it holds
pointers and standing rules only. When something doesn't fit, move it — never
raise the cap:

| Content                    | Home                    |
| -------------------------- | ----------------------- |
| What happened in a session | `docs/sessions/NN-*.md` |
| What's next, what's owed   | `docs/roadmap.md`       |
| Why something is settled   | `docs/decisions/`       |
| How to run or deploy       | `docs/deployment.md`    |
| Visual language            | `docs/design-system.md` |

Adding a rule here means retiring or absorbing one. If the Standing Engineering
Conventions can't be read in a minute, they aren't standing conventions.
