-- The shopping schema (ADR 069). One migration, not the four the closed PR #127
-- accumulated: nothing shipped, so there is no data to walk through a backfill.
-- The profile-referencing columns are TEXT, not UUID (ADR 072) — profile ids are
-- text and the unattended wall writes the literal 'family'.

CREATE SCHEMA IF NOT EXISTS "shopping";

-- CreateTable
CREATE TABLE "shopping"."lists" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "group_by_aisle" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping"."items" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "quantity" TEXT,
    "status" TEXT NOT NULL DEFAULT 'needed',
    "source_type" TEXT NOT NULL,
    "source_id" TEXT,
    "added_by" TEXT NOT NULL,
    "added_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "got_by" TEXT,
    "got_at" TIMESTAMPTZ(6),
    "list_id" UUID NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping"."entries" (
    "id" UUID NOT NULL,
    "normalized_name" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "last_added_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping"."aisle_overrides" (
    "id" UUID NOT NULL,
    "normalized_name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "aisle_overrides_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "entries_normalized_name_key" ON "shopping"."entries"("normalized_name");

-- CreateIndex
CREATE UNIQUE INDEX "aisle_overrides_normalized_name_key" ON "shopping"."aisle_overrides"("normalized_name");

-- AddForeignKey
ALTER TABLE "shopping"."items" ADD CONSTRAINT "items_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "shopping"."lists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- The two permanent destinations the surface opens on. Permanent lists stay
-- visible and dim at zero; a runtime one is created at tier 4 and vanishes when
-- it empties. Sort order is the destination strip's order.
-- Aisle grouping is a property of the LIST (live review, 2026-09-03): the walk
-- order is real in a grocery store and meaningless in a warehouse club, so
-- Costco renders flat.
INSERT INTO "shopping"."lists" ("id", "name", "kind", "group_by_aisle", "sort_order")
VALUES
  (gen_random_uuid(), 'Grocery', 'permanent', true, 0),
  (gen_random_uuid(), 'Costco', 'permanent', false, 1);
