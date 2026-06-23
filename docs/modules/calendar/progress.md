# Calendar — Progress

---

## M3 — Calendar · 🔄 In Progress

> **Milestone done when:** The family stops using a separate calendar for
> day-to-day scheduling.

Stories are dependency-ordered. **M3 Design: Calendar** runs after this planning
session and before the dev stories (it locks the month-view UX, event surface,
identity-on-events, and the widget). Stories 1–7 are the M3 MVP; story 8 is the
deferred north star (its model lands in story 1; the build is later).

| #   | Story                                                       | Status         | Notes                                                                                                                                                                                                                     |
| --- | ----------------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | [Event Model + Plugin Scaffold](stories/event-model.md)     | ✅ Done        | `calendar` plugin; `events` + `event_attendees` + `event_exceptions`; weekly recurrence (computed-on-read, ADR 038) + per-occurrence skip; attendees join; CRUD API; events + permissions namespaces. 2026-06-23 (PR #27) |
| 2   | [Tablet Month View](stories/tablet-month-view.md)           | ⬜ Not Started | Glanceable month grid; color-by-owner; truncation (`+N more`); drill to week/day                                                                                                                                          |
| 3   | [Event Create / Edit](stories/event-create-edit.md)         | ⬜ Not Started | One reused drawer form; owner/Family, time, recurrence, span; tier 4                                                                                                                                                      |
| 4   | [Mobile Event Creation](stories/mobile-event-creation.md)   | ⬜ Not Started | The create surface on the mobile PWA — unify capture                                                                                                                                                                      |
| 5   | [Recurring Activities](stories/recurring-activities.md)     | ⬜ Not Started | Recurring series surfaced/managed as named **Activities** (first-class)                                                                                                                                                   |
| 6   | [Event Reminders](stories/event-reminders.md)               | ⬜ Not Started | Time-based reminders via `platform.notify()` + Web Push — the rung that retires Google                                                                                                                                    |
| 7   | [Up Next Widget](stories/up-next-widget.md)                 | ⬜ Not Started | `calendar.up-next` (family + mine framings, sizes, empty states); fills the reserved slot                                                                                                                                 |
| 8   | [Suggested Events Inbox](stories/suggested-events-inbox.md) | ⬜ Deferred    | North star — model lands in #1; email/newsletter parsing build is post-MVP                                                                                                                                                |

> **Owed ADRs** (logged in the queue): ~~recurrence storage model (gates #1)~~ →
> **resolved, ADR 038**; reminder scheduling mechanism (gates #6), external-ingest
> extension point (gates #8). Resolve each before the dependent dev story opens.
