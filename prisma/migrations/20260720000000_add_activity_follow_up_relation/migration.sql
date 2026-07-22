-- Add the optional relation because not every activity belongs to a follow-up.
ALTER TABLE "Activity" ADD COLUMN "followUpId" TEXT;

-- Preserve associations previously stored only in Activity.metadata.
UPDATE "Activity" AS activity
SET "followUpId" = follow_up."id"
FROM "FollowUp" AS follow_up
WHERE activity."metadata"->>'followUpId' = follow_up."id"
  AND activity."businessId" = follow_up."businessId";

CREATE INDEX "Activity_followUpId_createdAt_idx"
ON "Activity"("followUpId", "createdAt");

ALTER TABLE "Activity"
ADD CONSTRAINT "Activity_followUpId_fkey"
FOREIGN KEY ("followUpId") REFERENCES "FollowUp"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
