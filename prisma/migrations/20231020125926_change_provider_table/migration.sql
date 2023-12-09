/*
  Warnings:

  - Added the required column `providerID` to the `associatedAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "associatedAccount" ADD COLUMN     "providerID" TEXT NOT NULL;
