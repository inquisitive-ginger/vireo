-- Demo calendar events for the M3 Tablet Month View live review (June 2026).
-- Reversible: `DELETE FROM calendar.events WHERE source = 'demo-review';` clears them.
-- Profile ids are this dev DB's real members so identity hues resolve.

\set zach   '''1662a813-4833-4eb9-b94f-50a30569572d'''
\set hallie '''e3eaaa12-3060-4314-a2c6-fbead87d9e5f'''
\set zoe    '''5facc87c-4583-474f-ad49-29196084cc80'''
\set teddy  '''cbb739da-2e13-40ad-a07c-47dd5c86ce5c'''

BEGIN;

-- Clear any prior run so this is idempotent.
DELETE FROM calendar.events WHERE source = 'demo-review';

-- ── Weekly recurring activities (solo → is_activity) ───────────────────────────
WITH e AS (INSERT INTO calendar.events (id,title,created_by,starts_at,ends_at,recurrence,is_activity,source,updated_at)
  VALUES (gen_random_uuid(),'Gymnastics',:zach,'2026-06-01T16:00:00-04','2026-06-01T17:00:00-04','weekly',true,'demo-review',now()) RETURNING id)
INSERT INTO calendar.event_attendees SELECT id, :zoe FROM e;

WITH e AS (INSERT INTO calendar.events (id,title,created_by,starts_at,ends_at,recurrence,is_activity,source,updated_at)
  VALUES (gen_random_uuid(),'T&T',:zach,'2026-06-02T17:15:00-04','2026-06-02T18:15:00-04','weekly',true,'demo-review',now()) RETURNING id)
INSERT INTO calendar.event_attendees SELECT id, :teddy FROM e;

WITH e AS (INSERT INTO calendar.events (id,title,created_by,starts_at,ends_at,recurrence,is_activity,source,updated_at)
  VALUES (gen_random_uuid(),'Karate',:zach,'2026-06-03T16:30:00-04','2026-06-03T17:30:00-04','weekly',true,'demo-review',now()) RETURNING id)
INSERT INTO calendar.event_attendees SELECT id, :zoe FROM e;

WITH e AS (INSERT INTO calendar.events (id,title,created_by,starts_at,ends_at,recurrence,is_activity,source,updated_at)
  VALUES (gen_random_uuid(),'Swim',:zach,'2026-06-04T18:00:00-04','2026-06-04T19:00:00-04','weekly',true,'demo-review',now()) RETURNING id)
INSERT INTO calendar.event_attendees SELECT id, :teddy FROM e;

WITH e AS (INSERT INTO calendar.events (id,title,created_by,starts_at,ends_at,recurrence,is_activity,source,updated_at)
  VALUES (gen_random_uuid(),'Piano',:zach,'2026-06-05T15:30:00-04','2026-06-05T16:15:00-04','weekly',true,'demo-review',now()) RETURNING id)
INSERT INTO calendar.event_attendees SELECT id, :zoe FROM e;

-- ── Single-day events: solo, shared (split fill), Family (neutral) ─────────────
WITH e AS (INSERT INTO calendar.events (id,title,created_by,starts_at,ends_at,location,source,updated_at)
  VALUES (gen_random_uuid(),'Dentist',:zach,'2026-06-09T10:00:00-04','2026-06-09T11:00:00-04','Dr. Lee','demo-review',now()) RETURNING id)
INSERT INTO calendar.event_attendees SELECT id, x FROM e, unnest(ARRAY[:zoe,:teddy]::uuid[]) AS x;

INSERT INTO calendar.events (id,title,created_by,starts_at,ends_at,source,updated_at)
  VALUES (gen_random_uuid(),'Parent–teacher',:zach,'2026-06-11T17:00:00-04','2026-06-11T18:00:00-04','demo-review',now());

WITH e AS (INSERT INTO calendar.events (id,title,created_by,starts_at,ends_at,location,source,updated_at)
  VALUES (gen_random_uuid(),'Soccer game',:zach,'2026-06-13T09:00:00-04','2026-06-13T10:30:00-04','Field 3','demo-review',now()) RETURNING id)
INSERT INTO calendar.event_attendees SELECT id, :teddy FROM e;

WITH e AS (INSERT INTO calendar.events (id,title,created_by,starts_at,ends_at,source,updated_at)
  VALUES (gen_random_uuid(),'Date night',:zach,'2026-06-20T19:00:00-04','2026-06-20T21:00:00-04','demo-review',now()) RETURNING id)
INSERT INTO calendar.event_attendees SELECT id, x FROM e, unnest(ARRAY[:zach,:hallie]::uuid[]) AS x;

INSERT INTO calendar.events (id,title,created_by,starts_at,ends_at,source,updated_at)
  VALUES (gen_random_uuid(),'Family BBQ',:zach,'2026-06-21T13:00:00-04','2026-06-21T16:00:00-04','demo-review',now());

-- ── Crowded day (June 23) → +N more truncation: T&T(recurring) + these three ──
WITH e AS (INSERT INTO calendar.events (id,title,created_by,starts_at,ends_at,location,source,updated_at)
  VALUES (gen_random_uuid(),'Doctor',:zach,'2026-06-23T11:00:00-04','2026-06-23T12:00:00-04','Pediatrics','demo-review',now()) RETURNING id)
INSERT INTO calendar.event_attendees SELECT id, :zoe FROM e;

WITH e AS (INSERT INTO calendar.events (id,title,created_by,starts_at,ends_at,source,updated_at)
  VALUES (gen_random_uuid(),'Book club',:zach,'2026-06-23T15:30:00-04','2026-06-23T17:00:00-04','demo-review',now()) RETURNING id)
INSERT INTO calendar.event_attendees SELECT id, :hallie FROM e;

INSERT INTO calendar.events (id,title,created_by,starts_at,ends_at,source,updated_at)
  VALUES (gen_random_uuid(),'Grocery run',:zach,'2026-06-23T13:00:00-04','2026-06-23T14:00:00-04','demo-review',now());

-- ── Multi-day spans (all-day) — solo, shared, Family; one wraps a week ────────
WITH e AS (INSERT INTO calendar.events (id,title,created_by,starts_at,ends_at,all_day,source,updated_at)
  VALUES (gen_random_uuid(),'Grandma visits',:zach,'2026-06-05T12:00:00-04','2026-06-08T12:00:00-04',true,'demo-review',now()) RETURNING id)
SELECT 1 FROM e; -- Family span (no attendees)

WITH e AS (INSERT INTO calendar.events (id,title,created_by,starts_at,ends_at,all_day,source,updated_at)
  VALUES (gen_random_uuid(),'Zach → London',:zach,'2026-06-16T12:00:00-04','2026-06-19T12:00:00-04',true,'demo-review',now()) RETURNING id)
INSERT INTO calendar.event_attendees SELECT id, :zach FROM e;

WITH e AS (INSERT INTO calendar.events (id,title,created_by,starts_at,ends_at,all_day,source,updated_at)
  VALUES (gen_random_uuid(),'FISW Camp',:zach,'2026-06-22T12:00:00-04','2026-06-26T12:00:00-04',true,'demo-review',now()) RETURNING id)
INSERT INTO calendar.event_attendees SELECT id, x FROM e, unnest(ARRAY[:zoe,:teddy]::uuid[]) AS x;

INSERT INTO calendar.events (id,title,created_by,starts_at,ends_at,all_day,source,updated_at)
  VALUES (gen_random_uuid(),'School break',:zach,'2026-06-29T12:00:00-04','2026-06-30T12:00:00-04',true,'demo-review',now());

COMMIT;

SELECT count(*) AS seeded FROM calendar.events WHERE source = 'demo-review';
