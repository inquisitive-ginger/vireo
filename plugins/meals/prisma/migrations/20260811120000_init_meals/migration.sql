-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "meals";

-- CreateTable
CREATE TABLE "meals"."planned_meals" (
    "id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "slot" TEXT NOT NULL DEFAULT 'dinner',
    "title" TEXT NOT NULL,
    "sides" TEXT,
    "kind" TEXT NOT NULL DEFAULT 'cooked',
    "owner_id" UUID,
    "coin_reward" INTEGER,
    "notes" TEXT,
    "try_bite" TEXT,
    "needs" TEXT,
    "created_by" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "planned_meals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "planned_meals_date_slot_key" ON "meals"."planned_meals"("date", "slot");

