-- P$ leaves meals (live review, 2026-08-13): a paid dinner is a chore in the
-- chores module. The column never carried production data — earn wiring was M5/3.
ALTER TABLE "meals"."planned_meals" DROP COLUMN "coin_reward";
