-- AlterTable
ALTER TABLE "platform"."profiles" ADD COLUMN     "dark_mode" BOOLEAN;

-- CreateTable
CREATE TABLE "platform"."widget_layouts" (
    "id" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "widget_id" TEXT NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "w" INTEGER NOT NULL,
    "h" INTEGER NOT NULL,

    CONSTRAINT "widget_layouts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "platform"."widget_layouts" ADD CONSTRAINT "widget_layouts_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "platform"."profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
