CREATE TYPE "FollowUpType" AS ENUM ('call', 'email', 'instagram_message', 'visit', 'meeting', 'proposal', 'dossier', 'other');

ALTER TABLE "FollowUp" ADD COLUMN "type" "FollowUpType" NOT NULL DEFAULT 'other';

ALTER TABLE "FollowUp" ALTER COLUMN "type" DROP DEFAULT;
