# Family OS — Master Context

> **Working title.** "Family OS" is provisional — use consistently
> throughout until renamed, then find-replace globally.

A locally-hosted, plugin-native platform for family organization —
chores, scheduling, finance, smart home, and more. Designed to grow
with the family that runs it. See [`docs/vision.md`](docs/vision.md).

---

## Current Status
- **Milestone:** M0 — Foundation (in progress)
- **Active stories:** None — M0 stories defined, none started
- **Last session:** 2026-05-29 — Widget Composition Design (ADR 022: left sidebar nav, 6-size widget taxonomy, React Grid Layout, manifest registration shape, role-aware composition, layout persistence user model)
- **Next session:** Visual Language Design — see `docs/sessions/queue.md`

> Update this section at the end of every session.

---

## Workspace Map

| Path | What it is |
|---|---|
| `docs/vision.md` | The why — stable, rarely changes |
| `docs/architecture.md` | How pieces fit — living doc |
| `docs/design-system.md` | Visual language and component conventions |
| `docs/decisions/` | ADRs — settled decisions |
| `docs/modules/[name]/` | Per-module spec + progress board |
| `docs/sessions/queue.md` | What to run next — the session queue |
| `docs/sessions/templates/` | Session kickoff templates by type |
| `docs/sessions/logs/` | Session output artifacts |
| `docs/roadmap.md` | Milestones and delivery status |

---

## Rules Every Session Follows

1. **Read this file first**
2. **Read the relevant module spec and story before touching anything**
3. **Check `docs/decisions/` before proposing changes to settled questions**
4. **Do not re-litigate ADRs** — if a decision needs revisiting, flag
   it in your session note; don't just override it
5. **Commit an output artifact + session note before closing**
6. **Planning sessions must update `docs/sessions/queue.md`** before closing

---

## Formats

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

## Session Templates
`docs/sessions/templates/` — one file per type:
`product` · `design` · `architecture` · `backend` · `frontend`
· `qa` · `planning`

Write each template before the first session of that type, not all upfront.
