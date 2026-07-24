-- CreateTable
CREATE TABLE "rewards"."pending_payouts" (
    "id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "amount" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "source_type" TEXT NOT NULL,
    "source_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "decided_by" UUID,
    "decided_note" TEXT,
    "decided_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pending_payouts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "pending_payouts_status_created_at_idx" ON "rewards"."pending_payouts"("status", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "pending_payouts_source_type_source_id_key" ON "rewards"."pending_payouts"("source_type", "source_id");
