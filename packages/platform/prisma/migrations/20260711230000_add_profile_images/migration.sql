-- CreateTable
CREATE TABLE "platform"."profile_images" (
    "profile_id" TEXT NOT NULL,
    "bytes" BYTEA NOT NULL,
    "mime_type" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profile_images_pkey" PRIMARY KEY ("profile_id")
);

-- AddForeignKey
ALTER TABLE "platform"."profile_images" ADD CONSTRAINT "profile_images_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "platform"."profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

