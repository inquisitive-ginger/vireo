-- ADR 055: a redemption is a ticket — buy → own → explicit use.
ALTER TABLE "rewards"."redemptions" ALTER COLUMN "status" SET DEFAULT 'owned';
ALTER TABLE "rewards"."redemptions" RENAME COLUMN "requested_at" TO "purchased_at";
ALTER TABLE "rewards"."redemptions" ADD COLUMN "use_requested_at" TIMESTAMP(3);
ALTER TABLE "rewards"."redemptions" ADD COLUMN "used_at" TIMESTAMP(3);

-- Postgres keeps index names across a column rename; Prisma expects them derived
-- from the new column, so rename them too or `migrate dev` reports drift.
ALTER INDEX "rewards"."redemptions_status_requested_at_idx" RENAME TO "redemptions_status_purchased_at_idx";
ALTER INDEX "rewards"."redemptions_profile_id_requested_at_idx" RENAME TO "redemptions_profile_id_purchased_at_idx";

-- Pre-ticket rows exist only in dev (prod's table is empty, the plugin dormant).
-- A declined request was already refunded, so in ticket terms it never existed.
DELETE FROM "rewards"."redemptions" WHERE "status" = 'declined';
UPDATE "rewards"."redemptions" SET "status" = 'use_requested', "use_requested_at" = "purchased_at" WHERE "status" = 'pending';
UPDATE "rewards"."redemptions" SET "status" = 'owned' WHERE "status" = 'granted';
UPDATE "rewards"."redemptions" SET "status" = 'used', "used_at" = COALESCE("decided_at", "purchased_at") WHERE "status" = 'fulfilled';
