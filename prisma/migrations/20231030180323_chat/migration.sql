/*
  Warnings:

  - You are about to drop the column `blockStatus` on the `friendStatus` table. All the data in the column will be lost.
  - You are about to drop the column `muteStatus` on the `friendStatus` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "directMessage" ADD COLUMN     "blockStatus" "actionStatus" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "muteStatus" "actionStatus" NOT NULL DEFAULT 'NONE';

-- AlterTable
ALTER TABLE "friendStatus" DROP COLUMN "blockStatus",
DROP COLUMN "muteStatus";
