/*
  Warnings:

  - Added the required column `mimeType` to the `attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `attachment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "attachment" ADD COLUMN     "mimeType" TEXT NOT NULL,
ADD COLUMN     "size" INTEGER NOT NULL;
