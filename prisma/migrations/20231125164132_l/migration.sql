/*
  Warnings:

  - The values [BACKGROUND] on the enum `category` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `selected` on the `product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[repoID]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `color` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `img` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `repoID` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "category_new" AS ENUM ('PADDLE', 'MAPSKIN');
ALTER TABLE "product" ALTER COLUMN "category" TYPE "category_new" USING ("category"::text::"category_new");
ALTER TYPE "category" RENAME TO "category_old";
ALTER TYPE "category_new" RENAME TO "category";
DROP TYPE "category_old";
COMMIT;

-- AlterTable
ALTER TABLE "product" DROP COLUMN "selected",
ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "img" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "repoID" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "repo" (
    "id" TEXT NOT NULL,
    "mapSkinID" TEXT,
    "paddleSkinID" TEXT,

    CONSTRAINT "repo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_repoID_key" ON "user"("repoID");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_repoID_fkey" FOREIGN KEY ("repoID") REFERENCES "repo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repo" ADD CONSTRAINT "repo_mapSkinID_fkey" FOREIGN KEY ("mapSkinID") REFERENCES "product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repo" ADD CONSTRAINT "repo_paddleSkinID_fkey" FOREIGN KEY ("paddleSkinID") REFERENCES "product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
