-- AlterTable
ALTER TABLE "chores"."tasks" ADD COLUMN     "requires_approval" BOOLEAN NOT NULL DEFAULT false;
