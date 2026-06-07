-- AlterTable
ALTER TABLE "platform"."profiles" ADD COLUMN     "push_enabled" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "platform"."push_subscriptions" (
    "id" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "p256dh_key" TEXT NOT NULL,
    "auth_key" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "push_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "push_subscriptions_endpoint_key" ON "platform"."push_subscriptions"("endpoint");

-- AddForeignKey
ALTER TABLE "platform"."push_subscriptions" ADD CONSTRAINT "push_subscriptions_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "platform"."profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
