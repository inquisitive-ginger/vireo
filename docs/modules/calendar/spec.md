# Calendar — Module Spec

> Spec written in M3 Product Planning session (2026-06-21), opened by a
> requirements brainstorm against the family's real paper wall calendar.

---

## What it is

The calendar module is a **tablet twin of the family's paper wall calendar** — a
glanceable, color-by-person month grid that holds the family's recurring activity
backbone and one-off events, captures events from a phone, and reminds the family
of what's coming. It does **not** replace the analog calendar (the main user
prefers paper, and it stays on the wall); it **augments** it by doing the three
things paper can't: hold recurrence reliably, capture from mobile, and notify.

The product thesis, from the brainstorm: the "separate calendar" the family is
trying to retire (Google) is really a **notification engine** — appointments are
duplicated there "to capture the notification aspect." So the wedge is _mirror the
paper beautifully + capture-once + remind_, not a from-scratch interaction model.

## M3 scope (MVP)

- **One shared family calendar** (not per-member calendars) — mirrors the single
  paper surface
- **Event ownership / attendees:** an event has **0+ attendees**. **One** → that
  member's identity hue fills the event; **2+** (a couple's date night, siblings'
  shared appointment, a multi-kid camp) → a **split fill** of each attendee's hue
  (hard-stop segments — pulled into M3 scope 2026-06-22 via the design gate, having
  been deferred at planning); **none** → a **Family** event (whole-house, neutral
  pill + a people glyph). Reproduces the highlighter color-coding 1:1.
- **Event shape:** all-day **and** timed events; **multi-day spanning** events
  (the travel/camp arrows — "Zach to London →", "FISW camp") are first-class
- **Simple weekly recurrence:** "every Tuesday at 5:15" with an optional end date.
  Per-occurrence edits/skips are deferred
- **Recurring activities are first-class — as a _load lens_, not just a list**
  (refined in M3 Design, 2026-06-22). An **Activity** is not "an event that
  repeats" (events repeat too); it's a **standing commitment a specific person
  has taken on, over a season, that counts toward how busy they are** — T&T,
  gymnastics, **Vision Therapy**, speech/OT. A recurring _event_ (trash day,
  Sunday dinner) just lands on the calendar again and nobody carries it as load.
  - **Derive, don't categorize:** users never choose "event vs activity." Any
    **weekly-recurring event owned by a person** _is_ an activity and appears in
    their roster automatically; Family / un-owned / one-off recurring things do
    not. The Activities surface is a **lens** on the calendar, not a separate
    object type. ("Add activity" just opens the event drawer with repeat-weekly on.)
  - **Why it earns its keep** (what paper/month-grid can't answer): a per-person
    **weekday-load** read (committed days filled in their hue → over/under-booking
    at a glance) and a family **season timeline** (bars to each activity's end →
    "what frees up in November / can we start something new?"). This is the unique
    value over the analog calendar. _Connects to the owed **member-capacity ADR**
    (chores): a child's true load is chores + activities; Activities is capacity's
    first consumer._
- **Tablet month view** (primary): glanceable month grid, color-by-owner, crowded
  days truncate (`+N more`) and drill into week/day
- **Event create/edit:** one reused form (drawer, chores pattern); tier 4 creates/edits
- **Mobile event creation:** the create surface on the mobile PWA — unify capture
  so Google duplication stops
- **Event reminders:** time-based reminders via `platform.notify()` + Web Push —
  the rung that actually retires Google
- **`calendar.up-next` widget:** today + next events; **family** framing on the
  shared tablet, **mine** framing on personal/mobile; fills the reserved Calendar
  home-surface slot (ADR 028)
- **Suggested-events model reserved:** events carry a `status` (`confirmed` |
  `suggested`) so the email/newsletter north star has a contract to land into. The
  parsing itself is **deferred** (see below)

## Explicitly deferred

- **Email / newsletter / provider-reminder parsing** → suggested events. The
  **model is reserved now** (the `suggested` status + a `source` field); the
  ingest + extraction build is a later story (north star). _Owed ADR: external-ingest
  extension point._
- **Per-occurrence recurrence edits/skips/exceptions** (move just this week's
  practice). MVP weekly repeat is uniform.
- **Complex recurrence** (every-other-week, monthly-nth-weekday, RRULE).
- **Per-occurrence attendance / streak tracking** (the antibiotics-checkmark
  pattern) — closer to a chores/health concern; not a calendar MVP feature.
- **Per-member calendars composited with show/hide toggles** — single shared
  calendar in MVP.
- **Teen self-creation / propose flow** (tier 3) — parents create in MVP, exactly
  as Chores deferred tier-3 self-assignment.
- **External two-way sync** (Google/iCal import/export) — the suggested-events /
  external-ingest extension point is where this eventually attaches.

---

## Authorship & tier

| Capability               | Tier       | Notes                                              |
| ------------------------ | ---------- | -------------------------------------------------- |
| View the calendar        | Tier 1+    | Shared wall surface — everyone reads it            |
| Create / edit / delete   | Tier 4     | Parents own the calendar (the main user is tier 4) |
| Teen self-create/propose | _deferred_ | Mirrors chores' deferred tier-3 self-assignment    |

This matches M2's authorship model (tier-4 creates; lower tiers consume). The
vision's "kids are participants" principle is honored later via a tier-3 propose
flow, not in M3 MVP.

---

## Events namespace

`calendar.event.*`

| Event                    | Published by               | Payload                                                                        |
| ------------------------ | -------------------------- | ------------------------------------------------------------------------------ |
| `calendar.event.created` | calendar on POST success   | `{ eventId, ownerId, createdBy, title, startsAt, endsAt, allDay, recurrence }` |
| `calendar.event.updated` | calendar on PATCH success  | `{ eventId, ownerId, title, startsAt, endsAt, allDay, recurrence }`            |
| `calendar.event.deleted` | calendar on DELETE success | `{ eventId, ownerId }`                                                         |

> `ownerId` is `null` for **Family** events. M5 School is the first downstream
> subscriber — school events will surface into this calendar via this namespace.
> Reminders fire through `platform.notify()` and do **not** add a calendar event
> (the firing mechanism is an owed ADR — see below).

---

## Permissions namespace

| Permission key          | CASL                              | Default baseline |
| ----------------------- | --------------------------------- | ---------------- |
| `calendar.event.view`   | `can('view', 'calendar.Event')`   | Tier 1+          |
| `calendar.event.create` | `can('create', 'calendar.Event')` | Tier 4           |

Registry-toggleable set: `view` / `create`. The tier-4 management actions below are
CASL baseline rules on `calendar.Event` (`manage`/`all`) — enforced in routes but
not individually toggleable, so no registry key (same pattern as chores):

| CASL action                       | Route                         | Default baseline          |
| --------------------------------- | ----------------------------- | ------------------------- |
| `can('update', 'calendar.Event')` | `PATCH /calendar/events/:id`  | Tier 4 (edit any event)   |
| `can('delete', 'calendar.Event')` | `DELETE /calendar/events/:id` | Tier 4 (remove any event) |

---

## Widget

### `calendar.up-next`

| Field                | Value                                                                                                                          |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `id`                 | `calendar.up-next`                                                                                                             |
| `displayName`        | Up Next                                                                                                                        |
| `defaultSize`        | `standard`                                                                                                                     |
| `supportedSizes`     | `compact`, `standard`, `large`                                                                                                 |
| `minTier`            | 1                                                                                                                              |
| `requiredPermission` | `calendar.event.view`                                                                                                          |
| `description`        | Today + the next few events. Family framing on the shared tablet; the active member's own events on a personal/mobile profile. |

Shares a query-key prefix with the calendar page (`['calendar/events']` +
`['calendar/events', 'widget']`) so one invalidation refreshes both (ADR 013).

---

## Plugin manifest shape

```json
{
  "name": "calendar",
  "schema": "calendar",
  "events": {
    "publishes": ["calendar.event.created", "calendar.event.updated", "calendar.event.deleted"],
    "subscribes": []
  },
  "routes": ["/calendar"],
  "navItem": {
    "label": "Calendar",
    "route": "/calendar",
    "icon": "calendar-days",
    "minTier": 1
  },
  "widgets": [
    {
      "id": "calendar.up-next",
      "displayName": "Up Next",
      "component": "./widgets/UpNext",
      "defaultSize": "standard",
      "supportedSizes": ["compact", "standard", "large"],
      "minTier": 1,
      "requiredPermission": "calendar.event.view",
      "description": "Today + the next few events."
    }
  ]
}
```

New plugin → mirror the existing plugin structure (db export, prisma config,
federation singletons, manifest); register in `plugins.json`, `load-plugin.ts`,
`federation.d.ts`, and the shell `ICON_MAP` (`calendar-days` → lucide
`CalendarDays`).

---

## Database schema (`calendar`)

> The exact storage shape for recurrence (the columns below vs. a separate
> `occurrences` table, and computed-on-read vs. materialized) is an **owed ADR** —
> see "Owed architecture." The shape below is the product-level model.

```
events
  id              uuid  PK
  title           text
  description     text  nullable
  -- ownership is 0+ attendees, modeled as an `event_attendees` join
  -- (event_id, profile_id): 0 rows = Family · 1 = solo (owner hue) · 2+ = shared
  -- (split fill). Supersedes a single owner_id; exact shape settled in the Event
  -- Model story (an owner_id shortcut for the 0/1 case may still be kept).
  owner_id        uuid  nullable  FK → platform.profiles.id   -- null = Family (solo-case shortcut)
  created_by      uuid  FK → platform.profiles.id
  starts_at       timestamptz                                 -- start instant; date@00:00 if all_day
  ends_at         timestamptz  nullable                        -- end; carries multi-day spans
  all_day         boolean  default false
  location        text  nullable
  recurrence      text  nullable    ('weekly' | null)          -- MVP: weekly only
  recurrence_until date  nullable                              -- inclusive end of the repeat
  is_activity     boolean  default false                       -- recurring series surfaced as an Activity
  status          text  ('confirmed' | 'suggested')  default 'confirmed'  -- reserves the email north star
  source          text  default 'manual'                       -- 'manual' now; ingest sources later
  reminder_minutes integer  nullable                           -- minutes-before to notify; null = no reminder
  created_at      timestamptz
  updated_at      timestamptz
```

- A **recurring event** is the canonical row; its weekly occurrences are derived
  for the view within the queried date range (subject to the owed recurrence ADR).
- An **Activity** is a recurring event with `is_activity = true` — same table,
  surfaced and managed as a named standing commitment. `is_activity` is **derived,
  not user-chosen**: a weekly-recurring event owned by a person sets it true
  (Family / un-owned recurring events stay false). The Activities surface filters
  on it and adds the load lens (weekday-load + season timeline).
- **Attendees drive the fill** (design session): no attendee → **Family** (neutral
  pill + people glyph); one → solo tint; 2+ → **split fill** of each attendee's hue.
- `status = 'suggested'` rows are the landing zone for the deferred email north
  star — not created by users in MVP.

---

## Home surface placement

Calendar is a reserved module in all three default layouts (ADR 028). Final sizes
and exact positions are a **design-session** call (the design kickoff owns widget
sizing); the reserved slots already exist as placeholders today.

---

## Owed architecture (logged to the queue, not improvised here)

Per the product-session rule (don't settle architecture in a product session),
three questions are logged as **owed ADRs** in `docs/sessions/queue.md`:

1. **Recurrence storage model** — materialized `occurrences` rows vs.
   computed-on-read from the canonical event + range; gates the Event Model story.
2. **Time-based reminder scheduling** — how a "remind me 30 min before" fires,
   given the event bus is an in-process `EventEmitter` with no timer/cron
   primitive today (ADR 008); gates the Event Reminders story.
3. **External-ingest / suggested-events extension point** — the contract by which
   parsed email events (and, later, iCal/Google sync) land as `suggested` events;
   gates the Suggested-Events Inbox story (and the email north star).
