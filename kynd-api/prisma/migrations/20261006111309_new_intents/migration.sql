/*
  Warnings:

  - The values [JUST_BROWSING] on the enum `UserIntent` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserIntent_new" AS ENUM ('LOOKING_FOR_HELP', 'OFFERING_HELP', 'BORROW', 'LEND', 'SHARE', 'CONTRIBUTE', 'ORGANIZE');
ALTER TABLE "public"."UserProfile" ALTER COLUMN "intent" DROP DEFAULT;
ALTER TABLE "UserProfile" ALTER COLUMN "intent" TYPE "UserIntent_new"[] USING ("intent"::text::"UserIntent_new"[]);
ALTER TYPE "UserIntent" RENAME TO "UserIntent_old";
ALTER TYPE "UserIntent_new" RENAME TO "UserIntent";
DROP TYPE "public"."UserIntent_old";
ALTER TABLE "UserProfile" ALTER COLUMN "intent" SET DEFAULT ARRAY['LOOKING_FOR_HELP']::"UserIntent"[];
COMMIT;

-- AlterTable
ALTER TABLE "UserProfile" ALTER COLUMN "intent" SET DEFAULT ARRAY['LOOKING_FOR_HELP']::"UserIntent"[];
