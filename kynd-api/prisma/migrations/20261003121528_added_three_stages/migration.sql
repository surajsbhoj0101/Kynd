/*
  Warnings:

  - The values [COMPLETE] on the enum `VerificationStatus` will be removed.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "VerificationStatus_new" AS ENUM ('PENDING', 'ONBOARDING', 'ACTIVE');
ALTER TABLE "public"."User" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "User"
  ALTER COLUMN "status" TYPE "VerificationStatus_new"
  USING (
    CASE
      WHEN "status"::text = 'COMPLETE' THEN 'ACTIVE'
      ELSE "status"::text
    END
  )::"VerificationStatus_new";
ALTER TYPE "VerificationStatus" RENAME TO "VerificationStatus_old";
ALTER TYPE "VerificationStatus_new" RENAME TO "VerificationStatus";
DROP TYPE "public"."VerificationStatus_old";
ALTER TABLE "User" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
