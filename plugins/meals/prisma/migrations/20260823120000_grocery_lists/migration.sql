-- A list is its own row (ADR 067, design gate 2026-08-23): each store is its
-- own list, never a column on the item. New table, new column, seed, backfill,
-- then NOT NULL — in that order, because the column is not nullable in the end
-- state and 20260822120000_grocery_list (already applied in dev DBs) predates
-- this table and cannot be folded into.

-- CreateTable
CREATE TABLE "meals"."grocery_lists" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "group_by_aisle" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "grocery_lists_pkey" PRIMARY KEY ("id")
);

-- Seed the two permanent lists (design gate: "Permanent lists — Grocery
-- Store, Costco — stay visible and dim at zero"). Sort order is the index's
-- display order; "Grocery Store" is also the backfill target below.
INSERT INTO "meals"."grocery_lists" ("id", "name", "kind", "group_by_aisle", "sort_order")
VALUES
  (gen_random_uuid(), 'Grocery Store', 'permanent', true, 0),
  (gen_random_uuid(), 'Costco', 'permanent', true, 1);

-- AlterTable: add nullable first so existing rows can be backfilled.
ALTER TABLE "meals"."grocery_items" ADD COLUMN "list_id" UUID;

-- Backfill every existing item onto "Grocery Store" — the only list that
-- existed before this migration, from the reader's point of view.
UPDATE "meals"."grocery_items"
SET "list_id" = (SELECT "id" FROM "meals"."grocery_lists" WHERE "name" = 'Grocery Store')
WHERE "list_id" IS NULL;

-- AlterTable: now that every row has a list, the column matches its
-- application-level shape (list is never optional).
ALTER TABLE "meals"."grocery_items" ALTER COLUMN "list_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "meals"."grocery_items" ADD CONSTRAINT "grocery_items_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "meals"."grocery_lists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
