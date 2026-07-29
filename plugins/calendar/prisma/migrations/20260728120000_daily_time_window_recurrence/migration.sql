-- AlterTable (ADR 057): weekday set for a 'daily' series, as day offsets from
-- starts_at's weekday mod 7. Empty for non-daily rows.
ALTER TABLE "calendar"."events" ADD COLUMN "recurrence_day_offsets" INTEGER[] NOT NULL DEFAULT ARRAY[]::INTEGER[];
