/*
  Warnings:

  - The primary key for the `attachment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `message` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `updatedAt` to the `message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "attachment" DROP CONSTRAINT "attachment_messageID_fkey";

-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_directmessageID_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_profileID_fkey";

-- AlterTable
ALTER TABLE "attachment" DROP CONSTRAINT "attachment_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "messageID" SET DATA TYPE TEXT,
ADD CONSTRAINT "attachment_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "attachment_id_seq";

-- AlterTable
ALTER TABLE "directMessage" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT;
DROP SEQUENCE "directMessage_id_seq";

-- AlterTable
ALTER TABLE "message" DROP CONSTRAINT "message_pkey",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "directmessageID" SET DATA TYPE TEXT,
ADD CONSTRAINT "message_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "message_id_seq";

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "avatarUrl" SET DEFAULT 'http://localhost:3001/upload/banners/avatar1.jpeg',
ALTER COLUMN "bannerUrl" SET DEFAULT 'http://localhost:3001/upload/banners/banner1.jpeg';

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_profileID_fkey" FOREIGN KEY ("profileID") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_directmessageID_fkey" FOREIGN KEY ("directmessageID") REFERENCES "directMessage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachment" ADD CONSTRAINT "attachment_messageID_fkey" FOREIGN KEY ("messageID") REFERENCES "message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
