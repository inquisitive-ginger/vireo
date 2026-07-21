-- CreateTable
CREATE TABLE "platform"."bug_reports" (
    "id" TEXT NOT NULL,
    "reporter_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "context" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "github_issue_number" INTEGER,
    "resolution" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bug_reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "bug_reports_status_idx" ON "platform"."bug_reports"("status");

-- AddForeignKey
ALTER TABLE "platform"."bug_reports" ADD CONSTRAINT "bug_reports_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "platform"."profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

