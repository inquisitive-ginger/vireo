-- CreateTable
CREATE TABLE "chore_engine"."xp_balances" (
    "profile_id" UUID NOT NULL,
    "total_xp" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "xp_balances_pkey" PRIMARY KEY ("profile_id")
);
