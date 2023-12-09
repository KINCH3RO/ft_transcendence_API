-- DropForeignKey
ALTER TABLE "channelUser" DROP CONSTRAINT "channelUser_channelID_fkey";

-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_channelID_fkey";

-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_directmessageID_fkey";

-- AddForeignKey
ALTER TABLE "channelUser" ADD CONSTRAINT "channelUser_channelID_fkey" FOREIGN KEY ("channelID") REFERENCES "channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_directmessageID_fkey" FOREIGN KEY ("directmessageID") REFERENCES "directMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_channelID_fkey" FOREIGN KEY ("channelID") REFERENCES "channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
