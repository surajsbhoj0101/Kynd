-- CreateEnum
CREATE TYPE "ScheduleType" AS ENUM ('FLEXIBLE', 'STARTS_AT', 'TIME_RANGE');

-- CreateTable
CREATE TABLE "PostSchedule" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "type" "ScheduleType" NOT NULL,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PostSchedule_postId_key" ON "PostSchedule"("postId");

-- AddForeignKey
ALTER TABLE "PostSchedule" ADD CONSTRAINT "PostSchedule_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
