-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "chore_engine";

-- CreateTable
CREATE TABLE "chore_engine"."tasks" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "assignee_id" UUID NOT NULL,
    "created_by" UUID NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "due_date" DATE,
    "xp_reward" INTEGER NOT NULL DEFAULT 10,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);
