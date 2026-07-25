-- CreateTable
CREATE TABLE "rewards"."rewards" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "description" TEXT,
    "cost" INTEGER NOT NULL,
    "requires_approval" BOOLEAN NOT NULL DEFAULT false,
    "audience" UUID[],
    "stock" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rewards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rewards"."redemptions" (
    "id" UUID NOT NULL,
    "reward_id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "cost" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decided_by" UUID,
    "decided_at" TIMESTAMP(3),
    "decided_note" TEXT,

    CONSTRAINT "redemptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "rewards_active_idx" ON "rewards"."rewards"("active");

-- CreateIndex
CREATE INDEX "redemptions_status_requested_at_idx" ON "rewards"."redemptions"("status", "requested_at");

-- CreateIndex
CREATE INDEX "redemptions_profile_id_requested_at_idx" ON "rewards"."redemptions"("profile_id", "requested_at");

-- AddForeignKey
ALTER TABLE "rewards"."redemptions" ADD CONSTRAINT "redemptions_reward_id_fkey" FOREIGN KEY ("reward_id") REFERENCES "rewards"."rewards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
