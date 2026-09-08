# 2026-09-07 — Audit: the standing docs against the code

**Type:** audit · **Trigger:** ad-hoc (Zach) — "run an audit session and clean up any
stale docs. code is the authority."

## What it covered

Every standing doc read against the tree: `architecture.md`, `design-system.md`,
`roadmap.md`, `vision.md`, `deployment.md`, `fix-it-playbook.md`, `CLAUDE.md`, all
eight progress boards, all seven module specs, all 74 ADRs. Plus two mechanical
sweeps — every backticked file path and every internal `.md` link.

## Clean

`design-system.md` (current through ADR 074), `vision.md`, `fix-it-playbook.md`, every
progress board, all ADR statuses and byte caps, every doc link, every file reference.
The `family-os` names in the deployment and fix-it docs are **correct, not stale** —
the repo, the GHCR images, the databases and `/opt/family-os` all still carry the old
name deliberately (ADR 065, `vision.md` §Name).

## What had drifted

**`architecture.md`'s Platform API section was the whole problem.** It described a
package that no longer exists:

- **Server exports were fiction.** `createEventBusPlugin` and `getEventBus` are not
  exported and never were by that name. The real surface is `createEventBus`,
  `createAbility`, `createDayMarkRegistry`, `prisma`. `apps/api` registers its own
  `plugins/event-bus` and decorates `app.eventBus`.
- **`EventBus` was missing `emitAndAwait`** — the contract-event dispatch ADR 069 §4
  turns on, shipped in PR #133 — and `onAny`, and `on`'s unsubscribe return.
- **Client exports were missing the TanStack Query re-exports**, which is what the
  ADR 013 standing convention actually depends on: plugins import the hooks from the
  singleton so they share the shell's `QueryClient`. A convention every session is told
  to follow was undocumented at its source.
- `useAuth()` was documented as three fields; `AuthUser` carries nine.
- `PERMISSION_REGISTRY` was inlined with 6 of its 24 keys.
- `PluginManifest` was missing `navItem` (ADR 032, shipping since M3).
- The `platform` schema table omitted `push_subscriptions`, `notifications`, `sessions`.
- The manifest example and the generator table had both fallen behind.

The Settled Decisions table also stopped at ADR 064 — ten missing.

Elsewhere: `roadmap.md` still had M5.5 "in flight" with offline as the last story;
`shopping/spec.md` said the same; `deployment.md` had a clause pointing at a Pi 4 that
left the title in the 2026-09-03 rename.

## The finding worth keeping

**A byte cap and an aligned Markdown table are in direct conflict.** `architecture.md`
blew its 44,000-byte budget adding ten table rows — and **13,347 of its bytes were
Prettier's trailing spaces**, which pad all 74 rows to the width of the single longest
one. Median row content was 199 chars; the padding was 368. Fifteen rows had grown into
paragraphs, and each one taxed the other 59.

Trimming those fifteen to ~250 chars dropped the pad for every row: **48,841 → 40,471**,
with 3.5 KB of headroom. No meaning left the repo — it is all in the ADRs.

The general rule, worth applying before the next cap failure: **in a padded table, a
long row is not a local cost.** Check the widest row before assuming the file is full.

## The other principle applied

Two of these fixes deleted content rather than correcting it: the `PERMISSION_REGISTRY`
literal and (implicitly) the argument for the rest. **A doc that mirrors code drifts by
default.** The registry is now a one-paragraph description of the shape plus a pointer
to `packages/platform/src/types.ts`; it cannot go stale on the next plugin the way it
had on the last seven.

## Docs amended

`architecture.md` (the Platform API section rewritten, ADR rows 065–074 added, fifteen
trimmed), `roadmap.md`, `modules/shopping/spec.md`, `deployment.md`, `CLAUDE.md`.

## No code changes

The audit read the code; it did not touch it.
