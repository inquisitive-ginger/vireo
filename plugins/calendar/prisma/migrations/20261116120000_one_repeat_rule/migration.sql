-- ADR 082: one repeat rule. A 'daily' series' day offsets (from starts_at's weekday,
-- mod 7) become local weekdays. The zone is the household's, the same default as
-- TZ in docker-compose.prod.yml; the database session zone is UTC, so it is named here.
ALTER TABLE "calendar"."events"
  ADD COLUMN "recurrence_interval" INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN "recurrence_weekdays" INTEGER[] NOT NULL DEFAULT ARRAY[]::INTEGER[],
  ADD COLUMN "recurrence_month_week" INTEGER;

UPDATE "calendar"."events" e
SET "recurrence_weekdays" = (
  SELECT ARRAY(
    SELECT DISTINCT ((EXTRACT(DOW FROM e."starts_at" AT TIME ZONE 'America/Los_Angeles')::int + o) % 7)
    FROM unnest(e."recurrence_day_offsets") AS o
    ORDER BY 1
  )
)
WHERE e."recurrence" = 'daily';

ALTER TABLE "calendar"."events" DROP COLUMN "recurrence_day_offsets";
