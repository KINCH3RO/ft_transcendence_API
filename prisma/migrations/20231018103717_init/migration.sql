-- CreateEnum
CREATE TYPE "fileType" AS ENUM ('IMAGE', 'VIDEO', 'FILE');

-- CreateEnum
CREATE TYPE "provider" AS ENUM ('GOOGLE', 'INTRA', 'GITHUB');

-- CreateEnum
CREATE TYPE "channelVisibility" AS ENUM ('PRIVATE', 'PUBLIC', 'PROTECTED');

-- CreateEnum
CREATE TYPE "channelRole" AS ENUM ('OWNER', 'ADMINISTRATOR', 'MEMBER');

-- CreateEnum
CREATE TYPE "channelStatus" AS ENUM ('FREE', 'MUTED', 'BANNED');

-- CreateEnum
CREATE TYPE "actionStatus" AS ENUM ('BOTH', 'NONE', 'SENDER', 'RECEIVER');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "password" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "onlineStatus" BOOLEAN NOT NULL DEFAULT false,
    "avatarUrl" TEXT NOT NULL DEFAULT '',
    "bannerUrl" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "profileID" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "associatedAccount" (
    "id" TEXT NOT NULL,
    "provider" "provider" NOT NULL,
    "userID" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "associatedAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 0,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "coins" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matches" (
    "id" SERIAL NOT NULL,
    "winnerID" TEXT NOT NULL,
    "loserID" TEXT NOT NULL,
    "winnerScore" INTEGER NOT NULL,
    "loserScore" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gameMode" TEXT NOT NULL,
    "ranked" BOOLEAN NOT NULL,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "userID" TEXT NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achievements" (
    "id" SERIAL NOT NULL,
    "imgUrl" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "reward" INTEGER NOT NULL,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "friendRequests" (
    "senderID" TEXT NOT NULL,
    "receiverID" TEXT NOT NULL,

    CONSTRAINT "friendRequests_pkey" PRIMARY KEY ("senderID","receiverID")
);

-- CreateTable
CREATE TABLE "friendStatus" (
    "senderID" TEXT NOT NULL,
    "receiverID" TEXT NOT NULL,
    "blockStatus" "actionStatus" NOT NULL,
    "muteStatus" "actionStatus" NOT NULL,

    CONSTRAINT "friendStatus_pkey" PRIMARY KEY ("senderID","receiverID")
);

-- CreateTable
CREATE TABLE "channel" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT,
    "visibility" "channelVisibility" NOT NULL,

    CONSTRAINT "channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channelUser" (
    "userID" TEXT NOT NULL,
    "channelID" TEXT NOT NULL,
    "role" "channelRole" NOT NULL,
    "status" "channelStatus" NOT NULL,

    CONSTRAINT "channelUser_pkey" PRIMARY KEY ("userID","channelID")
);

-- CreateTable
CREATE TABLE "directMessage" (
    "id" SERIAL NOT NULL,
    "senderID" TEXT NOT NULL,
    "receiverID" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "message" (
    "id" SERIAL NOT NULL,
    "senderID" TEXT NOT NULL,
    "directmessageID" INTEGER,
    "channelID" TEXT,
    "content" TEXT NOT NULL,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attachment" (
    "id" SERIAL NOT NULL,
    "messageID" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "fileType" NOT NULL,

    CONSTRAINT "attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_achievementsToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_userName_key" ON "user"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_profileID_key" ON "user"("profileID");

-- CreateIndex
CREATE UNIQUE INDEX "directMessage_id_key" ON "directMessage"("id");

-- CreateIndex
CREATE UNIQUE INDEX "directMessage_senderID_key" ON "directMessage"("senderID");

-- CreateIndex
CREATE UNIQUE INDEX "directMessage_senderID_receiverID_key" ON "directMessage"("senderID", "receiverID");

-- CreateIndex
CREATE UNIQUE INDEX "attachment_messageID_key" ON "attachment"("messageID");

-- CreateIndex
CREATE UNIQUE INDEX "_achievementsToUser_AB_unique" ON "_achievementsToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_achievementsToUser_B_index" ON "_achievementsToUser"("B");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_profileID_fkey" FOREIGN KEY ("profileID") REFERENCES "profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "associatedAccount" ADD CONSTRAINT "associatedAccount_userID_fkey" FOREIGN KEY ("userID") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_winnerID_fkey" FOREIGN KEY ("winnerID") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_loserID_fkey" FOREIGN KEY ("loserID") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userID_fkey" FOREIGN KEY ("userID") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendRequests" ADD CONSTRAINT "friendRequests_senderID_fkey" FOREIGN KEY ("senderID") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendRequests" ADD CONSTRAINT "friendRequests_receiverID_fkey" FOREIGN KEY ("receiverID") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendStatus" ADD CONSTRAINT "friendStatus_senderID_fkey" FOREIGN KEY ("senderID") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendStatus" ADD CONSTRAINT "friendStatus_receiverID_fkey" FOREIGN KEY ("receiverID") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channelUser" ADD CONSTRAINT "channelUser_userID_fkey" FOREIGN KEY ("userID") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channelUser" ADD CONSTRAINT "channelUser_channelID_fkey" FOREIGN KEY ("channelID") REFERENCES "channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "directMessage" ADD CONSTRAINT "directMessage_senderID_fkey" FOREIGN KEY ("senderID") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "directMessage" ADD CONSTRAINT "directMessage_receiverID_fkey" FOREIGN KEY ("receiverID") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_senderID_fkey" FOREIGN KEY ("senderID") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_directmessageID_fkey" FOREIGN KEY ("directmessageID") REFERENCES "directMessage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_channelID_fkey" FOREIGN KEY ("channelID") REFERENCES "channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachment" ADD CONSTRAINT "attachment_messageID_fkey" FOREIGN KEY ("messageID") REFERENCES "message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_achievementsToUser" ADD CONSTRAINT "_achievementsToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "achievements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_achievementsToUser" ADD CONSTRAINT "_achievementsToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
