-- AlterTable
ALTER TABLE "chores"."tasks" ADD COLUMN     "xp_awarded" BOOLEAN NOT NULL DEFAULT false;

-- Backfill: already-completed tasks were awarded XP under the old logic, so mark them
-- awarded to prevent a re-award if they are reopened and re-completed. Pending tasks
-- stay false (they read as freshly assigned, not reopened).
UPDATE "chores"."tasks" SET "xp_awarded" = true WHERE "status" = 'completed';
