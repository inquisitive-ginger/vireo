-- AlterTable: up-for-grabs — a task may have no assignee until claimed.
ALTER TABLE "chores"."tasks" ALTER COLUMN "assignee_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "chores"."tasks" ADD COLUMN     "routine_id" UUID;

-- CreateTable
CREATE TABLE "chores"."routines" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "assignee_id" UUID,
    "created_by" UUID NOT NULL,
    "kind" TEXT NOT NULL,
    "repeat_days" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "coin_reward" INTEGER NOT NULL DEFAULT 0,
    "requires_approval" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),

    CONSTRAINT "routines_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: lazy materialization is idempotent — concurrent reads racing to spawn
-- the same occurrence collide here and the loser is a no-op.
CREATE UNIQUE INDEX "tasks_routine_id_due_date_key" ON "chores"."tasks"("routine_id", "due_date");
