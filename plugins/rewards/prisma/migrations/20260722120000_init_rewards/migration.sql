-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "rewards";

-- CreateTable
CREATE TABLE "rewards"."ledger_entries" (
    "id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "delta" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "source_type" TEXT NOT NULL,
    "source_id" TEXT,
    "created_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ledger_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rewards"."balances" (
    "profile_id" UUID NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "balances_pkey" PRIMARY KEY ("profile_id")
);

-- CreateIndex
CREATE INDEX "ledger_entries_profile_id_created_at_idx" ON "rewards"."ledger_entries"("profile_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "ledger_entries_source_type_source_id_key" ON "rewards"."ledger_entries"("source_type", "source_id");

