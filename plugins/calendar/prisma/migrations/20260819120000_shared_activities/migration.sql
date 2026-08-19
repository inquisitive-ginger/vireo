-- is_activity now includes weekly events with 2+ attendees (issue #114);
-- backfill rows derived under the old exactly-one rule.
UPDATE "calendar"."events" e
SET "is_activity" = true
WHERE e."recurrence" = 'weekly'
  AND e."is_activity" = false
  AND EXISTS (
    SELECT 1 FROM "calendar"."event_attendees" a WHERE a."event_id" = e."id"
  );
