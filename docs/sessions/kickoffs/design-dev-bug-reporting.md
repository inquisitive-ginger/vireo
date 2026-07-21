# Kickoff — Design + Dev: In-situ Bug Reporting ("Report a problem")

**Type:** design + development (ad-hoc) · **Date:** 2026-07-20

---

## Why this session

The app is **live** on the fridge iPad and a phone. The people using it are not
the person who can fix it, and the gap between "this is broken" and a patch is
currently a verbal report to Zach that loses every detail that would make the bug
reproducible — which route, which build, which profile, what the console said.

This session builds the surface that closes that gap, and wires it to the
already-existing deploy path so a report can become a live fix.

## Scope

**In:**

- An in-app **Report a problem** surface reachable from every screen.
- **Automatic context capture** — the repro material a fixer actually needs.
- A `platform.bug_reports` table + API.
- A **status round-trip** so the reporter watches their bug move and is told when
  it ships.
- A **tier-4 triage board**.
- A best-effort **GitHub issue bridge** + the **fix-it playbook**.

**Out:**

- Screenshot capture (v2 — needs a client capture dep + image storage).
- An autonomous fix agent (documented as the upgrade path, not built).
- Any change to `release.yml` / `deploy.yml`.

## Decisions taken at the gate (user-approved)

| Decision           | Choice                              | Why                                                                                                                        |
| ------------------ | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Entry point**    | Notification tray footer            | The tray is already the "needs attention" surface. Reachable everywhere; no floating button over content.                  |
| **Who can report** | **Everyone, tier 1 included**       | A stuck kid is exactly who needs to report. `notify()` still gates the ping at tier 2+; tier 1 sees status in-app.         |
| **Screenshot**     | Skip for v1 — context only          | Route + build hash + console errors already carry a strong repro. Ship the loop first.                                     |
| **Automation**     | Bridge wired best-effort + playbook | Auto-merging patches to a live family app unattended is a trust step to earn. Manual fix session now, GitHub Action later. |

## Decision to make in-session

**ADR 046** — how a report becomes a fix, and what the app promises the reporter.
Specifically: what context is captured (and what is deliberately not), where the
status lives, and why the GitHub issue is the bridge rather than a queue we own.

## Constraints coming in

- **Standing conventions apply** — TanStack Query (ADR 013), `@family-os/ui`
  primitives + tokens (ADR 012/035), Zod schemas in `@family-os/schemas`,
  CASL namespaced subjects (ADR 018).
- **ADR 043** — identity takes the edge, status takes the field. The triage board
  is a multi-person surface: the **spine is the reporter's hue in every state**,
  and status goes to the row's field (a pill), never the spine.
- **ADR 044** — `resolveHue(name, profile.identityHue)`; the hue must travel on
  any payload carrying a person. The triage row carries a reporter.
- **Never hand-roll a row or a page frame** — `ItemCard` + `PageContainer`.
- `notify()` returns `null` below tier 2. Tier-1 reporters therefore get **no**
  notification; their status must be legible in-app or the loop is broken for them.
- **No new dependencies.**

## Acceptance criteria

1. Any profile, **any tier**, can open the report drawer from the notification
   tray on any screen and submit a description.
2. The submitted report carries, without the user typing it: route, profile id +
   name + tier, app build hash, viewport, user agent, and recent console errors.
3. The report persists to `platform.bug_reports` with status `new`.
4. If a GitHub token is configured, a labelled issue is opened and its number is
   stored on the row; if not, the report still saves (best-effort, never blocks).
5. A reporter can see their own reports and each one's current status.
6. Tier 4 sees **all** reports on a triage board, spine-coded by reporter, and can
   move a report's status.
7. Moving a report to `deployed` notifies the reporter (tier 2+) that it is live.
8. Tier 1 can report and can see status, but is never sent a notification.

## Required outputs

- [ ] ADR 046
- [ ] Migration + schema
- [ ] API plugin + tests
- [ ] UI surfaces + tests
- [ ] `docs/fix-it-playbook.md`
- [ ] Live review + sign-off before closeout
- [ ] Session log, progress, queue, CLAUDE.md status
