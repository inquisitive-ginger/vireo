-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "calendar";

-- CreateTable
CREATE TABLE "calendar"."events" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "created_by" UUID NOT NULL,
    "starts_at" TIMESTAMPTZ(6) NOT NULL,
    "ends_at" TIMESTAMPTZ(6),
    "all_day" BOOLEAN NOT NULL DEFAULT false,
    "location" TEXT,
    "recurrence" TEXT,
    "recurrence_until" DATE,
    "is_activity" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'confirmed',
    "source" TEXT NOT NULL DEFAULT 'manual',
    "reminder_minutes" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calendar"."event_attendees" (
    "event_id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,

    CONSTRAINT "event_attendees_pkey" PRIMARY KEY ("event_id","profile_id")
);

-- CreateTable
CREATE TABLE "calendar"."event_exceptions" (
    "event_id" UUID NOT NULL,
    "occurrence_date" DATE NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'cancelled',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_exceptions_pkey" PRIMARY KEY ("event_id","occurrence_date")
);

-- AddForeignKey
ALTER TABLE "calendar"."event_attendees" ADD CONSTRAINT "event_attendees_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "calendar"."events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendar"."event_exceptions" ADD CONSTRAINT "event_exceptions_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "calendar"."events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

