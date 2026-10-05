/*
  Warnings:

  - You are about to drop the column `areaLabel` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `areaLatitude` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `areaLongitude` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `availabilityTime` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `communityHelpRadius` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `dayOfWeekAvailability` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `intent` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `offeringHelpIntent` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `personalHelpRadius` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profileImage` on the `User` table. All the data in the column will be lost.
  - The `status` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('PENDING', 'ONBOARDING', 'ACTIVE', 'SUSPENDED');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "areaLabel",
DROP COLUMN "areaLatitude",
DROP COLUMN "areaLongitude",
DROP COLUMN "availabilityTime",
DROP COLUMN "bio",
DROP COLUMN "communityHelpRadius",
DROP COLUMN "dayOfWeekAvailability",
DROP COLUMN "intent",
DROP COLUMN "offeringHelpIntent",
DROP COLUMN "passwordHash",
DROP COLUMN "personalHelpRadius",
DROP COLUMN "profileImage",
DROP COLUMN "status",
ADD COLUMN     "status" "AccountStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- DropEnum
DROP TYPE "VerificationStatus";

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "profileImage" TEXT,
    "bio" TEXT,
    "intent" "UserIntent"[] DEFAULT ARRAY['JUST_BROWSING']::"UserIntent"[],
    "offeringHelpIntent" "OfferingHelpIntent"[] DEFAULT ARRAY[]::"OfferingHelpIntent"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserLocation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "areaLabel" TEXT,
    "areaLongitude" DOUBLE PRECISION,
    "areaLatitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "personalHelpRadius" INTEGER NOT NULL DEFAULT 2,
    "communityHelpRadius" INTEGER NOT NULL DEFAULT 2,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAvailability" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "day" "DayOfWeek" NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,

    CONSTRAINT "UserAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserLocation_userId_key" ON "UserLocation"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPreference_userId_key" ON "UserPreference"("userId");

-- CreateIndex
CREATE INDEX "UserAvailability_userId_idx" ON "UserAvailability"("userId");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLocation" ADD CONSTRAINT "UserLocation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAvailability" ADD CONSTRAINT "UserAvailability_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserPreference"("id") ON DELETE CASCADE ON UPDATE CASCADE;
