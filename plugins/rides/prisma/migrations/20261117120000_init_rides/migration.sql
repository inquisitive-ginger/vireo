CREATE SCHEMA IF NOT EXISTS "rides";

-- CreateTable
CREATE TABLE "rides"."school_runs" (
    "id" UUID NOT NULL,
    "kid_id" TEXT NOT NULL,
    "weekday" INTEGER NOT NULL,
    "kind" TEXT NOT NULL,
    "place" TEXT,
    "minutes" INTEGER NOT NULL,
    "starts_on" DATE NOT NULL,
    "ends_on" DATE,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "school_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rides"."run_drivers" (
    "run_id" UUID NOT NULL,
    "from_date" DATE NOT NULL,
    "driver_id" TEXT NOT NULL,
    "updated_by" TEXT NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "run_drivers_pkey" PRIMARY KEY ("run_id","from_date")
);

-- CreateTable
CREATE TABLE "rides"."run_days" (
    "run_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "driver_id" TEXT,
    "skipped" BOOLEAN NOT NULL DEFAULT false,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "run_days_pkey" PRIMARY KEY ("run_id","date")
);

-- CreateIndex
CREATE INDEX "school_runs_weekday_idx" ON "rides"."school_runs"("weekday");

-- AddForeignKey
ALTER TABLE "rides"."run_drivers" ADD CONSTRAINT "run_drivers_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "rides"."school_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rides"."run_days" ADD CONSTRAINT "run_days_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "rides"."school_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

