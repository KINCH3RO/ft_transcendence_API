/*
  Warnings:

  - You are about to drop the column `twoFactorAurhEnabled` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "twoFactorAurhEnabled",
ADD COLUMN     "twoFactorAuthEnabled" BOOLEAN NOT NULL DEFAULT false;
