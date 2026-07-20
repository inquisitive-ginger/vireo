-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "family_feed";

-- CreateTable
CREATE TABLE "family_feed"."posts" (
    "id" UUID NOT NULL,
    "author_id" UUID NOT NULL,
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

