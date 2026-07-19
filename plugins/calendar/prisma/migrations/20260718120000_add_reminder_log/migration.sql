-- CreateTable
CREATE TABLE "calendar"."reminder_log" (
    "event_id" UUID NOT NULL,
    "occurrence_date" DATE NOT NULL,
    "fired_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reminder_log_pkey" PRIMARY KEY ("event_id","occurrence_date")
);

-- AddForeignKey
ALTER TABLE "calendar"."reminder_log" ADD CONSTRAINT "reminder_log_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "calendar"."events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
