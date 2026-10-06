/*
  Warnings:

  - You are about to drop the column `communityHelpRadius` on the `UserPreference` table. All the data in the column will be lost.
  - You are about to drop the column `personalHelpRadius` on the `UserPreference` table. All the data in the column will be lost.
  - You are about to drop the column `intent` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `offeringHelpIntent` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the `UserAvailability` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Interest" AS ENUM ('NEIGHBORHOOD', 'COMMUNITY', 'EDUCATION', 'SPORTS', 'FITNESS', 'TECHNOLOGY', 'PETS', 'ENVIRONMENT', 'EVENTS', 'FOOD', 'HOBBIES', 'GAMING', 'CAREER', 'LOCAL_BUSINESS', 'BUY_SELL', 'TRAVEL', 'VOLUNTEERING', 'SOCIAL', 'OTHER');

-- CreateEnum
CREATE TYPE "Skill" AS ENUM ('TECHNOLOGY', 'TEACHING', 'TUTORING', 'WRITING', 'DESIGN', 'PHOTOGRAPHY', 'COOKING', 'REPAIR', 'DIY', 'MOVING', 'TRANSPORT', 'ERRANDS', 'PET_CARE', 'GARDENING', 'FITNESS', 'SPORTS', 'EVENT_HELP', 'ORGANIZING', 'FIRST_AID', 'OTHER');

-- DropForeignKey
ALTER TABLE "UserAvailability" DROP CONSTRAINT "UserAvailability_userId_fkey";

-- AlterTable
ALTER TABLE "UserPreference" DROP COLUMN "communityHelpRadius",
DROP COLUMN "personalHelpRadius",
ADD COLUMN     "localCommunityRadius" INTEGER NOT NULL DEFAULT 2,
ADD COLUMN     "localityRadius" INTEGER NOT NULL DEFAULT 2;

-- AlterTable
ALTER TABLE "UserProfile" DROP COLUMN "intent",
DROP COLUMN "offeringHelpIntent",
ADD COLUMN     "interests" "Interest"[] DEFAULT ARRAY[]::"Interest"[],
ADD COLUMN     "skills" "Skill"[] DEFAULT ARRAY[]::"Skill"[];

-- DropTable
DROP TABLE "UserAvailability";

-- DropEnum
DROP TYPE "DayOfWeek";

-- DropEnum
DROP TYPE "OfferingHelpIntent";

-- DropEnum
DROP TYPE "UserIntent";
