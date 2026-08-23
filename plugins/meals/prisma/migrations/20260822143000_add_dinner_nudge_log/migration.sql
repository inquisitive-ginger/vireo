-- CreateTable
CREATE TABLE "meals"."dinner_nudge_log" (
    "date" DATE NOT NULL,
    "audience" TEXT NOT NULL,
    "meal_id" UUID NOT NULL,
    "fired_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dinner_nudge_log_pkey" PRIMARY KEY ("date","audience")
);
