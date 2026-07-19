# 2026-07-18 — Planning: Audit + Queue Trim

**Type:** planning / audit · Ad-hoc (no kickoff). Docs-only; no code touched.

## Scope

Cross-document consistency audit (per `templates/audit.md`) plus two user-requested
restructures: aggressively trim the session queue, and prioritize the deferred list
into a dedicated backlog.

## Issues found and resolved

| #   | Issue                                                                                                                                       | Fix                                                                                                              |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| 1   | Queue "Up Next" header framed dev as just-unblocked ("start with #1") when 6/7 stories were done; every completed story carried a paragraph | Rewrote `queue.md` — see restructure below                                                                       |
| 2   | `architecture.md` Settled Decisions table stopped at ADR 034; ADRs 035–044 absent                                                           | Added rows 035–044                                                                                               |
| 3   | `architecture.md` profiles schema missing `identity_hue` (ADR 044) + the `profile_images` table (ADR 042)                                   | Added both from the real migrations (`mime_type`, UNIQUE `identity_hue`); refreshed the "Last updated" header    |
| 4   | ADR 030 had no amendment banner — still "six fixed hues," `identityColor` as live helper, persisted-hue as "future"                         | Added an amendment banner citing ADR 042 + ADR 044 at the top                                                    |
| 5   | `roadmap.md` Active Milestone paragraph said "M3 Design: Calendar is next, then the dev stories"                                            | Rewrote to "one story from MVP-complete; only Event Reminders remains"                                           |
| 6   | Deferred list unprioritized; a resolved ADR (recurrence → 038) and a Done ItemCard entry were still sitting in it                           | Restructured into a grouped **Deferred Backlog**; dropped the resolved/done entries                              |
| 7   | Templates didn't require concise queue entries on closeout                                                                                  | Added the 2–3-line + pointer rule to `development`/`product`/`qa`/`audit` templates and to the `queue.md` header |

Clean (no issue): `design-system.md` To Be Defined table; `CLAUDE.md` current status;
milestone sequencing; owed-ADR ordering (both gating ADRs queued ahead of their stories).

## Queue restructure

- **Recently Completed** — all ~50 entries collapsed to one line each (headline + log
  pointer). The full detail already lives in the linked logs.
- **Up Next** — reduced to the two live threads: Event Reminders (story 6, last MVP
  story) and the family-feed test addendum.
- **Deferred Backlog** — new grouped section: Owed ADRs (external-ingest, member
  capacity) · Platform v2 (SW cache strategy, family-profile notifications, push
  multi-profile device) · Tooling/tech-debt (validation audit, generator hardening,
  Storybook→Tailwind, family-wall typography). Each one-lined.
- **Dropped:** Retry Design-Sync (blocked on a converter bug, tooling-only, no
  near-term value — recoverable from the 2026-06-19/20 logs if revived); the resolved
  recurrence-storage owed-ADR entry; the "Done" ItemCard entry.

## Decided

- **Pressing vs deferred:** only the reminder-scheduling ADR is pressing (gates the
  next + last MVP story) — it stays folded into the Up Next / Event Reminders entry.
  Everything else is genuinely deferrable and now sits in the backlog.

## Next session

Unchanged: **M3 Dev — Event Reminders (story 6)**, resolving the reminder-scheduling
ADR first. Then the M3 MVP is complete.
