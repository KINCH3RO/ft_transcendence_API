-- AlterTable
ALTER TABLE "channelUser" ADD COLUMN     "duration" BIGINT;

-- AlterTable
ALTER TABLE "friendStatus" ALTER COLUMN "blockStatus" SET DEFAULT 'NONE',
ALTER COLUMN "muteStatus" SET DEFAULT 'NONE';
