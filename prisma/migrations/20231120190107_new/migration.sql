/*
  Warnings:

  - The values [MUTED] on the enum `channelStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `duration` on the `channelUser` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "channelStatus_new" AS ENUM ('FREE', 'BANNED');
ALTER TABLE "channelUser" ALTER COLUMN "status" TYPE "channelStatus_new" USING ("status"::text::"channelStatus_new");
ALTER TYPE "channelStatus" RENAME TO "channelStatus_old";
ALTER TYPE "channelStatus_new" RENAME TO "channelStatus";
DROP TYPE "channelStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "channelUser" ADD COLUMN     "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "duration" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "matches" ADD COLUMN     "duration" INTEGER,
ALTER COLUMN "winnerScore" SET DEFAULT 5;

-- AlterTable
ALTER TABLE "profile" ALTER COLUMN "rating" SET DEFAULT 500;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "state" TEXT NOT NULL DEFAULT 'Offline';
