-- CreateTable
CREATE TABLE "meals"."grocery_items" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "quantity" TEXT,
    "status" TEXT NOT NULL DEFAULT 'needed',
    "source_type" TEXT NOT NULL,
    "source_id" TEXT,
    "added_by" UUID NOT NULL,
    "added_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "got_by" UUID,
    "got_at" TIMESTAMPTZ(6),

    CONSTRAINT "grocery_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meals"."staples" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "staples_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meals"."grocery_aisle_overrides" (
    "id" UUID NOT NULL,
    "normalized_name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "grocery_aisle_overrides_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "grocery_aisle_overrides_normalized_name_key" ON "meals"."grocery_aisle_overrides"("normalized_name");
