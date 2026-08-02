-- M4/6 (ADR 049, reworked 2026-07-31): template / card / punch. The parent curates
-- the prize options; the kid names the one they're working for (changeable) and the
-- mint waits on that pick. Auto-payout + reset at goal; completed cards retained.

-- CreateTable
CREATE TABLE "rewards"."punch_card_templates" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "glyph" TEXT NOT NULL,
    "goal" INTEGER NOT NULL,
    "payout_kind" TEXT NOT NULL,
    "payout_coins" INTEGER,
    "payout_option_ids" UUID[],
    "audience" UUID[],
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "punch_card_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rewards"."punch_cards" (
    "id" UUID NOT NULL,
    "template_id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "chosen_reward_id" UUID,
    "completed_at" TIMESTAMP(3),
    "prize_claimed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "punch_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rewards"."punches" (
    "id" UUID NOT NULL,
    "card_id" UUID NOT NULL,
    "source_type" TEXT NOT NULL,
    "source_id" TEXT,
    "created_by" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "punches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "punch_card_templates_active_idx" ON "rewards"."punch_card_templates"("active");

-- CreateIndex
CREATE INDEX "punch_cards_profile_id_created_at_idx" ON "rewards"."punch_cards"("profile_id", "created_at");

-- CreateIndex
CREATE INDEX "punch_cards_template_id_profile_id_idx" ON "rewards"."punch_cards"("template_id", "profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "punches_source_type_source_id_key" ON "rewards"."punches"("source_type", "source_id");

-- CreateIndex
CREATE INDEX "punches_card_id_created_at_idx" ON "rewards"."punches"("card_id", "created_at");

-- At most one OPEN card per (template, profile). Partial, so Prisma's schema cannot
-- declare it — lazy materialization races resolve to P2002 and refetch instead of a
-- duplicate open card.
CREATE UNIQUE INDEX "punch_cards_open_template_profile_key" ON "rewards"."punch_cards"("template_id", "profile_id") WHERE "completed_at" IS NULL;

-- AddForeignKey
ALTER TABLE "rewards"."punch_cards" ADD CONSTRAINT "punch_cards_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "rewards"."punch_card_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rewards"."punches" ADD CONSTRAINT "punches_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "rewards"."punch_cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
